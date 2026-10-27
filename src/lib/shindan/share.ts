/**
 * 結果の共有（設計書8章・16.4・16.9）。URL・投稿文・共有先のリンクを組み立てる。
 * URLに入るのは共有コード（回答 + 名前由来の12bit）だけで、名前そのものは入れない。
 */
import { buildShareHash } from './codec';
import { cyrb53 } from './hash';
import type { Rarity } from './types';

/** 共有URL（`<origin>/shindan/<themeId>/#r=<code>`） */
export function buildShareUrl(
  origin: string,
  themeId: string,
  code: string,
): string {
  return `${origin}/shindan/${themeId}/${buildShareHash(code)}`;
}

export type ShareTextValues = {
  title: string;
  type: string;
  rarity: Rarity;
  label: string;
  /** 出現率（%表記の数値） */
  rate: number;
};

/**
 * 投稿文を作る。テンプレートはレア度ごとの候補から共有コードで決める（同じ結果なら同じ文面）。
 * ハッシュタグは本文の後ろに付ける。
 */
export function buildShareText(
  templates: Record<Rarity, readonly string[]>,
  values: ShareTextValues,
  code: string,
  hashtags: readonly string[],
): string {
  const candidates = templates[values.rarity];
  const template = candidates[cyrb53(code) % candidates.length] ?? '';
  const body = template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.hasOwn(values, key)
      ? String(values[key as keyof ShareTextValues])
      : match,
  );
  const tags = hashtags.map((tag) => `#${tag}`).join(' ');
  return tags ? `${body}\n${tags}` : body;
}

/** X の投稿画面（画像は添付できないため、テキストとURLのみ） */
export function xIntentUrl(text: string, url: string): string {
  const params = new URLSearchParams({ text, url });
  return `https://x.com/intent/post?${params}`;
}

/** LINE の送信画面（本文の後ろにURLを付ける） */
export function lineShareUrl(text: string, url: string): string {
  return `https://line.me/R/share?text=${encodeURIComponent(`${text}\n${url}`)}`;
}

/**
 * SNSアプリ内のブラウザか（ダウンロードが効かないことが多いので、長押しでの保存を案内する）。
 * 判定できないアプリもあるため、案内の表示にだけ使う。
 */
export function isInAppBrowser(userAgent: string): boolean {
  return /\bLine\/|\bTwitter|\bFBAN|\bFBAV|\bInstagram|\bMicroMessenger/i.test(
    userAgent,
  );
}

/** 保存する画像のファイル名 */
export function cardFileName(
  themeId: string,
  typeId: string,
  shape: 'landscape' | 'portrait',
): string {
  return `nyanko-shindan-${themeId}-${typeId}-${shape}.png`;
}
