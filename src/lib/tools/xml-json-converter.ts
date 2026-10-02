import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';

export interface ConvertSuccess {
  success: true;
  output: string;
}

export interface ConvertFailure {
  success: false;
  message: string;
}

export type ConvertOutcome = ConvertSuccess | ConvertFailure;

export interface XmlConvertOptions {
  indent?: number;
  /** true のとき、数値・真偽値らしいテキストを JSON の number / boolean に変換する */
  parseValues?: boolean;
}

const ATTRIBUTE_PREFIX = '@_';
const TEXT_NODE_NAME = '#text';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function xmlToJson(
  input: string,
  { indent = 2, parseValues = false }: XmlConvertOptions = {},
): ConvertOutcome {
  const validation = XMLValidator.validate(input);
  if (validation !== true) {
    const { msg, line, col } = validation.err;
    return { success: false, message: `${msg} (${line}:${col})` };
  }
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: ATTRIBUTE_PREFIX,
      textNodeName: TEXT_NODE_NAME,
      ignoreDeclaration: true,
      parseTagValue: parseValues,
      parseAttributeValue: parseValues,
      numberParseOptions: { hex: false, leadingZeros: false, eNotation: false },
    });
    const parsed = parser.parse(input);
    return { success: true, output: JSON.stringify(parsed, null, indent) };
  } catch (error) {
    return { success: false, message: errorMessage(error) };
  }
}

export function jsonToXml(
  input: string,
  { indent = 2 }: XmlConvertOptions = {},
): ConvertOutcome {
  try {
    let parsed: unknown = JSON.parse(input);
    if (parsed === null || typeof parsed !== 'object') {
      return { success: false, message: 'JSON must be an object or array' };
    }
    // XML のルート要素は1つだけ。複数キー・配列の場合は <root> で包む。
    const keys = Array.isArray(parsed) ? [] : Object.keys(parsed);
    const hasSingleRoot =
      keys.length === 1 &&
      !keys[0].startsWith(ATTRIBUTE_PREFIX) &&
      keys[0] !== TEXT_NODE_NAME &&
      !Array.isArray((parsed as Record<string, unknown>)[keys[0]]);
    if (!hasSingleRoot) {
      // 配列をそのまま root に入れるとルート要素が複数になるため、item 要素の繰り返しにする
      parsed = { root: Array.isArray(parsed) ? { item: parsed } : parsed };
    }
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: ATTRIBUTE_PREFIX,
      textNodeName: TEXT_NODE_NAME,
      format: indent > 0,
      indentBy: ' '.repeat(indent),
      suppressEmptyNode: true,
    });
    const output = String(builder.build(parsed)).replace(/\n$/, '');
    return { success: true, output };
  } catch (error) {
    return { success: false, message: errorMessage(error) };
  }
}
