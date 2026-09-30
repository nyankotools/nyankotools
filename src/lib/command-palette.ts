import { getLocalizedTools, type LocalizedTool } from '../data/tools';
import { normalize } from './home-filter';

/**
 * クエリに一致するツールを、関連度の高い順（名前の前方一致 → 名前 → 別名 →
 * slug・カテゴリ → 説明文）に並べて返す。クエリが空なら登録順のまま全件返す。
 */
export function rankTools(
  tools: LocalizedTool[],
  query: string,
  limit = 20,
): LocalizedTool[] {
  const q = normalize(query.trim());
  if (!q) return tools;

  const scored: { tool: LocalizedTool; score: number; index: number }[] = [];
  tools.forEach((tool, index) => {
    const name = normalize(tool.name);
    let score: number | null = null;
    if (name.startsWith(q)) score = 0;
    else if (name.includes(q)) score = 1;
    else if (tool.keywords.some((k) => normalize(k).includes(q))) score = 2;
    else if (tool.slug.includes(q) || normalize(tool.category).includes(q))
      score = 3;
    else if (normalize(tool.description).includes(q)) score = 4;
    if (score !== null) scored.push({ tool, score, index });
  });
  scored.sort((a, b) => a.score - b.score || a.index - b.index);
  return scored.slice(0, limit).map((s) => s.tool);
}

const OPTION_CLASS =
  'flex cursor-pointer items-baseline justify-between gap-3 min-h-11 rounded px-3 py-2 text-sm aria-selected:bg-blue-50 aria-selected:text-blue-700 dark:aria-selected:bg-blue-950/40 dark:aria-selected:text-blue-400';

/** Ctrl+K / ⌘+K でツール検索ダイアログを開閉する */
export function initCommandPalette(): void {
  const dialog = document.getElementById(
    'command-palette',
  ) as HTMLDialogElement | null;
  const input = document.getElementById(
    'palette-input',
  ) as HTMLInputElement | null;
  const list = document.getElementById('palette-list');
  const empty = document.getElementById('palette-empty');
  if (!dialog || !input || !list || !empty) return;

  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  document.querySelectorAll('[data-palette-kbd]').forEach((el) => {
    el.textContent = isMac ? '⌘ K' : 'Ctrl K';
  });

  const locale = document.documentElement.lang === 'en' ? 'en' : 'ja';
  const tools = getLocalizedTools(locale);
  const prefix = locale === 'en' ? '/en/tools/' : '/tools/';
  let results: LocalizedTool[] = [];
  let active = 0;

  function select(index: number): void {
    if (results.length === 0) {
      input!.removeAttribute('aria-activedescendant');
      return;
    }
    active = (index + results.length) % results.length;
    list!.querySelectorAll('[role="option"]').forEach((el, i) => {
      el.setAttribute('aria-selected', String(i === active));
    });
    input!.setAttribute('aria-activedescendant', `palette-option-${active}`);
    document
      .getElementById(`palette-option-${active}`)
      ?.scrollIntoView?.({ block: 'nearest' });
  }

  function render(): void {
    const hasQuery = input!.value.trim() !== '';
    results = rankTools(tools, input!.value, hasQuery ? 20 : tools.length);
    list!.replaceChildren(
      ...results.map((tool, i) => {
        const li = document.createElement('li');
        li.id = `palette-option-${i}`;
        li.setAttribute('role', 'option');
        li.dataset.href = `${prefix}${tool.slug}/`;
        li.className = OPTION_CLASS;
        const name = document.createElement('span');
        name.textContent = tool.name;
        const category = document.createElement('span');
        category.className =
          'shrink-0 text-xs text-gray-400 dark:text-gray-500';
        category.textContent = tool.category;
        li.append(name, category);
        return li;
      }),
    );
    empty!.hidden = results.length > 0;
    select(0);
  }

  function open(): void {
    if (dialog!.open) return;
    input!.value = '';
    render();
    dialog!.showModal();
    input!.focus();
  }

  document.addEventListener('keydown', (event) => {
    if (
      event.key.toLowerCase() === 'k' &&
      (isMac ? event.metaKey : event.ctrlKey) &&
      !event.altKey &&
      !event.shiftKey &&
      !event.isComposing
    ) {
      event.preventDefault();
      if (dialog.open) dialog.close();
      else open();
    }
  });

  document
    .querySelectorAll('[data-palette-open]')
    .forEach((el) => el.addEventListener('click', open));

  input.addEventListener('input', render);
  input.addEventListener('keydown', (event) => {
    // Safari は変換確定の Enter/Esc で isComposing が false になり keyCode が 229 になる
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === 'Escape') {
      // type="search" は Esc で入力欄のクリアを先に行うため、1回で閉じるよう自前で閉じる。
      // サイドバーの Esc ハンドラ（ドロワーを閉じる）へは伝えない
      event.preventDefault();
      event.stopPropagation();
      dialog.close();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      select(active + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      select(active - 1);
    } else if (
      event.key === 'Enter' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();
      const current = results[active];
      if (current) window.location.href = `${prefix}${current.slug}/`;
    }
  });

  list.addEventListener('click', (event) => {
    const option = (event.target as Element).closest<HTMLElement>(
      '[role="option"]',
    );
    if (option?.dataset.href) window.location.href = option.dataset.href;
  });

  // ダイアログの外（バックドロップ）のクリックで閉じる
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}
