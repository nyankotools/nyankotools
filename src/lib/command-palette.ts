import type { LocalizedTool } from '../data/tools';
import { normalize, splitQuery } from './home-filter';

/**
 * クエリに一致するツールを、関連度の高い順（名前の前方一致 → 名前 → 別名 →
 * slug・カテゴリ → 説明文）に並べて返す。クエリが空なら登録順のまま全件返す。
 */
export function rankTools(
  tools: LocalizedTool[],
  query: string,
  limit = 20,
): LocalizedTool[] {
  const terms = splitQuery(query);
  if (terms.length === 0) return tools;

  const scored: { tool: LocalizedTool; score: number; index: number }[] = [];
  tools.forEach((tool, index) => {
    const name = normalize(tool.name);
    const keywords = tool.keywords.map(normalize);
    const category = normalize(tool.category);
    const description = normalize(tool.description);
    // すべての語が一致する必要がある（AND検索）。順位は最も弱い一致で決める
    let score: number | null = 0;
    for (const q of terms) {
      let s: number | null = null;
      if (name.startsWith(q)) s = 0;
      else if (name.includes(q)) s = 1;
      else if (keywords.some((k) => k.includes(q))) s = 2;
      else if (tool.slug.includes(q) || category.includes(q)) s = 3;
      else if (description.includes(q)) s = 4;
      if (s === null) {
        score = null;
        break;
      }
      score = Math.max(score, s);
    }
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
  // ツール登録簿（説明文・キーワードで約60KB）は全ページで読み込まれないよう、初めて開くときに読み込む
  let tools: LocalizedTool[] = [];
  let loaded = false;
  let toolsLoading: Promise<void> | null = null;
  function loadTools(): Promise<void> {
    toolsLoading ??= import('../data/tools').then(
      (mod) => {
        tools = mod.getLocalizedTools(locale);
        loaded = true;
      },
      () => {
        // 一時的な通信断などで失敗しても、次に開いたときに再試行できるようにする
        toolsLoading = null;
      },
    );
    return toolsLoading;
  }
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
    // 登録簿の読み込み中は「該当なし」を出さない
    empty!.hidden = !loaded || results.length > 0;
    select(0);
  }

  function open(): void {
    if (dialog!.open) return;
    input!.value = '';
    render();
    dialog!.showModal();
    input!.focus();
    void loadTools().then(() => {
      if (dialog!.open) render();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (
      // オートフィル選択時は key が未定義のkeydownが発火する
      event.key?.toLowerCase() === 'k' &&
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

  document.querySelectorAll('[data-palette-open]').forEach((el) => {
    el.addEventListener('click', open);
    // 開く操作の前に読み込みを始めて、体感の遅延をなくす
    el.addEventListener('pointerenter', () => void loadTools(), { once: true });
    el.addEventListener('focus', () => void loadTools(), { once: true });
  });

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
