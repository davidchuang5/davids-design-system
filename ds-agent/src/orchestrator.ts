// src/orchestrator.ts
import 'dotenv/config';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { agentDefinitions } from './agents/definitions.js';
import type { DesignSystemSpec } from './types.js';
import { TOKEN_AGENT_PROMPT } from './agents/prompts.js';
import { generateTokenFiles } from './generate-tokens.js';
import * as readline from 'readline';
import * as fs from 'fs/promises';

const SRC_DIR = '/Users/davidchuang/enterprise-design-system/src';

// ── Utility: human-in-the-loop confirmation prompt ──────────
async function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(`\n${question} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

// ── Utility: collect text from an assistant message ─────────
function extractText(message: any): string {
  return (
    message.message?.content
      ?.filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('') ?? ''
  );
}

// ── Main orchestrator ────────────────────────────────────────
export async function orchestrate(spec: DesignSystemSpec) {
  console.log(`\n🎨  Design System Pipeline — ${spec.name}`);
  console.log(`    Components : ${spec.components.join(', ')}`);
  console.log(`    Palette    : ${spec.colorPalette}`);
  console.log(`    Radius     : ${spec.borderRadius}`);
  console.log(`    Output     : ${SRC_DIR}\n`);

  const runLog: Array<{
    phase: string;
    type: string;
    content: string;
    timestamp: string;
  }> = [];

  function log(phase: string, message: any) {
    runLog.push({
      phase,
      type: message.type,
      content: JSON.stringify(message).slice(0, 500),
      timestamp: new Date().toISOString(),
    });
  }

  // ── PHASE 1: Tokens (isolated run for human review) ────────
  console.log('── Phase 1: Design Tokens ──\n');

  const tokensExist = await Promise.all([
    fs.access(`${SRC_DIR}/tokens/variables.css`).then(() => true).catch(() => false),
    fs.access(`${SRC_DIR}/tokens/tokens.json`).then(() => true).catch(() => false),
  ]).then(([a, b]) => a && b);

  if (tokensExist) {
    console.log(`  ✓ Tokens already exist at ${SRC_DIR}/tokens/ — skipping generation.\n`);
  } else {
    for await (const message of query({
      prompt: `
        Generate design tokens for the following spec and write them to disk.
        Do not generate any components yet — tokens only.

        Spec:
        - Name: ${spec.name}
        - Color palette: ${spec.colorPalette}
        - Border radius style: ${spec.borderRadius}

        Write the CSS custom properties to: ${SRC_DIR}/tokens/variables.css
        Write the raw token values to: ${SRC_DIR}/tokens/tokens.json
      `,
      options: {
        model: 'claude-sonnet-4-6',
        systemPrompt: TOKEN_AGENT_PROMPT,
        allowedTools: ['Write', 'Read'],
        permissionMode: 'bypassPermissions',
        allowDangerouslySkipPermissions: true,
        cwd: process.cwd(),
      },
    })) {
      log('phase-1-tokens', message);

      if (message.type === 'assistant') {
        const text = extractText(message);
        if (text) process.stdout.write(text);
      }
    }
  }

  // ── Checkpoint: inspect tokens before proceeding ────────────
  const proceed = await confirm(
    `Tokens at ${SRC_DIR}/tokens/\nConfirm to proceed with component generation`
  );

  if (!proceed) {
    console.log('\n⏸  Pipeline paused. Edit token files and re-run to continue.\n');
    await fs.writeFile('./run-log.json', JSON.stringify(runLog, null, 2));
    process.exit(0);
  }

  // Generate tokens.js + tokens.d.ts from the (possibly edited) tokens.json
  console.log('\n── Generating JS token exports ──\n');
  await generateTokenFiles(`${SRC_DIR}/tokens/tokens.json`, `${SRC_DIR}/tokens`);

  // ── PHASES 2–3: Components, Tests & Docs ────────────────────
  console.log('\n── Phases 2–3: Components → Tests & Docs ──\n');

  const orchestratorPrompt = `
You are orchestrating the creation of React components for an existing design system.

Spec:
- Name: ${spec.name}
- Components: ${spec.components.join(', ')}
- Color palette: ${spec.colorPalette}
- Border radius style: ${spec.borderRadius}
- Source directory: ${SRC_DIR}
- Token variables are already written at: ${SRC_DIR}/tokens/variables.css

Execute the following phases in order. Use the Task tool to delegate to subagents.

───────────────────────────────────────────
PHASE 2 — Components
───────────────────────────────────────────
Invoke "component-agent" in parallel (one Task per component) for each of:
${spec.components.map((c) => `- ${c}`).join('\n')}

Pass each subagent:
- The component name to build
- The tokens path: ${SRC_DIR}/tokens/variables.css
- The output path: ${SRC_DIR}/components/[ComponentName]/

Wait for all component tasks to complete before proceeding.
Report which components succeeded and which (if any) failed.

───────────────────────────────────────────
PHASE 3 — Tests & Documentation
───────────────────────────────────────────
For each successfully generated component, invoke in parallel:
- "test-agent"  → Storybook stories + Vitest unit tests
- "docs-agent"  → MDX documentation

Pass each subagent the component name and its directory path.
Tests and docs for different components can all run simultaneously.

Wait for all tasks to complete. Report results.

───────────────────────────────────────────
ERROR HANDLING
───────────────────────────────────────────
- If any subagent fails, log the error and continue with remaining work
- Do not retry failed subagents — report them clearly at the end
- After all phases, print a final summary: succeeded components and failed components
`;

  for await (const message of query({
    prompt: orchestratorPrompt,
    options: {
      model: 'claude-opus-4-7',
      permissionMode: 'bypassPermissions',
      allowDangerouslySkipPermissions: true,
      maxTurns: 100,
      cwd: process.cwd(),
      agents: agentDefinitions,
    },
  })) {
    log('phase-2-3-orchestrator', message);

    if (message.type === 'assistant') {
      const text = extractText(message);
      if (text) process.stdout.write(text);
    }

    if (message.type === 'system' && message.subtype === 'task_started') {
      console.log(`\n  ↳ [${message.subagent_type ?? 'subagent'}] ${message.description}`);
    }
    if (
      message.type === 'system' &&
      message.subtype === 'task_updated' &&
      message.patch.status === 'completed'
    ) {
      console.log(`  ↳ finished\n`);
    }
  }

  // ── Update barrel export ─────────────────────────────────────
  console.log('\n── Updating src/index.ts ──');
  const indexPath = `${SRC_DIR}/index.ts`;
  const existingIndex = await fs.readFile(indexPath, 'utf-8');

  const newExports = (
    await Promise.all(
      spec.components.map(async (name) => {
        if (existingIndex.includes(`./components/${name}`)) return null;
        try {
          await fs.access(`${SRC_DIR}/components/${name}`);
          return `export * from './components/${name}';`;
        } catch {
          return null;
        }
      }),
    )
  )
    .filter(Boolean)
    .join('\n');

  if (newExports) {
    await fs.writeFile(indexPath, `${existingIndex.trimEnd()}\n${newExports}\n`);
    console.log(`Added exports for: ${spec.components.join(', ')}\n`);
  } else {
    console.log('No new exports to add.\n');
  }

  // ── Write run log ────────────────────────────────────────────
  const logPath = './run-log.json';
  await fs.writeFile(logPath, JSON.stringify(runLog, null, 2));

  console.log(`✓  Pipeline complete`);
  console.log(`✓  Components → ${SRC_DIR}/components/`);
  console.log(`✓  Run log   → ${logPath}\n`);
}
