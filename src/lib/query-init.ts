/** URLクエリで渡せる最大文字数（URL長の上限と、巨大入力による負荷を避ける） */
export const MAX_QUERY_LENGTH = 5000;

/**
 * URLクエリから入力欄へ初期値として渡す値を取り出す（パラメータ名の既定は `text`）。
 * 無い・空・長すぎる場合は null。
 */
export function readQueryText(search: string, param = 'text'): string | null {
  const value = new URLSearchParams(search).get(param);
  if (!value || value.length > MAX_QUERY_LENGTH) return null;
  return value;
}

/**
 * クエリから指定パラメータだけを除いた `?...` 文字列を返す（残りが無ければ空文字）。
 * 対象パラメータが含まれていなければ null（URLを書き換える必要が無い）。
 * utm_* / gclid など、入力データ以外のパラメータは残す。
 */
export function stripQueryParams(
  search: string,
  names: string[],
): string | null {
  const params = new URLSearchParams(search);
  if (!names.some((name) => params.has(name))) return null;
  names.forEach((name) => params.delete(name));
  const rest = params.toString();
  return rest ? `?${rest}` : '';
}

/**
 * ツールページのURLクエリを、`data-query-target="<パラメータ名>"` を付けた入力欄へ流し込む。
 * URLは共有・履歴・計測に残りうるため、機微ツール（`data-tool-sensitive`）では反映せず、
 * 対象欄は各ツールが明示的にオプトインしたものに限る。
 * 入力データがアドレスバー・履歴・Referer（次ページの計測を含む）に残らないよう、
 * 反映の成否や機微ツールかどうかに関わらず、該当パラメータはURLから消す。
 */
export function initQueryInit(): void {
  const container = document.querySelector<HTMLElement>('[data-tool-page]');
  const targets = container
    ? Array.from(
        container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
          '[data-query-target]',
        ),
      )
    : [];
  const names = Array.from(
    new Set(['text', ...targets.map((t) => t.dataset.queryTarget || 'text')]),
  );

  try {
    if (!container || container.hasAttribute('data-tool-sensitive')) return;
    targets.forEach((target) => {
      const value = readQueryText(
        window.location.search,
        target.dataset.queryTarget || 'text',
      );
      if (value === null) return;
      target.value = value;
      target.dispatchEvent(new Event('input', { bubbles: true }));
    });
  } finally {
    const search = stripQueryParams(window.location.search, names);
    if (search !== null) {
      history.replaceState(
        null,
        '',
        window.location.pathname + search + window.location.hash,
      );
    }
  }
}
