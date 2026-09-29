import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface YamlJsonConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeAriaLabel: string;
  modeYamlToJson: string;
  modeJsonToYaml: string;
  indentLabel: string;
  indentOption2: string;
  indentOption4: string;
  copy: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholderYamlToJson: string;
  inputPlaceholderJsonToYaml: string;
  syntaxErrorPrefix: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const yamlJsonConverterContent: Record<
  Locale,
  YamlJsonConverterPageContent
> = {
  ja: {
    title: 'YAML⇔JSON変換',
    description:
      'YAMLとJSONを相互に変換できる無料ツールです。Docker ComposeやGitHub Actionsの設定ファイルをJSONで確認したい時などに便利。構文エラーの内容も分かりやすく表示します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'YAML⇔JSON変換ツール',
    introHtml:
      'YAMLを入力するとJSONに、JSONを入力するとYAMLに変換します。Docker ComposeやGitHub Actions、Kubernetesマニフェストなどの設定ファイルを別形式で確認したい時に便利です。変換後のJSONをさらに整形・検証したい場合は <a href="/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON整形</a> もあわせてご利用ください。',
    modeAriaLabel: '変換方向',
    modeYamlToJson: 'YAML→JSON',
    modeJsonToYaml: 'JSON→YAML',
    indentLabel: 'インデント幅',
    indentOption2: '半角スペース2個',
    indentOption4: '半角スペース4個',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    outputLabel: '結果',
    inputPlaceholderYamlToJson: 'name: Taro\nhobbies:\n  - reading\n  - coding',
    inputPlaceholderJsonToYaml:
      '{"name": "Taro", "hobbies": ["reading", "coding"]}',
    syntaxErrorPrefix: '構文エラー',
    notesHeading: '注意事項',
    notes: [
      'JSONにはコメントがないため、YAMLのコメントは変換時に失われます。',
      'YAMLはインデントに意味があり、タブ文字は使えません。エラーが出たときは、スペースでそろっているか確認してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
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
        term: 'インデントエラー',
        description:
          'YAMLは字下げの深さで階層を表すため、スペースの数がずれていたり、タブ文字が混ざっていたりすると構文エラーになります。',
      },
    ],
  },
  en: {
    title: 'YAML to JSON Converter',
    description:
      'Free online tool to convert between YAML and JSON, handy for checking Docker Compose or GitHub Actions config files in JSON form. Syntax errors are shown with a clear message. Your data is processed in the browser and never sent to a server.',
    h1: 'YAML ⇔ JSON Converter',
    introHtml:
      'Paste YAML to convert it to JSON, or paste JSON to convert it to YAML — useful when you want to inspect a Docker Compose, GitHub Actions, or Kubernetes manifest file in the other format. To further format or validate the resulting JSON, try the <a href="/en/tools/json-formatter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">JSON Formatter</a> as well.',
    modeAriaLabel: 'Direction',
    modeYamlToJson: 'YAML→JSON',
    modeJsonToYaml: 'JSON→YAML',
    indentLabel: 'Indent',
    indentOption2: '2 spaces',
    indentOption4: '4 spaces',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    outputLabel: 'Result',
    inputPlaceholderYamlToJson: 'name: Taro\nhobbies:\n  - reading\n  - coding',
    inputPlaceholderJsonToYaml:
      '{"name": "Taro", "hobbies": ["reading", "coding"]}',
    syntaxErrorPrefix: 'Syntax error',
    notesHeading: 'Notes',
    notes: [
      'JSON has no comments, so YAML comments are lost during conversion.',
      'Indentation is significant in YAML and tabs are not allowed. If an error appears, check that spaces are used consistently.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'YAML',
        description:
          "A human-friendly data format that represents structure using indentation. It's widely used for config files such as Docker Compose, GitHub Actions, and Kubernetes manifests.",
      },
      {
        term: 'JSON',
        description:
          'Short for JavaScript Object Notation, a text format for representing data as key-value pairs. It is widely used for APIs and configuration files.',
      },
      {
        term: 'Indentation error',
        description:
          'YAML uses indentation depth to represent structure, so inconsistent spacing or a stray tab character will cause a syntax error.',
      },
    ],
  },
};
