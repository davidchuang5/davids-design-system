import { fileURLToPath } from 'url'
import { dirname, resolve, join } from 'path'
import { writeFile } from './utils/fs.js'
import { confirm } from './utils/confirm.js'
import { runTokenAgent } from './agents/token-agent.js'
import { runComponentAgent } from './agents/component-agent.js'
import { runTestAgent } from './agents/test-agent.js'
import { runDocsAgent } from './agents/docs-agent.js'
import type { DesignSystemSpec, ComponentOutput } from './types.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(__dirname, '../../')

export async function orchestrate(spec: DesignSystemSpec): Promise<void> {
  const outDir = join(PROJECT_ROOT, 'generated', spec.name)
  console.log(`\nOutput directory: ${outDir}\n`)

  // ── Phase 1: Design Tokens ───────────────────────────────────────
  console.log('── Phase 1: Design Tokens ──')
  const tokens = await runTokenAgent(spec)

  await writeFile(join(outDir, 'src/tokens/variables.css'), tokens.cssVariables)
  await writeFile(
    join(outDir, 'src/tokens/tokens.json'),
    JSON.stringify(tokens.colors, null, 2),
  )

  console.log('\nGenerated token CSS variables:\n')
  console.log(tokens.cssVariables.slice(0, 800) + (tokens.cssVariables.length > 800 ? '\n  ...(truncated)' : ''))

  const proceed = await confirm('\nContinue with component generation?')
  if (!proceed) {
    console.log('Aborted after token phase. Inspect generated/tokens/ and rerun when ready.')
    process.exit(0)
  }

  // ── Phase 2: Components (parallel) ──────────────────────────────
  console.log('\n── Phase 2: Components ──')
  const componentResults = await Promise.allSettled(
    spec.components.map(name => runComponentAgent(name, spec, tokens)),
  )

  const components: ComponentOutput[] = componentResults
    .map((result, i) => {
      if (result.status === 'fulfilled') return result.value
      console.error(`[ComponentAgent] Failed for ${spec.components[i]}:`, result.reason)
      return null
    })
    .filter((c): c is ComponentOutput => c !== null)

  await Promise.all(
    components.map(async component => {
      const dir = join(outDir, 'src/components', component.name)
      await writeFile(join(dir, `${component.name}.tsx`), component.code)
      await writeFile(join(dir, `${component.name}.css`), component.cssContent)
      await writeFile(join(dir, 'index.ts'), `export * from './${component.name}'\n`)
    }),
  )

  // ── Phase 3: Tests & Stories (parallel) ─────────────────────────
  console.log('\n── Phase 3: Tests & Stories ──')
  await Promise.allSettled(
    components.map(async component => {
      try {
        const tests = await runTestAgent(component)
        const dir = join(outDir, 'src/components', component.name)
        await writeFile(join(dir, `${component.name}.stories.tsx`), tests.storyCode)
        await writeFile(join(dir, `${component.name}.test.tsx`), tests.testCode)
      } catch (err) {
        console.error(`[TestAgent] Failed for ${component.name}:`, err)
      }
    }),
  )

  // ── Phase 4: Documentation (parallel) ───────────────────────────
  console.log('\n── Phase 4: Documentation ──')
  await Promise.allSettled(
    components.map(async component => {
      try {
        const docs = await runDocsAgent(component, tokens)
        await writeFile(join(outDir, 'docs', `${component.name}.mdx`), docs.mdx)
      } catch (err) {
        console.error(`[DocsAgent] Failed for ${component.name}:`, err)
      }
    }),
  )

  // ── Phase 5: Package scaffolding ────────────────────────────────
  console.log('\n── Phase 5: Package Scaffolding ──')
  await writeFile(join(outDir, 'src/index.ts'), generateBarrelExport(components))
  await writeFile(join(outDir, 'package.json'), generatePackageJson(spec))

  const succeeded = components.length
  const attempted = spec.components.length
  console.log(`\n✓ Done — ${succeeded}/${attempted} components generated at ${outDir}`)
  console.log('  Inspect the output, then copy components into src/components/ to integrate.\n')
}

function generateBarrelExport(components: ComponentOutput[]): string {
  const exports = components.map(c => `export * from './components/${c.name}'`).join('\n')
  return `${exports}\n`
}

function generatePackageJson(spec: DesignSystemSpec): string {
  return JSON.stringify(
    {
      name: `@ds/${spec.name.toLowerCase()}`,
      version: '0.1.0',
      description: spec.description,
      type: 'module',
      main: './dist/index.cjs',
      module: './dist/index.js',
      types: './dist/index.d.ts',
      peerDependencies: { react: '>=17', 'react-dom': '>=17' },
    },
    null,
    2,
  )
}
