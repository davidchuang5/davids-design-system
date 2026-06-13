import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { baseTokens } from '../tokens';

const fontSans = 'var(--ds-font-family-sans)';
const fontMono = 'var(--ds-font-family-mono)';

const sampleText = 'The quick brown fox jumps over the lazy dog';

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h2>
      {description && (
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4, marginBottom: 0 }}>
          {description}
        </p>
      )}
    </div>
  );
}

function FontSizes() {
  return (
    <div style={{ padding: 32 }}>
      <SectionHeader
        title="Font Sizes"
        description="All available font sizes from the token scale."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {Object.entries(baseTokens.fontSize).map(([name, token]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
            <div style={{ width: 80, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: fontMono }}>
                {name}
              </span>
              <br />
              <span style={{ fontSize: 11, color: '#d1d5db', fontFamily: fontMono }}>
                {token.value}
              </span>
            </div>
            <span style={{ fontSize: token.value, fontFamily: fontSans }}>{sampleText}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FontWeights() {
  return (
    <div style={{ padding: 32 }}>
      <SectionHeader
        title="Font Weights"
        description="All available font weights from the token scale."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {Object.entries(baseTokens.fontWeight).map(([name, token]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
            <div style={{ width: 80, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: fontMono }}>
                {name}
              </span>
              <br />
              <span style={{ fontSize: 11, color: '#d1d5db', fontFamily: fontMono }}>
                {token.value}
              </span>
            </div>
            <span style={{ fontSize: 16, fontWeight: Number(token.value), fontFamily: fontSans }}>{sampleText}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineHeights() {
  return (
    <div style={{ padding: 32 }}>
      <SectionHeader title="Line Heights" description="How text behaves across multiple lines." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {Object.entries(baseTokens.lineHeight).map(([name, token]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
            <div style={{ width: 80, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: fontMono }}>
                {name}
              </span>
              <br />
              <span style={{ fontSize: 11, color: '#d1d5db', fontFamily: fontMono }}>
                {token.value}
              </span>
            </div>
            <p style={{ fontSize: 15, lineHeight: token.value, maxWidth: 480, margin: 0, fontFamily: fontSans }}>
              {sampleText}. {sampleText}. {sampleText}.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypeScale() {
  const weights = baseTokens.fontWeight;
  return (
    <div style={{ padding: 32 }}>
      <SectionHeader
        title="Type Scale"
        description="Sizes and weights combined. Use this to pick heading and body text pairings."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {Object.entries(baseTokens.fontSize)
          .slice()
          .reverse()
          .map(([sizeName, sizeToken]) => (
            <div key={sizeName}>
              <span
                style={{
                  fontSize: 11,
                  color: '#9ca3af',
                  fontFamily: fontMono,
                  display: 'block',
                  marginBottom: 12,
                }}
              >
                {sizeName} — {sizeToken.value}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(weights).map(([weightName, weightToken]) => (
                  <div
                    key={weightName}
                    style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: '#d1d5db',
                        fontFamily: fontMono,
                        width: 64,
                        flexShrink: 0,
                      }}
                    >
                      {weightName}
                    </span>
                    <span
                      style={{ fontSize: sizeToken.value, fontWeight: Number(weightToken.value), fontFamily: fontSans }}
                    >
                      {sampleText}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Tokens/Typography',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const Sizes: Story = { render: () => <FontSizes /> };
export const Weights: Story = { render: () => <FontWeights /> };
export const Heights: Story = { render: () => <LineHeights /> };
export const Scale: Story = { render: () => <TypeScale /> };
