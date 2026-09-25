import {
  getFavoriteSlugs,
  isFavorite,
  moveFavorite,
  toggleFavorite,
} from './favorites';
import {
  getLocalizedTools,
  type Locale,
  type LocalizedTool,
} from '../data/tools';
import { useTranslations } from '../i18n/ui';

const SVG_NS = 'http://www.w3.org/2000/svg';

function updateToggleButtons(slug: string, active: boolean): void {
  document
    .querySelectorAll<HTMLElement>(`[data-favorite-toggle="${slug}"]`)
    .forEach((button) => {
      button.setAttribute('aria-pressed', String(active));
      const label = active
        ? button.dataset.labelRemove
        : button.dataset.labelAdd;
      if (label) {
        button.setAttribute('aria-label', label);
        const labelEl = button.querySelector<HTMLElement>(
          '[data-favorite-label]',
        );
        if (labelEl) labelEl.textContent = label;
      }
      button
        .querySelector<HTMLElement>('[data-star-outline]')
        ?.classList.toggle('hidden', active);
      button
        .querySelector<HTMLElement>('[data-star-filled]')
        ?.classList.toggle('hidden', !active);
    });
}

/** お気に入りに登録済みのツールを先頭（登録順）に、それ以外を元の順序のまま並べ替える */
function reorderHomepageGrid(tools: LocalizedTool[]): void {
  const items = document.querySelectorAll<HTMLElement>('[data-tool-slug]');
  if (items.length === 0) return;
  const container = items[0].parentElement;
  if (!container) return;

  const elementBySlug = new Map<string, HTMLElement>();
  items.forEach((el) => {
    const slug = el.dataset.toolSlug;
    if (slug) elementBySlug.set(slug, el);
  });

  const favoriteSlugs = getFavoriteSlugs();
  const favoriteSet = new Set(favoriteSlugs);
  const favoriteElements = favoriteSlugs
    .map((slug) => elementBySlug.get(slug))
    .filter((el): el is HTMLElement => el !== undefined);
  const restElements = tools
    .filter((tool) => !favoriteSet.has(tool.slug))
    .map((tool) => elementBySlug.get(tool.slug))
    .filter((el): el is HTMLElement => el !== undefined);

  container.append(...favoriteElements, ...restElements);
}

function createChevronIcon(direction: 'up' | 'down'): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('h-4', 'w-4');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute(
    'd',
    direction === 'up'
      ? 'M4.5 15.75l7.5-7.5 7.5 7.5'
      : 'M4.5 8.25l7.5 7.5 7.5-7.5',
  );
  svg.appendChild(path);
  return svg;
}

