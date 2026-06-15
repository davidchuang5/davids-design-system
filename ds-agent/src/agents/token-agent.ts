import { callAgentWithJsonRetry } from '../utils/call-agent.js'
import type { DesignSystemSpec, TokenOutput } from '../types.js'

const SYSTEM_PROMPT = `You are a design token expert. Output ONLY valid JSON — no markdown fences, no prose.

Output this exact shape:
{
  "colors": {
    "{paletteName}": {
      "50": "#hex", "100": "#hex", "200": "#hex", "400": "#hex",
      "500": "#hex", "700": "#hex", "900": "#hex"
    }
  },
  "cssVariables": ":root { ... }"
}

CSS variable naming convention (follow exactly):
- Colors:       --ds-color-{palette}-{shade}   (e.g. --ds-color-brand-500)
- Spacing:      --ds-spacing-{n}               (4px scale: 0,1,2,3,4,5,6,8,10,12,16)
- Font sizes:   --ds-font-size-{size}          (xs,sm,base,md,lg,xl,2xl,3xl,4xl)
- Font weights: --ds-font-weight-{weight}      (regular,medium,semibold,bold)
- Line heights: --ds-line-height-{name}        (tight,normal,relaxed)
- Border radii: --ds-border-radius-{name}      (none,sm,md,lg,xl,full)
- Shadows:      --ds-shadow-{size}             (sm,md,lg,xl)
- Durations:    --ds-duration-{speed}          (fast,normal,slow)
- Easings:      --ds-easing-{name}             (default,in,out)
- Semantic:     --ds-semantic-color-{category}-{role} (e.g. --ds-semantic-color-text-default)

The cssVariables field must be the full :root { } CSS block with ALL tokens included.
Generate fresh, harmonious colors based on the spec. Neutral palette is always required alongside the primary.`

export async function runTokenAgent(spec: DesignSystemSpec): Promise<TokenOutput> {
  const borderRadiusMap = {
    sharp: '0px / 2px / 4px / 6px',
    rounded: '4px / 6px / 8px / 12px',
    pill: '8px / 16px / 24px / 9999px',
  }

  const prompt = `Generate design tokens for:
- System name: ${spec.name}
- Description: ${spec.description}
- Color palette: ${spec.colorPalette}
- Border radius style: ${spec.borderRadius} (sm/md/lg/full = ${borderRadiusMap[spec.borderRadius]})

Include a "neutral" palette (grays from near-white to near-black) and the primary palette(s) described above.
Also include semantic color aliases (text-default, text-subtle, bg-default, border-default, etc.) in cssVariables.`

  return callAgentWithJsonRetry<TokenOutput>('TokenAgent', SYSTEM_PROMPT, prompt)
}
