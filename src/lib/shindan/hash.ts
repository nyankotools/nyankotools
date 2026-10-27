/**
 * 診断用の決定論的ハッシュ。暗号強度は不要。
 * 実装を変えると全員の結果が変わるため、変更時は ENGINE_VERSION を上げて旧実装を残すこと。
 */

/** cyrb53（53bit の整数を返す） */
export function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

const TWO_POW_53 = 2 ** 53;

/** seed と key から (0, 1) の一様な値を作る */
export function unitHash(seed: number, key: string): number {
  // cyrb53 の seed 引数は32bitなので、53bit の seed の上位は key 側に含める
  const low = seed % 4294967296;
  const high = Math.floor(seed / 4294967296);
  // 最大値付近では +0.5 が丸められて 1 になり得るので、1 未満に抑える
  return Math.min(
    (cyrb53(`${high}|${key}`, low) + 0.5) / TWO_POW_53,
    1 - 2 ** -53,
  );
}
