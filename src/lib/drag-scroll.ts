const DRAG_THRESHOLD_PX = 5;

/** マウスのドラッグで横スクロールできるようにする（タッチはブラウザ標準のスクロールに任せる） */
export function enableDragScroll(el: HTMLElement): void {
  let startX = 0;
  let startScroll = 0;
  let pointerId: number | null = null;
  let dragging = false;

  el.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScroll = el.scrollLeft;
    dragging = false;
  });

  el.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointerId) return;
    const dx = event.clientX - startX;
    if (!dragging && Math.abs(dx) < DRAG_THRESHOLD_PX) return;
    if (!dragging) {
      dragging = true;
      // ドラッグ開始後にキャプチャして、要素の外へ出てもスクロールを続ける
      el.setPointerCapture(event.pointerId);
      el.classList.add('cursor-grabbing');
    }
    el.scrollLeft = startScroll - dx;
  });

  const end = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    pointerId = null;
    el.classList.remove('cursor-grabbing');
    // 直後のclickを打ち消した後、clickが来なくてもフラグが残らないようにする
    setTimeout(() => {
      dragging = false;
    }, 0);
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);

  // ドラッグ直後のクリック（ボタンの誤選択）を打ち消す
  el.addEventListener(
    'click',
    (event) => {
      if (dragging) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true,
  );
}

const FADE_PX = 32;

/** 横にスクロールできる側の端を薄くぼかし、続きがあることを示す */
export function enableScrollFade(el: HTMLElement): void {
  const update = () => {
    const max = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft > 1 ? FADE_PX : 0;
    const right = el.scrollLeft < max - 1 ? FADE_PX : 0;
    const mask =
      left || right
        ? `linear-gradient(to right, transparent, #000 ${left}px, #000 calc(100% - ${right}px), transparent)`
        : '';
    el.style.maskImage = mask;
    el.style.webkitMaskImage = mask;
  };
  el.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(el);
  update();
}
