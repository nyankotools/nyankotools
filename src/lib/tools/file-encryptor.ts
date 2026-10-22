import { PBKDF2_ITERATIONS, deriveKey } from './crypto-encryptor';

export { PBKDF2_ITERATIONS };

/** 1ファイルあたりの上限（入力と出力の両方をメモリに保持するため） */
export const MAX_FILE_SIZE = 512 * 1024 * 1024;

/** 暗号化時の平文チャンクサイズ */
export const CHUNK_SIZE = 1024 * 1024;

const MAGIC = [0x4e, 0x59, 0x45, 0x46]; // "NYEF"
const VERSION = 1;
const SALT_LENGTH = 16;
const NONCE_PREFIX_LENGTH = 7;
const TAG_LENGTH = 16;
/** マジック(4) + バージョン(1) + チャンクサイズ(4) + メタ長(2) + ソルト(16) + ノンス接頭辞(7) */
const HEADER_LENGTH = 4 + 1 + 4 + 2 + SALT_LENGTH + NONCE_PREFIX_LENGTH;
const MIN_CHUNK_SIZE = 1024;
const MAX_CHUNK_SIZE = 64 * 1024 * 1024;
const MAX_META_LENGTH = 4096;
const MAX_NAME_LENGTH = 200;
const MAX_TYPE_LENGTH = 100;

export type FileEncryptError =
  'invalid-format' | 'wrong-password' | 'truncated' | 'corrupted' | 'too-large';

export type DecryptFileResult =
  | { success: true; blob: Blob; name: string; type: string }
  | { success: false; error: FileEncryptError };

export type ProgressCallback = (done: number, total: number) => void;

interface FileMeta {
  name: string;
  type: string;
}

/** チャンクごとのノンス: 接頭辞(7) + チャンク番号(4, BE) + 最終フラグ(1) */
function makeNonce(
  prefix: Uint8Array,
  index: number,
  final: boolean,
): Uint8Array<ArrayBuffer> {
  const nonce = new Uint8Array(12);
  nonce.set(prefix, 0);
  new DataView(nonce.buffer).setUint32(NONCE_PREFIX_LENGTH, index, false);
  nonce[11] = final ? 1 : 0;
  return nonce;
}

function buildHeader(
  chunkSize: number,
  metaLength: number,
  salt: Uint8Array,
  prefix: Uint8Array,
): Uint8Array<ArrayBuffer> {
  const header = new Uint8Array(HEADER_LENGTH);
  const view = new DataView(header.buffer);
  header.set(MAGIC, 0);
  header[4] = VERSION;
  view.setUint32(5, chunkSize, false);
  view.setUint16(9, metaLength, false);
  header.set(salt, 11);
  header.set(prefix, 11 + SALT_LENGTH);
  return header;
}

async function readRange(
  blob: Blob,
  start: number,
  end: number,
): Promise<Uint8Array<ArrayBuffer>> {
  return new Uint8Array(await blob.slice(start, end).arrayBuffer());
}

/** 描画更新の機会を与える */
const yieldToUi = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/**
 * ファイルをパスワードでAES-256-GCM暗号化する（チャンクごとに独立して暗号化するSTREAM構成）。
 * 形式: ヘッダ(34) + メタ情報チャンク + データチャンク…。ヘッダは全チャンクの認証データに含める。
 * 最終チャンクのみノンスに最終フラグを立てるので、末尾の切り詰め・入れ替えを検出できる。
 */
export async function encryptFile(
  file: Blob,
  name: string,
  password: string,
  onProgress?: ProgressCallback,
): Promise<Blob> {
  if (file.size > MAX_FILE_SIZE) throw new RangeError('file-too-large');
  const meta: FileMeta = {
    name: name.slice(0, MAX_NAME_LENGTH),
    type: (file.type ?? '').slice(0, MAX_TYPE_LENGTH),
  };
  const metaBytes = new TextEncoder().encode(JSON.stringify(meta));
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const prefix = crypto.getRandomValues(new Uint8Array(NONCE_PREFIX_LENGTH));
  const header = buildHeader(CHUNK_SIZE, metaBytes.length, salt, prefix);
  const key = await deriveKey(password, salt, 'encrypt');

  const encryptChunk = async (
    data: Uint8Array<ArrayBuffer>,
    index: number,
    final: boolean,
  ) =>
    new Uint8Array(
      await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: makeNonce(prefix, index, final),
          additionalData: header,
        },
        key,
        data,
      ),
    );

  const parts: Uint8Array<ArrayBuffer>[] = [header];
  parts.push(await encryptChunk(new Uint8Array(metaBytes), 0, false));
  let offset = 0;
  let index = 1;
  do {
    const end = Math.min(offset + CHUNK_SIZE, file.size);
    const final = end >= file.size;
    parts.push(
      await encryptChunk(await readRange(file, offset, end), index, final),
    );
    offset = end;
    index++;
    onProgress?.(offset, file.size);
    await yieldToUi();
  } while (offset < file.size);
  return new Blob(parts, { type: 'application/octet-stream' });
}

