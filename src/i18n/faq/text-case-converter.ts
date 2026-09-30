import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'camelCaseとPascalCaseの違いは何ですか？',
      answer:
        'camelCaseは先頭の単語を小文字で始め（myVariableName）、PascalCaseは先頭も大文字にします（MyVariableName）。一般に変数や関数はcamelCase、クラス名はPascalCaseが使われます。',
    },
    {
      question: 'スペースやハイフン区切りの文字列も認識されますか？',
      answer:
        'はい。スペース・ハイフン・アンダースコアによる単語の区切りや、すでにcamelCaseで書かれた文字列も自動で認識して、9種類の命名規則にまとめて変換します。',
    },
    {
      question: '日本語を含む文字列は変換できますか？',
      answer:
        '日本語には大文字・小文字の区別がないため、文字そのものは変換されません。命名規則の変換は、英数字で書かれた変数名や関数名などの識別子を対象にお使いください。',
    },
  ],
  en: [
    {
      question: 'What is the difference between camelCase and PascalCase?',
      answer:
        'camelCase starts with a lowercase word (myVariableName) while PascalCase capitalizes the first word too (MyVariableName). Variables and functions usually use camelCase; class names use PascalCase.',
    },
    {
      question: 'Does it recognize words separated by spaces or hyphens?',
      answer:
        'Yes. Separators such as spaces, hyphens and underscores, as well as existing camelCase, are detected and converted to nine naming styles at once.',
    },
    {
      question: 'Can it convert strings containing Japanese?',
      answer:
        'Japanese has no letter case, so those characters are not converted. Use this tool for identifiers written in letters and digits, such as variable and function names.',
    },
  ],
};
