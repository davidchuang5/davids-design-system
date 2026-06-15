import { callAgentWithJsonRetry } from '../utils/call-agent.js'
import type { ComponentOutput, TokenOutput, DocsOutput } from '../types.js'

const SYSTEM_PROMPT = `You are a design system documentation writer. Output ONLY valid JSON — no markdown fences wrapping the JSON itself.

Output this exact shape:
{
  "mdx": "...full MDX content..."
}

The MDX content should include:
- A top-level heading with the component name
- 1-2 sentence description of purpose and typical use cases
- A props table (markdown table with columns: Prop | Type | Default | Description)
- At least 2 usage examples with JSX code blocks
- An "Accessibility" section noting ARIA roles, keyboard navigation, and screen reader behavior
- A "Design guidelines" section with 2-3 bullet points on when/how to use this component

Keep the tone concise and developer-focused. Write for someone integrating this component for the first time.`

export async function runDocsAgent(component: ComponentOutput, tokens: TokenOutput): Promise<DocsOutput> {
  const prompt = `Generate MDX documentation for the ${component.name} component.

Component .tsx:
\`\`\`tsx
${component.code}
\`\`\`

Available design tokens for context (color palette names): ${Object.keys(tokens.colors).join(', ')}`

  return callAgentWithJsonRetry<DocsOutput>('DocsAgent', SYSTEM_PROMPT, prompt, 3, 4096)
}
