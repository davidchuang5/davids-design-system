import 'dotenv/config'
import { orchestrate } from './orchestrator.js'
import type { DesignSystemSpec } from './types.js'

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY is not set.')
  console.error('Copy .env.example to .env and add your key.')
  process.exit(1)
}

// Edit this spec to change what gets generated.
const spec: DesignSystemSpec = {
  name: 'nova-ui',
  description: 'A clean, accessible component library with a warm neutral palette',
  components: ['Badge', 'Avatar', 'Tooltip', 'Select', 'Modal'],
  colorPalette: 'warm neutrals with a slate-blue primary accent',
  borderRadius: 'rounded',
}

orchestrate(spec).catch(err => {
  console.error('Orchestrator failed:', err)
  process.exit(1)
})
