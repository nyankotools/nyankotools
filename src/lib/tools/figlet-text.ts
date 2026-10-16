// FIGlet 風テキストバナー（ASCIIアート文字）の生成ロジック。FLF 書体の解析と、字間の詰め（スマッシング）を含む描画を行う。

export const FONT_IDS = [
  'standard',
  'small',
  'slant',
  'big',
  'mini',
  'doom',
  'block',
  'misaki',
] as const;
export type FontId = (typeof FONT_IDS)[number];

export const LAYOUTS = ['default', 'full', 'fitted', 'smush'] as const;
export type Layout = (typeof LAYOUTS)[number];

export const COMMENT_STYLES = [
  'none',
  'slash',
  'hash',
  'block',
  'html',
] as const;
export type CommentStyle = (typeof COMMENT_STYLES)[number];

/** 入力文字数の上限（長すぎる入力で描画が重くなるのを防ぐ） */
export const MAX_INPUT_LENGTH = 200;

const FIRST_CODE = 32;
const LAST_CODE = 126;

// layout のビット（FIGfont 仕様の full_layout）
const SM_RULES_MASK = 63;
const SM_KERN = 64;
const SM_SMUSH = 128;
const RULE_EQUAL = 1;
const RULE_LOWLINE = 2;
const RULE_HIERARCHY = 4;
const RULE_PAIR = 8;
const RULE_BIGX = 16;
const RULE_HARDBLANK = 32;

export interface FigFont {
  height: number;
  hardblank: string;
  /** 字間の詰め方（0 = 詰めない / 64 = 接する位置まで / 128 以上 = スマッシング） */
  smushMode: number;
  /** ASCII 32〜126 の文字ごとの行配列（各行は同じ幅） */
  glyphs: Map<number, string[]>;
}

/** FLF 書体ファイルの文字列を解析する（ASCII 32〜126 のみ使う） */
export function parseFlf(text: string): FigFont {
  const lines = text.replace(/\r/g, '').split('\n');
  const header = lines[0] ?? '';
  if (!header.startsWith('flf2a') || header.length < 7) {
    throw new Error('FLF 形式ではありません');
  }
  const hardblank = header[5];
  const params = header.slice(6).trim().split(/\s+/).map(Number);
  const [height, , , oldLayout, commentLines, , fullLayout] = params;
  if (!Number.isInteger(height) || height < 1) {
    throw new Error('FLF のヘッダーが不正です');
  }
  let smushMode: number;
  if (fullLayout !== undefined && !Number.isNaN(fullLayout)) {
    smushMode = fullLayout & (SM_RULES_MASK | SM_KERN | SM_SMUSH);
  } else if (oldLayout < 0) {
    smushMode = 0;
  } else if (oldLayout === 0) {
    smushMode = SM_KERN;
  } else {
    smushMode = (oldLayout & 31) | SM_SMUSH;
  }

  const glyphs = new Map<number, string[]>();
  let index = 1 + (commentLines || 0);
  for (let code = FIRST_CODE; code <= LAST_CODE; code++) {
    const rows: string[] = [];
    for (let r = 0; r < height; r++) {
      const line = lines[index++];
      if (line === undefined)
        throw new Error('FLF の文字データが不足しています');
      // 行末の終端記号（@ または @@）を取り除く
      const endMark = line[line.length - 1];
      let end = line.length;
      while (end > 0 && line[end - 1] === endMark) end--;
      rows.push(line.slice(0, end));
    }
    glyphs.set(code, rows);
  }
  return { height, hardblank, smushMode, glyphs };
}

