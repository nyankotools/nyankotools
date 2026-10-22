import { displayWidth } from './ascii-table-generator';

export type FrameStyle =
  | 'ascii'
  | 'single'
  | 'rounded'
  | 'double'
  | 'heavy'
  | 'hash'
  | 'star'
  | 'speech'
  | 'thought';
export type FrameAlign = 'left' | 'center' | 'right';
export type CommentStyle = 'none' | 'slash' | 'hash' | 'dash' | 'block';

export const frameStyles: FrameStyle[] = [
  'ascii',
  'single',
  'rounded',
  'double',
  'heavy',
  'hash',
  'star',
  'speech',
  'thought',
];
export const commentStyles: CommentStyle[] = [
  'none',
  'slash',
  'hash',
  'dash',
  'block',
];

export interface TextBoxFrameOptions {
  style: FrameStyle;
  align: FrameAlign;
  /** 左右の余白（半角スペース数）。吹き出しでは使わない */
  paddingX: number;
  /** 上下の余白（行数）。吹き出しでは使わない */
  paddingY: number;
  /** 吹き出しのしっぽを付ける */
  tail: boolean;
  comment: CommentStyle;
  /** 罫線文字（─│┌など）を全角幅で表示する環境（MSゴシック等）向けに、幅2として整形する */
  wideBorder?: boolean;
}

export interface TextBoxFrameResult {
  output: string;
  /** 出力の行数 */
  lines: number;
  /** 枠の内側の文字幅（全角=2） */
  width: number;
}

interface BoxChars {
  h: string;
  v: string;
  tl: string;
  tr: string;
  bl: string;
  br: string;
}

export const BOX_CHARS: Record<
  Exclude<FrameStyle, 'speech' | 'thought'>,
  BoxChars
> = {
  ascii: { h: '-', v: '|', tl: '+', tr: '+', bl: '+', br: '+' },
  single: { h: '─', v: '│', tl: '┌', tr: '┐', bl: '└', br: '┘' },
  rounded: { h: '─', v: '│', tl: '╭', tr: '╮', bl: '╰', br: '╯' },
  double: { h: '═', v: '║', tl: '╔', tr: '╗', bl: '╚', br: '╝' },
  heavy: { h: '━', v: '┃', tl: '┏', tr: '┓', bl: '┗', br: '┛' },
  hash: { h: '#', v: '#', tl: '#', tr: '#', bl: '#', br: '#' },
  star: { h: '*', v: '*', tl: '*', tr: '*', bl: '*', br: '*' },
};

/** 入力を行に分ける。タブは4桁のスペースにし、末尾の改行1つは無視する */
export function splitLines(text: string): string[] {
  const normalized = text.replace(/\t/g, '    ');
  const lines = normalized.split(/\r\n|\r|\n/);
  if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

function pad(text: string, width: number, align: FrameAlign): string {
  const gap = Math.max(0, width - displayWidth(text));
  if (align === 'right') return ' '.repeat(gap) + text;
  if (align === 'center') {
    const left = Math.floor(gap / 2);
    return ' '.repeat(left) + text + ' '.repeat(gap - left);
  }
  return text + ' '.repeat(gap);
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

function isBoxDrawing(chars: BoxChars): boolean {
  return chars.h.charCodeAt(0) >= 0x2500;
}

function boxLines(
  lines: string[],
  width: number,
  options: TextBoxFrameOptions,
  chars: BoxChars,
): string[] {
  const padX = clamp(options.paddingX, 0, 8);
  const padY = clamp(options.paddingY, 0, 4);
  const wide = options.wideBorder === true && isBoxDrawing(chars);
  // 罫線が幅2のときは、内側を偶数幅にして罫線の繰り返し数で揃える
  const extra = wide && (width + padX * 2) % 2 === 1 ? 1 : 0;
  const inner = width + padX * 2 + extra;
  const hCount = wide ? inner / 2 : inner;
  const blank = chars.v + ' '.repeat(inner) + chars.v;
  const result = [chars.tl + chars.h.repeat(hCount) + chars.tr];
  for (let i = 0; i < padY; i++) result.push(blank);
  for (const line of lines) {
    result.push(
      chars.v +
        ' '.repeat(padX) +
        pad(line, width, options.align) +
        ' '.repeat(padX + extra) +
        chars.v,
    );
  }
  for (let i = 0; i < padY; i++) result.push(blank);
  result.push(chars.bl + chars.h.repeat(hCount) + chars.br);
  return result;
}

function bubbleLines(
  lines: string[],
  width: number,
  options: TextBoxFrameOptions,
): string[] {
  const thought = options.style === 'thought';
  const edges = (index: number, count: number): [string, string] => {
    if (thought) return ['(', ')'];
    if (count === 1) return ['<', '>'];
    if (index === 0) return ['/', '\\'];
    if (index === count - 1) return ['\\', '/'];
    return ['|', '|'];
  };
  const result = [' ' + '_'.repeat(width + 2)];
  lines.forEach((line, index) => {
    const [left, right] = edges(index, lines.length);
    result.push(`${left} ${pad(line, width, options.align)} ${right}`);
  });
  result.push(' ' + '-'.repeat(width + 2));
  if (options.tail) {
    result.push(thought ? '  o' : '  \\');
    result.push(thought ? '   O' : '   \\');
  }
  return result;
}

function applyComment(lines: string[], comment: CommentStyle): string[] {
  const prefixed = (prefix: string) =>
    lines.map((line) => (line === '' ? prefix : `${prefix} ${line}`));
  switch (comment) {
    case 'slash':
      return prefixed('//');
    case 'hash':
      return prefixed('#');
    case 'dash':
      return prefixed('--');
    case 'block':
      return [
        '/*',
        ...lines.map((line) => {
          const safe = line.replace(/\*\//g, '* /');
          return safe === '' ? ' *' : ` * ${safe}`;
        }),
        ' */',
      ];
    default:
      return lines;
  }
}

/** 末尾の空白を落とす（コメント用の行や吹き出しのしっぽで余計な空白を残さない） */
function trimEnds(lines: string[]): string[] {
  return lines.map((line) => line.replace(/[ ]+$/, ''));
}

export function frameText(
  input: string,
  options: TextBoxFrameOptions,
): TextBoxFrameResult {
  if (input.trim() === '') return { output: '', lines: 0, width: 0 };

  const lines = splitLines(input);
  const width = Math.max(...lines.map((line) => displayWidth(line)));

  let framed: string[];
  if (options.style === 'speech' || options.style === 'thought') {
    framed = bubbleLines(lines, width, options);
  } else {
    framed = boxLines(lines, width, options, BOX_CHARS[options.style]);
  }

  const commented = trimEnds(applyComment(framed, options.comment));
  return {
    output: commented.join('\n'),
    lines: commented.length,
    width,
  };
}
