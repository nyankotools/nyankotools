(function () {
  try {
    const raw = localStorage.getItem('sidebar-open-categories');
    if (raw) {
      const stored = new Set(JSON.parse(raw));
      document.querySelectorAll('nav details[data-category]').forEach((el) => {
        if (
          !el.open &&
          el.dataset.category &&
          stored.has(el.dataset.category)
        ) {
          el.open = true;
        }
      });
    }
  } catch {
    // localStorageが使えない、または保存内容が壊れている場合は無視する
  }
  try {
    // お気に入り欄の開閉状態を復元する（既定は開。保存は favorites-ui.ts）
    if (localStorage.getItem('sidebar-favorites-open') === '0') {
      document.getElementById('sidebar-favorites').open = false;
    }
  } catch {
    // localStorageが使えない場合は既定（開）のままにする
  }
  try {
    // お気に入り欄は描画がモジュールJS（initFavorites）待ちで、初回ペイント後に下のリストが押し下げられて
    // ちらつくため、登録数ぶんの高さを持つプレースホルダーを先に表示しておく（実描画時に置き換わる）。
    // 高さは favorites-ui.ts の行（並び替えボタン p-3 + アイコン h-4 = 40px）に合わせている。
    const favRaw = localStorage.getItem('favorite-tools');
    const parsed = favRaw ? JSON.parse(favRaw) : [];
    // 非文字列は favorites.ts の読み込み時に除外されるため、件数もそれに合わせる
    const favorites = Array.isArray(parsed)
      ? parsed.filter((s) => typeof s === 'string')
      : [];
    const section = document.getElementById('sidebar-favorites-list');
    if (favorites.length > 0 && section) {
      // 前ページで描画済みのお気に入り欄HTML（favorites-ui.ts が保存）が、現在のお気に入りと一致すれば
      // そのまま復元する。中身まで同じなので、実描画に置き換わっても見た目が変わらない。
      // 一致しない場合は高さだけ確保するプレースホルダーにする。
      let cached = null;
      try {
        const lang = document.documentElement.lang === 'en' ? 'en' : 'ja';
        const saved = JSON.parse(
          localStorage.getItem('sidebar-favorites-html:' + lang),
        );
        const key = favorites.join(',');
        if (saved && saved.key === key && typeof saved.html === 'string') {
          cached = saved.html;
        }
      } catch {
        // 壊れたキャッシュは無視してプレースホルダーにする
      }
      if (cached !== null) {
        section.innerHTML = cached;
        // キャッシュは別ページで作られたため、現在のページに合わせて現在地表示を付け替える
        section.querySelectorAll('a[aria-current]').forEach((a) => {
          a.removeAttribute('aria-current');
        });
        section
          .querySelectorAll('a[href="' + location.pathname + '"]')
          .forEach((a) => {
            a.setAttribute('aria-current', 'page');
          });
      } else {
        for (let i = 0; i < favorites.length; i++) {
          const li = document.createElement('li');
          li.setAttribute('aria-hidden', 'true');
          li.style.height = '40px';
          section.appendChild(li);
        }
      }
      document.getElementById('sidebar-favorites').hidden = false;
    }
  } catch {
    // localStorageが使えない、または保存内容が壊れている場合は無視する
  }
  try {
    // ページ遷移前のサイドバーのスクロール位置を復元する（保存は layout-nav.ts の initSidebarScroll）
    const top = Number(sessionStorage.getItem('sidebar-scroll-top'));
    const sidebar = document.getElementById('sidebar');
    if (sidebar && top > 0) sidebar.scrollTop = top;
  } catch {
    // sessionStorageが使えない場合は無視する
  }
})();
