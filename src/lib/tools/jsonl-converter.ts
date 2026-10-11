import {
  csvToJson,
  jsonToCsv,
  type ConvertFailure,
} from './csv-json-converter';

export interface JsonlSuccess {
  success: true;
  output: string;
}

export type JsonlFailure =
  | ConvertFailure
  | { success: false; reason: 'invalid-line'; line: number; message: string }
  | { success: false; reason: 'not-object-line'; line: number };

export type JsonlOutcome = JsonlSuccess | JsonlFailure;

type ParsedLines =
  | { ok: true; values: { value: unknown; line: number }[] }
  | { ok: false; failure: JsonlFailure };

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** JSONL を1行ずつパースする。空行は読み飛ばし、行番号は元の位置のまま保つ */
function parseLines(input: string): ParsedLines {
  const values: { value: unknown; line: number }[] = [];
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
  const lines = text.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (trimmed === '') continue;
    try {
      values.push({ value: JSON.parse(trimmed), line: index + 1 });
    } catch (error) {
      return {
        ok: false,
        failure: {
          success: false,
          reason: 'invalid-line',
          line: index + 1,
          message: errorMessage(error),
        },
      };
    }
  }
  return { ok: true, values };
}

/** JSONL → JSON配列（各行は任意のJSON値でよい） */
export function jsonlToJson(input: string): JsonlOutcome {
  const parsed = parseLines(input);
  if (!parsed.ok) return parsed.failure;
  if (parsed.values.length === 0) return { success: true, output: '[]' };
  return {
    success: true,
    output: JSON.stringify(
      parsed.values.map(({ value }) => value),
      null,
      2,
    ),
  };
}

/** JSON配列 → JSONL（1要素を1行のコンパクトなJSONにする） */
export function jsonToJsonl(input: string): JsonlOutcome {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch (error) {
    return {
      success: false,
      reason: 'invalid-json',
      message: errorMessage(error),
    };
  }
  if (!Array.isArray(parsed)) return { success: false, reason: 'not-array' };
  if (parsed.length === 0) return { success: true, output: '' };
  return {
    success: true,
    output: parsed.map((item) => JSON.stringify(item)).join('\n') + '\n',
  };
}

/** JSONL → CSV（各行はオブジェクトである必要がある） */
export function jsonlToCsv(input: string, delimiter = ','): JsonlOutcome {
  const parsed = parseLines(input);
  if (!parsed.ok) return parsed.failure;
  for (const { value, line } of parsed.values) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return { success: false, reason: 'not-object-line', line };
    }
  }
  return jsonToCsv(
    JSON.stringify(parsed.values.map(({ value }) => value)),
    delimiter,
  );
}

/** CSV → JSONL（ヘッダー行をキーにし、値はすべて文字列） */
export function csvToJsonl(input: string, delimiter = ','): JsonlOutcome {
  // Excel等のUTF-8 BOMが先頭ヘッダーのキーに残らないようにする
  const converted = csvToJson(
    input.charCodeAt(0) === 0xfeff ? input.slice(1) : input,
    delimiter,
  );
  if (!converted.success) return converted;
  return jsonToJsonl(converted.output);
}
