import {
  inferType,
  jsonToTypeScript,
  toPascalCase,
  type InferredType,
  type JsonToTypeScriptOptions,
  type JsonToTypeScriptResult,
} from './json-to-typescript';

export const CODE_LANGUAGES = [
  'typescript',
  'csharp',
  'go',
  'python',
  'java',
] as const;

export type CodeLanguage = (typeof CODE_LANGUAGES)[number];

export interface JsonToCodeOptions extends JsonToTypeScriptOptions {
  /** 出力する言語（既定: typescript）。style / exportDeclarations は typescript のときだけ使う */
  language?: CodeLanguage;
}

export type JsonToCodeResult = JsonToTypeScriptResult;

/** 言語ごとの型の表し方。生成の流れ（型の推測・名前の割り当て・宣言の切り出し）は共通 */
interface LanguageSpec {
  /** 生成した型名と衝突すると標準の型を隠してしまう名前 */
  reserved: Set<string>;
  /** 宣言の区切り */
  separator: string;
  /** 子の宣言を親より先に出力する（Python のように前方参照できない言語） */
  childrenFirst?: boolean;
  typeName?(name: string): string;
  scalar(name: 'string' | 'number' | 'boolean', integer: boolean): string;
  list(inner: string): string;
  readonly any: string;
  wrap(r: Rendered, optional: boolean, inList: boolean): string;
  declare(name: string, fields: FieldDecl[]): string;
  /** ルートがオブジェクトでないとき（配列など）の宣言 */
  alias(name: string, type: string): string;
  /** 全体を描画し終えたあとに、使った型に応じた import 等を返す */
  header(hasDeclarations: boolean): string;
}

interface Rendered {
  base: string;
  nullable: boolean;
  kind: 'scalar' | 'list' | 'object' | 'any';
}

interface FieldDecl {
  key: string;
  /** 省略可能・null許容を反映した型 */
  type: string;
  optional: boolean;
}

function unique(name: string, used: Set<string>): string {
  let result = name;
  for (let i = 2; used.has(result); i++) result = `${name}${i}`;
  used.add(result);
  return result;
}

function escapeString(text: string): string {
  return JSON.stringify(text);
}

/** `userID` → `userID`、`ID` → `id`、`URLPath` → `urlPath`、`Name` → `name` */
function toCamelCase(text: string): string {
  const pascal = toPascalCase(text);
  const lead = pascal.match(/^[A-Z]+(?=[A-Z][a-z])/);
  if (lead) return lead[0].toLowerCase() + pascal.slice(lead[0].length);
  if (/^[A-Z]+$/.test(pascal)) return pascal.toLowerCase();
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toSnakeCase(text: string): string {
  const words = text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w !== '');
  const name = words.map((w) => w.toLowerCase()).join('_');
  if (name === '') return 'field';
  return /^\p{N}/u.test(name) ? `_${name}` : name;
}

const PYTHON_KEYWORDS = new Set([
  'False',
  'None',
  'True',
  'and',
  'as',
  'assert',
  'async',
  'await',
  'break',
  'class',
  'continue',
  'def',
  'del',
  'elif',
  'else',
  'except',
  'finally',
  'for',
  'from',
  'global',
  'if',
  'import',
  'in',
  'is',
  'lambda',
  'nonlocal',
  'not',
  'or',
  'pass',
  'raise',
  'return',
  'try',
  'while',
  'with',
  'yield',
]);

/** フィールド名にすると、同じクラス本文内の型注釈（list[int] など）を隠してしまう名前 */
const PYTHON_BUILTIN_TYPES = new Set([
  'bool',
  'dict',
  'float',
  'int',
  'list',
  'set',
  'str',
  'tuple',
]);

