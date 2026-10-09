export type TypeScriptDeclarationStyle = 'interface' | 'type';

export interface JsonToTypeScriptOptions {
  /** ルート型の名前（既定: Root） */
  rootName?: string;
  /** オブジェクトを interface と type のどちらで出力するか（既定: interface） */
  style?: TypeScriptDeclarationStyle;
  /** 各宣言に export を付ける（既定: false） */
  exportDeclarations?: boolean;
}

export type JsonToTypeScriptResult =
  | { success: true; code: string }
  | { success: false; reason: 'empty' | 'invalid-json' | 'too-deep' };

export interface ObjectField {
  type: InferredType;
  optional: boolean;
}

/** `integer` は number のときだけ意味を持つ（TypeScript では使わないが、他言語の int/float の判別に使う） */
export type InferredType =
  | {
      kind: 'primitive';
      name: 'string' | 'number' | 'boolean' | 'null';
      integer?: boolean;
    }
  | { kind: 'object'; fields: Map<string, ObjectField> }
  | { kind: 'array'; element: InferredType | null }
  | { kind: 'union'; members: InferredType[] };

const IDENTIFIER_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/** 生成した型名と衝突すると標準の型を隠してしまう名前 */
const RESERVED_TYPE_NAMES = new Set([
  'Array',
  'Boolean',
  'Date',
  'Function',
  'Map',
  'Number',
  'Object',
  'Promise',
  'Record',
  'RegExp',
  'Set',
  'String',
  'Symbol',
]);

export function inferType(value: unknown): InferredType {
  if (value === null) return { kind: 'primitive', name: 'null' };
  if (Array.isArray(value)) {
    return {
      kind: 'array',
      element: value.length === 0 ? null : mergeTypes(value.map(inferType)),
    };
  }
  switch (typeof value) {
    case 'string':
      return { kind: 'primitive', name: 'string' };
    case 'number':
      return {
        kind: 'primitive',
        name: 'number',
        integer: Number.isInteger(value),
      };
    case 'boolean':
      return { kind: 'primitive', name: 'boolean' };
  }
  const fields = new Map<string, ObjectField>();
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    fields.set(key, { type: inferType(child), optional: false });
  }
  return { kind: 'object', fields };
}

/** 配列の要素など、複数の型を1つにまとめる（オブジェクトは1つに統合し、片方にしかないキーは省略可能にする） */
function mergeTypes(types: InferredType[]): InferredType {
  const primitives: InferredType[] = [];
  const objects: Extract<InferredType, { kind: 'object' }>[] = [];
  const arrays: Extract<InferredType, { kind: 'array' }>[] = [];
  const addPrimitive = (type: InferredType) => {
    const index = primitives.findIndex(
      (p) =>
        p.kind === 'primitive' &&
        type.kind === 'primitive' &&
        p.name === type.name,
    );
    if (index < 0) {
      primitives.push(type);
      return;
    }
    // 整数と小数が混ざる number は小数として扱う
    const existing = primitives[index];
    if (
      existing.kind === 'primitive' &&
      type.kind === 'primitive' &&
      existing.integer &&
      !type.integer
    ) {
      primitives[index] = type;
    }
  };
  const visit = (type: InferredType) => {
    if (type.kind === 'union') type.members.forEach(visit);
    else if (type.kind === 'primitive') addPrimitive(type);
    else if (type.kind === 'object') objects.push(type);
    else arrays.push(type);
  };
  types.forEach(visit);

  const members: InferredType[] = [...primitives];
  if (objects.length > 0) members.push(mergeObjects(objects));
  if (arrays.length > 0) {
    const elements = arrays
      .map((a) => a.element)
      .filter((e): e is InferredType => e !== null);
    members.push({
      kind: 'array',
      element: elements.length === 0 ? null : mergeTypes(elements),
    });
  }
  return members.length === 1 ? members[0] : { kind: 'union', members };
}

