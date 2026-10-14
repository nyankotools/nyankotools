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

export interface SealStampGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  /** 実印・銀行印の代用にならない旨。ツール本体の近くに表示する */
  disclaimer: string;
  kindLabel: string;
  kindOptions: SelectOption[];
  textLabelNamed: string;
  textLabelDate: string;
  textPlaceholder: string;
  defaultText: string;
  subTextLabel: string;
  subTextPlaceholder: string;
  dateLabel: string;
  dateStyleLabel: string;
  dateStyleOptions: SelectOption[];
  orientationLabel: string;
  orientationOptions: SelectOption[];
  colorLabel: string;
  colorPresets: SelectOption[];
  thicknessLabel: string;
  thicknessOptions: SelectOption[];
  fontLabel: string;
  fontOptions: SelectOption[];
  boldLabel: string;
  sizeLabel: string;
  previewLabel: string;
  emptyHint: string;
  downloadButton: string;
  downloaded: string;
  errorExportFailed: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const sealStampGeneratorContent: Record<
  Locale,
  SealStampGeneratorPageContent
> = {
  ja: {
    title: '電子印鑑・日付印ジェネレーター（無料・透過PNG）',
    description:
      '名前を入れて丸印・角印・日付印の電子印鑑を無料で作成できます。朱色などの色を選び、背景が透明なPNGで保存できます。入力した内容はブラウザ内で処理され、サーバーには送信されません。',
    h1: '電子印鑑・日付印を作成（丸印・角印・透過PNG）',
    introHtml:
      '名前や会社名を入れて、丸印・角印・日付印の電子印鑑画像を作ります。縦書き・横書き、朱色などの印影の色を選べ、背景が透明なPNGで保存できます。ブラウザ内で処理されるため、入力した名前は送信されません。作った画像は、書類のレイアウトに貼る前に <a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ・圧縮</a> で大きさを整えることもできます。',
    disclaimer:
      'ここで作る印影は見た目だけの画像です。市区町村に登録した実印や、銀行に届け出た銀行印の代わりにはならず、契約書や届出などで印鑑の効力が必要な場面では使えません。',
    kindLabel: '種類',
    kindOptions: [
      { value: 'round', label: '丸印', selected: true },
      { value: 'square', label: '角印' },
      { value: 'date', label: '日付印' },
    ],
    textLabelNamed: '文字（改行で列・行を分ける）',
    textLabelDate: '上段（名前・会社名など）',
    textPlaceholder: '例: にゃんこツール',
    defaultText: 'にゃんこ\nツール',
    subTextLabel: '下段（部署名など）',
    subTextPlaceholder: '例: 営業部',
    dateLabel: '日付',
    dateStyleLabel: '日付の形式',
    dateStyleOptions: [
      { value: 'dot', label: '2026.10.14', selected: true },
      { value: 'slash', label: '2026/10/14' },
      { value: 'kanji', label: '2026年10月14日' },
      { value: 'era', label: '令和8年10月14日' },
    ],
    orientationLabel: '文字の向き',
    orientationOptions: [
      { value: 'vertical', label: '縦書き' },
      { value: 'horizontal', label: '横書き', selected: true },
    ],
    colorLabel: '印影の色',
    colorPresets: [
      { value: '#d7261e', label: '朱色' },
      { value: '#b30000', label: '赤' },
      { value: '#1f3f9e', label: '青' },
      { value: '#111111', label: '黒' },
    ],
    thicknessLabel: '枠線の太さ',
    thicknessOptions: [
      { value: 'thin', label: '細い' },
      { value: 'normal', label: '標準', selected: true },
      { value: 'thick', label: '太い' },
    ],
    fontLabel: '書体',
    fontOptions: [
      { value: 'serif', label: '明朝体', selected: true },
      { value: 'sans', label: 'ゴシック体' },
    ],
    boldLabel: '太字',
    sizeLabel: '画像サイズ（px）',
    previewLabel: 'プレビュー',
    emptyHint: '文字を入力すると、ここに印影が表示されます。',
    downloadButton: '透過PNGをダウンロード',
    downloaded: 'ダウンロードしました',
    errorExportFailed:
      '画像を書き出せませんでした。お使いのブラウザが対応していない可能性があります。',
    howToHeading: '使い方',
    howToSteps: [
      '「種類」で丸印・角印・日付印のどれかを選びます。',
      '名前などを入力します。日付印は「上段（名前・会社名など）」「下段（部署名など）」「日付」を入れます。',
      '「文字の向き」「印影の色」「書体」「枠線の太さ」を調整し、プレビューで仕上がりを確認します。',
      '「透過PNGをダウンロード」で保存します。背景は透明なので、そのまま書類に重ねて使えます。',
    ],
    notesHeading: '注意事項',
    notes: [
      'この画像は、実印・銀行印・認印の登録印影の代わりにはなりません。契約や届出、銀行手続きなど、印鑑登録や届出印が必要な場面では使えません。',
      '電子印鑑は見た目を再現しただけの画像で、本人が押したことを証明する力はありません。取引先や提出先が電子印鑑を認めているか、事前に確認してください。',
      '他人の氏名や会社名の印影を、本人の許可なく作成・使用しないでください。',
      '書体はお使いの端末に入っているフォントから選ばれます。篆書体などの印鑑専用フォントは使えないため、見た目は端末によって少し異なります。',
      '縦書きでは、長音記号やカッコも1文字ずつ並べるだけで、回転はしません。',
      '文字が多いと、枠に収まるよう自動で小さくなります。丸印・角印は4文字程度までが読みやすい目安です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '丸印・角印',
        description:
          '丸印は個人の認印などに使われる円形の印、角印は会社名などを入れる四角い印です。角印は請求書や見積書などに会社の印として押されることが多い印です。',
      },
      {
        term: '日付印',
        description:
          '上段に名前、中段に日付、下段に部署名などを入れる円形の印です。受付や確認の日付を記録するために使われます。',
      },
      {
        term: '実印・銀行印',
        description:
          '実印は市区町村に印鑑登録した印、銀行印は銀行に届け出た印です。どちらも登録・届出した印影そのものに意味があるため、似せた画像では代用できません。',
      },
    ],
  },
  en: {
    title: 'Hanko Stamp Maker: Round, Square & Date Seals (PNG)',
    description:
      'Make a Japanese-style hanko, company seal, or date stamp image with your name. Pick the color and save a transparent PNG. Runs in your browser.',
    h1: 'Hanko & Date Stamp Maker (Transparent PNG, In Your Browser)',
    introHtml:
      'Type a name or company name and create a round hanko, a square company seal, or a date stamp image. Choose vertical or horizontal text and an ink color such as vermilion, then save a PNG with a transparent background. Everything runs in your browser, so the name you type is never sent anywhere. To adjust the image size afterwards, use the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer &amp; Compressor</a>.',
    disclaimer:
      'The stamp made here is only an image. It cannot replace a registered personal seal (jitsuin) or a bank seal (ginko-in), and it is not valid where a registered seal is required, such as contracts or official filings.',
    kindLabel: 'Type',
    kindOptions: [
      { value: 'round', label: 'Round seal', selected: true },
      { value: 'square', label: 'Square seal' },
      { value: 'date', label: 'Date stamp' },
    ],
    textLabelNamed: 'Text (one column or row per line)',
    textLabelDate: 'Top line (name or company)',
    textPlaceholder: 'e.g. Nyanko Tools',
    defaultText: 'Nyanko\nTools',
    subTextLabel: 'Bottom line (department, etc.)',
    subTextPlaceholder: 'e.g. Sales',
    dateLabel: 'Date',
    dateStyleLabel: 'Date format',
    dateStyleOptions: [
      { value: 'dot', label: '2026.10.14', selected: true },
      { value: 'slash', label: '2026/10/14' },
      { value: 'kanji', label: '2026年10月14日' },
      { value: 'era', label: '令和8年10月14日 (Japanese era)' },
    ],
    orientationLabel: 'Text direction',
    orientationOptions: [
      { value: 'vertical', label: 'Vertical' },
      { value: 'horizontal', label: 'Horizontal', selected: true },
    ],
    colorLabel: 'Ink color',
    colorPresets: [
      { value: '#d7261e', label: 'Vermilion' },
      { value: '#b30000', label: 'Red' },
      { value: '#1f3f9e', label: 'Blue' },
      { value: '#111111', label: 'Black' },
    ],
    thicknessLabel: 'Border thickness',
    thicknessOptions: [
      { value: 'thin', label: 'Thin' },
      { value: 'normal', label: 'Normal', selected: true },
      { value: 'thick', label: 'Thick' },
    ],
    fontLabel: 'Font',
    fontOptions: [
      { value: 'serif', label: 'Serif', selected: true },
      { value: 'sans', label: 'Sans-serif' },
    ],
    boldLabel: 'Bold',
    sizeLabel: 'Image size (px)',
    previewLabel: 'Preview',
    emptyHint: 'Type some text and the stamp will appear here.',
    downloadButton: 'Download transparent PNG',
    downloaded: 'Downloaded',
    errorExportFailed:
      'Could not export the image. Your browser may not support this.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a round seal, square seal, or date stamp under "Type".',
      'Enter the name. For a date stamp, fill in "Top line (name or company)", "Bottom line (department, etc.)", and "Date".',
      'Adjust "Text direction", "Ink color", "Font", and "Border thickness", and check the preview.',
      'Click "Download transparent PNG". The background is transparent, so you can lay it over a document as is.',
    ],
    notesHeading: 'Notes',
    notes: [
      'This image cannot replace a registered personal seal, a bank seal, or any seal registered with an authority. Do not use it where a registered or filed seal is required, such as contracts, official filings, or bank procedures.',
      'An electronic seal is only a picture of a stamp and does not prove who applied it. Check beforehand whether your client or recipient accepts electronic seals.',
      "Do not create or use a seal bearing someone else's name or a company name without their permission.",
      'Fonts come from those installed on your device. Seal-specific scripts such as tensho are not available, so the look varies a little between devices.',
      'In vertical mode, the long vowel mark and brackets are simply stacked one character at a time, without rotation.',
      'Long text is shrunk automatically to fit. About four characters or fewer stay the most readable in a round or square seal.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Round seal and square seal',
        description:
          'A round seal is a circular stamp often used for personal everyday sign-offs. A square seal usually carries a company name and is typically stamped on invoices and quotations.',
      },
      {
        term: 'Date stamp',
        description:
          'A circular stamp with a name on top, the date in the middle, and a department or similar at the bottom. It records the date a document was received or checked.',
      },
      {
        term: 'Jitsuin and ginko-in',
        description:
          'A jitsuin is a seal registered with the local government, and a ginko-in is a seal registered with a bank. Their value lies in the exact registered impression, so a lookalike image cannot stand in for them.',
      },
    ],
  },
};
