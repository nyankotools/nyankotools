/**
 * 広告表示の可否判定（純関数）。
 * 広告枠・広告用CSPの出し分けは、すべてこの判定結果で行う。
 */

/**
 * 広告機能のマスタースイッチ。AdSense審査・広告コード導入が決まるまで false のまま。
 * false の間は広告枠もCSP緩和も一切出力されず、サイトの挙動・配信ヘッダーは従来と同じ。
 */
export const ADS_ENABLED = false;

/** 広告配信に必要な外部ドメイン（広告を出すページのCSPにだけ追加する） */
export const AD_CSP = {
  script: [
    'https://pagead2.googlesyndication.com',
    'https://googleads.g.doubleclick.net',
  ],
  img: ['https://pagead2.googlesyndication.com', 'https://*.g.doubleclick.net'],
  connect: [
    'https://pagead2.googlesyndication.com',
    'https://*.g.doubleclick.net',
  ],
  frame: [
    'https://googleads.g.doubleclick.net',
    'https://tpc.googlesyndication.com',
  ],
} as const;

interface AdContext {
  /** マスタースイッチ（テスト用に差し替え可能） */
  enabled?: boolean;
  /** ツールページなら、そのツールの属性。ツールページ以外は undefined */
  tool?: { ads?: boolean; sensitive?: boolean } | undefined;
  /** 広告を出せる静的ページ（トップ・カテゴリ一覧など）か */
  isAdPage?: boolean;
  noindex?: boolean;
}

/**
 * このページに広告を出してよいか。
 * ツールページは `ads: false` または `sensitive` のツールを除外する。
 * 機密データを貼るページに第三者コードを載せないための安全側の既定。
 */
export function shouldShowAds({
  enabled = ADS_ENABLED,
  tool,
  isAdPage = false,
  noindex = false,
}: AdContext): boolean {
  if (!enabled || noindex) return false;
  if (tool) return tool.ads !== false && !tool.sensitive;
  return isAdPage;
}