/** 自作ブロック体（█）の字形。# が塗り。各字形の行は同じ幅 */
const BLOCK_GLYPHS: Record<string, string[]> = {
  ' ': ['   ', '   ', '   ', '   ', '   '],
  A: [' ### ', '#   #', '#####', '#   #', '#   #'],
  B: ['#### ', '#   #', '#### ', '#   #', '#### '],
  C: [' ####', '#    ', '#    ', '#    ', ' ####'],
  D: ['#### ', '#   #', '#   #', '#   #', '#### '],
  E: ['#####', '#    ', '#### ', '#    ', '#####'],
  F: ['#####', '#    ', '#### ', '#    ', '#    '],
  G: [' ####', '#    ', '#  ##', '#   #', ' ####'],
  H: ['#   #', '#   #', '#####', '#   #', '#   #'],
  I: ['#####', '  #  ', '  #  ', '  #  ', '#####'],
  J: ['    #', '    #', '    #', '#   #', ' ### '],
  K: ['#   #', '#  # ', '###  ', '#  # ', '#   #'],
  L: ['#    ', '#    ', '#    ', '#    ', '#####'],
  M: ['#   #', '## ##', '# # #', '#   #', '#   #'],
  N: ['#   #', '##  #', '# # #', '#  ##', '#   #'],
  O: [' ### ', '#   #', '#   #', '#   #', ' ### '],
  P: ['#### ', '#   #', '#### ', '#    ', '#    '],
  Q: [' ### ', '#   #', '# # #', '#  # ', ' ## #'],
  R: ['#### ', '#   #', '#### ', '#  # ', '#   #'],
  S: [' ####', '#    ', ' ### ', '    #', '#### '],
  T: ['#####', '  #  ', '  #  ', '  #  ', '  #  '],
  U: ['#   #', '#   #', '#   #', '#   #', ' ### '],
  V: ['#   #', '#   #', '#   #', ' # # ', '  #  '],
  W: ['#   #', '#   #', '# # #', '## ##', '#   #'],
  X: ['#   #', ' # # ', '  #  ', ' # # ', '#   #'],
  Y: ['#   #', ' # # ', '  #  ', '  #  ', '  #  '],
  Z: ['#####', '   # ', '  #  ', ' #   ', '#####'],
  '0': [' ### ', '#  ##', '# # #', '##  #', ' ### '],
  '1': ['  #  ', ' ##  ', '  #  ', '  #  ', ' ### '],
  '2': [' ### ', '#   #', '   # ', '  #  ', '#####'],
  '3': ['#### ', '    #', ' ### ', '    #', '#### '],
  '4': ['#  # ', '#  # ', '#####', '   # ', '   # '],
  '5': ['#####', '#    ', '#### ', '    #', '#### '],
  '6': [' ### ', '#    ', '#### ', '#   #', ' ### '],
  '7': ['#####', '    #', '   # ', '  #  ', '  #  '],
  '8': [' ### ', '#   #', ' ### ', '#   #', ' ### '],
  '9': [' ### ', '#   #', ' ####', '    #', ' ### '],
  '!': ['#', '#', '#', ' ', '#'],
  '?': [' ### ', '#   #', '  ## ', '     ', '  #  '],
  '.': [' ', ' ', ' ', ' ', '#'],
  ',': ['  ', '  ', '  ', ' #', '# '],
  ':': [' ', '#', ' ', '#', ' '],
  '-': ['     ', '     ', '#####', '     ', '     '],
  _: ['     ', '     ', '     ', '     ', '#####'],
  '+': ['     ', '  #  ', '#####', '  #  ', '     '],
  '=': ['     ', '#####', '     ', '#####', '     '],
  '/': ['    #', '   # ', '  #  ', ' #   ', '#    '],
  '(': [' #', '# ', '# ', '# ', ' #'],
  ')': ['# ', ' #', ' #', ' #', '# '],
  "'": ['#', '#', ' ', ' ', ' '],
  '*': ['     ', ' # # ', '  #  ', ' # # ', '     '],
  '#': [' # # ', '#####', ' # # ', '#####', ' # # '],
};

/** 自作ブロック体を FigFont として作る（英小文字は大文字と同じ字形。字と字の間に1桁の空きを付ける） */
export function createBlockFont(): FigFont {
  const glyphs = new Map<number, string[]>();
  for (let code = FIRST_CODE; code <= LAST_CODE; code++) {
    const ch = String.fromCharCode(code);
    const g = BLOCK_GLYPHS[ch.toUpperCase()] ?? BLOCK_GLYPHS[ch];
    // 字形が無い文字は登録しない（未対応として扱う）
    if (g)
      glyphs.set(
        code,
        g.map((row) => row.replaceAll('#', '█') + ' '),
      );
  }
  return { height: 5, hardblank: '\x00', smushMode: 0, glyphs };
}

/**
 * 美咲フォント由来のドット書体データを FigFont の字形に展開する。
 * データは「8行ぶんの16進（1行1バイト、左端が最上位ビット）＋幅（4 or 8）＋直前の文字コードとの差（36進）」を `;` でつないだ形式。
 */
export function decodeBitmapFont(
  data: string,
  glyphs: Map<number, string[]> = new Map(),
): Map<number, string[]> {
  let code = 0;
  for (const entry of data.split(';')) {
    if (entry.length < 18) continue;
    const width = Number(entry[16]);
    code += parseInt(entry.slice(17), 36);
    const rows: string[] = [];
    for (let r = 0; r < 8; r++) {
      const byte = parseInt(entry.slice(r * 2, r * 2 + 2), 16);
      let row = '';
      for (let c = 0; c < width; c++) row += byte & (0x80 >> c) ? '█' : ' ';
      rows.push(row);
    }
    glyphs.set(code, rows);
  }
  return glyphs;
}