/** record のコンポーネント名にできない Object のメソッド名も含む */
const JAVA_KEYWORDS = new Set([
  'clone',
  'finalize',
  'getClass',
  'hashCode',
  'notify',
  'notifyAll',
  'toString',
  'wait',
  'abstract',
  'assert',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'default',
  'do',
  'double',
  'else',
  'enum',
  'extends',
  'final',
  'finally',
  'float',
  'for',
  'goto',
  'if',
  'implements',
  'import',
  'instanceof',
  'int',
  'interface',
  'long',
  'native',
  'new',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'strictfp',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'try',
  'void',
  'volatile',
  'while',
  'true',
  'false',
  'null',
]);

function createCSharpSpec(): LanguageSpec {
  let usesList = false;
  let usesAttribute = false;
  return {
    reserved: new Set([
      'Dictionary',
      'List',
      'Math',
      'Object',
      'String',
      'Task',
      'Type',
    ]),
    separator: '\n\n',
    scalar: (name, integer) =>
      name === 'string'
        ? 'string'
        : name === 'boolean'
          ? 'bool'
          : integer
            ? 'long'
            : 'double',
    list(inner) {
      usesList = true;
      return `List<${inner}>`;
    },
    any: 'object',
    wrap: (r, optional) => (r.nullable || optional ? `${r.base}?` : r.base),
    declare(name, fields) {
      const used = new Set([name]);
      const members = fields.map((field) => {
        const property = unique(toPascalCase(field.key), used);
        let attribute = '';
        if (property !== field.key) {
          usesAttribute = true;
          attribute = `    [JsonPropertyName(${escapeString(field.key)})]\n`;
        }
        return `${attribute}    public ${field.type} ${property} { get; set; }`;
      });
      const body = members.length > 0 ? `\n${members.join('\n')}\n` : '\n';
      return `public class ${name}\n{${body}}`;
    },
    alias: (name, type) => `// ${name}: ${type}`,
    header() {
      const lines: string[] = [];
      if (usesList) lines.push('using System.Collections.Generic;');
      if (usesAttribute) lines.push('using System.Text.Json.Serialization;');
      return lines.join('\n');
    },
  };
}

/** Go の慣習（golint）に合わせ、id・url などの頭字語は大文字にする */
const GO_INITIALISMS = new Set([
  'api',
  'html',
  'http',
  'https',
  'id',
  'ip',
  'json',
  'sql',
  'ssh',
  'uri',
  'url',
  'uuid',
  'xml',
]);