/** `encryptFile` の出力を復号し、元のファイル名・MIMEタイプとともに返す */
export async function decryptFile(
  encrypted: Blob,
  password: string,
  onProgress?: ProgressCallback,
): Promise<DecryptFileResult> {
  const fail = (error: FileEncryptError): DecryptFileResult => ({
    success: false,
    error,
  });
  if (encrypted.size > MAX_FILE_SIZE + MAX_META_LENGTH + 1024 * 1024) {
    return fail('too-large');
  }
  if (encrypted.size < HEADER_LENGTH) return fail('invalid-format');
  const header = await readRange(encrypted, 0, HEADER_LENGTH);
  const view = new DataView(header.buffer);
  const chunkSize = view.getUint32(5, false);
  const metaLength = view.getUint16(9, false);
  if (
    !MAGIC.every((b, i) => header[i] === b) ||
    header[4] !== VERSION ||
    chunkSize < MIN_CHUNK_SIZE ||
    chunkSize > MAX_CHUNK_SIZE ||
    metaLength > MAX_META_LENGTH
  ) {
    return fail('invalid-format');
  }
  const salt = header.slice(11, 11 + SALT_LENGTH);
  const prefix = header.slice(11 + SALT_LENGTH, HEADER_LENGTH);
  const metaEnd = HEADER_LENGTH + metaLength + TAG_LENGTH;
  if (encrypted.size < metaEnd + TAG_LENGTH) return fail('truncated');

  const key = await deriveKey(password, salt, 'decrypt');
  const decryptChunk = async (
    data: Uint8Array<ArrayBuffer>,
    index: number,
    final: boolean,
  ) =>
    new Uint8Array(
      await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: makeNonce(prefix, index, final),
          additionalData: header,
        },
        key,
        data,
      ),
    );

  let meta: FileMeta;
  try {
    const metaPlain = await decryptChunk(
      await readRange(encrypted, HEADER_LENGTH, metaEnd),
      0,
      false,
    );
    const parsed = JSON.parse(new TextDecoder().decode(metaPlain));
    meta = {
      name: typeof parsed.name === 'string' ? parsed.name : '',
      type: typeof parsed.type === 'string' ? parsed.type : '',
    };
  } catch {
    return fail('wrong-password');
  }

  const cipherChunkSize = chunkSize + TAG_LENGTH;
  const dataLength = encrypted.size - metaEnd;
  const chunkCount = Math.ceil(dataLength / cipherChunkSize);
  const parts: Uint8Array<ArrayBuffer>[] = [];
  for (let i = 0; i < chunkCount; i++) {
    const start = metaEnd + i * cipherChunkSize;
    const end = Math.min(start + cipherChunkSize, encrypted.size);
    const last = i === chunkCount - 1;
    const data = await readRange(encrypted, start, end);
    try {
      parts.push(await decryptChunk(data, i + 1, last));
    } catch {
      if (last) {
        // 最終フラグなしで復号できるなら、後続のチャンクが失われている
        try {
          await decryptChunk(data, i + 1, false);
          return fail('truncated');
        } catch {
          // 改ざん・破損
        }
      }
      return fail('corrupted');
    }
    onProgress?.(end - metaEnd, dataLength);
    await yieldToUi();
  }
  return {
    success: true,
    blob: new Blob(parts, { type: meta.type }),
    name: sanitizeFileName(meta.name),
    type: meta.type,
  };
}

/** 暗号化ファイルの保存名（拡張子 `.enc` を付ける） */
export function encryptedFileName(name: string): string {
  return `${name || 'file'}.enc`;
}

/** 復号したファイル名から、パス区切りや保存に使えない文字を除く */
export function sanitizeFileName(name: string): string {
  const cleaned = name
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069\\/:*?"<>|]/g, '_')
    .replace(/[. ]+$/, '')
    .trim();
  return cleaned === '' ? 'decrypted-file' : cleaned;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
