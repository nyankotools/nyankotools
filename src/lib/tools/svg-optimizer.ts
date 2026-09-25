import { optimize } from 'svgo/browser';

export interface SvgOptimizeOptions {
  /** 最適化を収束するまで繰り返す（サイズは小さくなりやすいが遅くなる） */
  multipass: boolean;
  /** 数値の小数点以下の桁数 */
  precision: number;
  /** 出力を読みやすく整形する（インデント・改行を入れる） */
  pretty: boolean;
  /** width/height属性を削除し、viewBoxのみで拡縮できるようにする */
  removeDimensions: boolean;
}

export const defaultSvgOptimizeOptions: SvgOptimizeOptions = {
  multipass: true,
  precision: 3,
  pretty: false,
  removeDimensions: false,
};

export type SvgOptimizeResult =
  | {
      success: true;
      output: string;
      originalBytes: number;
      optimizedBytes: number;
      /** 削減率（%）。増加した場合は負の値 */
      savedPercent: number;
    }
  | { success: false; error: string };

export function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

export function optimizeSvg(
  svg: string,
  options: SvgOptimizeOptions = defaultSvgOptimizeOptions,
): SvgOptimizeResult {
  if (svg.trim() === '') {
    return { success: false, error: 'empty' };
  }
  const precision = Math.min(
    8,
    Math.max(
      0,
      Math.round(Number.isFinite(options.precision) ? options.precision : 3),
    ),
  );
  try {
    const result = optimize(svg, {
      multipass: options.multipass,
      js2svg: { pretty: options.pretty },
      floatPrecision: precision,
      plugins: [
        {
          name: 'preset-default',
          params: { overrides: {} },
        },
        ...(options.removeDimensions ? (['removeDimensions'] as const) : []),
      ],
    });
    const originalBytes = byteLength(svg);
    const optimizedBytes = byteLength(result.data);
    return {
      success: true,
      output: result.data,
      originalBytes,
      optimizedBytes,
      savedPercent:
        originalBytes === 0
          ? 0
          : ((originalBytes - optimizedBytes) / originalBytes) * 100,
    };
  } catch {
    return { success: false, error: 'invalid' };
  }
}
