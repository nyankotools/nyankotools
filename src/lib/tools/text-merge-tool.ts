import { diffLines } from './text-diff';

/** 差分箇所（ハンク）ごとの採用方法。none は両方とも採用しない（その箇所を削除する） */
export type MergeChoice = 'a' | 'b' | 'ab' | 'ba' | 'none';

export const MERGE_CHOICES: MergeChoice[] = ['a', 'b', 'ab', 'ba', 'none'];

export interface EqualSegment {
  type: 'equal';
  lines: string[];
}

export interface ChangeSegment {
  type: 'change';
  /** A側にだけある行（A側の該当箇所） */
  a: string[];
  /** B側にだけある行（B側の該当箇所） */
  b: string[];
}

export type MergeSegment = EqualSegment | ChangeSegment;

/** 改行コードを LF にそろえて行に分割する */
function splitLines(text: string): string[] {
  return text.replace(/\r\n?/g, '\n').split('\n');
}

/**
 * 2つのテキストを行単位で比較し、一致する区間と差分箇所（ハンク）の並びにする。
 * 連続する追加・削除行は1つのハンクにまとめる。
 */
export function buildSegments(left: string, right: string): MergeSegment[] {
  const lines = diffLines(
    splitLines(left).join('\n'),
    splitLines(right).join('\n'),
  );
  const segments: MergeSegment[] = [];
  let current: MergeSegment | null = null;
  for (const line of lines) {
    if (line.type === 'equal') {
      if (current?.type === 'equal') {
        current.lines.push(line.text);
      } else {
        current = { type: 'equal', lines: [line.text] };
        segments.push(current);
      }
      continue;
    }
    if (current?.type !== 'change') {
      current = { type: 'change', a: [], b: [] };
      segments.push(current);
    }
    (line.type === 'removed' ? current.a : current.b).push(line.text);
  }
  return segments;
}

export function countChanges(segments: MergeSegment[]): number {
  return segments.filter((s) => s.type === 'change').length;
}

/** 入力が変わっても選択を引き継ぐための、ハンクの内容から作るキー */
export function changeKey(segment: ChangeSegment): string {
  return JSON.stringify([segment.a, segment.b]);
}

export function chooseLines(segment: ChangeSegment, choice: MergeChoice) {
  switch (choice) {
    case 'a':
      return segment.a;
    case 'b':
      return segment.b;
    case 'ab':
      return [...segment.a, ...segment.b];
    case 'ba':
      return [...segment.b, ...segment.a];
    case 'none':
      return [];
  }
}

/**
 * ハンクごとの選択（changeIndex 順の配列）に従ってマージ結果のテキストを作る。
 * 選択が足りないハンクは fallback を使う。
 */
export function mergeSegments(
  segments: MergeSegment[],
  choices: MergeChoice[],
  fallback: MergeChoice = 'b',
): string {
  const out: string[] = [];
  let index = 0;
  for (const segment of segments) {
    if (segment.type === 'equal') {
      for (const line of segment.lines) out.push(line);
    } else {
      const choice = choices[index++] ?? fallback;
      for (const line of chooseLines(segment, choice)) out.push(line);
    }
  }
  return out.join('\n');
}
