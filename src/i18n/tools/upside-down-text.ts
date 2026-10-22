import type { Locale } from '../../data/tools';
import type { UpsideDownMode } from '../../lib/tools/upside-down-text';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface UpsideDownTextPageContent {
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
  /** {converted} と {unconverted} を数に置き換える */
  countTemplate: string;
  allConverted: string;
  modeNames: Record<UpsideDownMode, string>;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const upsideDownTextContent: Record<Locale, UpsideDownTextPageContent> =
  {
    ja: {
      title: '上下反転・鏡文字テキスト変換｜逆さ文字をコピペ',
      description:
        '英数字を上下反転（逆さ文字）・左右反転（鏡文字）・逆順に変換する無料ツールです。SNSのプロフィールやゲーム名に貼り付けられます。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: '上下反転・鏡文字テキスト変換（逆さ文字ジェネレーター）',
      introHtml:
        '入力した文字を、上下逆さま・左右反転（鏡文字）・逆順の3通りに変換します。結果の右の「コピー」を押して、SNSのプロフィールなどに貼り付けてください。対応する文字（英数字と一部の記号）だけが反転され、日本語などはそのまま残ります。変換できなかった文字数も表示します。太字や丸文字にしたいときは <a href="/tools/unicode-decorator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unicode装飾文字変換</a> をご利用ください。',
      inputLabel: '変換する文字',
      inputPlaceholder: '英数字を入力（例: Hello Nyanko 2026）',
      sampleText: 'Hello Nyanko 2026',
      previewText: 'Hello Nyanko 2026',
      resultsLabel: '変換結果',
      copy: 'コピー',
      copied: 'コピーしました',
      copyFailed: 'コピーに失敗しました',
      countTemplate:
        '変換 {converted} 文字 / そのまま残した文字 {unconverted} 文字',
      allConverted: 'すべて変換できました',
      modeNames: {
        upsideDown: '上下反転（逆さ文字）',
        mirror: '左右反転（鏡文字）',
        reverse: '逆順（文字を置き換えない）',
      },
      notesHeading: '注意事項',
      notes: [
        '変換後の文字は、普通の英字ではなく別のUnicode文字です。検索・ユーザー名・パスワードの入力では、元の英字とは別の文字として扱われます。',
        '対応表にある英数字と一部の記号だけを置き換えます。ひらがな・カタカナ・漢字などはそのまま残り、並び順だけが逆になります。',
        '反転後の文字の一部は、フォントによって表示されない（□や？になる）ことがあります。貼り付け先で表示を確認してください。',
        '複数行の場合は、1行ごとに左右の並びを逆にします。行の順番は変わりません。',
        'スクリーンリーダーでは正しく読み上げられないため、大事な情報には使わないでください。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: '逆さ文字',
          description:
            '文字を180度回転させたように見える文字のことです。Unicodeにある似た形の別の文字を並べ、順番を逆にして作ります。',
        },
        {
          term: '鏡文字',
          description:
            '文字を左右反転させた、鏡に映したような文字です。左右が反転した形の文字が無いものは、そのまま残ります。',
        },
      ],
    },
    en: {
      title: 'Upside Down Text Generator – Flip & Mirror Text',
      description:
        'Flip text upside down, mirror it or reverse it. Copy and paste into bios and game names. Runs in your browser; nothing is sent to a server.',
      h1: 'Upside Down & Mirror Text Generator',
      introHtml:
        'Turn your text upside down, mirror it left to right, or just reverse it. Press Copy next to a result and paste it into a social media bio or a game name. Only supported characters (letters, digits and some symbols) are flipped; everything else stays as it is, and the tool tells you how many characters could not be converted. For bold or bubble letters, see the <a href="/en/tools/unicode-decorator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unicode Text Decorator</a>.',
      inputLabel: 'Text to convert',
      inputPlaceholder: 'Enter text (e.g. Hello Nyanko 2026)',
      sampleText: 'Hello Nyanko 2026',
      previewText: 'Hello Nyanko 2026',
      resultsLabel: 'Results',
      copy: 'Copy',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      countTemplate: '{converted} converted / {unconverted} left unchanged',
      allConverted: 'Everything was converted',
      modeNames: {
        upsideDown: 'Upside down',
        mirror: 'Mirrored (left to right)',
        reverse: 'Reversed (no character swap)',
      },
      notesHeading: 'Notes',
      notes: [
        'The converted characters are not ordinary letters but other Unicode characters. Search, usernames and passwords treat them as different characters from the originals.',
        'Only letters, digits and some symbols in the conversion table are swapped. Other characters, such as Japanese, stay as they are and only their order is reversed.',
        'Some flipped characters may not display in every font (shown as □ or ?). Check how the text looks where you paste it.',
        'For multi-line text, each line is reversed on its own. The order of the lines does not change.',
        'Screen readers cannot read this text properly, so do not use it for important information.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Upside down text',
          description:
            'Text that looks rotated by 180 degrees. It is made by swapping each letter for a similar-looking Unicode character and reversing the order.',
        },
        {
          term: 'Mirror text',
          description:
            'Text flipped left to right, as if seen in a mirror. Characters with no mirrored form in Unicode stay unchanged.',
        },
      ],
    },
  };
