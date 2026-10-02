import { parse as parseToml, stringify as stringifyToml } from 'smol-toml';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

export type DataFormat = 'toml' | 'json' | 'yaml';

export interface ConvertSuccess {
  success: true;
  output: string;
}

export interface ConvertFailure {
  success: false;
  /** ライブラリが返す構文エラーのメッセージ。reason が指定されている場合は空文字 */
  message: string;
  /** 文言を辞書から引くためのエラー種別（UIコピーはロジック層に持たない） */
  reason?: 'toml-top-level';
}

class TomlTopLevelError extends Error {}

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
      throw new TomlTopLevelError();
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
    if (error instanceof TomlTopLevelError) {
      return { success: false, message: '', reason: 'toml-top-level' };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
