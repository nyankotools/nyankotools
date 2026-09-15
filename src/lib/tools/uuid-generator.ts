export interface UuidGeneratorOptions {
  /** 生成する個数（1〜100） */
  count: number;
  /** true の場合ハイフンを除去する */
  removeHyphens?: boolean;
  /** true の場合大文字に変換する */
  uppercase?: boolean;
}

const MIN_COUNT = 1;
const MAX_COUNT = 100;

export function clampUuidCount(count: number): number {
  if (!Number.isFinite(count)) return MIN_COUNT;
  return Math.min(Math.max(Math.trunc(count), MIN_COUNT), MAX_COUNT);
}

function formatUuid(uuid: string, options: UuidGeneratorOptions): string {
  let result = options.removeHyphens ? uuid.replace(/-/g, '') : uuid;
  if (options.uppercase) result = result.toUpperCase();
  return result;
}

/** UUID v4 (RFC 4122) を指定した個数・形式で生成する */
export function generateUuids(options: UuidGeneratorOptions): string[] {
  const count = clampUuidCount(options.count);
  return Array.from({ length: count }, () =>
    formatUuid(crypto.randomUUID(), options),
  );
}
