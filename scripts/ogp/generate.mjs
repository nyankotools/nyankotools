// ツール別OGP画像（1200×630 PNG）をビルド時に生成する。
// satori（JSX風オブジェクト → SVG。文字はパス化される）→ sharp（SVG → PNG）で、システムフォントに依存しない。
// 出力: <outDir>/ogp/<slug>.png（ja）、<outDir>/ogp/en/<slug>.png（en）。
// 画像の内容は tools.ts（ツール名・説明・カテゴリ）から決まるため、内容のハッシュで
// node_modules/.cache/ogp/ にキャッシュし、変更のないツールは再描画しない。
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { mkdir, readFile, copyFile, access } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import sharp from 'sharp';
import { getLocalizedTools, tools } from '../../src/data/tools.ts';

const root = path.resolve(fileURLToPath(import.meta.url), '../../..');
const cacheDir = path.join(root, 'node_modules/.cache/ogp');
const fontDir = path.dirname(
  createRequire(import.meta.url).resolve(
    '@fontsource/m-plus-rounded-1c/package.json',
  ),
);

/** テンプレートを変えたらここを上げる（キャッシュ無効化） */
const TEMPLATE_VERSION = '2';
const WIDTH = 1200;
const HEIGHT = 630;
const INK = '#4a2f63';
const MUTED = '#6b5a7c';
const SITE = 'nyankotools.com';

/** カテゴリの識別色（src/lib/category-style.ts のTailwind 500番台に対応） */
const categoryColor = {
  text: '#0ea5e9',
  data: '#14b8a6',
  encode: '#8b5cf6',
  datetime: '#f59e0b',
  image: '#ec4899',
  pdf: '#ef4444',
  calc: '#10b981',
  dev: '#6366f1',
  generate: '#f97316',
  camera: '#f43f5e',
  security: '#64748b',
  file: '#65a30d',
  hardware: '#0891b2',
  media: '#d946ef',
  games: '#eab308',
};

/** fontsource のCSSから、サブセットごとの unicode-range とファイル名を読む */
async function loadSubsets(weight) {
  const css = await readFile(path.join(fontDir, `${weight}.css`), 'utf8');
  const subsets = [];
  for (const block of css.split('@font-face').slice(1)) {
    const file = block.match(/files\/([^)]+?\.woff)\)/)?.[1];
    const range = block.match(/unicode-range:\s*([^;]+);/)?.[1];
    if (!file || !range) continue;
    const ranges = range.split(',').map((r) => {
      const [lo, hi = lo] = r.trim().replace('U+', '').split('-');
      return [parseInt(lo, 16), parseInt(hi, 16)];
    });
    subsets.push({ file, ranges });
  }
  return subsets;
}

const covers = (subset, cp) =>
  subset.ranges.some(([lo, hi]) => cp >= lo && cp <= hi);

/** 全テキストに必要なサブセットだけを読み込み、satori 用のフォント配列にする */
async function loadFonts(allText) {
  const fonts = [];
  const missing = new Set();
  for (const weight of [400, 700]) {
    const subsets = await loadSubsets(weight);
    const need = new Set();
    for (const ch of new Set(allText)) {
      const cp = ch.codePointAt(0);
      if (cp <= 0x20) continue;
      const hit = subsets.find((s) => covers(s, cp));
      if (hit) need.add(hit.file);
      else missing.add(ch);
    }
    for (const file of need) {
      fonts.push({
        // satori は同名フォントの文字カバー範囲を合算しないため、サブセットごとに別名を付けて
        // fontFamily のフォールバック列として並べる（familyList 参照）
        name: `mplus-${weight}-${file}`,
        weight,
        style: 'normal',
        data: await readFile(path.join(fontDir, 'files', file)),
      });
    }
  }
  if (missing.size > 0) {
    console.warn(
      `[ogp] フォントに無い文字（表示されない）: ${[...missing].join(' ')}`,
    );
  }
  return fonts;
}

/** 指定ウェイトのフォールバック列（fontFamily に渡す文字列） */
const familyList = (fonts, weight) =>
  fonts
    .filter((f) => f.weight === weight)
    .map((f) => f.name)
    .join(', ');

/** フォントに無いローマ数字（Ⅰ〜Ⅻ）を通常のラテン文字に置き換える */
const ROMAN = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
];
const toDisplayText = (text) =>
  text.replace(/[Ⅰ-Ⅻ]/g, (ch) => ROMAN[ch.codePointAt(0) - 0x2160]);

/** 文字幅の概算（全角=1em、半角=0.55em）。タイトルのサイズ決定にだけ使う */
function textWidth(text) {
  let em = 0;
  for (const ch of text) em += ch.codePointAt(0) > 0x2e80 ? 1 : 0.55;
  return em;
}

