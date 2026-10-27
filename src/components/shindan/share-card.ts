/**
 * 共有カード画像をブラウザ内で作る（結果を表示したときに動的importで読み込む）。
 * フォントは fontsource の文字サブセット（unicode-range）なので、カードに載る文字を含むファイルだけが読み込まれる（16.7 #7）。
 */
import '@fontsource/m-plus-rounded-1c/500.css';
import '@fontsource/m-plus-rounded-1c/800.css';
import {
  CARD_SIZES,
  cardText,
  drawCard,
  type CardData,
  type CardShape,
} from '../../lib/shindan/card';

const FONT_FAMILY = '"M PLUS Rounded 1c"';
/** フォントの読み込みを待つ上限。超えたら代替フォントで描く */
const FONT_TIMEOUT_MS = 3000;

const images = new Map<string, Promise<HTMLImageElement>>();

function loadImage(src: string): Promise<HTMLImageElement> {
  let promise = images.get(src);
  if (!promise) {
    const img = new Image();
    img.src = src;
    promise = img.decode().then(() => img);
    // 失敗したら次回やり直せるようにする
    promise.catch(() => images.delete(src));
    images.set(src, promise);
  }
  return promise;
}

async function loadFonts(text: string): Promise<void> {
  const loads = Promise.all(
    [500, 800].map((weight) =>
      document.fonts.load(`${weight} 32px ${FONT_FAMILY}`, text),
    ),
  );
  let timer: number | undefined;
  const timeout = new Promise((resolve) => {
    timer = window.setTimeout(resolve, FONT_TIMEOUT_MS);
  });
  try {
    await Promise.race([loads, timeout]);
  } catch {
    // 読み込めなくても代替フォントで描く
  } finally {
    window.clearTimeout(timer);
  }
}

/** カードをPNGにする */
export async function renderCard(
  shape: CardShape,
  data: CardData,
  imageSrc: string,
): Promise<Blob> {
  const [image] = await Promise.all([
    loadImage(imageSrc),
    loadFonts(cardText(data)),
  ]);
  const { width, height } = CARD_SIZES[shape];
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d unavailable');
  drawCard(ctx, shape, data, image);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/png',
    ),
  );
}