export function initFavorites(): void {
  const locale: Locale = document.documentElement.lang === 'en' ? 'en' : 'ja';
  const t = useTranslations(locale);
  const tools = getLocalizedTools(locale);
  const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));
  const favoritesSection = document.getElementById('sidebar-favorites');
  const favoritesList = document.getElementById('sidebar-favorites-list');

  function getOrderedFavoriteTools(): LocalizedTool[] {
    return getFavoriteSlugs()
      .map((slug) => toolBySlug.get(slug))
      .filter((tool): tool is LocalizedTool => tool !== undefined);
  }

  function applyOrderChange() {
    renderFavoritesList();
    reorderHomepageGrid(tools);
  }

  /** 並び替え後、操作したボタン（無効化されていれば反対方向のボタン）にフォーカスを戻す */
  function focusMoveButton(slug: string, direction: 'up' | 'down'): void {
    if (!favoritesList) return;
    const primary = favoritesList.querySelector<HTMLButtonElement>(
      `[data-move-slug="${slug}"][data-move-direction="${direction}"]`,
    );
    if (primary && !primary.disabled) {
      primary.focus();
      return;
    }
    const fallbackDirection = direction === 'up' ? 'down' : 'up';
    favoritesList
      .querySelector<HTMLButtonElement>(
        `[data-move-slug="${slug}"][data-move-direction="${fallbackDirection}"]`,
      )
      ?.focus();
  }

  function renderFavoritesList() {
    if (!favoritesSection || !favoritesList) return;
    const favoriteTools = getOrderedFavoriteTools();

    favoritesList.replaceChildren(
      ...favoriteTools.map((tool, index) => {
        const href =
          locale === 'en' ? `/en/tools/${tool.slug}/` : `/tools/${tool.slug}/`;
        const li = document.createElement('li');
        li.className = 'flex items-center gap-0.5';

        const a = document.createElement('a');
        a.href = href;
        a.textContent = tool.name;
        a.className =
          'block flex-1 rounded px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 aria-[current=page]:bg-blue-50 aria-[current=page]:font-semibold aria-[current=page]:text-blue-700 dark:text-gray-300 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 dark:aria-[current=page]:bg-blue-950/40 dark:aria-[current=page]:text-blue-400';
        if (window.location.pathname === href) {
          a.setAttribute('aria-current', 'page');
        }
        li.appendChild(a);

        const moveButtonClass =
          'shrink-0 rounded p-3 text-gray-400 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-25 dark:text-gray-500 dark:hover:text-blue-400';

        const upButton = document.createElement('button');
        upButton.type = 'button';
        upButton.appendChild(createChevronIcon('up'));
        upButton.setAttribute('aria-label', t('favorite.moveUp'));
        upButton.dataset.moveSlug = tool.slug;
        upButton.dataset.moveDirection = 'up';
        upButton.className = moveButtonClass;
        upButton.disabled = index === 0;
        upButton.addEventListener('click', () => {
          moveFavorite(tool.slug, 'up');
          applyOrderChange();
          focusMoveButton(tool.slug, 'up');
        });
        li.appendChild(upButton);

        const downButton = document.createElement('button');
        downButton.type = 'button';
        downButton.appendChild(createChevronIcon('down'));
        downButton.setAttribute('aria-label', t('favorite.moveDown'));
        downButton.dataset.moveSlug = tool.slug;
        downButton.dataset.moveDirection = 'down';
        downButton.className = moveButtonClass;
        downButton.disabled = index === favoriteTools.length - 1;
        downButton.addEventListener('click', () => {
          moveFavorite(tool.slug, 'down');
          applyOrderChange();
          focusMoveButton(tool.slug, 'down');
        });
        li.appendChild(downButton);

        return li;
      }),
    );

    favoritesSection.hidden = favoriteTools.length === 0;

    // 次のページの初回描画前に同じHTMLを復元できるよう保存する（復元側は sidebar-category-init.js）。
    // 表示するツールの絞り込み前のお気に入り一覧をキーにして、内容の一致を判定する。
    try {
      localStorage.setItem(
        `sidebar-favorites-html:${locale}`,
        JSON.stringify({
          key: getFavoriteSlugs().join(','),
          html: favoritesList.innerHTML,
        }),
      );
    } catch {
      // localStorageが使えない環境では保存せず、プレースホルダー表示になる
    }
  }

  document
    .querySelectorAll<HTMLButtonElement>('[data-favorite-toggle]')
    .forEach((button) => {
      const slug = button.dataset.favoriteToggle;
      if (!slug) return;
      updateToggleButtons(slug, isFavorite(slug));
      button.addEventListener('click', () => {
        const active = toggleFavorite(slug);
        updateToggleButtons(slug, active);
        applyOrderChange();
      });
    });

  // 開閉状態を保存する（復元は sidebar-category-init.js が初回ペイント前に行う）
  if (favoritesSection instanceof HTMLDetailsElement) {
    favoritesSection.addEventListener('toggle', () => {
      try {
        localStorage.setItem(
          'sidebar-favorites-open',
          favoritesSection.open ? '1' : '0',
        );
      } catch {
        // localStorageが使えない環境では保存せず今回の表示だけ反映する
      }
    });
  }

  renderFavoritesList();
  reorderHomepageGrid(tools);
}
