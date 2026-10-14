export type BrailleDirection = 'toBraille' | 'toKana';

export interface TextToBrailleResult {
  braille: string;
  /** 変換できずそのまま残した文字（重複なし・出現順） */
  unsupported: string[];
}

export interface BrailleToTextResult {
  text: string;
  /** 解釈できずそのまま残した点字セル（重複なし・出現順） */
  unsupported: string[];
}

// Unicode点字: U+2800 + (点1=1, 点2=2, 点3=4, 点4=8, 点5=16, 点6=32, 点7=64, 点8=128)
const BRAILLE_BASE = 0x2800;

/** 点の番号列（例: '16'）からUnicode点字1文字を作る */
function cell(dots: string): string {
  let bits = 0;
  for (const d of dots) bits |= 1 << (Number(d) - 1);
  return String.fromCodePoint(BRAILLE_BASE + bits);
}

const SPACE = cell('');
const NUMBER_SIGN = cell('3456');
const CONNECTOR = cell('36');
const VOICED = cell('5');
const SEMI_VOICED = cell('6');
const YOON = cell('4');
const YOON_VOICED = cell('45');
const YOON_SEMI_VOICED = cell('46');
const SOKUON = cell('2');
const CHOUON = cell('25');

// 清音（ひらがな → 点の番号）。行ごとに あ・い・う・え・お の並び
const SEION: Record<string, string> = {};
function addRow(chars: string, dots: string[]) {
  [...chars].forEach((ch, i) => {
    SEION[ch] = dots[i];
  });
}
addRow('あいうえお', ['1', '12', '14', '124', '24']);
addRow('かきくけこ', ['16', '126', '146', '1246', '246']);
addRow('さしすせそ', ['156', '1256', '1456', '12456', '2456']);
addRow('たちつてと', ['135', '1235', '1345', '12345', '2345']);
addRow('なにぬねの', ['13', '123', '134', '1234', '234']);
addRow('はひふへほ', ['136', '1236', '1346', '12346', '2346']);
addRow('まみむめも', ['1356', '12356', '13456', '123456', '23456']);
addRow('やゆよ', ['34', '346', '345']);
addRow('らりるれろ', ['15', '125', '145', '1245', '245']);
addRow('わゐゑをん', ['3', '23', '235', '35', '356']);

const SEION_CELL: Record<string, string> = {};
for (const [kana, dots] of Object.entries(SEION)) {
  SEION_CELL[kana] = cell(dots);
}

// 濁音・半濁音 → [清音, 前置符]
const VOICED_BASE: Record<string, string> = {};
function addVoiced(voiced: string, plain: string) {
  [...voiced].forEach((ch, i) => {
    VOICED_BASE[ch] = [...plain][i];
  });
}
addVoiced('がぎぐげご', 'かきくけこ');
addVoiced('ざじずぜぞ', 'さしすせそ');
addVoiced('だぢづでど', 'たちつてと');
addVoiced('ばびぶべぼ', 'はひふへほ');
VOICED_BASE['ゔ'] = 'う';
const SEMI_VOICED_BASE: Record<string, string> = {};
[...'ぱぴぷぺぽ'].forEach((ch, i) => {
  SEMI_VOICED_BASE[ch] = [...'はひふへほ'][i];
});

// 拗音: い段の仮名 → [前置符, 同じ行のあ段の仮名]（う段・お段は行の並びから導く）
const YOON_ROWS: Record<string, { prefix: string; row: string }> = {
  き: { prefix: YOON, row: 'かくこ' },
  し: { prefix: YOON, row: 'さすそ' },
  ち: { prefix: YOON, row: 'たつと' },
  に: { prefix: YOON, row: 'なぬの' },
  ひ: { prefix: YOON, row: 'はふほ' },
  み: { prefix: YOON, row: 'まむも' },
  り: { prefix: YOON, row: 'らるろ' },
  ぎ: { prefix: YOON_VOICED, row: 'かくこ' },
  じ: { prefix: YOON_VOICED, row: 'さすそ' },
  ぢ: { prefix: YOON_VOICED, row: 'たつと' },
  び: { prefix: YOON_VOICED, row: 'はふほ' },
  ぴ: { prefix: YOON_SEMI_VOICED, row: 'はふほ' },
};
const SMALL_Y = 'ゃゅょ';

