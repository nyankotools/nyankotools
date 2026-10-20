(function () {
  try {
    const stored = localStorage.getItem('theme');
    const theme = stored === 'light' || stored === 'dark' ? stored : 'system';
    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', isDark ? '#030712' : '#f9fafb');
  } catch {
    // localStorageが使えない環境では初期表示はライトのままにする
  }
  try {
    // PC幅のサイドバー開閉状態を初回描画前に反映する（ちらつき防止）
    if (localStorage.getItem('sidebar-collapsed') === '1') {
      document.documentElement.classList.add('sidebar-collapsed');
    }
  } catch {
    // 保存できない環境では開いた状態にする
  }
})();
