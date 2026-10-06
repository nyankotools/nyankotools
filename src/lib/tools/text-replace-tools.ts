import { splitIntoLines } from './text-list-tools';

export type LineOperation =
  | {
      type: 'replace';
      find: string;
      replace: string;
      regex: boolean;
      ignoreCase: boolean;
    }
  | {
      type: 'extract';
      keyword: string;
      regex: boolean;
      ignoreCase: boolean;
      /** true のとき、一致した行を取り除く（一致しない行を残す） */
      invert: boolean;
    }
  | { type: 'affix'; prefix: string; suffix: string; skipEmpty: boolean }
  | {
      type: 'numberAdd';
      start: number;
      step: number;
      separator: string;
      zeroPad: boolean;
      skipEmpty: boolean;
    }
  | { type: 'numberRemove' }
  | { type: 'reverse' };

export type LineOperationResult =
  | {
      success: true;
      output: string;
      /** 置換した箇所・一致した行・変更した行などの件数（操作ごとに意味が異なる） */
      count: number;
    }
  | { success: false; error: 'invalidRegex' };

/** 行頭の行番号（「1. 」「2) 」「3: 」「4、」「5｜」「6<TAB>」「7 」など）にだけ一致する */
const LEADING_NUMBER = /^[ \t]*[0-9０-９]+(?:[.)\]:：、．）｜|]|[ \t])[ \t]*/;

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildRegExp(
  source: string,
  regex: boolean,
  ignoreCase: boolean,
  flags: string,
): RegExp | null {
  try {
    return new RegExp(
      regex ? source : escapeRegExp(source),
      flags + (ignoreCase ? 'i' : ''),
    );
  } catch {
    return null;
  }
}

/** 末尾の改行は行として数えず、処理後に元どおり付け直す */
function mapLines(
  text: string,
  fn: (lines: string[]) => { lines: string[]; count: number },
): LineOperationResult {
  const lines = splitIntoLines(text);
  const trailingNewline = lines.length > 1 && lines[lines.length - 1] === '';
  if (trailingNewline) lines.pop();
  const { lines: out, count } = fn(lines);
  const joined = out.join('\n');
  return {
    success: true,
    output: trailingNewline && out.length > 0 ? `${joined}\n` : joined,
    count,
  };
}

function toInteger(value: number, fallback: number): number {
  const n = Math.trunc(value);
  return Number.isSafeInteger(n) ? n : fallback;
}

/**
 * テキストに対して置換・行の抽出・前後への文字追加・行番号の付与/削除・行の逆順を行う。
 * 出力の改行は LF にそろえる（置換は入力の改行をそのまま保つ）。
 */
export function applyLineOperation(
  text: string,
  op: LineOperation,
): LineOperationResult {
  switch (op.type) {
    case 'replace': {
      if (op.find === '') return { success: true, output: text, count: 0 };
      // 正規表現モードでは ^ $ を行単位で扱えるように m フラグを付ける
      const re = buildRegExp(
        op.find,
        op.regex,
        op.ignoreCase,
        op.regex ? 'gm' : 'g',
      );
      if (!re) return { success: false, error: 'invalidRegex' };
      const count = [...text.matchAll(re)].length;
      // 正規表現モードでは $1 / $& などの置換パターンをそのまま使える
      const output = op.regex
        ? text.replace(re, op.replace)
        : text.replace(re, () => op.replace);
      return { success: true, output, count };
    }
    case 'extract': {
      if (op.keyword === '')
        return mapLines(text, (lines) => ({ lines, count: 0 }));
      const re = buildRegExp(op.keyword, op.regex, op.ignoreCase, '');
      if (!re) return { success: false, error: 'invalidRegex' };
      return mapLines(text, (lines) => {
        const matched = lines.filter((line) => re.test(line));
        return {
          count: matched.length,
          lines: lines.filter((line) => re.test(line) !== op.invert),
        };
      });
    }
    case 'affix':
      return mapLines(text, (lines) => {
        let count = 0;
        const out = lines.map((line) => {
          if (op.skipEmpty && line === '') return line;
          count++;
          return op.prefix + line + op.suffix;
        });
        return { lines: out, count };
      });
    case 'numberAdd':
      return mapLines(text, (lines) => {
        const start = toInteger(op.start, 1);
        const step = toInteger(op.step, 1);
        const targets = lines.filter((l) => !(op.skipEmpty && l === ''));
        const last = start + step * Math.max(targets.length - 1, 0);
        const width = op.zeroPad
          ? Math.max(
              String(Math.abs(start)).length,
              String(Math.abs(last)).length,
            )
          : 0;
        let n = start;
        const out = lines.map((line) => {
          if (op.skipEmpty && line === '') return line;
          const digits = String(Math.abs(n)).padStart(width, '0');
          const label = n < 0 ? `-${digits}` : digits;
          n += step;
          return label + op.separator + line;
        });
        return { lines: out, count: targets.length };
      });
    case 'numberRemove':
      return mapLines(text, (lines) => {
        let count = 0;
        const out = lines.map((line) => {
          const stripped = line.replace(LEADING_NUMBER, '');
          if (stripped !== line) count++;
          return stripped;
        });
        return { lines: out, count };
      });
    case 'reverse':
      return mapLines(text, (lines) => ({
        lines: [...lines].reverse(),
        count: lines.length,
      }));
  }
}
