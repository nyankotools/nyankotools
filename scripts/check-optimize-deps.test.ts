import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import astroConfig from '../astro.config.mjs';

// `src/lib` や `src/components` の <script> は Astro dev サーバーでクライアント向けに
// バンドルされる。ここで使う外部npmパッケージが astro.config.mjs の
// vite.optimizeDeps.include に載っていないと、キャッシュのないCI環境で
// 「504 (Outdated Optimize Dep)」が発生しツールのスクリプトが動かなくなる
// （exif-viewer追加時に実際に発生した障害）。この再発防止として、
// src配下の非テストコードが import する外部パッケージが漏れなく
// optimizeDeps.include に登録されていることを機械的に検証する。

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const scanDirs = ['src/lib', 'src/components'];
const targetExtensions = ['.ts', '.astro'];

function collectFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
      continue;
    }
    if (entry.name.endsWith('.test.ts')) continue;
    if (targetExtensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

const importSpecifierPattern = /(?:^|\s)from\s+['"]([^'"]+)['"]/g;

function isBareExternalSpecifier(specifier: string): boolean {
  if (specifier.startsWith('.')) return false; // 相対import
  if (specifier.startsWith('/')) return false; // 絶対パス
  if (specifier.startsWith('astro:')) return false; // Astroの仮想モジュール
  if (specifier.startsWith('node:')) return false; // Node組み込み
  if (specifier.includes('?url')) return false; // アセットURLの取得（依存の事前バンドル対象ではない）
  return true;
}

describe('vite optimizeDeps.include の網羅性', () => {
  it('src/lib・src/components が import する外部パッケージは全てastro.config.mjsのoptimizeDeps.includeに登録されている', () => {
    const includeList: string[] = astroConfig.vite?.optimizeDeps?.include ?? [];
    const includeSet = new Set(includeList);

    const missing = new Map<string, Set<string>>();

    for (const dir of scanDirs) {
      const files = collectFiles(path.join(rootDir, dir));
      for (const file of files) {
        const content = readFileSync(file, 'utf-8');
        for (const match of content.matchAll(importSpecifierPattern)) {
          const specifier = match[1];
          if (!isBareExternalSpecifier(specifier)) continue;
          if (includeSet.has(specifier)) continue;

          const relativeFile = path.relative(rootDir, file);
          if (!missing.has(specifier)) missing.set(specifier, new Set());
          missing.get(specifier)!.add(relativeFile);
        }
      }
    }

    if (missing.size > 0) {
      const details = [...missing.entries()]
        .map(
          ([specifier, files]) =>
            `  - "${specifier}" (used in: ${[...files].join(', ')})`,
        )
        .join('\n');
      throw new Error(
        `以下の外部パッケージが astro.config.mjs の vite.optimizeDeps.include に未登録です。\n` +
          `CI等キャッシュなし環境で「504 (Outdated Optimize Dep)」によりツールのスクリプトが\n` +
          `動作しなくなるため、astro.config.mjs の optimizeDeps.include に追加してください。\n` +
          `${details}`,
      );
    }

    expect(missing.size).toBe(0);
  });
});
