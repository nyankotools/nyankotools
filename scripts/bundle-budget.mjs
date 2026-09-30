// ページ別JSバンドルサイズ予算の検査（ビルド後に `node scripts/bundle-budget.mjs`）。
//
// dist/ の各HTMLについて、<script src="/_astro/*.js"> から辿れるJSのgzipサイズを計測する。
//   - initial: 静的import（`import ... from "./x.js"`）で最初に読み込まれるJS
//   - total  : 上記に動的import（`import("./x.js")`。PDFやwasmなど操作時に遅延読み込みされるもの）
//              を加えた、そのページで到達しうるJS全体
// 予算を超えたページがあれば一覧を出して終了コード1で終わる（CIでビルド後に実行する）。
// ツールの `heavy: true`（src/data/tools.ts）はtotalの予算が大きい。
// 予算を上げるのは、重いライブラリを意図して追加したときだけにする。

import process from 'node:process';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KB = 1024;

/**
 * gzip後のバイト数の上限（2026-09-30時点の実測: 通常ツール最大 toml-converter 59KB、
 * heavy 最大 code-minifier 469KB。それぞれに余裕を持たせた値）。
 * wasm・PDFワーカーなど、JSの静的/動的importで辿れないアセット（qpdf.wasm 等）は計測対象外。
 */
export const budgets = {
  // 通常ページ・通常ツール（initial / total の両方に適用）
  normal: 80 * KB,
  // heavy ツール（PDF・wasm・大きめのライブラリ）。initial / total の両方に適用
  heavy: 520 * KB,
};

const STATIC_IMPORT = /(?:\bfrom|\bimport)\s*["'](\.[^"']+\.m?js)["']/g;
const DYNAMIC_IMPORT = /\bimport\(\s*["'](\.[^"']+\.m?js)["']\s*\)/g;

/** JSソースから、静的import・動的importの相対パスを取り出す */
export function findImports(source) {
  const dynamic = [...source.matchAll(DYNAMIC_IMPORT)].map((m) => m[1]);
  const dynamicSet = new Set(dynamic);
  const statics = [...source.matchAll(STATIC_IMPORT)]
    .map((m) => m[1])
    .filter((p) => !dynamicSet.has(p) || isStaticOnlyMatch(source, p));
  return { static: [...new Set(statics)], dynamic: [...dynamicSet] };
}

// 同じファイルが静的・動的の両方で参照される場合は静的として扱う
function isStaticOnlyMatch(source, p) {
  const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:\\bfrom|\\bimport)\\s*["']${escaped}["']`).test(
    source.replace(
      new RegExp(`import\\(\\s*["']${escaped}["']\\s*\\)`, 'g'),
      '',
    ),
  );
}

/** HTMLから、読み込まれる自サイトのJS（/_astro/ 配下）のパスを取り出す */
export function findScripts(html) {
  return [...html.matchAll(/<script[^>]*\ssrc="(\/_astro\/[^"]+\.m?js)"/g)].map(
    (m) => m[1],
  );
}

/** dist上のJSをgzip後のサイズで計測し、initial / total を返す */
export function measurePage(html, distDir) {
  const gzipCache = new Map();
  const sizeOf = (file) => {
    if (!gzipCache.has(file)) {
      gzipCache.set(file, gzipSync(readFileSync(file)).length);
    }
    return gzipCache.get(file);
  };

  const initialFiles = new Set();
  const totalFiles = new Set();

  const walk = (file, isInitial) => {
    if (!existsSync(file) || totalFiles.has(file)) {
      if (isInitial && totalFiles.has(file)) markInitial(file);
      return;
    }
    totalFiles.add(file);
    if (isInitial) initialFiles.add(file);
    const imports = findImports(readFileSync(file, 'utf8'));
    for (const rel of imports.static)
      walk(path.resolve(path.dirname(file), rel), isInitial);
    for (const rel of imports.dynamic)
      walk(path.resolve(path.dirname(file), rel), false);
  };
  // 動的importで先に到達した後、静的importでも参照されていたファイルをinitialへ昇格させる
  const markInitial = (file) => {
    if (initialFiles.has(file)) return;
    initialFiles.add(file);
    const imports = findImports(readFileSync(file, 'utf8'));
    for (const rel of imports.static)
      markInitial(path.resolve(path.dirname(file), rel));
  };

  for (const src of findScripts(html)) {
    walk(path.join(distDir, src), true);
  }

  const sum = (set) => [...set].reduce((n, f) => n + sizeOf(f), 0);
  return { initial: sum(initialFiles), total: sum(totalFiles) };
}

