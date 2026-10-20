import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

let loading: Promise<typeof import('pdfjs-dist/legacy/build/pdf.mjs')> | null =
  null;

/** pdf.js は大きいため、PDFを実際に開くときに初めて読み込む（ページ初期表示のJSを小さく保つ） */
export function loadPdfjs() {
  loading ??= import('pdfjs-dist/legacy/build/pdf.mjs')
    .then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      return pdfjs;
    })
    .catch((e) => {
      // 一時的な読み込み失敗（オフライン等）を保持し続けず、次回の呼び出しで再試行できるようにする
      loading = null;
      throw e;
    });
  return loading;
}