const DIGIT_DOTS = [
  '245',
  '1',
  '12',
  '14',
  '145',
  '15',
  '124',
  '1245',
  '125',
  '24',
];
const DIGIT_CELLS = DIGIT_DOTS.map(cell);
const DECIMAL_POINT = cell('2');

const SYMBOL_TO_CELL: Record<string, string> = {
  '。': cell('256'),
  '、': cell('56'),
  '「': cell('36'),
  '」': cell('36'),
  '？': cell('26'),
  '?': cell('26'),
  '！': cell('235'),
  '!': cell('235'),
  ' ': SPACE,
};

/** 数字の直後に置くとき、数字と区別するためにつなぎ符が必要なかな（あ行・ら行） */
const NEEDS_CONNECTOR = new Set([...'あいうえおらりるれろ']);

// 点字に対応しない小書き・特殊カタカナは、ひらがなに変えず原文のまま未対応として報告する
const KEEP_KATAKANA = new Set([...'ァィゥェォヵヶヮ']);

function toHiragana(text: string): string {
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    // ァ〜ヶ（ヴ含む）→ ぁ〜ゖ
    out +=
      code >= 0x30a1 && code <= 0x30f6 && !KEEP_KATAKANA.has(ch)
        ? String.fromCodePoint(code - 0x60)
        : ch;
  }
  return out;
}

function pushUnique(list: string[], value: string) {
  if (!list.includes(value)) list.push(value);
}

/** 日本語のテキストを6点点字（Unicode点字）に変換する */
export function textToBraille(text: string): TextToBrailleResult {
  const chars = [...toHiragana(text.normalize('NFKC'))];
  const unsupported: string[] = [];
  let out = '';
  let inNumber = false;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const next = chars[i + 1];

    if (ch >= '0' && ch <= '9') {
      if (!inNumber) out += NUMBER_SIGN;
      out += DIGIT_CELLS[Number(ch)];
      inNumber = true;
      continue;
    }
    if (
      ch === '.' &&
      inNumber &&
      next !== undefined &&
      next >= '0' &&
      next <= '9'
    ) {
      out += DECIMAL_POINT;
      continue;
    }

    const wasNumber = inNumber;
    inNumber = false;
    if (wasNumber && NEEDS_CONNECTOR.has(ch)) out += CONNECTOR;

    if (ch === '\n' || ch === '\r' || ch === '\t') {
      out += ch;
    } else if (ch in SYMBOL_TO_CELL) {
      out += SYMBOL_TO_CELL[ch];
    } else if (ch === 'っ') {
      out += SOKUON;
    } else if (ch === 'ー') {
      out += CHOUON;
    } else if (
      ch in YOON_ROWS &&
      next !== undefined &&
      SMALL_Y.includes(next)
    ) {
      const { prefix, row } = YOON_ROWS[ch];
      out += prefix + SEION_CELL[[...row][SMALL_Y.indexOf(next)]];
      i++;
    } else if (ch in SEION_CELL) {
      out += SEION_CELL[ch];
    } else if (ch in VOICED_BASE) {
      out += VOICED + SEION_CELL[VOICED_BASE[ch]];
    } else if (ch in SEMI_VOICED_BASE) {
      out += SEMI_VOICED + SEION_CELL[SEMI_VOICED_BASE[ch]];
    } else {
      out += ch;
      pushUnique(unsupported, ch);
    }
  }

  return { braille: out, unsupported };
}

// ---------------------------------------------------------------------------
// 点字 → かな
// ---------------------------------------------------------------------------

