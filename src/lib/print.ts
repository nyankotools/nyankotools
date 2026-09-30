/**
 * 印刷の準備・後始末。
 * - ライトテーマ: ダークテーマの淡い文字色のまま印刷すると読めなくなるため、印刷中だけ `dark` を外す。
 *   テーマの保存値（localStorage）には触れない。
 * - FAQ など閉じた `<details>` は、印刷中だけ開いて中身も印刷する。
 * `afterprint` が来ない環境に備えて、`matchMedia('print')` の変化でも元に戻す。
 */
export function initPrint(): void {
  const root = document.documentElement;
  let restoreDark = false;
  let opened: HTMLDetailsElement[] = [];
  let printing = false;

  function before() {
    if (printing) return;
    printing = true;
    restoreDark = root.classList.contains('dark');
    root.classList.remove('dark');
    opened = Array.from(
      document.querySelectorAll<HTMLDetailsElement>(
        '[data-tool-page] details:not([open])',
      ),
    );
    opened.forEach((d) => d.setAttribute('open', ''));
  }

  function after() {
    if (!printing) return;
    printing = false;
    if (restoreDark) root.classList.add('dark');
    restoreDark = false;
    opened.forEach((d) => d.removeAttribute('open'));
    opened = [];
  }

  window.addEventListener('beforeprint', before);
  window.addEventListener('afterprint', after);
  const query = window.matchMedia?.('print');
  query?.addEventListener?.('change', (e) => (e.matches ? before() : after()));
}
