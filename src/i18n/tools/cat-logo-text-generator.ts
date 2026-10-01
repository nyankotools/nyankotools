import type { Locale } from '../../data/tools';

export interface CatLogoTextGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  textLabel: string;
  textPlaceholder: string;
  defaultText: string;
  fontSizeLabel: string;
  letterSpacingLabel: string;
  textColorLabel: string;
  outlineWidthLabel: string;
  outlineColorLabel: string;
  shadowLabel: string;
  earInnerColorLabel: string;
  decorColorLabel: string;
  previewLabel: string;
  previewBgLabel: string;
  previewBgs: { checker: string; light: string; dark: string };
  transparentNote: string;
  decorEdit: {
    heading: string;
    help: string;
    addLabel: string;
    kinds: Record<
      'ear' | 'whisker' | 'paw' | 'sparkle' | 'heart' | 'star' | 'moon',
      string
    >;
    clearAll: string;
    noSelection: string;
    selectedLabel: string;
    scaleLabel: string;
    rotationLabel: string;
    colorLabel: string;
    flip: string;
    duplicate: string;
    remove: string;
    overlayLabel: string;
  };
  download: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** {max} を置換 */
  errorTextTemplate: string;
  errorSizeTemplate: string;
  errorOutlineTemplate: string;
  errorColor: string;
  errorEncode: string;
  noteHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const catLogoTextGeneratorContent: Record<
  Locale,
  CatLogoTextGeneratorPageContent
