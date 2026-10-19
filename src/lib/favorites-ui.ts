import {
  FAVORITES_CHANGED_EVENT,
  getFavoriteSlugs,
  isFavorite,
  moveFavorite,
  setFavoriteOrder,
  toggleFavorite,
} from './favorites';
import type { Locale } from '../data/tools';
import { useTranslations } from '../i18n/ui';

const SVG_NS = 'http://www.w3.org/2000/svg';

function updateToggleButtons(
  slug: string,
  active: boolean,
  t: ReturnType<typeof useTranslations>,
): void {
  const label = t(active ? 'favorite.remove' : 'favorite.add');
  document
    .querySelectorAll<HTMLElement>(`[data-favorite-toggle="${slug}"]`)
    .forEach((button) => {
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
    });
}

/** サイドバーのリンクからツール名を引く（ツール登録簿をクライアントJSに含めないため、描画済みのDOMを使う） */
function readToolNames(): Map<string, string> {
  const names = new Map<string, string>();
  document.querySelectorAll<HTMLElement>('nav li').forEach((li) => {
    if (li.parentElement?.id === 'sidebar-favorites-list') return;
    const slug = li.querySelector<HTMLElement>('[data-favorite-toggle]')
      ?.dataset.favoriteToggle;
    const name = li.querySelector(':scope > a')?.textContent?.trim();
    if (slug && name) names.set(slug, name);
  });
  return names;
}

/** ドラッグハンドル（6点のグリップ）。点は丸いストロークの0長線で描く */
function createGripIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '3');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('h-4', 'w-4');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute(
    'd',
    'M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01',
  );
  svg.appendChild(path);
  return svg;
}

export function initFavorites(): void {
  const locale: Locale = document.documentElement.lang === 'en' ? 'en' : 'ja';
  const t = useTranslations(locale);
  const nameBySlug = readToolNames();
  const favoritesSection = document.getElementById('sidebar-favorites');
  const favoritesList = document.getElementById('sidebar-favorites-list');

  function getOrderedFavoriteTools(): { slug: string; name: string }[] {
    return getFavoriteSlugs().flatMap((slug) => {
      const name = nameBySlug.get(slug);
      return name ? [{ slug, name }] : [];
    });
  }

  function applyOrderChange() {
    renderFavoritesList();
    document.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
  }

  /** 一覧を作り直すとフォーカスが失われるため、並び替え後に操作したハンドルへ戻す */
  function focusHandle(slug: string): void {
    favoritesList
      ?.querySelector<HTMLButtonElement>(`[data-move-slug="${slug}"]`)
      ?.focus();
  }

  /** ハンドルのドラッグ操作。ドラッグ中はliを直接並べ替え、離した時点で保存する */
  function attachDrag(
    handle: HTMLButtonElement,
    li: HTMLLIElement,
    slug: string,
  ): void {
    let pointerId: number | null = null;

    // 並べ替え中にliを動かすとDOMから外れてポインターキャプチャが解除されるため、
    // 移動・終了はハンドルではなくwindowで受ける
    const onMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId || !favoritesList) return;
      const target = Array.from(favoritesList.children).find((child) => {
        if (child === li) return false;
        const rect = child.getBoundingClientRect();
        return event.clientY < rect.top + rect.height / 2;
      });
      const next = target ?? null;
      if (li.nextElementSibling !== next) {
        favoritesList.insertBefore(li, next);
        // タッチは暗黙のキャプチャが外れるため取り直す
        try {
          handle.setPointerCapture(event.pointerId);
        } catch {
          // 取れない環境ではwindowのリスナーに任せる
        }
      }
    };

    const finish = (event: PointerEvent) => {
      if (event.pointerId !== pointerId || !favoritesList) return;
      pointerId = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
      const ordered = Array.from(
        favoritesList.querySelectorAll<HTMLElement>('[data-move-slug]'),
      ).flatMap((el) => (el.dataset.moveSlug ? [el.dataset.moveSlug] : []));
      setFavoriteOrder(ordered);
      applyOrderChange();
      focusHandle(slug);
    };

    handle.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (pointerId !== null) return;
      event.preventDefault();
      pointerId = event.pointerId;
      li.classList.add('opacity-60', 'bg-blue-50', 'dark:bg-gray-800');
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', finish);
      window.addEventListener('pointercancel', finish);
    });

    // キーボード操作: ハンドルにフォーカスして上下キーで1つずつ移動
    handle.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      event.preventDefault();
      moveFavorite(slug, event.key === 'ArrowUp' ? 'up' : 'down');
      applyOrderChange();
      focusHandle(slug);
    });
  }

  function renderFavoritesList() {
    if (!favoritesSection || !favoritesList) return;
    const favoriteTools = getOrderedFavoriteTools();

    favoritesList.replaceChildren(
      ...favoriteTools.map((tool) => {
        const href =
          locale === 'en' ? `/en/tools/${tool.slug}/` : `/tools/${tool.slug}/`;
        const li = document.createElement('li');
        li.className = 'flex items-center gap-0.5';

        const a = document.createElement('a');
        a.href = href;
        a.textContent = tool.name;
        a.className = 'sidebar-link';
        if (window.location.pathname === href) {
          a.setAttribute('aria-current', 'page');
        }
        li.appendChild(a);

        const handle = document.createElement('button');
        handle.type = 'button';
        handle.appendChild(createGripIcon());
        handle.setAttribute('aria-label', t('favorite.reorder'));
        handle.dataset.moveSlug = tool.slug;
        handle.className =
          'shrink-0 cursor-grab touch-none rounded p-3 text-gray-400 hover:text-blue-600 active:cursor-grabbing dark:text-gray-500 dark:hover:text-blue-400';
        attachDrag(handle, li, tool.slug);
        li.prepend(handle);

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
      updateToggleButtons(slug, isFavorite(slug), t);
      button.addEventListener('click', () => {
        const active = toggleFavorite(slug);
        updateToggleButtons(slug, active, t);
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
}
