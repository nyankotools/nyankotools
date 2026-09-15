import qrcode from 'qrcode-generator';

// 既定のバイト変換はASCII以外を正しく扱えないため、日本語などマルチバイト文字にも対応できるようUTF-8変換に差し替える
qrcode.stringToBytes = (text: string) =>
  Array.from(new TextEncoder().encode(text));

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface ErrorCorrectionLevelOption {
  value: ErrorCorrectionLevel;
  label: string;
}

export const ERROR_CORRECTION_LEVEL_OPTIONS: ErrorCorrectionLevelOption[] = [
  { value: 'L', label: '低（約7%復元）' },
  { value: 'M', label: '中（約15%復元）' },
  { value: 'Q', label: '高（約25%復元）' },
  { value: 'H', label: '最高（約30%復元）' },
];

export interface QrMatrix {
  moduleCount: number;
  isDark: (row: number, col: number) => boolean;
}

export type QrGenerateResult =
  { ok: true; matrix: QrMatrix } | { ok: false; message: string };

/** テキストからQRコードのモジュール（白黒マス）情報を生成する */
export function generateQrMatrix(
  text: string,
  errorCorrectionLevel: ErrorCorrectionLevel = 'M',
): QrGenerateResult {
  if (text === '') {
    return { ok: false, message: 'テキストを入力してください。' };
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
    return {
      ok: false,
      message:
        '入力内容が長すぎるため、QRコードを生成できません。文字数を減らすか、誤り訂正レベルを下げてください。',
    };
  }
}
