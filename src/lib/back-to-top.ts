/** スクロール量がこの値（px）を超えたら「ページ先頭に戻る」ボタンを表示する。 */
export const BACK_TO_TOP_THRESHOLD = 400;

export function shouldShowBackToTop(scrollY: number): boolean {
  return scrollY > BACK_TO_TOP_THRESHOLD;
}

export function initBackToTop(): void {
  const button = document.getElementById('back-to-top');
  if (!button) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    button.hidden = !shouldShowBackToTop(window.scrollY);
  };
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();

  button.addEventListener('click', () => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
}
