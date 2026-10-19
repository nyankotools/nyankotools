import { loadPdfjs } from './pdfjs-loader';

/**
 * PDFツールが使う重いライブラリを先読みする。ファイル選択ダイアログを開いた時点（enableFileDrop の onIntent）で
 * 呼び、選択完了後すぐ「実行」を押されても読み込みが間に合うようにする。失敗しても実処理側で再試行されるため握りつぶす。
 */
export function preloadPdfLibs(use: { pdfLib?: boolean; pdfjs?: boolean }) {
  if (use.pdfLib) void import('pdf-lib').catch(() => {});
  if (use.pdfjs) void loadPdfjs().catch(() => {});
}
