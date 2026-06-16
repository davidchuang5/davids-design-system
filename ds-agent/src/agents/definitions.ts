// src/agents/definitions.ts
import { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import {
  TOKEN_AGENT_PROMPT,
  COMPONENT_AGENT_PROMPT,
  TEST_AGENT_PROMPT,
  DOCS_AGENT_PROMPT,
} from './prompts.js';

export const agentDefinitions: Record<string, AgentDefinition> = {
  'token-agent': {
    description: 'Generates design tokens and writes tokens.css and tokens.json.',
    prompt: TOKEN_AGENT_PROMPT,
    tools: ['Write', 'Read', 'Bash'],
    model: 'sonnet',
  } as AgentDefinition,

  'component-agent': {
    description: 'Scaffolds a single React component with types and CSS Module.',
    prompt: COMPONENT_AGENT_PROMPT,
    tools: ['Read', 'Write', 'Glob'],
    model: 'sonnet',
  } as AgentDefinition,

  'test-agent': {
    description: 'Writes Storybook stories and Vitest unit tests for a component.',
    prompt: TEST_AGENT_PROMPT,
    tools: ['Read', 'Write', 'Glob'],
    model: 'sonnet',
  } as AgentDefinition,

  'docs-agent': {
    description: 'Generates MDX documentation for a component.',
    prompt: DOCS_AGENT_PROMPT,
    tools: ['Read', 'Write', 'Glob'],
    model: 'haiku',
  } as AgentDefinition,
};
