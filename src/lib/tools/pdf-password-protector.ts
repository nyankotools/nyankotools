import { getPageCount } from './pdf-merge-split';

export type PasswordErrorCode = 'noPassword' | 'encryptFailed';

export class PasswordToolError extends Error {
  code: PasswordErrorCode;
  constructor(code: PasswordErrorCode) {
    super(code);
    this.code = code;
  }
}

export interface EncryptOptions {
  /** PDFを開くためのパスワード（必須） */
  userPassword: string;
  /** 制限を変更するためのパスワード。空の場合はランダム値を使う */
  ownerPassword: string;
  allowPrint: boolean;
  allowCopy: boolean;
  allowModify: boolean;
}

/** qpdf-wasm のうち、暗号化に使う最小限のインターフェース（テストで差し替えられるようにする） */
export interface QpdfRunner {
  callMain: (args: string[]) => number;
  FS: {
    writeFile: (path: string, data: Uint8Array) => void;
    readFile: (path: string) => Uint8Array;
  };
}

const INPUT_PATH = '/input.pdf';
const OUTPUT_PATH = '/output.pdf';

/** 暗号学的乱数から、オーナーパスワード用の英数字16文字を作る */
export function randomOwnerPassword(): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

/** qpdf の引数（AES-256）を組み立てる */
export function buildQpdfArgs(options: EncryptOptions): string[] {
  if (options.userPassword === '') throw new PasswordToolError('noPassword');
  const owner =
    options.ownerPassword === ''
      ? randomOwnerPassword()
      : options.ownerPassword;
  return [
    '--encrypt',
    options.userPassword,
    owner,
    '256',
    `--print=${options.allowPrint ? 'full' : 'none'}`,
    `--extract=${options.allowCopy ? 'y' : 'n'}`,
    `--modify=${options.allowModify ? 'all' : 'none'}`,
    '--',
    INPUT_PATH,
    OUTPUT_PATH,
  ];
}

/** PDFにAES-256でパスワードを設定する。暗号化済み・破損PDFは PdfToolError */
export async function encryptPdf(
  bytes: Uint8Array,
  options: EncryptOptions,
  qpdf: QpdfRunner,
): Promise<Uint8Array> {
  const args = buildQpdfArgs(options);
  await getPageCount(bytes);
  qpdf.FS.writeFile(INPUT_PATH, bytes);
  let code: number;
  try {
    code = qpdf.callMain(args);
  } catch {
    throw new PasswordToolError('encryptFailed');
  }
  // 0=成功、3=警告つき成功
  if (code !== 0 && code !== 3) throw new PasswordToolError('encryptFailed');
  return qpdf.FS.readFile(OUTPUT_PATH);
}

/** 出力ファイル名（例: doc.pdf → doc_protected.pdf） */
export function protectedFileName(name: string): string {
  const base = name.replace(/\.pdf$/i, '') || 'document';
  return `${base}_protected.pdf`;
}
