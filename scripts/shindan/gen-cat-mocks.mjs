// 猫タイプ診断の仮画像（モックSVG）を生成する（設計書16.13）。
// 共通テンプレート（正面おすわり）+ 猫種ごとのパラメータから16ファイルを書き出す。
// 猫種として正確な絵ではなく、色・柄・長毛かどうかで16種が見分けられる粒度にとどめる。
// 本番画像（リアル調）に差し替えたら、このスクリプトと出力は削除してよい。
//
// 使い方: node scripts/shindan/gen-cat-mocks.mjs
import { Buffer } from 'node:buffer';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'public', 'shindan', 'neko', 'cats');

const INK = '#4a2f63';

/**
 * pattern: solid（単色）/ tabby（縞）/ calico（三毛）/ ticked（ティック）/ pointed（ポイント）/ spotted（斑点）
 * ear: 耳の高さの倍率、faceW: 顔の幅の倍率。折れ耳・極端な短足は描かない（16.10）。
 */
const BREEDS = {
  abyssinian: {
    base: '#c27a48',
    chest: '#e9bf94',
    eye: '#b9ab3c',
    pattern: 'ticked',
    stripe: '#7a4527',
    ear: 1.45,
    faceW: 0.92,
    whisker: '#f4e3cf',
  },
  somali: {
    base: '#c27a48',
    chest: '#e9bf94',
    eye: '#b9ab3c',
    pattern: 'ticked',
    stripe: '#7a4527',
    ear: 1.35,
    faceW: 0.96,
    longHair: true,
    whisker: '#f4e3cf',
  },
  chatora: {
    base: '#f0a35b',
    chest: '#fdf1e3',
    eye: '#7fb2d9',
    pattern: 'tabby',
    stripe: '#c8702e',
    ear: 1.0,
    faceW: 1.0,
    whisker: '#fdf1e3',
  },
  siberian: {
    base: '#8a6a4f',
    chest: '#efe3d3',
    eye: '#d8b13a',
    pattern: 'tabby',
    stripe: '#4d3527',
    ear: 1.05,
    faceW: 1.08,
    longHair: true,
    whisker: '#efe3d3',
  },
  siamese: {
    base: '#f3e7d3',
    chest: '#f3e7d3',
    eye: '#5aa7e0',
    pattern: 'pointed',
    point: '#5a3e30',
    ear: 1.4,
    faceW: 0.86,
    whisker: '#f3e7d3',
  },
  bengal: {
    base: '#e2a85a',
    chest: '#f6e3c4',
    eye: '#9cbf4a',
    pattern: 'spotted',
    spot: '#5a3a22',
    ear: 1.0,
    faceW: 0.95,
    whisker: '#f6e3c4',
  },
  kijitora: {
    base: '#8c7a62',
    chest: '#8c7a62',
    eye: '#c6a93a',
    pattern: 'tabby',
    stripe: '#3e3226',
    ear: 1.0,
    faceW: 1.0,
    whisker: '#e9e1d4',
  },
  'american-shorthair': {
    base: '#c9cdd2',
    chest: '#c9cdd2',
    eye: '#c6a23a',
    pattern: 'tabby',
    stripe: '#3b3f45',
    swirl: true,
    ear: 1.0,
    faceW: 1.06,
    whisker: '#f3f4f6',
  },
  'maine-coon': {
    base: '#a0785a',
    chest: '#f3e9dc',
    eye: '#d8b13a',
    pattern: 'tabby',
    stripe: '#5b4030',
    ear: 1.3,
    faceW: 1.06,
    longHair: true,
    lynxTips: true,
    whisker: '#f3e9dc',
  },
  'norwegian-forest': {
    base: '#9aa0a8',
    chest: '#ffffff',
    eye: '#7fbf6a',
    pattern: 'tabby',
    stripe: '#5e646c',
    ear: 1.15,
    faceW: 1.0,
    longHair: true,
    whisker: '#ffffff',
  },
  ragdoll: {
    base: '#f5efe6',
    chest: '#ffffff',
    eye: '#5aa7e0',
    pattern: 'pointed',
    point: '#7d8596',
    ear: 0.95,
    faceW: 1.08,
    longHair: true,
    whisker: '#ffffff',
  },
  'british-shorthair': {
    base: '#8b97a8',
    chest: '#8b97a8',
    eye: '#e39a2e',
    pattern: 'solid',
    ear: 0.8,
    faceW: 1.15,
    whisker: '#eef1f5',
  },
  mike: {
    base: '#fbf7f2',
    chest: '#fbf7f2',
    eye: '#d9a53b',
    pattern: 'calico',
    patchA: '#e8954a',
    patchB: '#3a3330',
    ear: 1.0,
    faceW: 1.0,
    whisker: '#9a8f88',
  },
  kuroneko: {
    base: '#2f2b33',
    chest: '#2f2b33',
    eye: '#e8c43a',
    pattern: 'solid',
    ear: 1.05,
    faceW: 0.98,
    whisker: '#cfc6d6',
  },
  persian: {
    base: '#f6efe6',
    chest: '#f6efe6',
    eye: '#d9883a',
    pattern: 'solid',
    ear: 0.7,
    faceW: 1.15,
    longHair: true,
    whisker: '#b8aca0',
  },
  'russian-blue': {
    base: '#8e9aab',
    chest: '#8e9aab',
    eye: '#6cc070',
    pattern: 'solid',
    ear: 1.25,
    faceW: 0.9,
    whisker: '#eef1f5',
  },
};