const CELL_TO_KANA = new Map<string, string>();
for (const [kana, dots] of Object.entries(SEION)) {
  // ゑ（235）は感嘆符と同じセル。現代の文章では感嘆符のほうが圧倒的に多いので逆変換では感嘆符を優先する
  if (kana !== 'ゑ') CELL_TO_KANA.set(cell(dots), kana);
}
const CELL_TO_SYMBOL = new Map<string, string>([
  [cell('256'), '。'],
  [cell('56'), '、'],
  [cell('36'), '「'],
  [cell('26'), '？'],
  [cell('235'), '！'],
  [SPACE, ' '],
]);

function isBrailleCell(ch: string): boolean {
  const code = ch.codePointAt(0)!;
  return code >= BRAILLE_BASE && code <= BRAILLE_BASE + 0xff;
}

/** 点字（Unicode点字）をひらがなに戻す。6点の範囲のみ解釈し、それ以外はそのまま残す */
export function brailleToText(braille: string): BrailleToTextResult {
  const cells = [...braille];
  const unsupported: string[] = [];
  let out = '';
  let i = 0;

  const kanaAt = (index: number): string | undefined => {
    const c = cells[index];
    return c === undefined ? undefined : CELL_TO_KANA.get(c);
  };

  while (i < cells.length) {
    const c = cells[i];

    if (!isBrailleCell(c)) {
      out += c;
      i++;
      continue;
    }

    if (c === NUMBER_SIGN) {
      i++;
      const numberStart = i;
      while (i < cells.length) {
        const digit = DIGIT_CELLS.indexOf(cells[i]);
        if (digit >= 0) {
          out += String(digit);
          i++;
        } else if (
          cells[i] === DECIMAL_POINT &&
          DIGIT_CELLS.includes(cells[i + 1] ?? '')
        ) {
          out += '.';
          i++;
        } else {
          break;
        }
      }
      if (i === numberStart) {
        out += c;
        pushUnique(unsupported, c);
      }
      // 数字の直後のつなぎ符は読み飛ばす
      if (cells[i] === CONNECTOR && kanaAt(i + 1) !== undefined) i++;
      continue;
    }

    if (c === VOICED || c === SEMI_VOICED) {
      const base = kanaAt(i + 1);
      const table = c === VOICED ? VOICED_BASE : SEMI_VOICED_BASE;
      const hit = base && Object.keys(table).find((k) => table[k] === base);
      if (hit) {
        out += hit;
        i += 2;
        continue;
      }
    }

    if (c === YOON || c === YOON_VOICED || c === YOON_SEMI_VOICED) {
      const base = kanaAt(i + 1);
      if (base) {
        const hit = Object.entries(YOON_ROWS).find(
          ([, v]) => v.prefix === c && v.row.includes(base),
        );
        if (hit) {
          out += hit[0] + SMALL_Y[hit[1].row.indexOf(base)];
          i += 2;
          continue;
        }
      }
    }

    if (c === SOKUON) {
      out += 'っ';
    } else if (c === CHOUON) {
      out += 'ー';
    } else if (CELL_TO_KANA.has(c)) {
      out += CELL_TO_KANA.get(c)!;
    } else if (CELL_TO_SYMBOL.has(c)) {
      // 「」は同じセルなので、開き括弧が直前にあれば閉じ括弧にする
      const sym = CELL_TO_SYMBOL.get(c)!;
      if (sym === '「') {
        const opened = out.lastIndexOf('「');
        const closed = out.lastIndexOf('」');
        out += opened > closed ? '」' : '「';
      } else {
        out += sym;
      }
    } else {
      out += c;
      pushUnique(unsupported, c);
    }
    i++;
  }

  return { text: out, unsupported };
}

/** 点字1文字の点の番号（例: ⠡ → [1, 6]）。8点点字の点7・8も返す */
export function brailleDots(ch: string): number[] {
  const code = ch.codePointAt(0);
  if (code === undefined || !isBrailleCell(ch)) return [];
  const bits = code - BRAILLE_BASE;
  const dots: number[] = [];
  for (let d = 0; d < 8; d++) if (bits & (1 << d)) dots.push(d + 1);
  return dots;
}
