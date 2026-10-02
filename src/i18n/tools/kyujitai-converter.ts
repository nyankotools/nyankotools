import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface KyujitaiConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  directionLabel: string;
  modeToShinjitai: string;
  modeToKyujitai: string;
  variantsLabel: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  outputLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** {total} を置換して表示する */
  summary: string;
  summaryNone: string;
  changesLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const kyujitaiConverterContent: Record<
  Locale,
  KyujitaiConverterPageContent
> = {
  ja: {
    title: '旧字体⇔新字体変換（國→国・髙→高）',
    description:
      '旧字体と新字体を相互に変換する無料ツールです。國→国・學→学・體→体・髙→高などの対応を、文章まとめて変換できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '旧字体⇔新字体変換',
    introHtml:
      '旧字体（國・學・體）と新字体（国・学・体）を相互に変換します。古い書類や戸籍・登記の転記、名前の表記ゆれの統一に使えます。変換した文字は一覧で確認でき、「髙」「﨑」などの異体字も新字体にできます。ひらがなとカタカナの変換は <a href="/tools/kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ひらがな/カタカナ変換</a> をご利用ください。',
    directionLabel: '変換方向',
    modeToShinjitai: '旧字体→新字体',
    modeToKyujitai: '新字体→旧字体',
    variantsLabel: '髙・﨑・嶋などの異体字も新字体にする',
    inputLabel: '入力',
    inputPlaceholder: '変換したいテキストを入力',
    sampleText: '國會議事堂、學校、體育館、髙橋さん、鈴木﨑',
    outputLabel: '結果',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    summary: '{total}文字を変換しました。',
    summaryNone: '変換対象の文字はありませんでした。',
    changesLabel: '変換した文字',
    notesHeading: '注意事項',
    notes: [
      '対応しているのは、主な常用漢字の旧字体（康熙字典体）と、人名に使われる一部の異体字です。すべての旧字体・異体字を網羅しているわけではありません。',
      '新字体→旧字体は、前後の言葉を考慮せず1文字ずつ置き換えます。実際の旧表記と異なる結果になる語があるため、「台」「予」「欠」のように意味が分かれる字は新字体→旧字体では変換しません。',
      '「弁」の旧字体は辨・辯・瓣の3つに分かれるため、新字体→旧字体では変換しません。旧字体→新字体では3つとも「弁」にします。',
      '人名や地名の正式な表記は、戸籍・登記・住民票などで確認してください。このツールの結果をそのまま公的な書類に使うことは避けてください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '旧字体・新字体',
        description:
          '旧字体は、1946年の当用漢字表で字形が整理される前から使われてきた画数の多い字形です。新字体は、それを簡略化して標準にした字形で、現在の常用漢字表の多くの字がこれにあたります。このツールの旧字体は、いわゆる康熙字典体を指します。',
      },
      {
        term: '異体字',
        description:
          '同じ字を表すのに使われる、形の違う字のことです。「高」に対する「髙」（はしご高）、「崎」に対する「﨑」（たつさき）などは、人名や地名に使われますが、新字体と旧字体の関係とは別に扱います。',
      },
    ],
  },
  en: {
    title: 'Kyujitai ⇔ Shinjitai Converter (Old and New Kanji Forms)',
    description:
      'Convert between old kanji forms (kyujitai) and modern forms (shinjitai), including name variants. Runs in your browser; nothing is sent to a server.',
    h1: 'Kyujitai ⇔ Shinjitai Converter (Old & New Kanji Forms)',
    introHtml:
      'Convert Japanese text between old kanji forms (kyujitai: 國, 學, 體) and the modern simplified forms (shinjitai: 国, 学, 体). It is useful when transcribing old documents, family registers or names, or when a form rejects characters outside the current standard. The tool lists every character it changed, and can also normalise name variants such as 髙 and 﨑. For hiragana and katakana, see the <a href="/en/tools/kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Hiragana / Katakana Converter</a>.',
    directionLabel: 'Direction',
    modeToShinjitai: 'Old → new forms',
    modeToKyujitai: 'New → old forms',
    variantsLabel: 'Also convert name variants (髙, 﨑, 嶋…) to standard forms',
    inputLabel: 'Input',
    inputPlaceholder: 'Enter text to convert',
    sampleText: '國會議事堂、學校、體育館、髙橋さん、鈴木﨑',
    outputLabel: 'Result',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    summary: 'Converted {total} character(s).',
    summaryNone: 'No convertible characters found.',
    changesLabel: 'Characters changed',
    notesHeading: 'Notes',
    notes: [
      'The tool covers the old forms (Kangxi dictionary forms) of the main jōyō kanji, plus some variant characters used in names. It is not an exhaustive list of every old form or variant.',
      'New → old replaces one character at a time without looking at the surrounding word. Some words come out differently from the real old spelling, so characters with several meanings (台, 予, 欠) are not converted in the new → old direction.',
      'The kanji 弁 has three old forms (辨, 辯, 瓣), so it is not converted in the new → old direction. In the old → new direction all three become 弁.',
      'Check the official spelling of a name or place in a family register, property record or residence record. Do not use this tool’s output as-is on official documents.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Kyujitai and shinjitai',
        description:
          'Kyujitai ("old character forms") are the traditional, more complex forms used before the 1946 reforms. Shinjitai ("new character forms") are the simplified forms that became the standard and make up most of today’s jōyō kanji. The old forms used here are the Kangxi dictionary forms.',
      },
      {
        term: 'Variant characters (itaiji)',
        description:
          'Characters with a different shape that stand for the same kanji. For example 髙 (ladder-top 高) for 高 and 﨑 for 崎 appear in names and place names. They are handled separately from the old/new pairs.',
      },
    ],
  },
};