const KANJI_PATTERN = /[一-鿿]/;
const KANJI_SENTINEL = 0x4e00;

const FONT_LOADERS: Record<
  Exclude<FontId, 'block' | 'misaki'>,
  () => Promise<{ default: string }>
> = {
  standard: () => import('./figlet-fonts/standard'),
  small: () => import('./figlet-fonts/small'),
  slant: () => import('./figlet-fonts/slant'),
  big: () => import('./figlet-fonts/big'),
  mini: () => import('./figlet-fonts/mini'),
  doom: () => import('./figlet-fonts/doom'),
};

const fontCache = new Map<FontId, FigFont>();

async function createMisakiFont(): Promise<FigFont> {
  const glyphs = decodeBitmapFont(
    (await import('./figlet-fonts/misaki-base')).default,
  );
  return { height: 8, hardblank: '\x00', smushMode: 0, glyphs };
}

/**
 * 書体を読み込む（初回のみ動的 import。以降はキャッシュ）。
 * 日本語ドット書体（misaki）は、漢字のデータが大きいため、`text` に漢字が含まれるときだけ追加で読み込む。
 */
export async function loadFont(id: FontId, text = ''): Promise<FigFont> {
  let font = fontCache.get(id);
  if (!font) {
    const created =
      id === 'block'
        ? createBlockFont()
        : id === 'misaki'
          ? await createMisakiFont()
          : parseFlf((await FONT_LOADERS[id]()).default);
    // 並行して読み込んだ呼び出しがあれば、先にキャッシュされた書体を使う（漢字の追加読込を取りこぼさないため）
    font = fontCache.get(id) ?? created;
    fontCache.set(id, font);
  }
  // 漢字の読込済みは、書体自身が漢字の字形（「一」）を持っているかで判定する
  if (
    id === 'misaki' &&
    !font.glyphs.has(KANJI_SENTINEL) &&
    KANJI_PATTERN.test(text)
  ) {
    decodeBitmapFont(
      (await import('./figlet-fonts/misaki-kanji')).default,
      font.glyphs,
    );
  }
  return font;
}

// ---- スマッシング（字形の重ね合わせ） ----

const HIERARCHY = ['|', '/\\', '[]', '{}', '()', '<>'];

function smushChars(
  left: string,
  right: string,
  mode: number,
  hardblank: string,
): string | null {
  if (left === ' ') return right;
  if (right === ' ') return left;
  if ((mode & SM_SMUSH) === 0) return null;

  if ((mode & SM_RULES_MASK) === 0) {
    // ユニバーサルスマッシング: 後から来た文字が勝つ（ハードブランクは負ける）
    if (left === hardblank) return right;
    if (right === hardblank) return left;
    return right;
  }
  if (mode & RULE_HARDBLANK && left === hardblank && right === hardblank) {
    return left;
  }
  if (left === hardblank || right === hardblank) return null;
  if (mode & RULE_EQUAL && left === right) return left;
  if (mode & RULE_LOWLINE) {
    if (left === '_' && '|/\\[]{}()<>'.includes(right)) return right;
    if (right === '_' && '|/\\[]{}()<>'.includes(left)) return left;
  }
  if (mode & RULE_HIERARCHY) {
    const l = HIERARCHY.findIndex((c) => c.includes(left));
    const r = HIERARCHY.findIndex((c) => c.includes(right));
    if (l >= 0 && r >= 0 && l !== r) return l > r ? left : right;
  }
  if (mode & RULE_PAIR) {
    const pair = left + right;
    if (['[]', '][', '{}', '}{', '()', ')('].includes(pair)) return '|';
  }
  if (mode & RULE_BIGX) {
    const pair = left + right;
    if (pair === '/\\') return '|';
    if (pair === '\\/') return 'Y';
    if (pair === '><') return 'X';
  }
  return null;
}

function effectiveMode(font: FigFont, layout: Layout): number {
  switch (layout) {
    case 'full':
      return 0;
    case 'fitted':
      return SM_KERN;
    case 'smush':
      return (font.smushMode & SM_RULES_MASK) | SM_SMUSH;
    default:
      return font.smushMode;
  }
}