/** 説明文を、指定サイズで2行に収まる長さに切り詰める（satori の lineClamp は当てにしない） */
function clampText(text, size, boxWidth) {
  const limit = (boxWidth * 2 * 0.88) / size;
  if (textWidth(text) <= limit) return text;
  let out = '';
  for (const ch of text) {
    if (textWidth(out + ch + '…') > limit) break;
    out += ch;
  }
  return `${out}…`;
}

/** タイトルが最大2行に収まる最大のフォントサイズを選ぶ */
function titleSize(name, boxWidth) {
  for (const size of [92, 80, 68, 58, 50, 44]) {
    if (textWidth(name) * size <= boxWidth * 2 * 0.92) return size;
  }
  return 40;
}

const div = (style, children) => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

function template({ name, description, category, categoryId, logoUri, fonts }) {
  const bold = familyList(fonts, 700);
  const regular = familyList(fonts, 400);
  const boxWidth = WIDTH - 2 * 96;
  return div(
    {
      width: WIDTH,
      height: HEIGHT,
      boxSizing: 'border-box',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '56px 96px',
      color: INK,
      fontFamily: regular,
      backgroundImage: 'linear-gradient(135deg, #f7f3fd 0%, #fdf2f9 100%)',
    },
    [
      div({ alignItems: 'center', justifyContent: 'space-between' }, [
        { type: 'img', props: { src: logoUri, width: 275, height: 56 } },
        div(
          {
            alignItems: 'center',
            gap: 12,
            padding: '8px 22px',
            borderRadius: 999,
            backgroundColor: '#ffffff',
            border: '2px solid #e4d9f0',
            fontSize: 28,
            fontFamily: bold,
            fontWeight: 700,
          },
          [
            div(
              {
                width: 18,
                height: 18,
                borderRadius: 999,
                backgroundColor: categoryColor[categoryId],
              },
              [],
            ),
            category,
          ],
        ),
      ]),
      div({ flexDirection: 'column', gap: 24 }, [
        div(
          {
            fontSize: titleSize(name, boxWidth),
            fontFamily: bold,
            fontWeight: 700,
            lineHeight: 1.25,
            lineClamp: 2,
          },
          name,
        ),
        div(
          {
            fontSize: 32,
            fontWeight: 400,
            lineHeight: 1.5,
            color: MUTED,
            lineClamp: 2,
          },
          clampText(description, 32, boxWidth),
        ),
      ]),
      div(
        {
          justifyContent: 'flex-end',
          fontSize: 28,
          fontFamily: bold,
          fontWeight: 700,
        },
        SITE,
      ),
    ],
  );
}

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

/** dist などの出力先に /ogp/ 以下の画像を生成する。件数を返す */
export async function generateOgpImages(outDir) {
  const jobs = [];
  for (const locale of ['ja', 'en']) {
    for (const tool of getLocalizedTools(locale)) {
      jobs.push({
        locale,
        tool: {
          ...tool,
          name: toDisplayText(tool.name),
          description: toDisplayText(tool.description),
        },
      });
    }
  }
  const logo = await readFile(path.join(root, 'public/logo.png'));
  const logoUri = `data:image/png;base64,${logo.toString('base64')}`;
  const allText = jobs
    .map(({ tool }) => `${tool.name}${tool.description}${tool.category}${SITE}`)
    .join('');
  const fonts = await loadFonts(allText);
  // フォント・ロゴの中身が変わったらキャッシュを無効にする
  const assetsHash = createHash('sha256');
  for (const f of fonts) assetsHash.update(f.data);
  assetsHash.update(logo);
  const fontsKey = assetsHash.digest('hex').slice(0, 8);

  await mkdir(cacheDir, { recursive: true });
  let rendered = 0;
  for (const { locale, tool } of jobs) {
    const key = createHash('sha256')
      .update(
        JSON.stringify([
          TEMPLATE_VERSION,
          fontsKey,
          tool.name,
          tool.description,
          tool.category,
          tool.categoryId,
        ]),
      )
      .digest('hex')
      .slice(0, 24);
    const cached = path.join(cacheDir, `${key}.png`);
    if (!(await exists(cached))) {
      const svg = await satori(template({ ...tool, logoUri, fonts }), {
        width: WIDTH,
        height: HEIGHT,
        fonts,
      });
      await sharp(Buffer.from(svg))
        .png({ compressionLevel: 9, palette: true })
        .toFile(cached);
      rendered++;
    }
    const dest = path.join(
      outDir,
      'ogp',
      locale === 'en' ? 'en' : '',
      `${tool.slug}.png`,
    );
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(cached, dest);
  }
  return { total: jobs.length, rendered };
}

/** `node scripts/ogp/generate.mjs <outDir>` で単体実行（見た目の確認用） */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [outDir = 'dist'] = process.argv.slice(2);
  console.log(`tools: ${tools.length}`);
  const t0 = Date.now();
  const result = await generateOgpImages(path.resolve(outDir));
  console.log(result, `${Date.now() - t0}ms`);
}
