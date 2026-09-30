/**
 * 印刷の間だけライトテーマにする（ダークテーマの淡い文字色のまま印刷すると読めなくなるため）。
 * 印刷後はテーマを元に戻す。テーマの保存値（localStorage）には触れない。
 */
export function initPrint(): void {
  const root = document.documentElement;
  let restoreDark = false;

  window.addEventListener('beforeprint', () => {
    restoreDark = root.classList.contains('dark');
    root.classList.remove('dark');
  });
  window.addEventListener('afterprint', () => {
    if (restoreDark) root.classList.add('dark');
    restoreDark = false;
  });
}
