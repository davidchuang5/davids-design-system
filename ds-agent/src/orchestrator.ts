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
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`\n${question} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

function extractText(message: any): string {
  return (
    message.message?.content
      ?.filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('') ?? ''
  );
}

// ── Cost tracking ─────────────────────────────────────────────
interface UsageTotals {
  input: number;
  output: number;
  cacheRead: number;
  cacheCreation: number;
}

function trackUsage(message: any, totals: UsageTotals) {
  if (message.type === 'result' && message.usage) {
    totals.input += message.usage.input_tokens ?? 0;
    totals.output += message.usage.output_tokens ?? 0;
    totals.cacheRead += message.usage.cache_read_input_tokens ?? 0;
    totals.cacheCreation += message.usage.cache_creation_input_tokens ?? 0;
  }
}

function printUsage(label: string, totals: UsageTotals) {
  const cacheHitRate =
    totals.cacheRead + totals.cacheCreation > 0
      ? ((totals.cacheRead / (totals.cacheRead + totals.cacheCreation)) * 100).toFixed(0)
      : '0';
  console.log(
    `  [usage] ${label} — in: ${totals.input}, out: ${totals.output}, cache hit: ${cacheHitRate}%`
  );
}

// ── Run log (kept lightweight — no full message bodies) ───────
const runLog: Array<{ phase: string; type: string; summary: string; timestamp: string }> = [];

function log(phase: string, message: any) {
  // Don't store full JSON.stringify of every message — that's tokens-on-disk,
  // not API cost, but it bloats the log and tempts you to replay it into a
  // future prompt for "debugging context," which DOES cost tokens.
  const summary =
    message.type === 'assistant'
      ? extractText(message).slice(0, 120)
      : message.type === 'result'
      ? `cost=$${message.total_cost_usd ?? '?'}`
      : message.subtype ?? message.type;

  runLog.push({ phase, type: message.type, summary, timestamp: new Date().toISOString() });
}

// ── Main orchestrator ────────────────────────────────────────
export async function orchestrate(spec: DesignSystemSpec) {
  console.log(`\n🎨  Design System Pipeline — ${spec.name}`);
  console.log(`    Components : ${spec.components.join(', ')}`);
  console.log(`    Palette    : ${spec.colorPalette}`);
  console.log(`    Radius     : ${spec.borderRadius}`);
  console.log(`    Output     : ${SRC_DIR}\n`);

  const totalUsage: UsageTotals = { input: 0, output: 0, cacheRead: 0, cacheCreation: 0 };

  // ── CLEAN: skip components that already exist and weren't asked for again ──
  console.log('── Checking existing generation state ──\n');

  const existingComponents = await fs.readdir(`${SRC_DIR}/components`).catch(() => [] as string[]);

  const componentsToBuild = spec.components.filter((c) => !existingComponents.includes(c));
  const componentsToSkip = spec.components.filter((c) => existingComponents.includes(c));

  if (componentsToSkip.length > 0) {
    console.log(`  ⏭  Skipping already-built: ${componentsToSkip.join(', ')}`);
  }
  if (componentsToBuild.length === 0) {
    console.log(`  ✓ All requested components already exist. Nothing to do.`);
    console.log(`    Pass --force to regenerate, or delete the component folders first.\n`);
    return;
  }
  console.log(`  → Building: ${componentsToBuild.join(', ')}\n`);

  const tokensExist = await fs
    .access(`${SRC_DIR}/tokens/variables.css`)
    .then(() => true)
    .catch(() => false);

  // ── PHASE 1: Tokens (skip if already generated) ─────────────
  if (!tokensExist) {
    console.log('── Phase 1: Design Tokens ──\n');

    for await (const message of query({
      prompt: `
        Generate design tokens for this spec and write them to disk. Tokens only — no components.

        Name: ${spec.name}
        Color palette: ${spec.colorPalette}
        Border radius style: ${spec.borderRadius}

        Write CSS custom properties to: ${SRC_DIR}/tokens/variables.css
        Write raw token values to: ${SRC_DIR}/tokens/tokens.json
      `,
      options: {
        model: 'claude-sonnet-4-6',
        systemPrompt: TOKEN_AGENT_PROMPT,
        allowedTools: ['Write', 'Read'],
        permissionMode: 'acceptEdits', // no Bash needed → no need for bypassPermissions
        cwd: SRC_DIR, // scope cwd tightly instead of project root
        maxTurns: 12, // tokens is a bounded task — cap it
      },
    })) {
      log('phase-1-tokens', message);
      trackUsage(message, totalUsage);
      if (message.type === 'assistant') {
        const text = extractText(message);
        if (text) process.stdout.write(text);
      }
    }

    printUsage('tokens', totalUsage);

    const proceed = await confirm(
      `Tokens at ${SRC_DIR}/tokens/\nConfirm to proceed with component generation`
    );

    if (!proceed) {
      console.log('\n⏸  Pipeline paused. Edit token files and re-run to continue.\n');
      await fs.writeFile('./run-log.json', JSON.stringify(runLog, null, 2));
      process.exit(0);
    }

    console.log('\n── Generating JS token exports ──\n');
    await generateTokenFiles(`${SRC_DIR}/tokens/tokens.json`, `${SRC_DIR}/tokens`);
  } else {
    console.log('── Phase 1: Tokens already exist, skipping ──\n');
  }

  // ── PHASES 2–4, per component, fully isolated ───────────────

  console.log('── Phases 2–4: Components → Tests → Stories (per component) ──\n');

  async function buildComponent(component: string): Promise<boolean> {
    console.log(`\n→ ${component}`);
    const componentUsage: UsageTotals = { input: 0, output: 0, cacheRead: 0, cacheCreation: 0 };
    let ok = false;

    for await (const message of query({
      prompt: `
