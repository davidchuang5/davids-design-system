import StyleDictionary from 'style-dictionary';

const isColorToken = (token) =>
  token.attributes.category === 'color' ||
  (token.attributes.category === 'semantic' && token.attributes.type === 'color');

const sd = StyleDictionary.extend({
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'ds',
      buildPath: 'src/tokens/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: { outputReferences: true },
        },
      ],
    },
    cssColors: {
      transformGroup: 'css',
      prefix: 'ds',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'colors.css',
          format: 'css/variables',
          filter: isColorToken,
          options: { outputReferences: true },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'src/tokens/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'src/tokens/',
      files: [
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },
  },
});

sd.buildAllPlatforms();
console.log('Tokens built successfully.');
