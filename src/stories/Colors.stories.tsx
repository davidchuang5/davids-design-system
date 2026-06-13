import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { baseTokens, semanticTokens } from '../tokens';

function Swatch({ name, background, value }: { name: string; background: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 80 }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 8,
          background,
          border: '1px solid rgba(0,0,0,0.08)',
        }}
      />
      <span style={{ fontSize: 11, color: '#374151', fontWeight: 500 }}>{name}</span>
      <span style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'monospace' }}>{value}</span>
    </div>
  );
}

function ColorPalette() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 32 }}>
      <h2 style={{ fontSize: 20, color: '#111827', marginBottom: 8, fontWeight: 700 }}>Base Colors</h2>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 32 }}>
        Primitive values. Reference these via semantic tokens — avoid using directly in components.
      </p>
      {Object.entries(baseTokens.color).map(([palette, steps]) => (
        <div key={palette} style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: 14, color: '#111827', marginBottom: 16, fontWeight: 600 }}>{palette}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {Object.entries(steps).map(([step, token]) => (
              <Swatch
                key={step}
                name={step}
                background={`var(--ds-color-${palette}-${step})`}
                value={token.value}
              />
            ))}
          </div>
        </div>
      ))}

      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '16px 0 32px' }} />

      <h2 style={{ fontSize: 20, color: '#111827', marginBottom: 8, fontWeight: 700 }}>Semantic Colors</h2>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 32 }}>
        Role-based aliases that map to base colors. Use these in components.
      </p>
      {Object.entries(semanticTokens.semantic.color).map(([group, tokens]) => (
        <div key={group} style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: 14, color: '#111827', marginBottom: 16, fontWeight: 600 }}>{group}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {Object.entries(tokens).map(([name, token]) => (
              <Swatch
                key={name}
                name={name}
                background={`var(--ds-semantic-color-${group}-${name})`}
                value={token.value}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: 'Tokens/Colors',
  component: ColorPalette,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const All: Story = {};
