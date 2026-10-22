import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'YAMLでインデントにタブを使えないのはなぜですか？',
      answer:
        'YAMLの仕様ではインデントに半角スペースだけが使え、タブは構文エラーになります。タブが混ざったYAMLはエラーとして行・列を示すので、該当箇所を半角スペースに直してください。出力のインデントは2個か4個から選べます。',
    },
    {
      question: '整形するとコメントや値は変わりますか？',
      answer:
        'コメントは保持し、キーと値の内容は変えません。ただし {a: 1} のような書き方のスペース、引用符の付け方、空行などは整形の規則に合わせて揃うことがあります。YAMLとしての意味は変わらないので、設定ファイルでも差分を確認してから使えます。',
    },
    {
      question: '同じキーが2回出てくるとエラーになるのはなぜですか？',
      answer:
        'YAML 1.2ではマップのキーは一意であるべきとされており、重複すると後の値が前の値を黙って上書きする実装もあります。意図しない設定ミスを防ぐため、重複キーはエラーとして行・列を表示します。',
    },
    {
      question: '複数のドキュメントを含むYAMLも整形できますか？',
      answer:
        'はい。--- で区切られた複数のドキュメントをそれぞれ整形し、--- でつないで出力します。どれか1つにエラーがある場合は、何番目のドキュメントのどの行かを表示します。',
    },
  ],
  en: [
    {
      question: 'Why does a tab in my indentation cause an error?',
      answer:
        'The YAML spec allows only spaces for indentation, so tabs are a syntax error. The tool reports the line and column, so replace the tab with spaces. The output indent can be 2 or 4 spaces.',
    },
    {
      question: 'Does formatting change my comments or values?',
      answer:
        'Comments are kept and keys and values are not altered. Spacing in inline forms like {a: 1}, quoting style, and blank lines may be normalized. The meaning of the YAML stays the same, but it is still worth reviewing the diff for config files.',
    },
    {
      question: 'Why is a duplicate key reported as an error?',
      answer:
        'Keys in a YAML map are supposed to be unique, and some parsers silently let the later value overwrite the earlier one. To catch accidental mistakes, duplicate keys are reported with their line and column.',
    },
    {
      question: 'Can it format YAML with multiple documents?',
      answer:
        'Yes. Each document separated by --- is formatted and the results are joined with ---. If one of them has an error, the message tells you which document and which line.',
    },
  ],
};
