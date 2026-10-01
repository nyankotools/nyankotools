import type { Locale } from '../../data/tools';

export interface DeadPixelCheckerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  startLabel: string;
  startHint: string;
  colorsHeading: string;
  stageLabel: string;
  closeLabel: string;
  stageHint: string;
  colorNames: Record<string, string>;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const deadPixelCheckerContent: Record<
  Locale,
  DeadPixelCheckerPageContent
> = {
  ja: {
    title: 'ドット抜けチェック（モニターの色ムラ・焼き付き確認）',
    description:
      'モニター・スマホ・タブレットのドット抜け（輝点・黒点）や色ムラを、全画面の単色表示で確認できる無料ツールです。白・黒・赤・緑・青など9色をクリックやキーで切り替え。ブラウザ内で動作し、データは送信されません。',
    h1: 'モニターのドット抜け・色ムラチェック',
    introHtml:
      'モニターやスマホを買った直後、中古品を受け取ったときに、画面全体を単色で塗りつぶして、ドット抜け（常時点灯・常時消灯の点）や色ムラがないかを確認できます。<a href="/tools/viewport-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">スクリーンサイズ・Viewportチェッカー</a>で画面の解像度を確認しておくと、スペック通りか見比べられます。',
    startLabel: '全画面でチェックを開始',
    startHint:
      '開始後は、クリック・タップ／→・スペースで次の色、←で前の色、Escで終了します。下の色ボタンを押すと、その色から開始できます。',
    colorsHeading: '開始する色',
    stageLabel: 'ドット抜けチェックの全画面表示',
    closeLabel: '終了',
    stageHint: 'クリック／→で次の色　←で前の色　Escで終了',
    colorNames: {
      white: '白',
      black: '黒',
      red: '赤',
      green: '緑',
      blue: '青',
      yellow: '黄',
      cyan: 'シアン',
      magenta: 'マゼンタ',
      gray: 'グレー',
    },
    howToHeading: '使い方',
    howToSteps: [
      'できればモニターの明るさを上げ、画面の汚れやホコリを拭き取ります。',
      '「全画面でチェックを開始」を押す（または開始したい色のボタンを押す）と、画面が単色で塗りつぶされます。',
      'クリックや矢印キーで色を切り替えながら、周囲と違う色の点や、色ムラ・明るさのムラがないかを目で確認します。',
      'Escキーで終了します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '白では黒い点（黒点・ドット欠け）、黒では明るく光る点（輝点）が見つけやすく、赤・緑・青では特定の色だけが点灯しない・点灯し続ける不良を確認できます。',
      '画面の汚れ・ホコリ・傷がドット抜けに見えることがあります。気になる点は、柔らかい布で拭いても残るか確認してください。',
      'ドット抜けが保証や交換の対象になるかは、メーカー・店舗ごとの基準（許容数・位置）で異なります。購入後は早めに確認し、販売元の規定を確認してください。',
      '同じ画面を長時間表示し続けると焼き付きの原因になることがあります。確認が済んだら終了してください。',
      'ブラウザのズームや表示スケールの設定によって、画面全体が塗りつぶされない場合があります。全画面表示に対応していない環境では、ウィンドウ全体を覆う表示になります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ドット抜け',
        description:
          '液晶や有機ELの画素（ピクセル）が正しく表示されない不良の総称です。常に明るい「輝点」、常に暗い「黒点」、特定の色だけが異常な「色点」などがあります。',
      },
      {
        term: '色ムラ・輝度ムラ',
        description:
          '画面全体を同じ色にしたときに、場所によって色味や明るさが均一でない現象です。バックライトの当たり方や経年で生じることがあります。',
      },
      {
        term: '焼き付き',
        description:
          '同じ画像を長時間表示し続けた結果、画面を切り替えても残像が薄く残る現象です。特に有機ELで注意が必要です。',
      },
    ],
  },
  en: {
    title: 'Dead Pixel Test – Check Your Screen for Stuck Pixels',
    description:
      'Check a monitor or phone for dead pixels and uneven color with a fullscreen solid color. Cycle 9 colors with a click or arrow keys. Runs in your browser.',
    h1: 'Dead Pixel & Screen Uniformity Test',
    introHtml:
      'Fill your whole screen with one solid color to spot dead pixels (always off), stuck pixels (always on) and uneven color or brightness right after you buy a monitor or phone, or when you receive a used one. To compare the resolution with the spec sheet, use the <a href="/en/tools/viewport-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Viewport Checker</a>.',
    startLabel: 'Start fullscreen test',
    startHint:
      'Once started, click or tap (or press → / Space) for the next color, ← for the previous one, and Esc to exit. You can also pick a color below to start from it.',
    colorsHeading: 'Start from a color',
    stageLabel: 'Fullscreen dead pixel test',
    closeLabel: 'Exit',
    stageHint: 'Click / → next color   ← previous   Esc exit',
    colorNames: {
      white: 'White',
      black: 'Black',
      red: 'Red',
      green: 'Green',
      blue: 'Blue',
      yellow: 'Yellow',
      cyan: 'Cyan',
      magenta: 'Magenta',
      gray: 'Gray',
    },
    howToHeading: 'How to use',
    howToSteps: [
      'Raise the screen brightness if you can, and wipe off any dust or smudges.',
      'Press "Start fullscreen test" (or a color button to start from that color) and the screen fills with one color.',
      'Switch colors with a click or the arrow keys, and look for dots of a different color or patches of uneven color or brightness.',
      'Press Esc to exit.',
    ],
    notesHeading: 'Notes',
    notes: [
      'White makes dark dots (dead pixels) easy to see, and black makes bright dots (stuck pixels) easy to see. Red, green and blue reveal pixels where only one color is stuck on or off.',
      'Dust, smudges and scratches can look like dead pixels. Wipe the screen with a soft cloth and check whether the spot is still there.',
      'Whether dead pixels qualify for a warranty or exchange depends on the manufacturer or store policy (number and location). Test soon after purchase and check the seller’s terms.',
      'Showing the same image for a long time can cause burn-in. Exit once you have finished checking.',
      'Browser zoom or display scaling can stop the color from covering the full screen. Where fullscreen is not supported, the test covers the whole browser window instead.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Dead / stuck pixel',
        description:
          'A pixel on an LCD or OLED panel that does not display correctly. A stuck pixel is always lit, a dead pixel is always dark, and some pixels show only one wrong color.',
      },
      {
        term: 'Uneven color / backlight bleed',
        description:
          'When a screen showing one solid color looks different in color or brightness from place to place. It can come from how the backlight is mounted or from aging.',
      },
      {
        term: 'Burn-in',
        description:
          'A faint ghost of an image left on the screen after it was displayed for a long time. OLED screens are especially prone to it.',
      },
    ],
  },
};