const HX = 256,
  HY = 195,
  HRY = 88;
const BODY =
  'M256 250 C190 250 160 330 165 400 C168 440 200 452 256 452 C312 452 344 440 347 400 C352 330 322 250 256 250 Z';
const TAIL = 'M330 435 C425 445 445 360 398 318';

function ears(b) {
  const rx = 100 * b.faceW;
  const h = 26 * b.ear;
  const mk = (s) => {
    const A = [HX + s * 0.92 * rx, HY - 30];
    const T = [HX + s * 0.74 * rx, HY - HRY - h];
    const B = [HX + s * 0.22 * rx, HY - 82];
    return { A, T, B };
  };
  return [mk(-1), mk(1)];
}

const pts = (...p) => p.map((q) => q.join(',')).join(' ');

function shrink({ A, T, B }, k) {
  const c = [(A[0] + T[0] + B[0]) / 3, (A[1] + T[1] + B[1]) / 3 + 6];
  const f = (p) => [c[0] + (p[0] - c[0]) * k, c[1] + (p[1] - c[1]) * k];
  return [f(A), f(T), f(B)];
}

/** 長毛種の飾り毛（胴の左右の縁と頬）。柄はかけず地の色だけにして、ふわっとした輪郭に見せる */
function fluff(b) {
  if (!b.longHair) return '';
  const out = [];
  for (let t = 0; t <= 1.001; t += 1 / 7) {
    const y = 285 + t * 150;
    const w = 72 + Math.sin(t * Math.PI * 0.9) * 22;
    out.push(
      `<circle cx="${HX - w - 6}" cy="${y}" r="16"/>`,
      `<circle cx="${HX + w + 6}" cy="${y}" r="16"/>`,
    );
  }
  const rx = 100 * b.faceW;
  out.push(
    `<polygon points="${pts([HX - rx + 8, HY + 5], [HX - rx - 22, HY + 40], [HX - rx + 30, HY + 55])}"/>`,
    `<polygon points="${pts([HX + rx - 8, HY + 5], [HX + rx + 22, HY + 40], [HX + rx - 30, HY + 55])}"/>`,
  );
  return out.join('');
}

/** 胴・足・頭・耳（飾り毛を除く）。柄はこの形で切り抜く */
function core(b) {
  const rx = 100 * b.faceW;
  const [L, R] = ears(b);
  return [
    `<polygon points="${pts(L.A, L.T, L.B)}"/>`,
    `<polygon points="${pts(R.A, R.T, R.B)}"/>`,
    `<path d="${BODY}"/>`,
    `<rect x="212" y="360" width="36" height="92" rx="18"/>`,
    `<rect x="264" y="360" width="36" height="92" rx="18"/>`,
    `<ellipse cx="${HX}" cy="${HY}" rx="${rx}" ry="${HRY}"/>`,
  ].join('');
}

const silhouette = (b) => fluff(b) + core(b);

function tabbyLines(b) {
  const lines = [];
  for (let y = 292; y <= 430; y += 26) {
    lines.push(
      `<path d="M150 ${y} q34 -8 56 4"/>`,
      `<path d="M362 ${y} q-34 -8 -56 4"/>`,
    );
  }
  lines.push(
    // 額のM字
    `<path d="M240 ${HY - 80} l4 34 M256 ${HY - 86} l0 38 M272 ${HY - 80} l-4 34"/>`,
    // 頬
    `<path d="M${HX - 95} ${HY + 8} q22 2 34 10 M${HX - 95} ${HY + 26} q20 0 30 6"/>`,
    `<path d="M${HX + 95} ${HY + 8} q-22 2 -34 10 M${HX + 95} ${HY + 26} q-20 0 -30 6"/>`,
    // 前足
    `<path d="M214 392 h32 M214 414 h32 M266 392 h32 M266 414 h32"/>`,
  );
  if (b.swirl) {
    // クラシックタビーの渦巻き（胴の側面）
    lines.push(
      `<circle cx="190" cy="360" r="20"/>`,
      `<circle cx="322" cy="360" r="20"/>`,
    );
  }
  return `<g clip-path="url(#core)" fill="none" stroke="${b.stripe}" stroke-width="9" stroke-linecap="round">${lines.join('')}</g>`;
}