> = {
  ja: {
    title: '猫ロゴ文字ジェネレーター｜猫耳・ひげ付きの背景透過PNGロゴを作成',
    description:
      '入力した文字に猫耳・ひげ・肉球・キラキラ・ハート・星・月を好きな位置へ配置して、猫らしい丸ゴシックのロゴ文字を作れる無料ツールです。背景透過のPNGでダウンロード可能。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '猫ロゴ文字ジェネレーター（背景透過PNG）',
    introHtml:
      '丸ゴシックの太文字に猫耳・ひげ・肉球・キラキラ・ハート・星・月を好きな位置へ配置して、猫らしいロゴ画像を作れます。書き出すPNGは背景が透明なので、ヘッダー画像やバナーにそのまま重ねられます。サイズを整えたい場合は<a href="/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画像リサイズ</a>もご利用ください。',
    textLabel: 'ロゴの文字',
    textPlaceholder: '例: にゃんこツール',
    defaultText: 'にゃんこツール',
    fontSizeLabel: '文字サイズ（px）',
    letterSpacingLabel: '文字間隔（px）',
    textColorLabel: '文字色',
    outlineWidthLabel: '縁取りの太さ（px）',
    outlineColorLabel: '縁取りの色',
    shadowLabel: '影をつける',
    earInnerColorLabel: '耳の内側の色',
    decorColorLabel: '装飾の既定色（部品ごとに変更できます）',
    previewLabel: 'プレビュー',
    previewBgLabel: 'プレビューの背景',
    previewBgs: { checker: '市松模様（透過）', light: '白', dark: '黒' },
    transparentNote:
      'プレビューの背景は確認用です。ダウンロードするPNGの背景は透明になります。',
    decorEdit: {
      heading: '装飾の位置・大きさ・角度を調整',
      help: 'プレビュー上の装飾をドラッグすると移動できます。選択すると、上の丸いハンドルで回転、右下の丸いハンドルで拡大縮小ができます（Shiftキーで15度刻み）。矢印キーで微調整、Deleteキーで削除もできます。最初は文字だけで、猫耳・ひげ・肉球・キラキラ・ハート・星・月は「部品を追加」から足して好きな位置に置きます。装飾は文字列の左端・ベースラインからの相対位置で保持されるため、文字数を変えても装飾は自動では動きません。',
      addLabel: '部品を追加',
      kinds: {
        ear: '猫耳',
        whisker: 'ひげ',
        paw: '肉球',
        sparkle: 'キラキラ',
        heart: 'ハート',
        star: '星',
        moon: '月',
      },
      clearAll: 'すべての装飾を削除',
      noSelection: 'プレビュー上の装飾をクリック／タップして選択してください。',
      selectedLabel: '選択中',
      scaleLabel: '大きさ',
      rotationLabel: '角度（度）',
      colorLabel: '色',
      flip: '左右反転',
      duplicate: '複製',
      remove: '削除',
      overlayLabel:
        'プレビュー（装飾をドラッグで移動、矢印キーで微調整、Deleteで削除）',
    },
    download: '透過PNGをダウンロード',
    copy: '画像をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorTextTemplate: 'ロゴの文字を1〜{max}文字で入力してください。',
    errorSizeTemplate: '文字サイズは{min}〜{max}の整数で入力してください。',
    errorOutlineTemplate: '縁取りの太さは0〜{max}の整数で入力してください。',
    errorColor: '色は #RGB または #RRGGBB 形式で入力してください。',
    errorEncode:
      '画像の生成に失敗しました。文字数や文字サイズを小さくして再度お試しください。',
    noteHeading: '使い方のヒント',
    notes: [
      '猫耳などの装飾は、追加したあとにドラッグで好きな位置へ動かし、角度や大きさを調整できます。',
      '文字は同梱の丸ゴシック体（M PLUS Rounded 1c）で描画します。収録外の文字は、お使いの端末のフォントで代替表示される場合があります。',
      'フォントはSIL Open Font License 1.1で配布されており、ロゴ画像への利用は商用でも可能です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '背景透過PNG',
        description:
          '背景部分が透明（アルファチャンネル付き）になっているPNG画像です。写真や色付きの背景の上に重ねても、文字の周りに四角い余白が出ません。',
      },
      {
        term: '丸ゴシック',
        description:
          '線の端が丸く、角のない柔らかい印象の日本語ゴシック体です。かわいらしいロゴやキャラクター系のデザインでよく使われます。',
      },
    ],
  },
  en: {
    title: 'Cat Logo Text Generator – Transparent PNG with Cat Ears',
    description:
      'Make cat-themed logo text: add cat ears, whiskers and paw prints to rounded lettering and download a transparent PNG. Runs in your browser; nothing is uploaded.',
    h1: 'Cat Logo Text Generator (Transparent PNG)',
    introHtml:
      'Turn any text into a cute cat-style logo with bold rounded lettering and cat ears, whiskers, paw prints, sparkles, hearts, stars, and moons placed wherever you like. The exported PNG has a transparent background, so you can drop it straight onto banners and headers. To change the size afterwards, try the <a href="/en/tools/image-resizer/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Image Resizer</a>.',
    textLabel: 'Logo text',
    textPlaceholder: 'e.g. Nyanko Tools',
    defaultText: 'Nyanko',
    fontSizeLabel: 'Font size (px)',
    letterSpacingLabel: 'Letter spacing (px)',
    textColorLabel: 'Text color',
    outlineWidthLabel: 'Outline width (px)',
    outlineColorLabel: 'Outline color',
    shadowLabel: 'Add a shadow',
    earInnerColorLabel: 'Inner ear color',
    decorColorLabel: 'Default decoration color (changeable per shape)',
    previewLabel: 'Preview',
    previewBgLabel: 'Preview background',
    previewBgs: {
      checker: 'Checkerboard (transparent)',
      light: 'White',
      dark: 'Black',
    },
    transparentNote:
      'The preview background is only a guide. The downloaded PNG has a transparent background.',
    decorEdit: {
      heading: 'Adjust decoration position, size, and angle',
      help: 'Drag a decoration in the preview to move it. Once selected, use the round handle on top to rotate and the one at the lower right to resize (hold Shift to snap to 15°). Arrow keys nudge it and Delete removes it. It starts with text only; add ears, whiskers, paw prints, sparkles, hearts, stars, or moons with “Add a shape” and place them by hand. Positions are stored relative to the text’s left edge and baseline, so decorations do not follow automatically when you change the text length.',
      addLabel: 'Add a shape',
      kinds: {
        ear: 'Cat ear',
        whisker: 'Whiskers',
        paw: 'Paw print',
        sparkle: 'Sparkle',
        heart: 'Heart',
        star: 'Star',
        moon: 'Moon',
      },
      clearAll: 'Remove all decorations',
      noSelection: 'Click or tap a decoration in the preview to select it.',
      selectedLabel: 'Selected',
      scaleLabel: 'Size',
      rotationLabel: 'Angle (°)',
      colorLabel: 'Color',
      flip: 'Flip',
      duplicate: 'Duplicate',
      remove: 'Delete',
      overlayLabel:
        'Preview (drag decorations to move, arrow keys to nudge, Delete to remove)',
    },
    download: 'Download transparent PNG',
    copy: 'Copy image',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorTextTemplate: 'Enter 1 to {max} characters of logo text.',
    errorSizeTemplate:
      'Enter a whole number from {min} to {max} for the font size.',
    errorOutlineTemplate:
      'Enter a whole number from 0 to {max} for the outline width.',
    errorColor: 'Enter colors as #RGB or #RRGGBB.',
    errorEncode:
      'Could not generate the image. Try fewer characters or a smaller font size.',
    noteHeading: 'Tips',
    notes: [
      'Ears and other decorations can be dragged anywhere after adding them, and their angle and size can be adjusted.',
      'Text is rendered with the bundled rounded font (M PLUS Rounded 1c). Characters it does not cover may fall back to a font on your device.',
      'The font is licensed under the SIL Open Font License 1.1, which allows using it in logo images, including commercially.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Transparent PNG',
        description:
          'A PNG image whose background is transparent (it has an alpha channel). Placed over a photo or colored background, it leaves no rectangular box around the lettering.',
      },
      {
        term: 'Rounded font',
        description:
          'A typeface whose stroke ends are rounded, giving a soft, friendly look. Common in cute logos and character-style designs.',
      },
    ],
  },
};
