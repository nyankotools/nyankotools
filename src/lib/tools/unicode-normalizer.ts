export type NormalForm = 'NFC' | 'NFD' | 'NFKC' | 'NFKD';

export const NORMAL_FORMS: NormalForm[] = ['NFC', 'NFD', 'NFKC', 'NFKD'];

export interface NormalizeChange {
  /** 変換前の文字（結合文字を含む1単位） */
  before: string;
  /** 変換後の文字 */
  after: string;
  /** 変換前のコードポイント（例: "U+304B U+3099"） */
  beforeCodes: string;
  /** 変換後のコードポイント */
  afterCodes: string;
}

export interface NormalizeStats {
  /** コードポイント数 */
  codePoints: number;
  /** UTF-16コード単位数（JavaScriptの length） */
  utf16Length: number;
  /** 濁点・半濁点が独立した結合文字（U+3099 / U+309A）として分離している箇所の数 */
  decomposedKana: number;
}

export interface NormalizeResult {
  output: string;
  changed: boolean;
  /** 変換された箇所（最大 maxChanges 件） */
  changes: NormalizeChange[];
  /** 変換された箇所の総数（changes を切り詰めた場合も全数） */
  changeCount: number;
  before: NormalizeStats;
  after: NormalizeStats;
}

/** 結合文字（\p{M}）、半角の濁点・半濁点（U+FF9E / U+FF9F）、ハングルの中声・終声ジャモを直前の文字に付随する単位とみなす */
const CLUSTER_RE =
  /[^\p{M}\uFF9E\uFF9F\u1160-\u11FF\uD7B0-\uD7FF][\p{M}\uFF9E\uFF9F\u1160-\u11FF\uD7B0-\uD7FF]*|[\p{M}\uFF9E\uFF9F\u1160-\u11FF\uD7B0-\uD7FF]+/gu;
const DECOMPOSED_KANA_RE = /[\u3099\u309A]/g;

export function formatCodePoints(text: string): string {
  return Array.from(text)
    .map(
      (ch) =>
        'U+' + ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0'),
    )
    .join(' ');
}

export function computeStats(text: string): NormalizeStats {
  return {
    codePoints: Array.from(text).length,
    utf16Length: text.length,
    decomposedKana: (text.match(DECOMPOSED_KANA_RE) ?? []).length,
  };
}

export function normalizeText(text: string, form: NormalForm): string {
  return text.normalize(form);
}

/**
 * 正規化を行い、変換結果・統計・変換された箇所の一覧を返す。
 * 箇所の一覧は「文字＋結合文字」の単位ごとに正規化して比較する。
 */
export function analyzeNormalization(
  text: string,
  form: NormalForm,
  maxChanges = 50,
): NormalizeResult {
  const output = normalizeText(text, form);
  const changes: NormalizeChange[] = [];
  let changeCount = 0;
  for (const cluster of text.match(CLUSTER_RE) ?? []) {
    const normalized = cluster.normalize(form);
    if (normalized === cluster) continue;
    changeCount++;
    if (changes.length < maxChanges) {
      changes.push({
        before: cluster,
        after: normalized,
        beforeCodes: formatCodePoints(cluster),
        afterCodes: formatCodePoints(normalized),
      });
    }
  }
  return {
    output,
    changed: output !== text,
    changes,
    changeCount,
    before: computeStats(text),
    after: computeStats(output),
  };
}
