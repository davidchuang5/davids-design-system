import type { Preview } from '@storybook/react';
import '../src/tokens/variables.css';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'subtle', value: '#f9fafb' },
        { name: 'dark', value: '#111827' },
      ],
    },
    controls: { matchers: { color: /(color)/i } },
  },
};

export default preview;
