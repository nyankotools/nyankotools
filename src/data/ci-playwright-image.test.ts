import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// CIのe2eジョブはPlaywright公式イメージを使う。イメージのタグと @playwright/test の
// バージョンがずれるとブラウザが見つからず落ちるため、ずれをPR Checkの段階で検知する。
describe('CIのPlaywrightイメージ', () => {
  it('タグが @playwright/test のバージョンと一致する', () => {
    const ci = readFileSync('.github/workflows/ci.yml', 'utf8');
    const tag = /mcr\.microsoft\.com\/playwright:v([\d.]+)-/.exec(ci)?.[1];
    const installed = (
      JSON.parse(
        readFileSync('node_modules/@playwright/test/package.json', 'utf8'),
      ) as {
        version: string;
      }
    ).version;
    expect(tag).toBe(installed);
  });
});
