/** URLクエリ `?text=` で渡せる最大文字数（URL長の上限と、巨大入力による負荷を避ける） */
export const MAX_QUERY_LENGTH = 5000;

/**
 * URLクエリから入力欄へ初期値として渡す値を取り出す。
 * `text` が無い・空・長すぎる場合は null。
 */
export function readQueryText(search: string): string | null {
  const value = new URLSearchParams(search).get('text');
  if (!value || value.length > MAX_QUERY_LENGTH) return null;
  return value;
}

/**
 * ツールページの `?text=...` を、`data-query-target` を付けた入力欄へ流し込む。
 * URLは共有・履歴・計測に残りうるため、機微ツール（`data-tool-sensitive`）では一切使わず、
 * 対象欄は各ツールが明示的にオプトインしたものに限る。
 */
export function initQueryInit(): void {
  const container = document.querySelector<HTMLElement>('[data-tool-slug]');
  if (!container || container.hasAttribute('data-tool-sensitive')) return;
  const target = container.querySelector<
    HTMLInputElement | HTMLTextAreaElement
  >('[data-query-target]');
  const value = readQueryText(window.location.search);
  if (!target || value === null) return;
  target.value = value;
  target.dispatchEvent(new Event('input', { bubbles: true }));
}
