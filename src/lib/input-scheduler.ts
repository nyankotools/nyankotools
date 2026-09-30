/** これ以上の長さの入力は、キー入力のたびに処理せず、入力が落ち着いてから処理する */
export const LARGE_INPUT_LENGTH = 20_000;
/** 大きな入力の処理を遅らせる時間（ms） */
export const LARGE_INPUT_DELAY_MS = 250;

/**
 * 入力欄の `input` イベントに処理を登録する。
 * 通常サイズの入力は即時に処理し（従来と同じ挙動）、巨大な入力（数MBの貼り付けなど）だけを
 * デバウンスして、キー入力ごとの再計算でUIが固まるのを避ける。
 * クリア・貼り付け・サンプル入力が発火する `input` イベントも同じ経路を通る。
 */
export function onTextInput(
  el: HTMLInputElement | HTMLTextAreaElement,
  handler: () => void,
  options: { threshold?: number; delay?: number } = {},
): void {
  const threshold = options.threshold ?? LARGE_INPUT_LENGTH;
  const delay = options.delay ?? LARGE_INPUT_DELAY_MS;
  let timer: ReturnType<typeof setTimeout> | undefined;

  el.addEventListener('input', () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
    if (el.value.length < threshold) {
      handler();
      return;
    }
    timer = setTimeout(() => {
      timer = undefined;
      handler();
    }, delay);
  });
}
