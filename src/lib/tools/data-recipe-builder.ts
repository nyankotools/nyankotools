import { md5Hex } from './hash-generator';
import { escapeHtml, unescapeHtml } from './html-escape';
import { escapeUnicode, unescapeUnicode } from './unicode-escape';

export const RECIPE_OPS = [
  'base64-encode',
  'base64-decode',
  'url-encode',
  'url-decode',
  'hex-encode',
  'hex-decode',
  'html-escape',
  'html-unescape',
  'unicode-escape',
  'unicode-unescape',
  'md5',
  'sha1',
  'sha256',
  'sha512',
  'rot13',
  'reverse',
  'uppercase',
  'lowercase',
] as const;

export type RecipeOp = (typeof RECIPE_OPS)[number];

export const MAX_RECIPE_STEPS = 20;

export function isRecipeOp(value: string): value is RecipeOp {
  return (RECIPE_OPS as readonly string[]).includes(value);
}

export type RecipeFailureReason = 'invalid-input' | 'unsupported';

export type RecipeResult =
  | { success: true; output: Uint8Array; outputs: Uint8Array[] }
  | {
      success: false;
      /** 失敗した手順の添字（0始まり） */
      step: number;
      reason: RecipeFailureReason;
      /** 失敗した手順より前までの各手順の出力 */
      outputs: Uint8Array[];
    };

class StepError extends Error {
  constructor(readonly reason: RecipeFailureReason) {
    super(reason);
  }
}

const encoder = new TextEncoder();

function toText(bytes: Uint8Array): string {
  return new TextDecoder('utf-8').decode(bytes);
}

function toBytes(text: string): Uint8Array {
  return encoder.encode(text);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/** 標準Base64・Base64URL・改行/空白入りを受け付けて復号する */
function base64ToBytes(text: string): Uint8Array {
  let s = text.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
  s = s.replace(/=+$/, '');
  if (s.length % 4 === 1 || !/^[A-Za-z0-9+/]*$/.test(s)) {
    throw new StepError('invalid-input');
  }
  s += '='.repeat((4 - (s.length % 4)) % 4);
  const binary = atob(s);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

/** `48 65`・`0x48,0x65`・`4865` のような16進数表記を復号する */
function hexToBytes(text: string): Uint8Array {
  const s = text.replace(/0x/gi, '').replace(/[\s,:]+/g, '');
  if (s.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(s)) {
    throw new StepError('invalid-input');
  }
  const bytes = new Uint8Array(s.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(s.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function rot13(text: string): string {
  return text.replace(/[A-Za-z]/g, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + 13) % 26) + base);
  });
}

async function digest(
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512',
  bytes: Uint8Array,
): Promise<Uint8Array> {
  if (!globalThis.crypto?.subtle) throw new StepError('unsupported');
  const copy = new Uint8Array(bytes);
  return new Uint8Array(await crypto.subtle.digest(algorithm, copy));
}

async function applyOp(op: RecipeOp, bytes: Uint8Array): Promise<Uint8Array> {
  switch (op) {
    case 'base64-encode':
      return toBytes(bytesToBase64(bytes));
    case 'base64-decode':
      return base64ToBytes(toText(bytes));
    case 'url-encode':
      return toBytes(encodeURIComponent(toText(bytes)));
    case 'url-decode':
      return toBytes(decodeURIComponent(toText(bytes)));
    case 'hex-encode':
      return toBytes(bytesToHex(bytes));
    case 'hex-decode':
      return hexToBytes(toText(bytes));
    case 'html-escape':
      return toBytes(escapeHtml(toText(bytes)));
    case 'html-unescape':
      return toBytes(unescapeHtml(toText(bytes)));
    case 'unicode-escape':
      return toBytes(
        escapeUnicode(toText(bytes), {
          format: 'js',
          scope: 'non-ascii',
          uppercase: false,
        }),
      );
    case 'unicode-unescape':
      return toBytes(unescapeUnicode(toText(bytes)));
    case 'md5':
      return toBytes(md5Hex(bytes));
    case 'sha1':
      return toBytes(bytesToHex(await digest('SHA-1', bytes)));
    case 'sha256':
      return toBytes(bytesToHex(await digest('SHA-256', bytes)));
    case 'sha512':
      return toBytes(bytesToHex(await digest('SHA-512', bytes)));
    case 'rot13':
      return toBytes(rot13(toText(bytes)));
    case 'reverse':
      return toBytes(Array.from(toText(bytes)).reverse().join(''));
    case 'uppercase':
      return toBytes(toText(bytes).toUpperCase());
    case 'lowercase':
      return toBytes(toText(bytes).toLowerCase());
  }
}

/**
 * 入力テキストに対して手順を上から順に適用する。
 * 手順間の受け渡しはバイト列で行うため、「Base64デコード → 16進数」のように
 * UTF-8テキストとして読めない中間結果も扱える。
 */
export async function runRecipe(
  input: string,
  steps: readonly RecipeOp[],
): Promise<RecipeResult> {
  let current: Uint8Array = toBytes(input);
  const outputs: Uint8Array[] = [];
  for (let i = 0; i < steps.length; i++) {
    try {
      current = await applyOp(steps[i], current);
    } catch (e) {
      return {
        success: false,
        step: i,
        reason: e instanceof StepError ? e.reason : 'invalid-input',
        outputs,
      };
    }
    outputs.push(current);
  }
  return { success: true, output: current, outputs };
}

/** バイト列がUTF-8として正しく読めるか */
export function isValidUtf8(bytes: Uint8Array): boolean {
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return true;
  } catch {
    return false;
  }
}

/** 表示用にバイト列をテキストへ変換する（UTF-8として不正な部分は � になる） */
export function bytesToDisplayText(bytes: Uint8Array): string {
  return toText(bytes);
}
