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
 * ツールページのURLクエリを、`data-query-target="<パラメータ名>"` を付けた入力欄へ流し込む。
 * URLは共有・履歴・計測に残りうるため、機微ツール（`data-tool-sensitive`）では一切使わず、
 * 対象欄は各ツールが明示的にオプトインしたものに限る。読み込み後はURLからクエリを消す。
 */
export function initQueryInit(): void {
  const container = document.querySelector<HTMLElement>('[data-tool-slug]');
  if (!container || container.hasAttribute('data-tool-sensitive')) return;

  let applied = false;
  container
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      '[data-query-target]',
    )
    .forEach((target) => {
      const value = readQueryText(
        window.location.search,
        target.dataset.queryTarget || 'text',
      );
      if (value === null) return;
      target.value = value;
      target.dispatchEvent(new Event('input', { bubbles: true }));
      applied = true;
    });

  // 入力データがアドレスバー・履歴・Referer（次ページの計測を含む）に残らないようにする
  if (applied) {
    history.replaceState(
      null,
      '',
      window.location.pathname + window.location.hash,
    );
  }
}
