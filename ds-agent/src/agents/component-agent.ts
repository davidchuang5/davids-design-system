import { callAgentWithJsonRetry } from '../utils/call-agent.js'
import type { DesignSystemSpec, TokenOutput, ComponentOutput } from '../types.js'

const SYSTEM_PROMPT = `You are a React design system component engineer. Output ONLY valid JSON — no markdown fences, no prose.

Output this exact shape:
{
  "name": "ComponentName",
  "code": "...full .tsx file content...",
  "cssContent": "...full .css file content..."
}

STRICT conventions for the code field (.tsx):
- import React from 'react'
- import './ComponentName.css'  (plain CSS import, NOT CSS Modules)
- Use React.forwardRef for all interactive elements
- Set ComponentName.displayName = 'ComponentName'
- Export: export const ComponentName = React.forwardRef<...>(...) AND export default ComponentName
- Extend HTML element props: interface ComponentNameProps extends React.ButtonHTMLAttributes<HTMLButtonElement>
- Add WAI-ARIA attributes appropriate to the component (role, aria-label, aria-disabled, etc.)
- All types defined in the same file (no separate .d.ts)

STRICT conventions for the cssContent field (.css):
- Root class: .ds-{component-kebab-name}  (e.g. .ds-badge, .ds-modal)
- Size modifier classes: .small / .medium / .large (no prefix)
- Variant modifier classes: use variant names as classes (e.g. .primary, .success, .error)
- State classes: .loading, .disabled, .active
- All values from --ds-* CSS custom properties (colors, spacing, border-radius, shadows, durations)
- Never use hardcoded pixel values or hex colors — always use CSS variables
- Include :focus-visible, :hover:not(:disabled), :disabled, :active states
- Include transitions using --ds-duration-fast and --ds-easing-default`

export async function runComponentAgent(
  componentName: string,
  spec: DesignSystemSpec,
  tokens: TokenOutput,
): Promise<ComponentOutput> {
  const prompt = `Generate a ${componentName} component for the "${spec.name}" design system.

System description: ${spec.description}
Border radius style: ${spec.borderRadius}
Color palette: ${spec.colorPalette}

Available CSS custom properties (use these, do not invent others):
${tokens.cssVariables}

The component name is "${componentName}". Design it as a complete, production-quality component with:
- At least 2 size variants (small, medium, large if applicable)
- At least 2 appearance variants suited to ${componentName}'s typical use cases
- Proper accessibility (ARIA attributes, keyboard interaction, focus management)
- Disabled state
- Loading state if the component triggers async actions`

  return callAgentWithJsonRetry<ComponentOutput>('ComponentAgent', SYSTEM_PROMPT, prompt, 3, 6000)
}