/** src/data/tools.ts から heavy: true のslug一覧を取り出す（TSを実行せず、登録簿の記法に依存して読む） */
export function readHeavySlugs(toolsTsSource) {
  const heavy = new Set();
  for (const block of toolsTsSource.split(/\n {2}\{\n\s+slug: /).slice(1)) {
    const slug = block.match(/^'([^']+)'/)?.[1];
    if (slug && /\n\s+heavy: true,/.test(block)) heavy.add(slug);
  }
  return heavy;
}

/** dist配下のindex.htmlを再帰的に集める */
function collectHtml(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name !== '_astro') out.push(...collectHtml(p));
    } else if (name === 'index.html') {
      out.push(p);
    }
  }
  return out;
}

/** ページのURLパスから、ツールのslugを取り出す（ツールページ以外は null） */
export function toolSlugOf(urlPath) {
  return urlPath.match(/^\/(?:en\/)?tools\/([^/]+)\/$/)?.[1] ?? null;
}

const fmt = (n) => `${(n / KB).toFixed(1)}KB`;

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const distDir = path.join(root, 'dist');
  if (!existsSync(distDir)) {
    console.error('dist/ がありません。先に `pnpm build` を実行してください。');
    process.exit(2);
  }
  const heavy = readHeavySlugs(
    readFileSync(path.join(root, 'src/data/tools.ts'), 'utf8'),
  );

  const rows = [];
  const violations = [];
  for (const file of collectHtml(distDir)) {
    const urlPath =
      '/' +
      path.relative(distDir, path.dirname(file)).split(path.sep).join('/');
    const page = urlPath === '/' ? '/' : `${urlPath}/`;
    const slug = toolSlugOf(page);
    const isHeavy = slug !== null && heavy.has(slug);
    const { initial, total } = measurePage(readFileSync(file, 'utf8'), distDir);
    const limit = isHeavy ? budgets.heavy : budgets.normal;
    rows.push({ page, initial, total, isHeavy });
    for (const [kind, size] of [
      ['initial', initial],
      ['total', total],
    ]) {
      if (size > limit)
        violations.push(
          `${page}: ${kind} ${fmt(size)} > ${fmt(limit)}${isHeavy ? '（heavy）' : ''}`,
        );
    }
  }

  rows.sort((a, b) => b.total - a.total);
  console.log('JSバンドル（gzip後）上位10ページ:');
  for (const r of rows.slice(0, 10)) {
    console.log(
      `  ${r.page.padEnd(44)} initial ${fmt(r.initial).padStart(9)}  total ${fmt(r.total).padStart(9)}${r.isHeavy ? '  heavy' : ''}`,
    );
  }
  console.log(
    `予算: 通常 ${fmt(budgets.normal)} / heavy ${fmt(budgets.heavy)}（initial・totalそれぞれに適用）  対象 ${rows.length}ページ`,
  );

  if (violations.length > 0) {
    console.error(`\n予算超過 ${violations.length}件:`);
    for (const v of violations) console.error(`  - ${v}`);
    console.error(
      '\n意図した増加なら scripts/bundle-budget.mjs の budgets を見直してください。',
    );
    process.exit(1);
  }
  console.log('予算内です。');
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main();
}
