/** `/tools/<slug>/` `/en/tools/<slug>/` からツールのslugを取り出す（それ以外は null） */
export function getToolSlug(pathname: string): string | null {
  const match = pathname.match(/^\/(?:en\/)?tools\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

type Gtag = (command: 'event', name: string, params: object) => void;

/**
 * GA4 へ計測イベントを送る。gtag が無い環境（dev・テスト・ブロッカー有効時）では何もしない。
 * 入力内容・ファイル名などユーザーのデータは送らず、イベント名とツールslugだけを送る。
 */
export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean> = {},
): void {
  if (typeof window === 'undefined') return;
  try {
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag !== 'function') return;
    const tool = getToolSlug(window.location.pathname);
    gtag('event', name, tool ? { tool, ...params } : params);
  } catch {
    // 計測の失敗でツール本体の動作を止めない
  }
}
