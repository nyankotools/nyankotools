import { parse as parseToml, stringify as stringifyToml } from 'smol-toml';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

export type DataFormat = 'toml' | 'json' | 'yaml';

export interface ConvertSuccess {
  success: true;
  output: string;
}

export interface ConvertFailure {
  success: false;
  message: string;
}

export type ConvertOutcome = ConvertSuccess | ConvertFailure;

function parseByFormat(format: DataFormat, input: string): unknown {
  if (format === 'toml') return parseToml(input);
  if (format === 'json') return JSON.parse(input);
  return parseYaml(input);
}

function stringifyByFormat(
  format: DataFormat,
  value: unknown,
  indent: number,
): string {
  if (format === 'toml') {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new Error(
        'TOMLはトップレベルがオブジェクト（テーブル）である必要があります。配列や文字列などの単一の値はTOMLとして出力できません。',
      );
    }
    return stringifyToml(value);
  }
  if (format === 'json') return JSON.stringify(value, null, indent) ?? '';
  return stringifyYaml(value, { indent });
}

export function convert(
  from: DataFormat,
  to: DataFormat,
  input: string,
  indent = 2,
): ConvertOutcome {
  try {
    const value = parseByFormat(from, input);
    const output = stringifyByFormat(to, value, indent);
    return { success: true, output };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