Build the "${component}" component for the "${spec.name}" design system, end to end.

Context:
- Source directory: ${SRC_DIR}
- Token variables: ${SRC_DIR}/tokens/variables.css
- Output path: ${SRC_DIR}/components/${component}/
- Color palette: ${spec.colorPalette}
- Border radius style: ${spec.borderRadius}

Steps (use the Task tool to delegate — do not write code yourself):
1. Invoke "component-agent" to scaffold the component, its types, and its CSS module.
2. Once that succeeds, invoke "test-agent" AND "storybook-agent" in parallel — they
   don't depend on each other, only on step 1.
3. Report PASS or FAIL for this component at the end. If anything fails, report
   the failure reason in one sentence and stop — do not retry.
`,
      options: {
        model: 'claude-opus-4-7',
        permissionMode: 'bypassPermissions',
        maxTurns: 30,
        cwd: SRC_DIR,
        agents: agentDefinitions,
      },
    })) {
      log(`component-${component}`, message);
      trackUsage(message, componentUsage);
      trackUsage(message, totalUsage);

      if (message.type === 'assistant') {
        const text = extractText(message);
        if (text) {
          process.stdout.write(text);
          if (/\bPASS\b/.test(text)) ok = true;
        }
      }
      if (message.type === 'system' && message.subtype === 'task_started') {
        console.log(`\n  ↳ [${message.subagent_type ?? 'subagent'}] ${message.description}`);
      }
      if (message.type === 'system' && message.subtype === 'task_updated' && message.patch?.status === 'completed') {
        console.log(`  ↳ finished`);
      }
    }

    printUsage(component, componentUsage);
    return ok;
  }

  const results = await Promise.all(componentsToBuild.map(buildComponent));
  const succeeded = componentsToBuild.filter((_, i) => results[i]);
  const failed = componentsToBuild.filter((_, i) => !results[i]);

  console.log(`\n── Summary ──`);
  console.log(`  ✓ Succeeded: ${succeeded.join(', ') || 'none'}`);
  if (failed.length) console.log(`  ✗ Failed: ${failed.join(', ')}`);
  printUsage('TOTAL', totalUsage);

  // ── Update barrel export (no LLM call — pure fs, zero tokens) ──
  console.log('\n── Updating src/index.ts ──');
  const indexPath = `${SRC_DIR}/index.ts`;
  const existingIndex = await fs
    .readFile(indexPath, 'utf-8')
    .catch(() => "export * from './tokens';\n");

  const newExports = (
    await Promise.all(
      succeeded.map(async (name) => {
        if (existingIndex.includes(`./components/${name}`)) return null;
        return `export * from './components/${name}';`;
      })
    )
  )
    .filter(Boolean)
    .join('\n');

  if (newExports) {
    await fs.writeFile(indexPath, `${existingIndex.trimEnd()}\n${newExports}\n`);
    console.log(`  Added exports for: ${succeeded.join(', ')}\n`);
  } else {
    console.log('  No new exports to add.\n');
  }

  await fs.writeFile('./run-log.json', JSON.stringify(runLog, null, 2));

  console.log(`✓  Pipeline complete`);
  console.log(`✓  Components → ${SRC_DIR}/components/`);
  console.log(`✓  Run log    → ./run-log.json\n`);
}
