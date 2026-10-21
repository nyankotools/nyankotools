import {
  applyCompletion,
  suggestCompletions,
  wordAtCursor,
  type Completion,
  type WordAtCursor,
} from './expression-autocomplete';

const LIST_CLASS =
  'fixed z-50 max-h-60 overflow-auto rounded border border-gray-300 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-900';
const ITEM_CLASS =
  'cursor-pointer px-3 py-1.5 font-mono text-sm text-gray-900 dark:text-gray-100';
const ACTIVE_CLASSES = ['bg-blue-100', 'dark:bg-blue-900'];

let uid = 0;

/**
 * 数式入力欄に関数名・定数・変数の補完候補を付ける。
 * ↑↓で選択、Tab で確定（未選択なら先頭）、Enter は ↑↓で選んだときだけ確定、Esc で閉じる。
 */
export function attachExpressionAutocomplete(
  input: HTMLInputElement,
  variables: readonly string[],
): void {
  const listId = `expr-ac-${uid++}`;
  const list = document.createElement('ul');
  list.id = listId;
  list.setAttribute('role', 'listbox');
  list.className = `${LIST_CLASS} hidden`;
  const label = input.getAttribute('aria-label');
  if (label) list.setAttribute('aria-label', label);
  document.body.append(list);

  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', listId);

  let items: Completion[] = [];
  let word: WordAtCursor | null = null;
  let active = -1;
  let composing = false;

  function isOpen(): boolean {
    return !list.classList.contains('hidden');
  }

  function close() {
    items = [];
    active = -1;
    list.classList.add('hidden');
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  function place() {
    const rect = input.getBoundingClientRect();
    list.style.left = `${rect.left}px`;
    list.style.top = `${rect.bottom + 2}px`;
    list.style.minWidth = `${Math.min(rect.width, 240)}px`;
    list.style.maxWidth = `${window.innerWidth - rect.left - 8}px`;
  }

  function highlight(index: number) {
    active = index;
    Array.from(list.children).forEach((li, i) => {
      const on = i === index;
      li.setAttribute('aria-selected', String(on));
      ACTIVE_CLASSES.forEach((c) => li.classList.toggle(c, on));
    });
    if (index >= 0) {
      input.setAttribute('aria-activedescendant', `${listId}-${index}`);
      list.children[index]?.scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }

  function accept(index: number) {
    const completion = items[index];
    if (!completion || !word) return;
    const result = applyCompletion(input.value, word, completion);
    input.value = result.text;
    input.setSelectionRange(result.cursor, result.cursor);
    close();
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function refresh() {
    if (document.activeElement !== input || composing) return;
    word = wordAtCursor(
      input.value,
      input.selectionStart ?? input.value.length,
    );
    items = word ? suggestCompletions(word.prefix, variables) : [];
    if (items.length === 0) {
      close();
      return;
    }
    list.textContent = '';
    items.forEach((c, i) => {
      const li = document.createElement('li');
      li.id = `${listId}-${i}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      li.className = ITEM_CLASS;
      li.textContent = c.kind === 'function' ? `${c.name}(…)` : c.name;
      // クリックで入力欄のフォーカスを失わないようにする
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        accept(i);
      });
      list.append(li);
    });
    active = -1;
    input.removeAttribute('aria-activedescendant');
    place();
    list.classList.remove('hidden');
    input.setAttribute('aria-expanded', 'true');
  }

  input.addEventListener('compositionstart', () => {
    composing = true;
    close();
  });
  input.addEventListener('compositionend', () => {
    composing = false;
    refresh();
  });
  input.addEventListener('input', refresh);
  input.addEventListener('keyup', (e) => {
    if (
      ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(
        e.key,
      )
    )
      refresh();
  });
  input.addEventListener('blur', close);
  input.addEventListener('click', refresh);
  // 画面外へ追従しないので、スクロール・リサイズでは閉じる
  window.addEventListener('resize', close);
  window.addEventListener(
    'scroll',
    (e) => {
      // 候補リスト自身のスクロールでは閉じない
      if (e.target instanceof Node && list.contains(e.target)) return;
      close();
    },
    true,
  );

  // ページ側の Enter 処理（計算の確定）より先に処理するためキャプチャで受ける
  input.addEventListener(
    'keydown',
    (e) => {
      if (e.isComposing || !isOpen()) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const n = items.length;
        const next =
          e.key === 'ArrowDown' ? (active + 1) % n : (active - 1 + n) % n;
        highlight(active === -1 && e.key === 'ArrowUp' ? n - 1 : next);
      } else if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        accept(active >= 0 ? active : 0);
      } else if (e.key === 'Enter' && active >= 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        accept(active);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    },
    true,
  );
}
