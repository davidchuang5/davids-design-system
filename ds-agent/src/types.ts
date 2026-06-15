export interface DesignSystemSpec {
  name: string
  description: string
  components: string[]
  colorPalette: string
  borderRadius: 'sharp' | 'rounded' | 'pill'
}

export interface TokenOutput {
  colors: Record<string, Record<string, string>>
  cssVariables: string
}

export interface ComponentOutput {
  name: string
  code: string
  cssContent: string
}

export interface TestOutput {
  storyCode: string
  testCode: string
}

export interface DocsOutput {
  mdx: string
}

export interface RunLogEntry {
  timestamp: string
  agent: string
  success: boolean
  duration?: number
  inputTokens?: number
  outputTokens?: number
  error?: string
}
