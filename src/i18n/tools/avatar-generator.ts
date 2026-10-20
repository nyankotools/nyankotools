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

export interface AvatarGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeInitials: string;
  modeIdenticon: string;
  textLabelInitials: string;
  textLabelIdenticon: string;
  textPlaceholderInitials: string;
  textPlaceholderIdenticon: string;
  countLabel: string;
  count1: string;
  count2: string;
  fontLabel: string;
  fontOptions: SelectOption[];
  autoColorLabel: string;
  bgLabel: string;
  fgLabel: string;
  shapeLabel: string;
  shapeSquare: string;
  shapeRounded: string;
  shapeCircle: string;
  sizeLabel: string;
  sizeOptions: SelectOption[];
  previewLabel: string;
  /** {width}, {height} を置換する */
  outputInfo: string;
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

export const avatarGeneratorContent: Record<
  Locale,
  AvatarGeneratorPageContent
> = {
  ja: {
    title: 'アバター・アイコン作成｜イニシャル／identicon生成',
    description:
      '名前のイニシャルや、文字列から決まるGitHub風identiconでアバター画像を作成します。背景色・形・フォントを選んでPNG保存。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'アバター・アイコン作成（イニシャル／identicon）',
    introHtml:
      '名前のイニシャルを使った文字アイコンや、入力した文字列から同じ模様が必ず作られるGitHub風のidenticonを作成し、PNGで保存します。SNSやプロフィール、掲示板、チャットの初期アイコン作りに便利です。ブラウザ内で処理され、入力した文字はアップロードされません。写真を丸く切り抜きたいときは <a href="/tools/image-round-crop/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像の円形・角丸切り抜き</a> をご利用ください。',
    modeLabel: 'タイプ',
    modeInitials: 'イニシャル',
    modeIdenticon: 'identicon（模様）',
    textLabelInitials: '名前（イニシャルにする文字）',
    textLabelIdenticon: 'シード文字列（同じ文字列なら同じ模様）',
    textPlaceholderInitials: '例: 山田 太郎 / Ada Lovelace',
    textPlaceholderIdenticon: '例: octocat / user@example.com',
    countLabel: '文字数',
    count1: '1文字',
    count2: '2文字',
    fontLabel: 'フォント',
    fontOptions: [
      { value: 'sans', label: 'ゴシック体', selected: true },
      { value: 'serif', label: '明朝体' },
      { value: 'rounded', label: '丸ゴシック体' },
      { value: 'mono', label: '等幅' },
    ],
    autoColorLabel: '色を文字列から自動で決める',
    bgLabel: '背景色',
    fgLabel: '文字色／模様の色',
    shapeLabel: '形',
    shapeSquare: '正方形',
    shapeRounded: '角丸',
    shapeCircle: '円形',
    sizeLabel: '出力サイズ',
    sizeOptions: [
      { value: '128', label: '128px' },
      { value: '256', label: '256px' },
      { value: '512', label: '512px', selected: true },
      { value: '1024', label: '1024px' },
    ],
    previewLabel: 'プレビュー',
    outputInfo: '出力サイズ: {width} × {height} px',
    downloadButton: 'PNGをダウンロード',
    downloaded: 'ダウンロードしました',
    errorExportFailed:
      '画像を書き出せませんでした。お使いのブラウザがCanvasからのPNG出力に対応していない可能性があります。',
    howToHeading: '使い方',
    howToSteps: [
      '「タイプ」で「イニシャル」か「identicon（模様）」を選びます。',
      '「名前（イニシャルにする文字）」または「シード文字列（同じ文字列なら同じ模様）」を入力します。',
      '「形」と「出力サイズ」を選びます。色を変えたいときは「色を文字列から自動で決める」を外し、「背景色」「文字色／模様の色」を選びます。',
      '「PNGをダウンロード」で保存します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'イニシャルは、空白で区切られた複数の語があれば最初と最後の語の頭文字、1語だけなら先頭から数えた文字になります。',
      'identiconは入力文字列から決まるため、同じ文字列なら別の端末でも同じ模様と色になります。メールアドレスなどを入れても、その文字列は外部に送られません。',
      '「正方形」以外の形では、外側の四隅が透明なPNGになります。',
      'フォントは端末にあるものを使うため、環境によって字形が少し異なります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'identicon',
        description:
          '文字列から自動で作られる左右対称の幾何学模様のアイコンです。GitHubなどで、アイコン未設定のユーザーに割り当てられます。',
      },
      {
        term: 'シード',
        description:
          '乱数や模様のもとになる値です。同じシードからは必ず同じ結果が得られます。',
      },
      {
        term: 'イニシャル',
        description:
          '名前の頭文字です。英語圏のアイコンでは姓名の頭文字2文字がよく使われます。',
      },
    ],
  },
  en: {
    title: 'Avatar Generator: Initials & Identicon Icon Maker',
    description:
      'Make avatar icons from initials or a seed string (GitHub-style identicon). Pick colors, shape and font, then save a PNG. Runs in your browser; no uploads.',
    h1: 'Avatar Generator: Initials and Identicon Icons',
    introHtml:
      'Create a letter avatar from a name, or a GitHub-style identicon that always comes out the same for the same text, and save it as a PNG. It works well for default profile pictures on social media, forums and chat apps. Everything runs in your browser and the text you type is never uploaded. To crop a photo into a circle instead, use the <a href="/en/tools/image-round-crop/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Round Image Cropper</a>.',
    modeLabel: 'Type',
    modeInitials: 'Initials',
    modeIdenticon: 'Identicon (pattern)',
    textLabelInitials: 'Name (to make initials from)',
    textLabelIdenticon: 'Seed text (same text, same pattern)',
    textPlaceholderInitials: 'e.g. Ada Lovelace',
    textPlaceholderIdenticon: 'e.g. octocat / user@example.com',
    countLabel: 'Letters',
    count1: '1 letter',
    count2: '2 letters',
    fontLabel: 'Font',
    fontOptions: [
      { value: 'sans', label: 'Sans-serif', selected: true },
      { value: 'serif', label: 'Serif' },
      { value: 'rounded', label: 'Rounded' },
      { value: 'mono', label: 'Monospace' },
    ],
    autoColorLabel: 'Pick colors automatically from the text',
    bgLabel: 'Background color',
    fgLabel: 'Text / pattern color',
    shapeLabel: 'Shape',
    shapeSquare: 'Square',
    shapeRounded: 'Rounded',
    shapeCircle: 'Circle',
    sizeLabel: 'Output size',
    sizeOptions: [
      { value: '128', label: '128px' },
      { value: '256', label: '256px' },
      { value: '512', label: '512px', selected: true },
      { value: '1024', label: '1024px' },
    ],
    previewLabel: 'Preview',
    outputInfo: 'Output size: {width} × {height} px',
    downloadButton: 'Download PNG',
    downloaded: 'Downloaded',
    errorExportFailed:
      'Could not export the image. Your browser may not support PNG export from a canvas.',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose "Initials" or "Identicon (pattern)" under "Type".',
      'Enter "Name (to make initials from)" or "Seed text (same text, same pattern)".',
      'Pick a "Shape" and an "Output size". To change colors, turn off "Pick colors automatically from the text" and choose "Background color" and "Text / pattern color".',
      'Click "Download PNG" to save it.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Initials use the first letters of the first and last word when the name has several words, or the leading letters of a single word.',
      'An identicon is derived from the text, so the same text gives the same pattern and color on any device. Even if you type an email address, it is never sent anywhere.',
      'Any shape other than Square gives a PNG with transparent corners.',
      'Fonts come from your device, so letter shapes may differ slightly between systems.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Identicon',
        description:
          'A symmetric geometric icon generated automatically from a string. GitHub and similar sites assign them to users without a profile picture.',
      },
      {
        term: 'Seed',
        description:
          'The starting value for a random or generated result. The same seed always produces the same output.',
      },
      {
        term: 'Initials',
        description:
          'The first letters of a name. Letter avatars commonly use the first letters of the given and family names.',
      },
    ],
  },
};
