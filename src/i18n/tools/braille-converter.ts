import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface BrailleConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  directionLabel: string;
  modeToBraille: string;
  modeToKana: string;
  copy: string;
  copied: string;
  copyFailed: string;
  inputLabel: string;
  inputPlaceholderToBraille: string;
  inputPlaceholderToKana: string;
  sampleText: string;
  outputLabel: string;
  unsupportedPrefix: string;
  dotsHeading: string;
  dotsLabel: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const brailleConverterContent: Record<
  Locale,
  BrailleConverterPageContent
> = {
  ja: {
    title: '点字変換（日本語点字・Unicode点字）',
    description:
      'ひらがな・カタカナを日本語点字（6点・Unicode点字）に、点字をかなに変換する無料ツールです。濁音・拗音・促音・数符にも対応し、各セルの点の番号も確認できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '点字変換（日本語点字・Unicode点字）',
    introHtml:
      'かな文字を日本語点字（Unicode点字）に、点字をかなに相互変換します。濁音・半濁音・拗音・促音・長音・数符・つなぎ符に対応し、変換後は点字1マスごとの点の番号（1〜6の点）も一覧で確認できます。点字の学習や、印刷物・資料への点字表記の挿入にご利用ください。ひらがなとカタカナを揃えたいときは <a href="/tools/kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ひらがな/カタカナ変換</a> もご利用いただけます。',
    directionLabel: '変換方向',
    modeToBraille: 'かな→点字',
    modeToKana: '点字→かな',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    inputLabel: '入力',
    inputPlaceholderToBraille: '点字にしたいかな文字を入力',
    inputPlaceholderToKana: 'かなに戻したい点字を貼り付け',
    sampleText: 'にゃんこツールズ 2026ねん',
    outputLabel: '結果',
    unsupportedPrefix: '変換できずそのまま残した文字: ',
    dotsHeading: '点の番号',
    dotsLabel: '点',
    notesHeading: '注意事項',
    notes: [
      '漢字・英字・記号の多くは変換できず、そのまま残ります（かな文字と数字のみ変換します）。漢字を含む文章は、先にひらがなに直してください。',
      '点字の表記は分かち書きが必要で、助詞の「は」「へ」は「わ」「え」と書くなどの決まりもありますが、本ツールは文字を1つずつ置き換えるだけなので、これらは自動では行いません。正式な点字資料の作成には、点字の専門家や点訳ソフトで確認してください。',
      '点字→かなの変換は、Unicodeの点字パターン（U+2800〜）のうち6点の範囲を解釈します。8点点字の点7・8を含むセルは解釈できず、そのまま残します。',
      '「！」と古い仮名「ゑ」は同じ点字（点2・3・5）のため、点字→かなでは「！」に戻します。かぎ括弧「」の開閉も同じ点字（点3・6）のため、出現順に開き・閉じを交互に当てはめます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '日本語点字（6点点字）',
        description:
          '縦3点×横2列の6つの点の組み合わせで文字を表す方式です。五十音を6点の組み合わせで表し、濁音・半濁音・拗音・促音などは、清音の前に前置符をつけて表します。',
      },
      {
        term: 'Unicode点字',
        description:
          'U+2800〜U+28FF にある、点字パターンを表す文字のブロックです。8つの点の組み合わせ（256通り）が収められており、そのうち6点の範囲（64通り）が日本語点字の6点点字に対応します。テキストとしてコピー・貼り付けでき、点字表示器や点字プリンターへの入力にも使われます。',
      },
      {
        term: '数符・つなぎ符',
        description:
          '数符は、後に続く点字が数字であることを示す記号です。数字の0〜9は、かなの「あ行」「ら行」と同じ点字の形になるため、数字の直後にあ行・ら行の文字が続く場合は、区別のためにつなぎ符を入れます。',
      },
    ],
  },
  en: {
    title: 'Japanese Braille Converter (Kana to Unicode Braille)',
    description:
      'Convert Japanese kana to six-dot braille (Unicode) and back, with voiced marks, yoon and number signs. Runs in your browser; nothing is sent to a server.',
    h1: 'Japanese Braille Converter (Kana ⇔ Unicode Braille)',
    introHtml:
      'Type hiragana or katakana and get the matching Japanese braille (Nihongo tenji) as Unicode braille characters, or paste braille to turn it back into kana. Voiced and semi-voiced marks, contracted sounds, the small tsu, the long-vowel mark, the number sign and the connector are all handled, and every output cell is listed with its dot numbers (1–6). Useful for studying Japanese braille or adding braille to printed material. To normalize hiragana and katakana first, try the <a href="/en/tools/kana-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Hiragana / Katakana Converter</a>.',
    directionLabel: 'Direction',
    modeToBraille: 'Kana → Braille',
    modeToKana: 'Braille → Kana',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    inputLabel: 'Input',
    inputPlaceholderToBraille: 'Enter kana to convert to braille',
    inputPlaceholderToKana: 'Paste braille to convert back to kana',
    sampleText: 'にゃんこツールズ 2026ねん',
    outputLabel: 'Result',
    unsupportedPrefix: 'Characters left unconverted: ',
    dotsHeading: 'Dot numbers',
    dotsLabel: 'dots',
    notesHeading: 'Notes',
    notes: [
      'Most kanji, Latin letters and symbols cannot be converted and are left as they are; only kana and digits are converted. Rewrite kanji in hiragana first.',
      'Real Japanese braille needs word spacing and special rules (for example the particles は and へ are written as わ and え). This tool simply replaces characters one by one and does not apply them. For official braille documents, check with a braille specialist or transcription software.',
      'Braille → kana reads the six-dot range of the Unicode braille patterns (U+2800 onward). Cells that use dots 7 or 8 are left unchanged.',
      '"！" and the archaic kana "ゑ" share one braille cell (dots 2, 3, 5), so braille → kana returns "！". The opening and closing corner brackets「」 also share one cell (dots 3, 6), so they are assigned alternately in order of appearance.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Japanese braille (six-dot)',
        description:
          'A system that writes characters with combinations of six dots in a 3×2 cell. The kana syllabary is encoded in six-dot patterns, and voiced, semi-voiced and contracted sounds are written by putting a prefix cell before the base kana.',
      },
      {
        term: 'Unicode braille',
        description:
          'A Unicode block (U+2800–U+28FF) of braille patterns holding all 256 combinations of eight dots. The 64 patterns that use only dots 1–6 correspond to six-dot Japanese braille. Because it is plain text, it can be copied and pasted and used as input for braille displays and embossers.',
      },
      {
        term: 'Number sign and connector',
        description:
          'The number sign tells the reader that the following cells are digits. Because the digits 0–9 share their cell shapes with the あ-row and ら-row kana, a connector cell is inserted when one of those kana directly follows a number.',
      },
    ],
  },
};
