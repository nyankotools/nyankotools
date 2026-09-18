import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

interface SelectOption {
  value: string;
  label: string;
  selected?: boolean;
}

export interface TomlConverterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  fromLabel: string;
  fromOptions: SelectOption[];
  swapAriaLabel: string;
  toLabel: string;
  toOptions: SelectOption[];
  indentLabel: string;
  indentOptions: SelectOption[];
  copyButton: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  outputLabel: string;
  /** `{message}` を置換して使うテンプレート */
  errorTemplate: string;
  notesHeading: string;
  noteTopLevelTable: string;
  noteNullPart1: string;
  noteNullPart2: string;
  noteNullPart3: string;
  noteSameFormat: string;
  noteClientSideOnly: string;
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const tomlConverterContent: Record<Locale, TomlConverterPageContent> = {
  ja: {
    title: 'TOML⇔JSON/YAML変換',
    description:
      'TOML・JSON・YAMLを相互に変換できる無料ツールです。Cargo.tomlやpyproject.tomlの内容をJSON/YAMLで確認したい時などに便利。構文エラーの内容も分かりやすく表示します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'TOML⇔JSON/YAML変換ツール',
    introHtml:
      'TOML・JSON・YAMLの3形式を自由に組み合わせて相互変換します。Cargo.tomlやpyproject.tomlなどのTOML設定ファイルをJSONやYAMLで確認したい時に便利です。JSON⇔YAMLの変換だけなら <a href="/tools/yaml-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">YAML⇔JSON変換</a>、変換後のJSONをさらに整形・検証したい場合は <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> もあわせてご利用ください。',
    fromLabel: '変換元',
    fromOptions: [
      { value: 'toml', label: 'TOML', selected: true },
      { value: 'json', label: 'JSON' },
      { value: 'yaml', label: 'YAML' },
    ],
    swapAriaLabel: '変換元と変換先を入れ替える',
    toLabel: '変換先',
    toOptions: [
      { value: 'toml', label: 'TOML' },
      { value: 'json', label: 'JSON', selected: true },
      { value: 'yaml', label: 'YAML' },
    ],
    indentLabel: 'インデント幅',
    indentOptions: [
      { value: '2', label: '半角スペース2個' },
      { value: '4', label: '半角スペース4個' },
    ],
    copyButton: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    outputLabel: '結果',
    errorTemplate: '構文エラー: {message}',
    notesHeading: '注意点',
    noteTopLevelTable:
      'TOMLはトップレベルが必ずテーブル（オブジェクト）である必要があります。JSONやYAMLのトップレベルが配列や文字列などの場合はTOMLに変換できません。',
    noteNullPart1: 'TOMLには',
    noteNullPart2: 'に相当する値がありません。JSON/YAMLの',
    noteNullPart3: 'フィールドはTOML出力時に除外されます。',
    noteSameFormat:
      '変換元と変換先に同じ形式を選ぶと、その場で構文を整形し直せます（例: TOML→TOMLでインデントや空白を統一）。',
    noteClientSideOnly:
      'すべての処理はブラウザ内で完結しており、入力したデータがサーバーに送信されることはありません。',
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'TOML',
        description:
          "Tom's Obvious, Minimal Language の略で、`key = value` の形で設定を書くシンプルなデータ記述形式です。Rustの`Cargo.toml`やPythonの`pyproject.toml`など、プログラミング言語のパッケージ設定ファイルで広く使われています。",
      },
      {
        term: 'YAML',
        description:
          'インデント（字下げ）で階層構造を表す、人が読み書きしやすいデータ記述形式です。設定ファイル（Docker Compose・GitHub Actions・Kubernetesマニフェストなど）で広く使われています。',
      },
      {
        term: 'JSON',
        description:
          'JavaScript Object Notation の略で、データをキーと値の組み合わせで表現するテキスト形式です。APIのやり取りや設定ファイルなど、幅広い場面で使われています。',
      },
      {
        term: 'テーブル',
        description:
          'TOMLで「オブジェクト（入れ子構造）」に相当する概念です。`[address]`のように角括弧で見出しを書くと、それ以降の`key = value`がそのテーブルの中身として扱われます。',
      },
    ],
  },
  en: {
    title: 'TOML to JSON/YAML Converter',
    description:
      'A free tool for converting between TOML, JSON, and YAML. Handy for checking the contents of a Cargo.toml or pyproject.toml as JSON or YAML, with clear syntax error messages. Your data is processed in the browser and never sent to a server.',
    h1: 'TOML to JSON/YAML Converter',
    introHtml:
      'Converts freely between any pair of TOML, JSON, and YAML. Handy for checking a TOML config file such as Cargo.toml or pyproject.toml as JSON or YAML. For JSON⇔YAML only, also try the <a href="/en/tools/yaml-json-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">YAML to JSON Converter</a>, and if you want to further format or validate the resulting JSON, try the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a> tool.',
    fromLabel: 'From',
    fromOptions: [
      { value: 'toml', label: 'TOML', selected: true },
      { value: 'json', label: 'JSON' },
      { value: 'yaml', label: 'YAML' },
    ],
    swapAriaLabel: 'Swap the from and to formats',
    toLabel: 'To',
    toOptions: [
      { value: 'toml', label: 'TOML' },
      { value: 'json', label: 'JSON', selected: true },
      { value: 'yaml', label: 'YAML' },
    ],
    indentLabel: 'Indent width',
    indentOptions: [
      { value: '2', label: '2 spaces' },
      { value: '4', label: '4 spaces' },
    ],
    copyButton: 'Copy',
    copied: 'Copied',
    copyFailed: 'Failed to copy',
    inputLabel: 'Input',
    outputLabel: 'Result',
    errorTemplate: 'Syntax error: {message}',
    notesHeading: 'Notes',
    noteTopLevelTable:
      'TOML requires its top level to be a table (object). JSON or YAML whose top level is an array, string, or other non-object value cannot be converted to TOML.',
    noteNullPart1: 'TOML has no equivalent of',
    noteNullPart2: '. A',
    noteNullPart3: 'field in JSON/YAML is dropped when converting to TOML.',
    noteSameFormat:
      'Choosing the same format for both "from" and "to" reformats the document in place (e.g. TOML→TOML normalizes indentation and spacing).',
    noteClientSideOnly:
      'Everything runs entirely in your browser — the data you enter is never sent to a server.',
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'TOML',
        description:
          "Short for Tom's Obvious, Minimal Language — a simple data format for writing config as `key = value` pairs. Widely used for package config files such as Rust's `Cargo.toml` and Python's `pyproject.toml`.",
      },
      {
        term: 'YAML',
        description:
          'A human-friendly data format that represents structure through indentation. Widely used for config files such as Docker Compose, GitHub Actions, and Kubernetes manifests.',
      },
      {
        term: 'JSON',
        description:
          'Short for JavaScript Object Notation — a text format that represents data as key/value pairs. Used everywhere from API payloads to config files.',
      },
      {
        term: 'Table',
        description:
          "TOML's equivalent of a nested object. A header in square brackets, such as `[address]`, marks every `key = value` line that follows as belonging to that table.",
      },
    ],
  },
};
