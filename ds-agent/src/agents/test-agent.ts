import { callAgentWithJsonRetry } from '../utils/call-agent.js'
import type { ComponentOutput, TestOutput } from '../types.js'

const SYSTEM_PROMPT = `You are a frontend testing expert. Output ONLY valid JSON — no markdown fences, no prose.

Output this exact shape:
{
  "storyCode": "...full .stories.tsx content...",
  "testCode": "...full .test.tsx content..."
}

Story file conventions (Storybook 7 CSF3):
- import type { Meta, StoryObj } from '@storybook/react'
- import React from 'react'
- import { ComponentName } from './ComponentName'  (relative, same directory)
- tags: ['autodocs'] on the meta object
- export default meta  (not a named export)
- Required exports: Default, AllVariants (showing all appearance variants), AllSizes (if applicable), Disabled
- Add Loading story if component has a loading prop

Test file conventions (Vitest + @testing-library/react):
- import { render, screen, fireEvent } from '@testing-library/react'
- import { describe, it, expect, vi } from 'vitest'
- import { ComponentName } from './ComponentName'  (relative, same directory)
- Cover: renders without crashing, correct ARIA role/label, each variant prop, disabled state, keyboard events
- Use getByRole, getByLabelText, getByText for queries (not getByTestId)
- Each test should be independent and not rely on other tests`

export async function runTestAgent(component: ComponentOutput): Promise<TestOutput> {
  const prompt = `Generate Storybook stories and Vitest tests for this component:

Component name: ${component.name}

Component .tsx:
\`\`\`tsx
${component.code}
\`\`\`

Component .css class names (for reference):
\`\`\`css
${component.cssContent.slice(0, 1500)}
\`\`\``

  return callAgentWithJsonRetry<TestOutput>('TestAgent', SYSTEM_PROMPT, prompt, 3, 6000)
}
