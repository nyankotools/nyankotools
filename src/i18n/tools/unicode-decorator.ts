import type { Locale } from '../../data/tools';
import type { DecoratorStyleId } from '../../lib/tools/unicode-decorator';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface UnicodeDecoratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  inputLabel: string;
  inputPlaceholder: string;
  sampleText: string;
  /** 入力が空のときに、見た目の確認用として表示する文字 */
  previewText: string;
  resultsLabel: string;
  copy: string;
  copied: string;
  copyFailed: string;
  styleNames: Record<DecoratorStyleId, string>;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const unicodeDecoratorContent: Record<
  Locale,
  UnicodeDecoratorPageContent
> = {
  ja: {
    title: 'Unicode装飾文字変換｜おしゃれ文字・太字・丸文字をコピペ',
    description:
      '英数字を太字・斜体・筆記体・丸文字・全角・取り消し線などのUnicode装飾文字に変換する無料ツールです。X（旧Twitter）やInstagramのプロフィール、ゲーム名に貼り付けられます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'Unicode装飾文字変換（おしゃれ文字ジェネレーター）',
    introHtml:
      '英数字を、太字・筆記体・丸文字・取り消し線などの「おしゃれ文字」に変換します。結果の右の「コピー」を押して、SNSのプロフィールやゲーム内の名前に貼り付けてください。日本語（ひらがな・カタカナ・漢字）には装飾がないため、そのまま残ります。英数字の全角⇔半角変換は <a href="/tools/zenkaku-hankaku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">全角半角変換</a> をご利用ください。',
    inputLabel: '変換する文字',
    inputPlaceholder: '英数字を入力（例: Nyanko Tools 2026）',
    sampleText: 'Nyanko Tools 2026',
    previewText: 'Nyanko Tools 2026',
    resultsLabel: '変換結果',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    styleNames: {
      bold: '太字（Bold）',
      italic: '斜体（Italic）',
      boldItalic: '太字の斜体',
      script: '筆記体',
      boldScript: '太字の筆記体',
      fraktur: 'ゴシック体（Fraktur）',
      boldFraktur: '太字のゴシック体',
      doubleStruck: '二重線（黒板太字）',
      sans: 'サンセリフ',
      sansBold: 'サンセリフ太字',
      sansItalic: 'サンセリフ斜体',
      sansBoldItalic: 'サンセリフ太字斜体',
      monospace: '等幅',
      fullwidth: '全角',
      circled: '丸文字',
      negativeCircled: '黒丸文字',
      squared: '四角文字',
      negativeSquared: '黒四角文字',
      parenthesized: 'かっこ付き',
      smallCaps: 'スモールキャップ',
      flipped: '上下反転',
      strikethrough: '取り消し線',
      underline: '下線',
      doubleUnderline: '二重下線',
      slash: 'スラッシュ線',
      wrapStar: '星で囲む',
      wrapBracket: '隅付き括弧で囲む',
      wrapKakko: '二重かぎ括弧で囲む',
      wrapFlower: '飾り括弧で囲む',
      wrapSparkle: 'キラキラで囲む',
    },
    notesHeading: '注意事項',
    notes: [
      '変換後の文字は、普通の英字ではなく別の文字（Unicodeの数学用英数字記号など）です。検索・並べ替え・文字数制限の数え方・ユーザー名やパスワードの入力では、元の英字とは別の文字として扱われます。',
      'スクリーンリーダーは変換後の文字を「数学用の太字A」のように読み上げることがあり、内容が伝わりにくくなります。大事な情報や、アクセシビリティが必要な文章には使わないでください。',
      'アプリや端末のフォントによっては、表示されない（□や？になる）ことがあります。公開前に、貼り付け先で表示を確認してください。',
      '丸文字・四角文字・かっこ付きなどは、対応する文字（英字や一部の数字）だけが変換されます。取り消し線・下線は、文字ごとに結合文字を付けるため、使うアプリによっては線がずれて見えます。',
      '上下反転は、対応する英数字と一部の記号だけを反転して逆順に並べます。完全な「逆さ文字」ではありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'Unicode',
        description:
          '世界中の文字に番号（コードポイント）を割り当てた文字コードの規格です。太字や丸文字は装飾ではなく、それぞれ別の番号を持つ別の文字として定義されています。',
      },
      {
        term: '結合文字',
        description:
          '直前の文字に重ねて表示される文字です。取り消し線や下線は、各文字の後ろに結合文字を付けることで表現しています。',
      },
      {
        term: '数学用英数字記号',
        description:
          '数式で太字や筆記体などの区別を表すためにUnicodeへ追加された文字のまとまりです。このツールの太字・斜体・筆記体などは、これを使っています。',
      },
    ],
  },
  en: {
    title: 'Unicode Text Decorator – Fancy Fonts & Bubble Text',
    description:
      'Turn letters into fancy Unicode text: bold, script, circled, strikethrough and more. Runs in your browser; nothing is sent to a server.',
    h1: 'Unicode Text Decorator (Fancy Text Generator)',
    introHtml:
      'Turn plain letters and numbers into fancy text: bold, script, bubble letters, strikethrough and more. Press Copy next to a result and paste it into a social media bio or a game name. Characters without a decorated form, such as Japanese, stay as they are. To convert between fullwidth and halfwidth characters, see the <a href="/en/tools/zenkaku-hankaku/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Fullwidth/Halfwidth Converter</a>.',
    inputLabel: 'Text to convert',
    inputPlaceholder: 'Enter letters and numbers (e.g. Nyanko Tools 2026)',
    sampleText: 'Nyanko Tools 2026',
    previewText: 'Nyanko Tools 2026',
    resultsLabel: 'Results',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    styleNames: {
      bold: 'Bold',
      italic: 'Italic',
      boldItalic: 'Bold italic',
      script: 'Script',
      boldScript: 'Bold script',
      fraktur: 'Fraktur (gothic)',
      boldFraktur: 'Bold Fraktur',
      doubleStruck: 'Double-struck',
      sans: 'Sans-serif',
      sansBold: 'Sans-serif bold',
      sansItalic: 'Sans-serif italic',
      sansBoldItalic: 'Sans-serif bold italic',
      monospace: 'Monospace',
      fullwidth: 'Fullwidth',
      circled: 'Circled',
      negativeCircled: 'Black circled',
      squared: 'Squared',
      negativeSquared: 'Black squared',
      parenthesized: 'Parenthesized',
      smallCaps: 'Small caps',
      flipped: 'Upside down',
      strikethrough: 'Strikethrough',
      underline: 'Underline',
      doubleUnderline: 'Double underline',
      slash: 'Slash through',
      wrapStar: 'Between stars',
      wrapBracket: 'Between corner brackets',
      wrapKakko: 'Between double brackets',
      wrapFlower: 'Between ornate brackets',
      wrapSparkle: 'Sparkle frame',
    },
    notesHeading: 'Notes',
    notes: [
      'The converted characters are not ordinary letters but different Unicode characters (such as Mathematical Alphanumeric Symbols). Search, sorting, character limits, usernames and passwords treat them as different characters from the original letters.',
      'Screen readers may read the converted text as "mathematical bold capital A" and so on, which makes it hard to understand. Do not use it for important information or for text that must be accessible.',
      'Depending on the app or device font, some characters may not display (shown as □ or ?). Check how the text looks where you paste it before publishing.',
      'Circled, squared and parenthesized styles only convert the supported characters (letters and some digits). Strikethrough and underline add a combining character after every character, so the lines may look misaligned in some apps.',
      'Upside down only flips supported letters, digits and a few symbols, then reverses the order. It is not a perfect rotation of the text.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Unicode',
        description:
          'A character encoding standard that assigns a number (code point) to characters from the world’s writing systems. Bold and circled letters are not styling: each is defined as a separate character with its own number.',
      },
      {
        term: 'Combining character',
        description:
          'A character that is drawn on top of the one before it. Strikethrough and underline are made by adding a combining character after each character.',
      },
      {
        term: 'Mathematical Alphanumeric Symbols',
        description:
          'A block of Unicode characters added so that math formulas can distinguish bold, script and other letter styles. The bold, italic and script styles in this tool use it.',
      },
    ],
  },
};
