export type InvisibleGroup =
  'zeroWidth' | 'joiner' | 'direction' | 'other' | 'tag';

export const invisibleGroups: InvisibleGroup[] = [
  'zeroWidth',
  'joiner',
  'direction',
  'other',
  'tag',
];

/** 検出対象の文字（Unicodeタグ文字 U+E0000〜U+E007F は範囲で判定する） */
const GROUP_BY_CODE = new Map<number, InvisibleGroup>([
  [0x200b, 'zeroWidth'],
  [0x2060, 'zeroWidth'],
  [0xfeff, 'zeroWidth'],
  [0x180e, 'zeroWidth'],
  [0x200c, 'joiner'],
  [0x200d, 'joiner'],
  [0x200e, 'direction'],
  [0x200f, 'direction'],
  [0x061c, 'direction'],
  [0x202a, 'direction'],
  [0x202b, 'direction'],
  [0x202c, 'direction'],
  [0x202d, 'direction'],
  [0x202e, 'direction'],
  [0x2066, 'direction'],
  [0x2067, 'direction'],
  [0x2068, 'direction'],
  [0x2069, 'direction'],
  [0x00ad, 'other'],
  [0x034f, 'other'],
  [0x2061, 'other'],
  [0x2062, 'other'],
  [0x2063, 'other'],
  [0x2064, 'other'],
]);

export function getInvisibleGroup(cp: number): InvisibleGroup | null {
  if (cp >= 0xe0000 && cp <= 0xe007f) return 'tag';
  return GROUP_BY_CODE.get(cp) ?? null;
}

export function formatCodePoint(cp: number): string {
  return `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
}

export interface InvisibleFinding {
  code: number;
  group: InvisibleGroup;
  count: number;
}

export interface InvisibleScan {
  findings: InvisibleFinding[];
  total: number;
}

export function scanInvisible(text: string): InvisibleScan {
  const counts = new Map<number, number>();
  let total = 0;
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    if (getInvisibleGroup(cp) === null) continue;
    counts.set(cp, (counts.get(cp) ?? 0) + 1);
    total++;
  }
  const findings = [...counts.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([code, count]) => ({
      code,
      group: getInvisibleGroup(code)!,
      count,
    }));
  return { findings, total };
}

export function removeInvisible(
  text: string,
  groups: Iterable<InvisibleGroup>,
): { text: string; removed: number } {
  const target = new Set(groups);
  let result = '';
  let removed = 0;
  for (const ch of text) {
    const group = getInvisibleGroup(ch.codePointAt(0)!);
    if (group !== null && target.has(group)) {
      removed++;
    } else {
      result += ch;
    }
  }
  return { text: result, removed };
}

/** 検出対象の文字を `[U+200B]` の形に置き換えて、目に見える形にする */
export function visualizeInvisible(text: string): string {
  let result = '';
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    result += getInvisibleGroup(cp) === null ? ch : `[${formatCodePoint(cp)}]`;
  }
  return result;
}