function pattern(b) {
  switch (b.pattern) {
    case 'tabby':
      return tabbyLines(b);
    case 'calico':
      return `<g clip-path="url(#core)">
      <path fill="${b.patchA}" d="M120 60 C190 60 250 90 246 150 C240 190 190 175 160 200 C120 225 110 120 120 60 Z"/>
      <path fill="${b.patchB}" d="M300 70 C350 60 400 100 380 160 C365 190 320 170 300 150 C285 130 280 90 300 70 Z"/>
      <path fill="${b.patchA}" d="M160 330 C200 300 240 340 230 390 C220 430 170 440 150 410 Z"/>
      <path fill="${b.patchB}" d="M300 290 C340 280 370 320 355 360 C340 390 300 370 295 340 Z"/>
    </g>`;
    case 'ticked': {
      // 毛先の色（ティッキング）を短い斜線の散らしで表す。位置は固定の格子でずらして決定的にする
      const marks = [];
      for (let y = 120; y <= 440; y += 22) {
        for (let x = 150; x <= 362; x += 26) {
          const dx = ((y / 22) % 2) * 13;
          marks.push(`<path d="M${x + dx} ${y} l6 -8"/>`);
        }
      }
      return `<g clip-path="url(#core)" fill="none" stroke="${b.stripe}" stroke-width="3" stroke-linecap="round" opacity=".45">${marks.join('')}</g>
      <g clip-path="url(#core)" fill="none" stroke="${b.stripe}" stroke-width="6" stroke-linecap="round" opacity=".7"><path d="M246 ${HY - 78} l3 26 M266 ${HY - 78} l-3 26"/></g>`;
    }
    case 'pointed': {
      // 顔・耳・足先・しっぽだけ濃い色（シャム・ラグドール）
      const [L, R] = ears(b);
      return `<g clip-path="url(#core)" fill="${b.point}">
      <polygon points="${pts(L.A, L.T, L.B)}"/><polygon points="${pts(R.A, R.T, R.B)}"/>
      <ellipse cx="${HX}" cy="${HY + 22}" rx="${46 * b.faceW}" ry="44" opacity=".85"/>
      <ellipse cx="230" cy="440" rx="20" ry="16" opacity=".8"/><ellipse cx="282" cy="440" rx="20" ry="16" opacity=".8"/>
    </g>`;
    }
    case 'spotted': {
      const spots = [
        [190, 300],
        [322, 300],
        [176, 345],
        [336, 345],
        [200, 390],
        [312, 390],
        [182, 425],
        [330, 425],
        [226, 315],
        [286, 315],
        [230, 372],
        [282, 372],
      ];
      return `<g clip-path="url(#core)">${spots
        .map(
          ([x, y]) =>
            `<ellipse cx="${x}" cy="${y}" rx="11" ry="8" fill="${b.spot}"/><ellipse cx="${x}" cy="${y}" rx="5" ry="3.5" fill="${b.base}" opacity=".8"/>`,
        )
        .join('')}</g>
      <g clip-path="url(#core)" fill="none" stroke="${b.spot}" stroke-width="7" stroke-linecap="round"><path d="M240 ${HY - 80} l4 30 M272 ${HY - 80} l-4 30"/></g>`;
    }
    default:
      return '';
  }
}

function chest(b) {
  const ruff = b.longHair
    ? `<g fill="${b.chest}">${[-36, -12, 12, 36].map((dx) => `<circle cx="${HX + dx}" cy="${HY + 92}" r="20"/>`).join('')}</g>`
    : '';
  if (b.chest === b.base) return ruff;
  return `<g clip-path="url(#core)" fill="${b.chest}">
    <ellipse cx="${HX}" cy="${HY + 62}" rx="52" ry="34"/>
    <ellipse cx="${HX}" cy="330" rx="46" ry="70"/>
    <ellipse cx="230" cy="447" rx="20" ry="12"/><ellipse cx="282" cy="447" rx="20" ry="12"/>
  </g>${ruff}`;
}

