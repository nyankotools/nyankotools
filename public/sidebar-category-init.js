(function () {
  try {
    const raw = localStorage.getItem('sidebar-open-categories');
    if (!raw) return;
    const stored = new Set(JSON.parse(raw));
    document.querySelectorAll('nav details[data-category]').forEach((el) => {
      if (!el.open && el.dataset.category && stored.has(el.dataset.category)) {
        el.open = true;
      }
    });
  } catch {
    // localStorageが使えない、または保存内容が壊れている場合は無視する
  }
})();
