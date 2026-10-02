import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** コメント行と末尾カンマを除いて JSONC を読む（このリポジトリの wrangler 設定の範囲で足りる簡易版） */
function readJsonc(path: string): Record<string, unknown> {
  const text = readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n')
    .replace(/,(\s*[}\]])/g, '$1');
  return JSON.parse(text) as Record<string, unknown>;
}

describe('wrangler 設定の同期', () => {
  const prod = readJsonc('wrangler.jsonc');
  const e2e = readJsonc('e2e/wrangler.e2e.jsonc');

  it('E2E 用設定は本番設定から build だけを除いたもの（directory は dist を指す）', () => {
    expect(e2e.name).toBe(prod.name);
    expect(e2e.compatibility_date).toBe(prod.compatibility_date);
    expect(e2e.build).toBeUndefined();

    const { directory: prodDir, ...prodAssets } = prod.assets as Record<
      string,
      unknown
    >;
    const { directory: e2eDir, ...e2eAssets } = e2e.assets as Record<
      string,
      unknown
    >;
    expect(e2eAssets).toEqual(prodAssets);
    expect(prodDir).toBe('./dist');
    expect(e2eDir).toBe('../dist');
  });
});
