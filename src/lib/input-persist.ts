/** 1欄あたりに保存する最大文字数（sessionStorage の容量と保存負荷を抑える） */
export const MAX_PERSIST_LENGTH = 200_000;

const SAVE_DELAY_MS = 300;
const KEY_PREFIX = 'nyanko:input:';

const PERSIST_INPUT_TYPES = new Set([
  'text',
  'search',
  'number',
  'email',
  'url',
  'tel',
  'date',
  'datetime-local',
  'time',
  'month',
  'week',
]);

/** 保存対象の入力欄か（テキスト系・数値系の編集可能な欄で、id があり、オプトアウトされていない） */
export function isPersistable(el: Element): boolean {
  if (!(el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement)) {
    return false;
  }
  if (!el.id || el.readOnly || el.disabled) return false;
  if (el.hasAttribute('data-no-persist')) return false;
  if (el instanceof HTMLInputElement) {
    return PERSIST_INPUT_TYPES.has(el.type);
  }
  return true;
}

/** ja/en で同じツールが同じキーになる（言語切替で入力を引き継ぐ） */
export function storageKey(slug: string, id: string): string {
  return `${KEY_PREFIX}${slug}:${id}`;
}

function getStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * ツールページの入力値を sessionStorage に保存し、再読み込み・言語切替後に復元する。
 * - 対象は `[data-tool-page]` 内の編集可能なテキスト系・数値系の欄（`data-no-persist` で除外）。
 * - 機微ツール（`data-tool-sensitive`）は保存も復元もしない。
 * - sessionStorage はタブを閉じると消え、他のタブ・端末には届かない。
 * - 復元は `input` イベントを発火して各ツールの既存処理に反映させる。
 *   `?text=` の初期値はこの後に適用されるので、URLで渡した値が優先される。
 */
export function initInputPersist(): void {
  const container = document.querySelector<HTMLElement>('[data-tool-page]');
  const slug = container?.dataset.toolPage;
  if (!container || !slug || container.hasAttribute('data-tool-sensitive')) {
    return;
  }
  const storage = getStorage();
  if (!storage) return;

  container
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input[id], textarea[id]',
    )
    .forEach((el) => {
      if (!isPersistable(el)) return;
      let saved: string | null;
      try {
        saved = storage.getItem(storageKey(slug, el.id));
      } catch {
        return;
      }
      if (saved === null || saved === el.value) return;
      el.value = saved;
      // 値が正規化された（number 欄で不正な値が空になる等）場合は反映しない
      if (el.value !== saved) return;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });

  const pending = new Map<string, string>();
  let timer: ReturnType<typeof setTimeout> | undefined;

  function flush() {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    pending.forEach((value, key) => {
      try {
        if (value.length > MAX_PERSIST_LENGTH) storage!.removeItem(key);
        else storage!.setItem(key, value);
      } catch {
        // 容量超過・保存禁止でも、ツール本体の動作は妨げない
      }
    });
    pending.clear();
  }

  container.addEventListener('input', (event) => {
    const el = event.target;
    if (!(el instanceof Element) || !isPersistable(el)) return;
    const field = el as HTMLInputElement | HTMLTextAreaElement;
    pending.set(storageKey(slug, field.id), field.value);
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(flush, SAVE_DELAY_MS);
  });
  window.addEventListener('pagehide', flush);
}
