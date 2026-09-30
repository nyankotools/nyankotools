import { LARGE_INPUT_LENGTH, LARGE_INPUT_DELAY_MS } from './input-scheduler';

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

/** 保存される内容。`last` は最後にユーザーが操作した欄のキー（連動欄の整合に使う） */
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
 * 欄を識別するキー。id があれば id。id の無いラジオは `name#value`、
 * `data-option` を持つチェックボックスは `option:<値>`。それ以外は null（保存対象外）。
 */
export function fieldKey(el: Element): string | null {
  if (el.id) return el.id;
  if (el instanceof HTMLInputElement) {
    if (el.type === 'radio' && el.name) return `${el.name}#${el.value}`;
    if (el.type === 'checkbox' && el.dataset.option) {
      return `option:${el.dataset.option}`;
    }
  }
  return null;
}

/**
 * 保存対象の欄か。キーがあり、編集可能（readonly/disabled でない）で、`data-no-persist` がなく、
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
  if (fieldKey(el) === null || el.disabled) return false;
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
 *   ページ読み込み直後の値（JS が入れる「現在時刻」などの既定値を含む）から変わっていない欄は
 *   保存しない（古い時刻などが次回以降に固定されるのを避ける）。
 * - 復元は、全欄の値を入れて `input`/`change` を発火し（最後に操作した欄が最後）、ツールの結果を
 *   再計算させたうえで、最後に全欄へ保存値を黙って入れ直す（丸めを伴う連動欄が、
 *   他の欄の再計算で書き換わったままにならないように）。select・チェックボックス・ラジオは先に
 *   反映して、それによる欄の有効/無効の切替を先に済ませる。
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
      container.querySelectorAll<Field>('input, textarea, select'),
    ).filter(isPersistable);

  // 読み込み直後（復元前）の値。ここから変わった欄だけを保存する
  const initial = new Map<string, string>();
  for (const el of fields()) initial.set(fieldKey(el)!, readValue(el));

  let lastEdited: string | null = null;

  function save(): void {
    const values: Record<string, string> = {};
    for (const el of fields()) {
      const k = fieldKey(el)!;
      const value = readValue(el);
      if (value === initial.get(k)) continue;
      if (value.length > MAX_PERSIST_LENGTH) {
        // 一部の欄だけ欠けると、連動する欄と食い違った状態で復元されるため、全体を保存しない
        removeSaved();
        return;
      }
      values[k] = value;
    }
    try {
      storage!.setItem(key, JSON.stringify({ last: lastEdited, values }));
    } catch {
      // 容量超過などで保存できないとき、古い値が復元されないよう消しておく
      removeSaved();
    }
  }

  function removeSaved(): void {
    try {
      storage!.removeItem(key);
    } catch {
      // ツール本体の動作は妨げない
    }
  }

  function restore(): void {
    let snapshot: Snapshot | null;
    try {
      if (storage!.getItem(restoringKey) !== null) {
        // 前回の復元が完了しなかった（固まった）ので、保存内容を捨てて素の状態で開く
        storage!.removeItem(restoringKey);
        storage!.removeItem(key);
        return;
      }
      snapshot = parseSnapshot(storage!.getItem(key));
      if (!snapshot) return;
      storage!.setItem(restoringKey, '1');
    } catch {
      return;
    }
    lastEdited = snapshot.last;

    let deferClear = false;
    try {
      const saved = snapshot;
      const restored: Array<[Field, string]> = [];
      const apply = (el: Field): boolean => {
        const value = saved.values[fieldKey(el)!];
        if (value === undefined || !writeValue(el, value)) return false;
        restored.push([el, value]);
        return true;
      };

      // 選択系を先に反映・発火して、欄の有効/無効の切替を済ませる
      fields()
        .filter((el) => el instanceof HTMLSelectElement || isToggle(el))
        .forEach((el) => {
          if (apply(el)) fire(el);
        });
      const changed = fields()
        .filter((el) => !(el instanceof HTMLSelectElement || isToggle(el)))
        .filter(apply);
      // 最後に操作した欄を最後に発火する
      changed.sort(
        (a, b) =>
          Number(fieldKey(a) === saved.last) -
          Number(fieldKey(b) === saved.last),
      );
      changed.forEach(fire);
      // 他の欄の再計算で書き換わった値を、保存した（整合の取れた）値へ戻す
      for (const [el, value] of restored) writeValue(el, value);

      // 大きな入力はツール側で遅延処理される（onTextInput）ため、その処理が終わるまで
      // 「復元中」の印を残し、固まった場合に次回の復元を止められるようにする
      const total = restored.reduce((sum, [, v]) => sum + v.length, 0);
      deferClear = total >= LARGE_INPUT_LENGTH;
    } catch {
      // 保存内容を使えなくても、ツール本体の動作は妨げない
    } finally {
      const clear = () => {
        try {
          storage!.removeItem(restoringKey);
        } catch {
          // 何もしない
        }
      };
      if (deferClear) setTimeout(clear, LARGE_INPUT_DELAY_MS + 500);
      else clear();
    }
  }

  restore();

  let timer: ReturnType<typeof setTimeout> | undefined;

  function flush(): void {
    if (timer === undefined) return;
    clearTimeout(timer);
    timer = undefined;
    save();
  }

  const onEdit = (event: Event) => {
    const el = event.target;
    if (!(el instanceof Element) || !isPersistable(el)) return;
    lastEdited = fieldKey(el);
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
