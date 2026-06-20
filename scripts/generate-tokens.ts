import * as fs from 'fs/promises';
import * as path from 'path';

const TOP_LEVEL_PREFIX: Record<string, string | null> = {
  colors: 'Color',
  spacing: 'Spacing',
  typography: null,
  borderRadius: 'BorderRadius',
  borderWidth: 'BorderWidth',
  shadow: 'Shadow',
  opacity: 'Opacity',
  zIndex: 'ZIndex',
  transition: null,
};

const SKIP_IN_PATH = new Set(['scale']);
const SKIP_KEYS = new Set(['description', 'px', '$schema', '$meta']);

interface TokenExport {
  name: string;
  value: string | number;
  type: 'string' | 'number';
}

function capitalize(s: string): string {
  if (!s || /^\d/.test(s)) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function walk(obj: unknown, segments: string[], out: TokenExport[]): void {
  if (obj === null || typeof obj !== 'object') return;
  const record = obj as Record<string, unknown>;

  if ('value' in record) {
    const name = segments.map(capitalize).join('');
    if (!name) return;
    const raw = record.value as string | number;
    out.push({ name, value: raw, type: typeof raw === 'number' ? 'number' : 'string' });
    if ('foreground' in record) {
      out.push({ name: name + 'Foreground', value: record.foreground as string, type: 'string' });
    }
    return;
  }

  for (const [key, val] of Object.entries(record)) {
    if (key.startsWith('$') || SKIP_KEYS.has(key)) continue;
    const next = SKIP_IN_PATH.has(key) ? segments : [...segments, key];
    walk(val, next, out);
  }
}

async function generateTokenFiles(tokensJsonPath: string, outputDir: string): Promise<void> {
  const raw = await fs.readFile(tokensJsonPath, 'utf-8');
  const json = JSON.parse(raw) as Record<string, unknown>;
  const timestamp = new Date().toUTCString();
  const header = `/**\n * Do not edit directly\n * Generated on ${timestamp}\n */\n\n`;

  const exports: TokenExport[] = [];

  for (const [topKey, topVal] of Object.entries(json)) {
    if (topKey.startsWith('$') || !(topKey in TOP_LEVEL_PREFIX)) continue;
    const prefix = TOP_LEVEL_PREFIX[topKey];

    if (prefix === null) {
      if (typeof topVal !== 'object' || topVal === null) continue;
      for (const [childKey, childVal] of Object.entries(topVal as Record<string, unknown>)) {
        if (SKIP_KEYS.has(childKey)) continue;
        walk(childVal, [childKey], exports);
      }
    } else {
      walk(topVal, [prefix], exports);
    }
  }

  const jsLines = exports.map(({ name, value }) => {
    const v = typeof value === 'string' ? JSON.stringify(value) : String(value);
    return `export const ${name} = ${v};`;
  });

  const dtsLines = exports.map(({ name, type }) =>
    `export declare const ${name}: ${type};`
  );

  await fs.writeFile(path.join(outputDir, 'tokens.js'), header + jsLines.join('\n') + '\n');
  await fs.writeFile(path.join(outputDir, 'tokens.d.ts'), header + dtsLines.join('\n') + '\n');

  console.log(`  ✓ tokens.js + tokens.d.ts generated (${exports.length} exports)`);
}

// CLI entry point: npx tsx scripts/generate-tokens.ts <tokens.json> <outputDir>
const [tokensJsonPath, outputDir] = process.argv.slice(2);
if (!tokensJsonPath || !outputDir) {
  console.error('Usage: npx tsx scripts/generate-tokens.ts <tokens.json path> <output dir>');
  process.exit(1);
}
generateTokenFiles(tokensJsonPath, outputDir).catch((err) => {
  console.error(err);
  process.exit(1);
});
