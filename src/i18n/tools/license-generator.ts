import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface LicenseGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  howToHeading: string;
  howToSteps: string[];
  licenseLabel: string;
  holderLabel: string;
  holderPlaceholder: string;
  yearLabel: string;
  yearInvalid: string;
  spdxLabel: string;
  noticeOnly: string;
  fullTextNote: string;
  officialLink: string;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  download: string;
  snippetsHeading: string;
  packageJsonLabel: string;
  spdxHeaderLabel: string;
  tableHeading: string;
  tableCaption: string;
  colLicense: string;
  colSpdx: string;
  colCommercial: string;
  colModify: string;
  colRedistribute: string;
  colPatent: string;
  colCopyleft: string;
  allowed: string;
  patentYes: string;
  patentNo: string;
  copyleftNone: string;
  copyleftWeak: string;
  copyleftStrong: string;
  tableNote: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const licenseGeneratorContent: Record<
  Locale,
  LicenseGeneratorPageContent
> = {
  ja: {
    title: 'OSSライセンス文生成（MIT・Apache・BSD・GPL）',
    description:
      'MIT・Apache-2.0・BSD・ISC・Unlicenseなどのライセンス文を、著作者名と年を入れてLICENSEとして生成。SPDX識別子と比較表つき。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'OSSライセンス文生成（LICENSEファイル・SPDX識別子つき）',
    introHtml:
      'MIT、Apache-2.0、BSD、ISC、Unlicense などのライセンス文を、著作者名と年を入れて生成します。LICENSE ファイルとしてそのままコピー・ダウンロードでき、package.json 用の SPDX 識別子やソースファイル用のヘッダーも出力します。ブラウザ内で処理され、入力がサーバーに送信されることはありません。Webサイトを公開するときは <a href="/tools/robots-txt-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">robots.txt生成</a> も役立ちます。',
    howToHeading: '使い方',
    howToSteps: [
      '「ライセンス」を選びます。比較表で商用利用や特許条項などの違いを確認できます。',
      '「著作者名」と「年」を入力します。年は現在の年が入っています。',
      '出力された本文を「コピー」または「ダウンロード」します。',
      'プロジェクトの直下に LICENSE として置き、必要なら package.json にも SPDX 識別子を書きます。',
    ],
    licenseLabel: 'ライセンス',
    holderLabel: '著作者名',
    holderPlaceholder: 'Taro Yamada',
    yearLabel: '年',
    yearInvalid:
      '年は「2026」や「2020-2026」の形式で入力してください（そのまま出力はされます）。',
    spdxLabel: 'SPDX識別子',
    noticeOnly:
      'このライセンスは条文が長いため、全文は出力せず、ソースファイルの先頭に付ける注記を出力します。LICENSE には公式の全文を配置してください。',
    fullTextNote:
      '公式の条文をそのまま出力しています。著作権表示の行だけを入力値で置き換えます。',
    officialLink: '公式の全文を開く',
    outputLabel: '出力',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    download: 'ダウンロード',
    snippetsHeading: 'あわせて使うコード',
    packageJsonLabel: 'package.json',
    spdxHeaderLabel: 'ソースファイルの先頭コメント',
    tableHeading: 'ライセンスの比較',
    tableCaption: '主なライセンスの特徴（一般的な整理）',
    colLicense: 'ライセンス',
    colSpdx: 'SPDX識別子',
    colCommercial: '商用利用',
    colModify: '改変',
    colRedistribute: '再配布',
    colPatent: '特許条項',
    colCopyleft: 'コピーレフト',
    allowed: '可',
    patentYes: 'あり',
    patentNo: '明示なし',
    copyleftNone: 'なし',
    copyleftWeak: '弱い',
    copyleftStrong: '強い',
    tableNote:
      '一般的な事実の整理であり、法的助言ではありません。再配布時の表示義務やソース開示の範囲は条文により異なります。',
    notesHeading: '注意事項',
    notes: [
      '条文は公式のテキストを転記していますが、版や配布元によって空白や改行が異なることがあります。重要なプロジェクトでは公式の全文と照合してください。',
      'GPL-3.0・LGPL-3.0・MPL-2.0 は条文が長いため全文は収録していません。ソースファイル用の注記を出力し、LICENSE には公式サイトの全文を置いてください。',
      '比較表は一般的な事実の整理で、法的助言ではありません。ライセンスの選択や互換性の判断は、必要に応じて専門家にご相談ください。',
      '既に公開している他者のコードを含む場合は、そのライセンス条件が優先されます。',
      '入力内容は保存・送信されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'SPDX識別子',
        description:
          'ライセンスを機械可読な短い名前で表す標準の識別子です（例: MIT、Apache-2.0）。package.json の license や、ソースのコメントに使います。',
      },
      {
        term: 'コピーレフト',
        description:
          '改変物を配布するときに、同じライセンス条件での公開を求める仕組みです。GPLは強い、MPLやLGPLは範囲が限定された弱いコピーレフトです。',
      },
      {
        term: 'パーミッシブライセンス',
        description:
          'MIT・BSD・ISC・Apache-2.0 など、著作権表示と免責の保持を主な条件とし、ほぼ自由に利用できるライセンスの総称です。',
      },
    ],
  },
  en: {
    title: 'Open Source License Generator (MIT, Apache, BSD, GPL)',
    description:
      'Generate a LICENSE file for MIT, Apache-2.0, BSD, ISC, Unlicense and more with your name and year, plus SPDX IDs. Runs in your browser; nothing is sent.',
    h1: 'Open Source License Generator (LICENSE File with SPDX ID)',
    introHtml:
      'Generate the text of a license such as MIT, Apache-2.0, BSD, ISC or the Unlicense with your name and year filled in. Copy it or download it as a LICENSE file, and get the SPDX identifier for package.json and a source file header. Everything runs in your browser, and nothing you enter is sent to a server. Publishing a website? The <a href="/en/tools/robots-txt-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">robots.txt Generator</a> may help too.',
    howToHeading: 'How to use',
    howToSteps: [
      'Pick a "License". The comparison table shows commercial use, patent terms and more.',
      'Enter the "Copyright holder" and the "Year". The year defaults to the current year.',
      'Click "Copy" or "Download" to take the generated text.',
      'Save it as LICENSE at the project root, and add the SPDX identifier to package.json if needed.',
    ],
    licenseLabel: 'License',
    holderLabel: 'Copyright holder',
    holderPlaceholder: 'Jane Doe',
    yearLabel: 'Year',
    yearInvalid:
      'Use a form like "2026" or "2020-2026". The text is still generated as typed.',
    spdxLabel: 'SPDX identifier',
    noticeOnly:
      'This license is too long to include in full, so the output is the notice to put at the top of each source file. Add the official full text as your LICENSE file.',
    fullTextNote:
      'The official text is output unchanged except for the copyright line, which uses your input.',
    officialLink: 'Open the official full text',
    outputLabel: 'Output',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    download: 'Download',
    snippetsHeading: 'Related snippets',
    packageJsonLabel: 'package.json',
    spdxHeaderLabel: 'Source file header comment',
    tableHeading: 'License comparison',
    tableCaption: 'Key traits of the licenses (general overview)',
    colLicense: 'License',
    colSpdx: 'SPDX ID',
    colCommercial: 'Commercial use',
    colModify: 'Modification',
    colRedistribute: 'Redistribution',
    colPatent: 'Patent clause',
    colCopyleft: 'Copyleft',
    allowed: 'Yes',
    patentYes: 'Yes',
    patentNo: 'Not explicit',
    copyleftNone: 'None',
    copyleftWeak: 'Weak',
    copyleftStrong: 'Strong',
    tableNote:
      'This is a general overview, not legal advice. Notice and source-disclosure duties differ by license text.',
    notesHeading: 'Notes',
    notes: [
      'The license texts are transcribed from the official versions, but whitespace and line breaks can differ between sources. For important projects, compare with the official full text.',
      'GPL-3.0, LGPL-3.0 and MPL-2.0 are long, so the full texts are not included. The output is the notice for source file headers; use the full text from the official site as your LICENSE.',
      'The comparison table is a general overview, not legal advice. Consult a professional when choosing a license or judging compatibility.',
      "If your project includes other people's code, that code's license terms still apply.",
      'Nothing you enter is stored or sent.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'SPDX identifier',
        description:
          'A standard short, machine-readable name for a license (for example MIT or Apache-2.0), used in the license field of package.json and in source comments.',
      },
      {
        term: 'Copyleft',
        description:
          'A mechanism that requires derived works to be shared under the same license terms. The GPL is strong copyleft; the MPL and LGPL are weak copyleft with a narrower scope.',
      },
      {
        term: 'Permissive license',
        description:
          'A family of licenses such as MIT, BSD, ISC and Apache-2.0 whose main conditions are keeping the copyright notice and disclaimer, otherwise allowing broad reuse.',
      },
    ],
  },
};