function toGoName(key: string): string {
  return toSnakeCase(key)
    .split('_')
    .map((w) =>
      GO_INITIALISMS.has(w)
        ? w.toUpperCase()
        : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join('');
}

function createGoSpec(): LanguageSpec {
  return {
    reserved: new Set(),
    separator: '\n\n',
    typeName: (name) => (/^[A-Z]/.test(name) ? name : `X${name}`),
    scalar: (name, integer) =>
      name === 'string'
        ? 'string'
        : name === 'boolean'
          ? 'bool'
          : integer
            ? 'int64'
            : 'float64',
    list: (inner) => `[]${inner}`,
    any: 'any',
    wrap: (r, optional) =>
      (r.nullable || optional) && (r.kind === 'scalar' || r.kind === 'object')
        ? `*${r.base}`
        : r.base,
    declare(name, fields) {
      const used = new Set<string>();
      const rows = fields.map((field) => {
        let property = toGoName(field.key);
        if (!/^[A-Z]/.test(property)) property = `X${property}`;
        property = unique(property, used);
        const tagKey = escapeString(field.key)
          .slice(1, -1)
          .replace(/`/g, '\\u0060');
        const tag = `\`json:"${tagKey}${field.optional ? ',omitempty' : ''}"\``;
        return { property, type: field.type, tag };
      });
      const nameWidth = Math.max(0, ...rows.map((r) => r.property.length));
      const typeWidth = Math.max(0, ...rows.map((r) => r.type.length));
      const lines = rows.map(
        (r) =>
          `\t${r.property.padEnd(nameWidth)} ${r.type.padEnd(typeWidth)} ${r.tag}`,
      );
      const body = lines.length > 0 ? `\n${lines.join('\n')}\n` : '';
      return `type ${name} struct {${body}}`;
    },
    alias: (name, type) => `type ${name} = ${type}`,
    header: () => '',
  };
}

function createPythonSpec(): LanguageSpec {
  let usesAny = false;
  return {
    reserved: new Set([
      'Any',
      'Dict',
      'False',
      'List',
      'None',
      'Optional',
      'True',
    ]),
    separator: '\n\n\n',
    childrenFirst: true,
    scalar: (name, integer) =>
      name === 'string'
        ? 'str'
        : name === 'boolean'
          ? 'bool'
          : integer
            ? 'int'
            : 'float',
    list: (inner) => `list[${inner}]`,
    get any() {
      usesAny = true;
      return 'Any';
    },
    wrap: (r, optional) =>
      (r.nullable || optional) && r.kind !== 'any'
        ? `${r.base} | None`
        : r.base,
    declare(name, fields) {
      const used = new Set<string>();
      const rows = fields.map((field) => {
        let property = toSnakeCase(field.key);
        if (PYTHON_KEYWORDS.has(property) || PYTHON_BUILTIN_TYPES.has(property))
          property += '_';
        property = unique(property, used);
        const note =
          property !== field.key ? `  # ${escapeString(field.key)}` : '';
        return { ...field, property, note };
      });
      // dataclass は既定値のあるフィールドを後ろに置く必要がある
      const ordered = [
        ...rows.filter((r) => !r.optional),
        ...rows.filter((r) => r.optional),
      ];
      const lines = ordered.map(
        (r) =>
          `    ${r.property}: ${r.type}${r.optional ? ' = None' : ''}${r.note}`,
      );
      const body = lines.length > 0 ? lines.join('\n') : '    pass';
      return `@dataclass\nclass ${name}:\n${body}`;
    },
    alias: (name, type) => `${name} = ${type}`,
    header(hasDeclarations) {
      const lines = hasDeclarations
        ? ['from dataclasses import dataclass']
        : [];
      if (usesAny) lines.push('from typing import Any');
      return lines.join('\n');
    },
  };
}

const JAVA_BOXED: Record<string, string> = {
  long: 'Long',
  double: 'Double',
  boolean: 'Boolean',
};

function createJavaSpec(): LanguageSpec {
  let usesList = false;
  let usesAttribute = false;
  return {
    reserved: new Set([
      'Boolean',
      'Class',
      'Double',
      'Integer',
      'List',
      'Long',
      'Object',
      'Record',
      'String',
    ]),
    separator: '\n\n',
    scalar: (name, integer) =>
      name === 'string'
        ? 'String'
        : name === 'boolean'
          ? 'boolean'
          : integer
            ? 'long'
            : 'double',
    list(inner) {
      usesList = true;
      return `List<${inner}>`;
    },
    any: 'Object',
    wrap: (r, optional, inList) =>
      r.kind === 'scalar' && (r.nullable || optional || inList)
        ? (JAVA_BOXED[r.base] ?? r.base)
        : r.base,
    declare(name, fields) {
      const used = new Set<string>();
      const components = fields.map((field) => {
        let property = toCamelCase(field.key);
        if (JAVA_KEYWORDS.has(property)) property += '_';
        property = unique(property, used);
        let annotation = '';
        if (property !== field.key) {
          usesAttribute = true;
          annotation = `@JsonProperty(${escapeString(field.key)}) `;
        }
        return `    ${annotation}${field.type} ${property}`;
      });
      return components.length > 0
        ? `record ${name}(\n${components.join(',\n')}\n) {}`
        : `record ${name}() {}`;
    },
    alias: (name, type) => `// ${name}: ${type}`,
    header() {
      const lines: string[] = [];
      if (usesAttribute) {
        lines.push('import com.fasterxml.jackson.annotation.JsonProperty;');
      }
      if (usesList) lines.push('import java.util.List;');
      return lines.join('\n');
    },
  };
}

class CodeEmitter {
  private readonly declarations: string[] = [];
  private readonly usedNames = new Set<string>();

  constructor(
    private readonly spec: LanguageSpec,
    private readonly rootName: string,
  ) {}

  private allocateName(hint: string): string {
    let base = toPascalCase(hint);
    if (this.spec.typeName) base = this.spec.typeName(base);
    if (this.spec.reserved.has(base)) base += 'Type';
    let name = base;
    for (let i = 2; this.usedNames.has(name); i++) name = `${base}${i}`;
    this.usedNames.add(name);
    return name;
  }

  private render(type: InferredType, nameHint: string): Rendered {
    const { spec } = this;
    switch (type.kind) {
      case 'primitive':
        if (type.name === 'null') {
          return { base: spec.any, nullable: true, kind: 'any' };
        }
        return {
          base: spec.scalar(type.name, type.integer === true),
          nullable: false,
          kind: 'scalar',
        };
      case 'array': {
        if (type.element === null) {
          return { base: spec.list(spec.any), nullable: false, kind: 'list' };
        }
        const element = this.render(type.element, nameHint);
        return {
          base: spec.list(spec.wrap(element, false, true)),
          nullable: false,
          kind: 'list',
        };
      }
      case 'union': {
        const nonNull = type.members.filter(
          (m) => !(m.kind === 'primitive' && m.name === 'null'),
        );
        const hasNull = nonNull.length !== type.members.length;
        // 型が1種類 + null ならその型のnull許容。複数種類が混ざる場合は「何でも」にする
        if (nonNull.length === 1) {
          const rendered = this.render(nonNull[0], nameHint);
          return { ...rendered, nullable: rendered.nullable || hasNull };
        }
        return { base: spec.any, nullable: hasNull, kind: 'any' };
      }
      case 'object':
        return {
          base: this.declareObject(type, nameHint),
          nullable: false,
          kind: 'object',
        };
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
    const fields = [...type.fields].map(([key, field]) => ({
      key,
      type: this.spec.wrap(this.render(field.type, key), field.optional, false),
      optional: field.optional,
    }));
    this.declarations[slot] = this.spec.declare(name, fields);
    return name;
  }

  emit(root: InferredType): string {
    const { spec } = this;
    let alias = '';
    if (root.kind === 'object') {
      this.declareObject(root, this.rootName);
    } else {
      const rootName = this.allocateName(this.rootName);
      const rendered = this.render(root, `${rootName}Item`);
      alias = spec.alias(rootName, spec.wrap(rendered, false, false));
    }
    const declarations = spec.childrenFirst
      ? [...this.declarations].reverse()
      : this.declarations;
    return (
      [spec.header(this.declarations.length > 0), ...declarations, alias]
        .filter((part) => part !== '')
        .join(spec.separator) + '\n'
    );
  }
}

const SPEC_FACTORIES: Record<
  Exclude<CodeLanguage, 'typescript'>,
  () => LanguageSpec
> = {
  csharp: createCSharpSpec,
  go: createGoSpec,
  python: createPythonSpec,
  java: createJavaSpec,
};

/** JSON文字列から、指定した言語の型定義（TypeScript の型 / C#・Java のクラス / Go の構造体 / Python のdataclass）を生成する */
export function jsonToCode(
  input: string,
  options: JsonToCodeOptions = {},
): JsonToCodeResult {
  const language = options.language ?? 'typescript';
  if (language === 'typescript') return jsonToTypeScript(input, options);
  if (input.trim() === '') return { success: false, reason: 'empty' };
  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch {
    return { success: false, reason: 'invalid-json' };
  }
  try {
    const emitter = new CodeEmitter(
      SPEC_FACTORIES[language](),
      options.rootName?.trim() || 'Root',
    );
    return { success: true, code: emitter.emit(inferType(value)) };
  } catch (error) {
    if (error instanceof RangeError) {
      return { success: false, reason: 'too-deep' };
    }
    throw error;
  }
}
