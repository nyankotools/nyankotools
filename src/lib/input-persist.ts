/** 1欄あたりに保存する最大文字数（sessionStorage の容量と保存負荷を抑える） */
export const MAX_PERSIST_LENGTH = 200_000;

const SAVE_DELAY_MS = 300;
const KEY_PREFIX = 'nyanko:input:';
const RESTORING_PREFIX = 'nyanko:restoring:';

type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const TEXT_INPUT_TYPES = new Set([
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
  'color',
  'range',
]);

/** 保存される内容。`last` は最後にユーザーが操作した欄（連動欄の整合に使う） */
export interface Snapshot {
  last: string | null;
  values: Record<string, string>;
}

function isToggle(el: Field): el is HTMLInputElement {
  return (
    el instanceof HTMLInputElement && ['checkbox', 'radio'].includes(el.type)
  );
}

/**
 * 保存対象の欄か。id があり、編集可能（readonly/disabled でない）で、`data-no-persist` がなく、
 * テキスト系・数値系・色・スライダー・チェックボックス・ラジオ・select のいずれか。
 */
export function isPersistable(el: Element): el is Field {
  if (!(
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement
  )) {
    return false;
  }
  if (!el.id || el.disabled) return false;
  if (el.hasAttribute('data-no-persist')) return false;
  if (el instanceof HTMLSelectElement) return true;
  if (el instanceof HTMLTextAreaElement) return !el.readOnly;
  if (el.readOnly) return false;
  return TEXT_INPUT_TYPES.has(el.type) || isToggle(el);
}

/** ja/en で同じツールが同じキーになる（言語切替で入力を引き継ぐ） */
export function storageKey(slug: string): string {
  return `${KEY_PREFIX}${slug}`;
}

function readValue(el: Field): string {
  return isToggle(el) ? (el.checked ? '1' : '0') : el.value;
}

/** 保存値を欄へ反映する。反映できたら true（select に無い選択肢など、反映できない場合は false） */
function writeValue(el: Field, saved: string): boolean {
  if (isToggle(el)) {
    el.checked = saved === '1';
    return true;
  }
  el.value = saved;
  // 正規化された（number 欄の不正値・select に無い選択肢など）場合は反映しない
  return el.value === saved;
}

function fire(el: Field): void {
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

/** 保存内容を解釈する。壊れている・形式が違う場合は null */
export function parseSnapshot(raw: string | null): Snapshot | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<Snapshot>;
    if (!data || typeof data.values !== 'object' || data.values === null) {
      return null;
    }
    const values: Record<string, string> = {};
    for (const [id, value] of Object.entries(data.values)) {
      if (typeof value === 'string') values[id] = value;
    }
    return {
      last: typeof data.last === 'string' ? data.last : null,
      values,
    };
  } catch {
    return null;
  }
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
 * - 対象は `[data-tool-page]` 内の編集可能な入力欄（`isPersistable`。`data-no-persist` で除外）。
 * - 機微ツール（`data-tool-sensitive`）は保存も復元もしない。
 * - 保存は入力・変更のたびに、ページ内の対象欄をまとめてスナップショットする（ツールが計算で書き換えた
 *   連動欄や、`change` 時の範囲補正後の値も含む）。あわせて最後に操作した欄を記録する。
 * - 復元は全欄の値を入れてから、最後に操作した欄が最後になる順で `input`/`change` を発火する
 *   （連動欄が、最後に打った値で決まる）。select・チェックボックス・ラジオは先に反映して、
 *   それによる欄の有効/無効の切替を先に済ませる。
 * - 前回の復元中にページが固まった場合（重い正規表現など）、次の読み込みでは復元しない。
 * - sessionStorage はタブを閉じると消え、他のタブ・端末には届かない
 *   （ブラウザの「前回のページを開く」やタブの複製では残ることがある）。
 * `?text=` の初期値はこの後に適用されるので、URLで渡した値が優先される。
 */
export function initInputPersist(): void {
  const container = document.querySelector<HTMLElement>('[data-tool-page]');
  const slug = container?.dataset.toolPage;
  if (!container || !slug || container.hasAttribute('data-tool-sensitive')) {
    return;
  }
  const storage = getStorage();
  if (!storage) return;
  const key = storageKey(slug);
  const restoringKey = RESTORING_PREFIX + slug;

  const fields = () =>
    Array.from(
      container.querySelectorAll<Field>('input[id], textarea[id], select[id]'),
    ).filter(isPersistable);

  function save(last: string | null): void {
    const values: Record<string, string> = {};
    for (const el of fields()) {
      const value = readValue(el);
      if (value.length <= MAX_PERSIST_LENGTH) values[el.id] = value;
    }
    try {
      storage!.setItem(key, JSON.stringify({ last, values }));
    } catch {
      // 容量超過などで保存できないとき、古い値が復元されないよう消しておく
      try {
        storage!.removeItem(key);
      } catch {
        // ツール本体の動作は妨げない
      }
    }
  }

  restore();

  function restore(): void {
    try {
      if (storage!.getItem(restoringKey) !== null) {
        // 前回の復元が完了しなかった（固まった）ので、保存内容を捨てて素の状態で開く
        storage!.removeItem(restoringKey);
        storage!.removeItem(key);
        return;
      }
      const snapshot = parseSnapshot(storage!.getItem(key));
      if (!snapshot) return;
      storage!.setItem(restoringKey, '1');
      try {
        const restored: Field[] = [];
        const apply = (el: Field) => {
          const saved = snapshot.values[el.id];
          if (saved === undefined) return;
          if (writeValue(el, saved)) restored.push(el);
        };
        // 選択系を先に反映・発火して、欄の有効/無効の切替を済ませる
        fields()
          .filter((el) => el instanceof HTMLSelectElement || isToggle(el))
          .forEach((el) => {
            apply(el);
            if (restored.includes(el)) fire(el);
          });
        const textFields = fields().filter(
          (el) => !(el instanceof HTMLSelectElement || isToggle(el)),
        );
        const rest: Field[] = [];
        textFields.forEach((el) => {
          const before = restored.length;
          apply(el);
          if (restored.length > before) rest.push(el);
        });
        // 最後に操作した欄を最後に発火する
        rest.sort(
          (a, b) =>
            Number(a.id === snapshot.last) - Number(b.id === snapshot.last),
        );
        rest.forEach(fire);
      } finally {
        storage!.removeItem(restoringKey);
      }
    } catch {
      // 保存内容を使えなくても、ツール本体の動作は妨げない
    }
  }

  let lastEdited: string | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;

  function flush(): void {
    if (timer === undefined) return;
    clearTimeout(timer);
    timer = undefined;
    save(lastEdited);
  }

  const onEdit = (event: Event) => {
    const el = event.target;
    if (!(el instanceof Element) || !isPersistable(el)) return;
    lastEdited = el.id;
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(flush, SAVE_DELAY_MS);
  };
  container.addEventListener('input', onEdit);
  container.addEventListener('change', onEdit);
  window.addEventListener('pagehide', flush);
  // iOS Safari などで pagehide が来ないことがあるため、非表示になった時点でも保存する
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}
