import qrcode from 'qrcode-generator';

// 既定のバイト変換はASCII以外を正しく扱えないため、日本語などマルチバイト文字にも対応できるようUTF-8変換に差し替える
qrcode.stringToBytes = (text: string) =>
  Array.from(new TextEncoder().encode(text));

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrMatrix {
  moduleCount: number;
  isDark: (row: number, col: number) => boolean;
}

export type QrGenerateResult =
  { ok: true; matrix: QrMatrix } | { ok: false; reason: 'empty' | 'too-long' };

/** テキストからQRコードのモジュール（白黒マス）情報を生成する */
export function generateQrMatrix(
  text: string,
  errorCorrectionLevel: ErrorCorrectionLevel = 'M',
): QrGenerateResult {
  if (text === '') {
    return { ok: false, reason: 'empty' };
  }

  try {
    const qr = qrcode(0, errorCorrectionLevel);
    qr.addData(text);
    qr.make();
    const moduleCount = qr.getModuleCount();
    return {
      ok: true,
      matrix: {
        moduleCount,
        isDark: (row, col) => qr.isDark(row, col),
      },
    };
  } catch {
    return { ok: false, reason: 'too-long' };
  }
}