function mergeObjects(
  objects: Extract<InferredType, { kind: 'object' }>[],
): InferredType {
  const keys: string[] = [];
  const seen = new Set<string>();
  for (const obj of objects) {
    for (const key of obj.fields.keys()) {
      if (!seen.has(key)) {
        seen.add(key);
        keys.push(key);
      }
    }
  }
  const fields = new Map<string, ObjectField>();
  for (const key of keys) {
    const present = objects.filter((o) => o.fields.has(key));
    fields.set(key, {
      type: mergeTypes(present.map((o) => o.fields.get(key)!.type)),
      optional:
        present.length < objects.length ||
        present.some((o) => o.fields.get(key)!.optional),
    });
  }
  return { kind: 'object', fields };
}

/** 任意の文字列を PascalCase の型名にする（先頭が数字なら _ を付ける） */
export function toPascalCase(text: string): string {
  const words = text.split(/[^\p{L}\p{N}]+/u).filter((w) => w !== '');
  const name = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  if (name === '') return 'Item';
  return /^\p{N}/u.test(name) ? `_${name}` : name;
}

function formatKey(key: string): string {
  return IDENTIFIER_PATTERN.test(key) ? key : JSON.stringify(key);
}

class Emitter {
  private readonly declarations: string[] = [];
  private readonly usedNames = new Set<string>();

  constructor(private readonly options: Required<JsonToTypeScriptOptions>) {}

  private allocateName(hint: string): string {
    let base = toPascalCase(hint);
    if (RESERVED_TYPE_NAMES.has(base)) base += 'Type';
    let name = base;
    for (let i = 2; this.usedNames.has(name); i++) name = `${base}${i}`;
    this.usedNames.add(name);
    return name;
  }

  private get prefix(): string {
    return this.options.exportDeclarations ? 'export ' : '';
  }

  /** 型を文字列にする。オブジェクトは名前付きの宣言として切り出す */
  private render(type: InferredType, nameHint: string): string {
    switch (type.kind) {
      case 'primitive':
        return type.name;
      case 'array': {
        if (type.element === null) return 'unknown[]';
        const inner = this.render(type.element, nameHint);
        return type.element.kind === 'union' ? `(${inner})[]` : `${inner}[]`;
      }
      case 'union':
        return type.members.map((m) => this.render(m, nameHint)).join(' | ');
      case 'object':
        return this.declareObject(type, nameHint);
    }
  }

  private declareObject(
    type: Extract<InferredType, { kind: 'object' }>,
    nameHint: string,
  ): string {
    const name = this.allocateName(nameHint);
    // 親を子より先に出力するため、先に場所を確保する
    const slot = this.declarations.length;
    this.declarations.push('');
    const lines = [...type.fields].map(([key, field]) => {
      const rendered = this.render(field.type, key);
      return `  ${formatKey(key)}${field.optional ? '?' : ''}: ${rendered};`;
    });
    const body = lines.length > 0 ? `\n${lines.join('\n')}\n` : '';
    this.declarations[slot] =
      this.options.style === 'interface'
        ? `${this.prefix}interface ${name} {${body}}`
        : `${this.prefix}type ${name} = {${body}};`;
    return name;
  }

  emit(root: InferredType): string {
    if (root.kind === 'object') {
      this.declareObject(root, this.options.rootName);
    } else {
      const rootName = this.allocateName(this.options.rootName);
      const slot = this.declarations.length;
      this.declarations.push('');
      const rendered = this.render(root, `${rootName}Item`);
      this.declarations[slot] = `${this.prefix}type ${rootName} = ${rendered};`;
    }
    return this.declarations.join('\n\n') + '\n';
  }
}

/** JSON文字列から TypeScript の型定義を生成する */
export function jsonToTypeScript(
  input: string,
  options: JsonToTypeScriptOptions = {},
): JsonToTypeScriptResult {
  if (input.trim() === '') return { success: false, reason: 'empty' };
  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch {
    return { success: false, reason: 'invalid-json' };
  }
  const resolved: Required<JsonToTypeScriptOptions> = {
    rootName: options.rootName?.trim() || 'Root',
    style: options.style ?? 'interface',
    exportDeclarations: options.exportDeclarations ?? false,
  };
  try {
    const code = new Emitter(resolved).emit(inferType(value));
    return { success: true, code };
  } catch (error) {
    if (error instanceof RangeError) {
      return { success: false, reason: 'too-deep' };
    }
    throw error;
  }
}
