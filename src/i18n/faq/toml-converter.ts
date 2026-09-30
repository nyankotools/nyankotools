import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'JSONの配列をTOMLに変換できますか？',
      answer:
        'できません。TOMLはトップレベルがテーブル（オブジェクト）である必要があるため、JSONやYAMLのトップレベルが配列や文字列の場合はTOMLに変換できません。',
    },
    {
      question: 'nullの値はどうなりますか？',
      answer:
        'TOMLにはnullに相当する値がないため、JSONやYAMLのnullのフィールドはTOMLに変換する際に除外されます。',
    },
    {
      question: '同じ形式どうしを指定するとどうなりますか？',
      answer:
        '変換元と変換先に同じ形式を選ぶと、その形式で構文を整形し直せます。たとえばTOMLからTOMLで、インデントや空白を統一できます。',
    },
  ],
  en: [
    {
      question: 'Can a top-level JSON array be converted to TOML?',
      answer:
        'No. TOML requires the top level to be a table (object), so JSON or YAML with a top-level array or string cannot be converted.',
    },
    {
      question: 'What happens to null values?',
      answer:
        'TOML has no null, so fields with null values in JSON or YAML are dropped in TOML output.',
    },
    {
      question: 'What happens if I pick the same format for input and output?',
      answer:
        'The content is reformatted in that format, for example TOML to TOML to normalize indentation and spacing.',
    },
  ],
};
