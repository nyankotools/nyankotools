export type JsonSchemaDraft = '2020-12' | '2019-09' | '07';

export interface JsonSchemaOptions {
  /** 出力する $schema のドラフト（既定: 2020-12） */
  draft?: JsonSchemaDraft;
  /** 全オブジェクトで出現したキーを required にする（既定: true） */
  required?: boolean;
  /** オブジェクトに additionalProperties: false を付ける（既定: false） */
  noAdditionalProperties?: boolean;
  /** 文字列の format（date-time・email・uri など）を推測する（既定: true） */
  detectFormats?: boolean;
  /** ルートの title（空なら付けない） */
  title?: string;
}

export type JsonSchemaResult =
  | { success: true; schema: string }
  | { success: false; reason: 'empty' | 'invalid-json' | 'too-deep' };

type PrimitiveType = 'null' | 'boolean' | 'string' | 'integer' | 'number';

interface ObjectNode {
  /** 統合したオブジェクトの数 */
  count: number;
  keyCounts: Map<string, number>;
  fields: Map<string, Node>;
}

/** 推測した型。同じ位置に現れた複数の値を統合して持つ */
interface Node {
  types: Set<PrimitiveType>;
  /** string 値の format。undefined=文字列なし、null=format なし（不一致を含む） */
  format: string | null | undefined;
  object: ObjectNode | null;
  array: { items: Node | null } | null;
}

const FORMAT_PATTERNS: [string, RegExp][] = [
  [
    'date-time',
    /^\d{4}-\d{2}-\d{2}[Tt ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?([Zz]|[+-]\d{2}:?\d{2})$/,
  ],
  ['date', /^\d{4}-\d{2}-\d{2}$/],
  ['email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/],
  ['uri', /^https?:\/\/[^\s]+$/],
  ['uuid', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i],
];

function detectFormat(value: string): string | null {
  for (const [name, pattern] of FORMAT_PATTERNS) {
    if (pattern.test(value)) return name;
  }
  return null;
}

function emptyNode(): Node {
  return { types: new Set(), format: undefined, object: null, array: null };
}

function infer(value: unknown): Node {
  const node = emptyNode();
  if (value === null) {
    node.types.add('null');
  } else if (Array.isArray(value)) {
    node.array = {
      items:
        value.length === 0
          ? null
          : value.map(infer).reduce((acc, n) => merge(acc, n)),
    };
  } else if (typeof value === 'string') {
    node.types.add('string');
    node.format = detectFormat(value);
  } else if (typeof value === 'number') {
    node.types.add(Number.isInteger(value) ? 'integer' : 'number');
  } else if (typeof value === 'boolean') {
    node.types.add('boolean');
  } else {
    const fields = new Map<string, Node>();
    const keyCounts = new Map<string, number>();
    for (const [key, child] of Object.entries(value as object)) {
      fields.set(key, infer(child));
      keyCounts.set(key, 1);
    }
    node.object = { count: 1, keyCounts, fields };
  }
  return node;
}

function mergeFormat(
  a: string | null | undefined,
  b: string | null | undefined,
): string | null | undefined {
  if (a === undefined) return b;
  if (b === undefined) return a;
  return a === b ? a : null;
}

function merge(a: Node, b: Node): Node {
  const result = emptyNode();
  for (const t of a.types) result.types.add(t);
  for (const t of b.types) result.types.add(t);
  result.format = mergeFormat(a.format, b.format);

  if (a.object || b.object) {
    const fields = new Map<string, Node>();
    const keyCounts = new Map<string, number>();
    for (const o of [a.object, b.object]) {
      if (!o) continue;
      for (const [key, child] of o.fields) {
        const existing = fields.get(key);
        fields.set(key, existing ? merge(existing, child) : child);
        keyCounts.set(key, (keyCounts.get(key) ?? 0) + o.keyCounts.get(key)!);
      }
    }
    result.object = {
      count: (a.object?.count ?? 0) + (b.object?.count ?? 0),
      keyCounts,
      fields,
    };
  }

  if (a.array || b.array) {
    const items =
      a.array?.items && b.array?.items
        ? merge(a.array.items, b.array.items)
        : (a.array?.items ?? b.array?.items ?? null);
    result.array = { items };
  }
  return result;
}

const TYPE_ORDER: string[] = [
  'null',
  'boolean',
  'integer',
  'number',
  'string',
  'array',
  'object',
];

type Schema = Record<string, unknown>;

function toSchema(node: Node, options: Required<JsonSchemaOptions>): Schema {
  const types = new Set<string>(node.types);
  // integer と number が混在するなら number にまとめる
  if (types.has('integer') && types.has('number')) types.delete('integer');
  if (node.array) types.add('array');
  if (node.object) types.add('object');
  const ordered = TYPE_ORDER.filter((t) => types.has(t));

  const schema: Schema = {};
  if (ordered.length === 1) schema.type = ordered[0];
  else if (ordered.length > 1) schema.type = ordered;

  if (options.detectFormats && node.types.has('string') && node.format) {
    schema.format = node.format;
  }

  if (node.object) {
    const properties: Schema = Object.create(null);
    const required: string[] = [];
    for (const [key, child] of node.object.fields) {
      properties[key] = toSchema(child, options);
      if (node.object.keyCounts.get(key) === node.object.count) {
        required.push(key);
      }
    }
    schema.properties = properties;
    if (options.required && required.length > 0) schema.required = required;
    if (options.noAdditionalProperties) schema.additionalProperties = false;
  }

  if (node.array) {
    // 空配列だけなら items は付けず、何でも許す
    if (node.array.items) schema.items = toSchema(node.array.items, options);
  }
  return schema;
}

const DRAFT_URIS: Record<JsonSchemaDraft, string> = {
  '2020-12': 'https://json-schema.org/draft/2020-12/schema',
  '2019-09': 'https://json-schema.org/draft/2019-09/schema',
  '07': 'http://json-schema.org/draft-07/schema#',
};

/** JSON 文字列から JSON Schema を生成する */
export function generateJsonSchema(
  input: string,
  options: JsonSchemaOptions = {},
): JsonSchemaResult {
  if (input.trim() === '') return { success: false, reason: 'empty' };
  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch {
    return { success: false, reason: 'invalid-json' };
  }
  const resolved: Required<JsonSchemaOptions> = {
    draft: options.draft ?? '2020-12',
    required: options.required ?? true,
    noAdditionalProperties: options.noAdditionalProperties ?? false,
    detectFormats: options.detectFormats ?? true,
    title: options.title?.trim() ?? '',
  };
  try {
    const body = toSchema(infer(value), resolved);
    const schema: Schema = { $schema: DRAFT_URIS[resolved.draft] };
    if (resolved.title) schema.title = resolved.title;
    Object.assign(schema, body);
    return { success: true, schema: JSON.stringify(schema, null, 2) + '\n' };
  } catch (error) {
    if (error instanceof RangeError) {
      return { success: false, reason: 'too-deep' };
    }
    throw error;
  }
}
