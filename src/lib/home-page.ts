import { getLocalizedTools, type CategoryId } from '../data/tools';
import { enableDragScroll, enableScrollFade } from './drag-scroll';
import { FAVORITES_CHANGED_EVENT, getFavoriteSlugs } from './favorites';
import { filterTools } from './home-filter';
import { getRecentSlugs } from './recent-tools';

/** 絞り込みなしのとき、カテゴリごとに最初に表示するカード数（3列で2行分） */
const COLLAPSED_LIMIT = 6;

export function initHomePage(): void {
  const tools = getLocalizedTools(
    document.documentElement.lang === 'en' ? 'en' : 'ja',
  );

  const searchInput = document.getElementById(
    'tool-search',
  ) as HTMLInputElement | null;
  const categoryButtons = document.querySelectorAll<HTMLButtonElement>(
    '[data-category-filter]',
  );
  const noResults = document.getElementById('no-results');
  const root = document.getElementById('tool-grid');
  if (!root) return;
  const labelMore = root.dataset.labelMore ?? '';
  const labelLess = root.dataset.labelLess ?? '';

  const favoritesSection = root.querySelector<HTMLElement>(
    '[data-home-section="favorites"]',
  );
  const categorySections = Array.from(
    root.querySelectorAll<HTMLElement>(
      '[data-home-section]:not([data-home-section="favorites"])',
    ),
  );

  // 描画時点（カテゴリ別・登録順）のカード順を、並べ替えから戻すための基準として保持する
  const cardBySlug = new Map<string, HTMLElement>();
  const originalSlugs = new Map<HTMLElement, string[]>();
  for (const section of categorySections) {
    const slugs: string[] = [];
    section
      .querySelectorAll<HTMLElement>('[data-tool-slug]')
      .forEach((card) => {
        const slug = card.dataset.toolSlug;
        if (!slug) return;
        slugs.push(slug);
        cardBySlug.set(slug, card);
      });
    originalSlugs.set(section, slugs);
  }

  document.querySelectorAll<HTMLElement>('[data-drag-scroll]').forEach((el) => {
    enableDragScroll(el);
    enableScrollFade(el);
  });
  const categoryGroup = document.querySelector<HTMLElement>(
    '[role="group"][data-drag-scroll]',
  );

  let activeCategory: CategoryId | 'all' = 'all';
  const expanded = new Set<HTMLElement>();

  /** セクション内のカードを並べ、絞り込み・折りたたみを反映する。表示件数を返す */
  function layoutSection(
    section: HTMLElement,
    slugs: string[],
    visibleSlugs: Set<string>,
    limit: number,
  ): number {
    const grid = section.querySelector<HTMLElement>('[data-section-grid]');
    if (!grid) return 0;
    const cards = slugs.flatMap((slug) => {
      const card = cardBySlug.get(slug);
      return card ? [card] : [];
    });
    grid.append(...cards);

    let shown = 0;
    for (const card of cards) {
      const matched = visibleSlugs.has(card.dataset.toolSlug ?? '');
      card.hidden = !matched;
      // 折りたたみは hidden 属性ではなくクラスで行い、絞り込みの非表示と区別する
      card.classList.toggle('hidden', matched && shown >= limit);
      if (matched) shown++;
    }

    section.hidden = shown === 0;
    const count = section.querySelector('[data-section-count]');
    if (count) count.textContent = String(shown);
    return shown;
  }

  /** 「最近使ったツール」を小さなリンクのチップとして並べる。絞り込み中・履歴なしのときは隠す */
  const recentSection = document.getElementById('home-recent');
  const recentList = recentSection?.querySelector('[data-recent-list]');
  const localePrefix = document.documentElement.lang === 'en' ? '/en' : '';
  function renderRecent(filtering: boolean) {
    if (!recentSection || !recentList) return;
    if (filtering) {
      recentSection.hidden = true;
      return;
    }
    const bySlug = new Map(tools.map((tool) => [tool.slug, tool]));
    const recent = getRecentSlugs().flatMap((slug) => {
      const tool = bySlug.get(slug);
      return tool ? [tool] : [];
    });
    recentSection.hidden = recent.length === 0;
    recentList.replaceChildren(
      ...recent.map((tool) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `${localePrefix}/tools/${tool.slug}/`;
        a.textContent = tool.name;
        a.className =
          'inline-flex min-h-11 items-center rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-400';
        li.append(a);
        return li;
      }),
    );
  }

  function render() {
    const query = searchInput?.value ?? '';
    const visibleSlugs = new Set(
      filterTools(tools, { query, category: activeCategory }).map(
        (tool) => tool.slug,
      ),
    );
    const filtering = query.trim() !== '' || activeCategory !== 'all';
    renderRecent(filtering);

    const favoriteSlugs = getFavoriteSlugs().filter((slug) =>
      cardBySlug.has(slug),
    );
    const favoriteSet = new Set(favoriteSlugs);

    let total = 0;
    if (favoritesSection) {
      total += layoutSection(
        favoritesSection,
        favoriteSlugs,
        visibleSlugs,
        Infinity,
      );
    }

    for (const section of categorySections) {
      const slugs = (originalSlugs.get(section) ?? []).filter(
        (slug) => !favoriteSet.has(slug),
      );
      const limit =
        filtering || expanded.has(section) ? Infinity : COLLAPSED_LIMIT;
      const shown = layoutSection(section, slugs, visibleSlugs, limit);
      total += shown;

      const button =
        section.querySelector<HTMLButtonElement>('[data-show-more]');
      if (!button) continue;
      const canCollapse = !filtering && shown > COLLAPSED_LIMIT;
      button.hidden = !canCollapse;
      if (canCollapse) {
        const isExpanded = expanded.has(section);
        button.textContent = isExpanded
          ? labelLess
          : labelMore.replace('{count}', String(shown - COLLAPSED_LIMIT));
        button.setAttribute('aria-expanded', String(isExpanded));
      }
    }

    if (noResults) {
      noResults.hidden = total > 0;
    }
  }

  function setCategory(category: CategoryId | 'all') {
    activeCategory = category;
    categoryButtons.forEach((b) => {
      b.setAttribute(
        'aria-pressed',
        String(b.dataset.categoryFilter === category),
      );
    });
  }

  // 絞り込み状態をURLのクエリ（?q=…&c=…）に保存し、戻る操作や再訪問で復元する
  function syncUrl() {
    const params = new URLSearchParams();
    const query = searchInput?.value.trim() ?? '';
    if (query) params.set('q', query);
    if (activeCategory !== 'all') params.set('c', activeCategory);
    const search = params.toString();
    history.replaceState(
      history.state,
      '',
      location.pathname + (search ? '?' + search : '') + location.hash,
    );
  }

  searchInput?.addEventListener('input', () => {
    render();
    syncUrl();
  });

  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setCategory(
        (button.dataset.categoryFilter ?? 'all') as CategoryId | 'all',
      );
      render();
      syncUrl();
    });
  });

  categorySections.forEach((section) => {
    section
      .querySelector<HTMLButtonElement>('[data-show-more]')
      ?.addEventListener('click', () => {
        if (expanded.has(section)) expanded.delete(section);
        else expanded.add(section);
        render();
      });
  });

  document.addEventListener(FAVORITES_CHANGED_EVENT, render);

  const initial = new URLSearchParams(location.search);
  const initialCategory = initial.get('c');
  if (
    initialCategory &&
    Array.from(categoryButtons).some(
      (b) => b.dataset.categoryFilter === initialCategory,
    )
  ) {
    setCategory(initialCategory as CategoryId);
    // 横スクロール時に、復元したカテゴリのボタンが見える位置へ寄せる
    const pressed = categoryGroup?.querySelector<HTMLElement>(
      '[aria-pressed="true"]',
    );
    if (categoryGroup && pressed) {
      categoryGroup.scrollLeft =
        pressed.offsetLeft -
        (categoryGroup.clientWidth - pressed.offsetWidth) / 2;
    }
  }
  if (searchInput) searchInput.value = initial.get('q') ?? '';
  render();
}