function tail(b) {
  const w = b.longHair ? 44 : 26;
  const color =
    b.pattern === 'calico'
      ? b.patchA
      : b.pattern === 'pointed'
        ? b.point
        : b.base;
  const stripes =
    b.pattern === 'tabby' || b.pattern === 'spotted'
      ? `<path d="${TAIL}" fill="none" stroke="${b.stripe ?? b.spot}" stroke-width="${w}" stroke-dasharray="10 16" stroke-linecap="butt"/>`
      : '';
  return `<path d="${TAIL}" fill="none" stroke="${INK}" stroke-width="${w + 8}" stroke-linecap="round"/>
    <path d="${TAIL}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>${stripes}`;
}

function face(b) {
  const [L, R] = ears(b);
  const inner = [L, R]
    .map(
      (e) =>
        `<polygon points="${pts(...shrink(e, 0.55))}" fill="#f4b6c2" stroke="#f4b6c2" stroke-width="6" stroke-linejoin="round"/>`,
    )
    .join('');
  const lynx = b.lynxTips
    ? [L, R]
        .map(
          (e) =>
            `<path d="M${e.T[0]} ${e.T[1]} l${(e.T[0] - HX) * 0.06} -16" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
        )
        .join('')
    : '';
  const eye = (x) => `
    <ellipse cx="${x}" cy="${HY + 5}" rx="17" ry="19" fill="${b.eye}" stroke="${INK}" stroke-width="3"/>
    <ellipse cx="${x}" cy="${HY + 6}" rx="6" ry="14" fill="#2a2230"/>
    <circle cx="${x - 5}" cy="${HY - 3}" r="4.5" fill="#fff"/>`;
  const wk = (s) =>
    [0, 1, 2]
      .map(
        (i) =>
          `<path d="M${HX + s * 48} ${HY + 36 + i * 7} L${HX + s * 112} ${HY + 26 + i * 12}"/>`,
      )
      .join('');
  return `${inner}${lynx}
    <ellipse cx="${HX - 62}" cy="${HY + 38}" rx="14" ry="8" fill="#f4a0b4" opacity=".35"/>
    <ellipse cx="${HX + 62}" cy="${HY + 38}" rx="14" ry="8" fill="#f4a0b4" opacity=".35"/>
    ${eye(HX - 38)}${eye(HX + 38)}
    <path d="M${HX - 9} ${HY + 30} L${HX + 9} ${HY + 30} L${HX} ${HY + 40} Z" fill="#e8869b" stroke="#e8869b" stroke-width="3" stroke-linejoin="round"/>
    <path d="M${HX} ${HY + 40} q-8 12 -18 4 M${HX} ${HY + 40} q8 12 18 4" fill="none" stroke="${b.base === '#2f2b33' ? '#cfc6d6' : INK}" stroke-width="3" stroke-linecap="round"/>
    <g stroke="${b.whisker}" stroke-width="2.5" stroke-linecap="round" opacity=".9">${wk(-1)}${wk(1)}</g>`;
}

const sparkle = (x, y, r) =>
  `<path d="M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z" fill="#fff" opacity=".85"/>`;

function svg(b) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#efe6fa"/><stop offset="1" stop-color="#fde4ee"/></linearGradient>
    <clipPath id="core">${core(b)}</clipPath>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  ${sparkle(80, 90, 18)}${sparkle(440, 120, 12)}${sparkle(95, 300, 10)}${sparkle(455, 250, 16)}
  <ellipse cx="256" cy="458" rx="140" ry="14" fill="${INK}" opacity=".12"/>
  ${tail(b)}
  <g fill="${INK}" stroke="${INK}" stroke-width="8" stroke-linejoin="round">${silhouette(b)}</g>
  <g fill="${b.base}">${silhouette(b)}</g>
  ${chest(b)}
  ${pattern(b)}
  <path d="M256 392 V450" stroke="${b.base === '#2f2b33' ? '#cfc6d6' : INK}" stroke-width="4" stroke-linecap="round" opacity=".7"/>
  ${face(b)}
</svg>
`;
}

mkdirSync(OUT, { recursive: true });
for (const [id, b] of Object.entries(BREEDS)) {
  // 改行と行頭の空白を詰めてサイズを抑える
  const s = svg(b).replace(/\n\s*/g, '');
  writeFileSync(join(OUT, `${id}.svg`), `${s}\n`);
  console.log(`${id}.svg ${(Buffer.byteLength(s) / 1024).toFixed(1)}KB`);
}
