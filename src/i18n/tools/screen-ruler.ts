import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ScreenRulerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること */
  introHtml: string;

  calibrateHeading: string;
  calibrateHelp: string;
  sliderLabel: string;
  fineMinusLabel: string;
  finePlusLabel: string;
  fineMinusText: string;
  finePlusText: string;
  resetButton: string;
  cardCaption: string;
  /** {ppi} {px} を置換 */
  calibrationValue: string;
  savedNote: string;
  resetDone: string;

  rulerHeading: string;
  unitLabel: string;
  unitCm: string;
  unitInch: string;
  orientationLabel: string;
  orientationHorizontal: string;
  orientationVertical: string;
  rulerAriaLabel: string;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const screenRulerContent: Record<Locale, ScreenRulerPageContent> = {
  ja: {
    title: '画面定規（cm・インチの実寸をカードで校正）',
    description:
      '画面に実寸のcm・インチ定規を表示する無料ツールです。クレジットカードに枠を合わせて画面の大きさを校正でき、横・縦の切り替えにも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '画面定規（クレジットカードで校正する実寸のcm・インチ定規）',
    introHtml:
      'クレジットカード（ISO/IEC 7810 ID-1、85.60×53.98mm）の大きさを基準に、お使いの画面の実寸を校正して、cm・mm・インチの目盛りの定規を表示します。画面に小さな物を当てて長さを測りたいときに使えます。画面の物理サイズや解像度から画素密度（PPI）を知りたい場合は <a href="/tools/screen-size-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画面サイズ計算機</a> もご利用ください。校正値はこのブラウザ内にだけ保存され、サーバーには送信されません。',

    calibrateHeading: '画面を校正する',
    calibrateHelp:
      '下の枠を、手持ちのクレジットカード（またはICカード・免許証）を画面に重ねた大きさに合わせてください。カードの長辺が枠の横幅（85.6mm）と同じになれば校正完了です。',
    sliderLabel: 'カード幅の調整',
    fineMinusLabel: 'カード幅を0.5px縮める',
    finePlusLabel: 'カード幅を0.5px広げる',
    fineMinusText: '−0.5 px',
    finePlusText: '+0.5 px',
    resetButton: '96dpiに戻す',
    cardCaption: 'クレジットカードの大きさ（85.6×54.0mm）',
    calibrationValue: '校正値: {ppi} PPI（1cm = {px} px）',
    savedNote: '校正値はこのブラウザに自動で保存されます。',
    resetDone: '標準の96dpiに戻しました',

    rulerHeading: '定規',
    unitLabel: '単位',
    unitCm: 'cm',
    unitInch: 'インチ',
    orientationLabel: '向き',
    orientationHorizontal: '横',
    orientationVertical: '縦',
    rulerAriaLabel: '実寸の定規（目盛りの図）',

    howToHeading: '使い方',
    howToSteps: [
      '手持ちのクレジットカードを画面に重ね、「カード幅の調整」のスライダー（または微調整ボタン）で、枠の横幅がカードの長辺と一致するように合わせます。',
      '「単位」でcmかインチ、「向き」で横か縦を選びます。',
      '表示された定規に測りたい物を当てて、目盛りを読み取ります。',
    ],
    notesHeading: '注意事項',
    notes: [
      'ブラウザの拡大・縮小（ズーム）を変えると実寸がずれます。校正したときと同じ表示倍率で使うか、倍率を変えたら校正し直してください。',
      '校正の精度は、カードを枠に合わせる目視の精度で決まります。誤差は1mm前後を見込み、精密な測定には本物の定規やノギスを使ってください。',
      '画面が小さいスマホなどでは、カードの枠が画面に収まらず横にスクロールすることがあります。パソコンのモニターでの利用を想定しています。',
      '校正値はこのブラウザのlocalStorageに保存されます。プライベートブラウズや保存を禁止した環境では、ページを開いている間だけ有効です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ID-1（ISO/IEC 7810）',
        description:
          'クレジットカードやキャッシュカード、運転免許証などで使われるカードの国際規格サイズです。85.60×53.98mmで、世界中でほぼ共通なため画面の校正の基準にできます。',
      },
      {
        term: 'CSSピクセル',
        description:
          'ブラウザが画面に描画するときの基準の長さです。実際の画素数とは異なり、拡大率や高解像度設定の影響を受けるため、画面の実寸は校正して求めます。',
      },
      {
        term: 'PPI（画素密度）',
        description:
          '1インチあたりの画素数です。この定規では、校正した1cmあたりのCSSピクセル数から求めた値を参考として表示します。',
      },
    ],
  },
  en: {
    title: 'Screen Ruler: Actual-Size cm and Inch Ruler',
    description:
      'Measure small objects with an on-screen ruler in cm and inches. Calibrate to actual size with a credit card. Runs in your browser; nothing is uploaded.',
    h1: 'Screen Ruler: Actual-Size cm and Inch Ruler Calibrated with a Credit Card',
    introHtml:
      'Hold a credit card (ISO/IEC 7810 ID-1, 85.60 × 53.98 mm) up to your screen and match the frame to it. The tool uses that to work out your screen\'s real size and draws a ruler in cm, mm and inches. Handy for measuring a small object against your display. To work out pixel density from a screen\'s physical size and resolution, try the <a href="/en/tools/screen-size-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Screen Size Calculator</a>. Your calibration is stored only in this browser and nothing is sent to a server.',

    calibrateHeading: 'Calibrate your screen',
    calibrateHelp:
      "Resize the frame below until it matches a credit card (or any ID-1 card, such as a driver's license) held against the screen. When the card's long edge equals the frame width (85.6 mm), you are done.",
    sliderLabel: 'Card width',
    fineMinusLabel: 'Make the card 0.5 px narrower',
    finePlusLabel: 'Make the card 0.5 px wider',
    fineMinusText: '−0.5 px',
    finePlusText: '+0.5 px',
    resetButton: 'Reset to 96 dpi',
    cardCaption: 'Credit card size (85.6 × 54.0 mm)',
    calibrationValue: 'Calibration: {ppi} PPI (1 cm = {px} px)',
    savedNote: 'Your calibration is saved in this browser automatically.',
    resetDone: 'Reset to the standard 96 dpi',

    rulerHeading: 'Ruler',
    unitLabel: 'Unit',
    unitCm: 'cm',
    unitInch: 'Inches',
    orientationLabel: 'Orientation',
    orientationHorizontal: 'Horizontal',
    orientationVertical: 'Vertical',
    rulerAriaLabel: 'Actual-size ruler (drawing of tick marks)',

    howToHeading: 'How to use',
    howToSteps: [
      'Hold a credit card against the screen and use the "Card width" slider (or the fine-tune buttons) until the frame is exactly as wide as the card\'s long edge.',
      'Pick cm or inches under "Unit", and horizontal or vertical under "Orientation".',
      'Hold the object you want to measure against the ruler and read the tick marks.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Changing the browser zoom changes the real size on screen. Use the ruler at the same zoom level you calibrated at, and recalibrate after you change it.',
      'Accuracy depends on how well you line the card up with the frame. Expect an error of about 1 mm; use a real ruler or calipers for precise work.',
      'On a small phone screen the card frame may not fit and will scroll sideways. This tool is meant for a computer monitor.',
      "The calibration is kept in this browser's localStorage. In private browsing, or where storage is blocked, it lasts only while the page is open.",
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'ID-1 (ISO/IEC 7810)',
        description:
          "The international card size used for credit cards, bank cards and many driver's licenses: 85.60 × 53.98 mm. Because it is nearly universal, it works as a reference for calibrating a screen.",
      },
      {
        term: 'CSS pixel',
        description:
          'The reference unit browsers use when drawing on screen. It is not the same as a hardware pixel and depends on zoom and display scaling, which is why real size has to be calibrated.',
      },
      {
        term: 'PPI (pixel density)',
        description:
          'The number of pixels per inch. This tool shows the value implied by your calibrated CSS pixels per centimeter, for reference.',
      },
    ],
  },
};
