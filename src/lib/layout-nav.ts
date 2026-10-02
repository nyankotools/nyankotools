export function initSidebar(): void {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const mql = window.matchMedia('(min-width: 768px)');

  // モバイル幅で閉じている間は画面外のサイドバーにフォーカスやスクリーンリーダーが入らないよう inert にする
  function syncInert() {
    if (!sidebar) return;
    const isOpen = toggle?.getAttribute('aria-expanded') === 'true';
    sidebar.inert = !mql.matches && !isOpen;
    // モバイルで開いている間は、背後のコンテンツ（トグル以外）にフォーカスやスクリーンリーダーが届かないようにする
    const backgroundInert = !mql.matches && isOpen;
    document
      .querySelectorAll<HTMLElement>(
        'main, body > a[href="#main-content"], header > :not(#sidebar-toggle)',
      )
      .forEach((el) => {
        el.inert = backgroundInert;
      });
  }

  function openSidebar() {
    sidebar?.classList.remove('-translate-x-full');
    sidebar?.classList.add('translate-x-0');
    overlay?.classList.remove('hidden');
    toggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('overflow-hidden');
    syncInert();
    sidebar?.focus({ preventScroll: true });
  }

  function closeSidebar() {
    // inert 化でフォーカスが外れる前に、サイドバー内にあったかを控える
    const hadFocus = !!sidebar?.contains(document.activeElement);
    sidebar?.classList.add('-translate-x-full');
    sidebar?.classList.remove('translate-x-0');
    overlay?.classList.add('hidden');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('overflow-hidden');
    syncInert();
    // サイドバー内にフォーカスがあった場合のみトグルボタンへ戻す
    if (hadFocus && !mql.matches) toggle?.focus();
  }

  toggle?.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay?.addEventListener('click', () => {
    closeSidebar();
    toggle?.focus();
  });

  document.addEventListener('keydown', (event) => {
    // 開いているときだけ閉じる（閉じているときの Escape で他の処理を邪魔しない）
    if (
      event.key === 'Escape' &&
      toggle?.getAttribute('aria-expanded') === 'true'
    ) {
      closeSidebar();
    }
  });

  mql.addEventListener('change', (event) => {
    // 縮小して sidebar が inert になると、フォーカスが失われて body に落ちるため、先にトグルへ退避する
    const hadFocus = !!sidebar?.contains(document.activeElement);
    if (event.matches) {
      closeSidebar();
    }
    syncInert();
    if (hadFocus && !event.matches) toggle?.focus();
  });
  syncInert();
}

type Theme = 'light' | 'dark' | 'system';
const THEME_KEY = 'theme';

export function initTheme(): void {
  const themeButtons = document.querySelectorAll<HTMLButtonElement>(
    '[data-theme-option]',
  );
  const darkMql = window.matchMedia('(prefers-color-scheme: dark)');

  function getStoredTheme(): Theme {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // localStorageが使えない環境は無視してシステム設定に従う
    }
    return 'system';
  }

  function applyTheme(theme: Theme) {
    const isDark = theme === 'dark' || (theme === 'system' && darkMql.matches);
    document.documentElement.classList.toggle('dark', isDark);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', isDark ? '#030712' : '#f9fafb');
    themeButtons.forEach((button) => {
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.themeOption === theme),
      );
    });
  }

  function setTheme(theme: Theme) {
    try {
      if (theme === 'system') {
        localStorage.removeItem(THEME_KEY);
      } else {
        localStorage.setItem(THEME_KEY, theme);
      }
    } catch {
      // localStorageが使えない環境では保存せず今回の表示だけ反映する
    }
    applyTheme(theme);
  }

  applyTheme(getStoredTheme());

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setTheme(button.dataset.themeOption as Theme);
    });
  });

  darkMql.addEventListener('change', () => {
    if (getStoredTheme() === 'system') {
      applyTheme('system');
    }
  });

  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  themeToggleMobile?.addEventListener('click', () => {
    const next = document.documentElement.classList.contains('dark')
      ? 'light'
      : 'dark';
    setTheme(next);
  });
}

const SIDEBAR_OPEN_CATEGORIES_KEY = 'sidebar-open-categories';

const SIDEBAR_SCROLL_KEY = 'sidebar-scroll-top';

/** ページ遷移でサイドバーのスクロール位置が先頭に戻らないよう、離脱時に保存し再描画後に復元する */
export function initSidebarScroll(): void {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  try {
    // お気に入りリスト描画などで高さが変わった後に、位置を再適用する
    const top = Number(sessionStorage.getItem(SIDEBAR_SCROLL_KEY));
    if (top > 0) sidebar.scrollTop = top;
  } catch {
    // sessionStorageが使えない場合は無視する
  }
  window.addEventListener('pagehide', () => {
    try {
      sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(sidebar.scrollTop));
    } catch {
      // 保存できない場合は無視する
    }
  });
}

export function initCategoryPersistence(): void {
  // 開閉状態の初回復元は、展開チラつきを防ぐため Layout.astro 内の
  // 同期インラインスクリプトが初回ペイント前に行う。ここではトグル時の保存のみ担う。
  const categoryDetails = document.querySelectorAll<HTMLDetailsElement>(
    'nav details[data-category]',
  );

  function saveOpenCategories() {
    try {
      const open = Array.from(categoryDetails)
        .filter((el) => el.open)
        .map((el) => el.dataset.category);
      localStorage.setItem(SIDEBAR_OPEN_CATEGORIES_KEY, JSON.stringify(open));
    } catch {
      // localStorageが使えない環境では保存せず今回の表示だけ反映する
    }
  }

  categoryDetails.forEach((el) => {
    el.addEventListener('toggle', saveOpenCategories);
  });
}