/** 次の字形をどこまで左へ食い込ませられるか */
function smushAmount(
  line: string[],
  glyph: string[],
  mode: number,
  hardblank: string,
  prevWidth: number,
): number {
  if ((mode & (SM_SMUSH | SM_KERN)) === 0) return 0;
  const lineLen = line[0].length;
  if (lineLen === 0) return 0;
  const glyphWidth = glyph[0].length;
  let max = glyphWidth;
  for (let row = 0; row < glyph.length; row++) {
    const lineRow = line[row];
    const glyphRow = glyph[row];
    let lineEnd = lineRow.length - 1;
    while (lineEnd > 0 && lineRow[lineEnd] === ' ') lineEnd--;
    const ch1 = lineRow[lineEnd];
    let glyphStart = 0;
    while (glyphStart < glyphRow.length && glyphRow[glyphStart] === ' ')
      glyphStart++;
    const ch2 = glyphRow[glyphStart];
    let amount = glyphStart + lineLen - 1 - lineEnd;
    if (ch1 === undefined || ch1 === ' ') {
      amount++;
    } else if (ch2 !== undefined) {
      const ok =
        prevWidth >= 2 &&
        glyphWidth >= 2 &&
        smushChars(ch1, ch2, mode, hardblank) !== null;
      if (ok) amount++;
    }
    if (amount < max) max = amount;
  }
  return Math.max(0, max);
}

export interface RenderResult {
  text: string;
  /** 書体が対応していないため描画しなかった文字（重複なし・出現順） */
  skipped: string[];
}

/** 1行分の文字列を描画する（行ごとの配列で返す） */
function renderLine(
  font: FigFont,
  line: string,
  mode: number,
  skipped: Set<string>,
): string[] {
  const out: string[] = Array.from({ length: font.height }, () => '');
  let prevWidth = 0;
  for (const ch of line) {
    const code = ch.codePointAt(0)!;
    const glyph = font.glyphs.get(code);
    if (!glyph || glyph[0] === undefined || glyph[0].length === 0) {
      skipped.add(ch);
      continue;
    }
    const amount = smushAmount(out, glyph, mode, font.hardblank, prevWidth);
    for (let row = 0; row < font.height; row++) {
      let current = out[row];
      let g = glyph[row];
      if (amount > 0) {
        const column = Math.max(0, current.length - amount);
        const overlapLen = current.length - column;
        let merged = '';
        for (let k = 0; k < overlapLen; k++) {
          const l = current[column + k];
          const r = g[k] ?? ' ';
          merged += smushChars(l, r, mode, font.hardblank) ?? r;
        }
        current = current.slice(0, column) + merged;
        g = g.slice(overlapLen);
      }
      out[row] = current + g;
    }
    prevWidth = glyph[0].length;
  }
  return out;
}

/** テキストを書体で描画する。改行は行ごとに描画して縦に並べる。ハードブランクは空白にして行末の空白は削る */
export function renderFiglet(
  font: FigFont,
  text: string,
  layout: Layout = 'default',
): RenderResult {
  const mode = effectiveMode(font, layout);
  const skipped = new Set<string>();
  const blocks: string[] = [];
  const normalized = text.replace(/\r\n?/g, '\n').replaceAll('\t', '    ');
  for (const line of normalized.split('\n')) {
    const rows = renderLine(font, line, mode, skipped);
    const hb = font.hardblank;
    blocks.push(
      rows.map((row) => row.replaceAll(hb, ' ').replace(/\s+$/, '')).join('\n'),
    );
  }
  // 先頭・末尾の完全な空行は削る
  const text2 = blocks.join('\n').replace(/^\n+/, '').replace(/\n+$/, '');
  return { text: text2, skipped: [...skipped] };
}

/** バナーをコードのコメントで囲む */
export function wrapInComment(text: string, style: CommentStyle): string {
  if (style === 'none' || text === '') return text;
  const lines = text.split('\n');
  switch (style) {
    case 'slash':
      return lines.map((l) => `// ${l}`.trimEnd()).join('\n');
    case 'hash':
      return lines.map((l) => `# ${l}`.trimEnd()).join('\n');
    case 'block':
      // アート内の */ がコメントを閉じてしまわないよう、間に空白を入れる
      return [
        '/*',
        ...lines.map((l) => ` * ${l.replaceAll('*/', '* /')}`.trimEnd()),
        ' */',
      ].join('\n');
    case 'html':
      return [
        '<!--',
        ...lines.map((l) => l.replaceAll('-->', '-- >')),
        '-->',
      ].join('\n');
  }
}
