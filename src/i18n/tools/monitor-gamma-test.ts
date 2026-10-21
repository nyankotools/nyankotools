import type { Locale } from '../../data/tools';

export interface MonitorGammaTestPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  startLabel: string;
  startHint: string;
  patternsHeading: string;
  patternNames: Record<string, string>;
  patternDescriptions: Record<string, string>;
  stageLabel: string;
  closeLabel: string;
  stageHint: string;
  estimateHeading: string;
  estimateHint: string;
  levelLabel: string;
  estimateResultLabel: string;
  estimateInvalid: string;
  gammaTableHeading: string;
  gammaColumn: string;
  levelColumn: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const monitorGammaTestContent: Record<
  Locale,
  MonitorGammaTestPageContent
> = {
  ja: {
    title: 'モニターのガンマ・階調チェック（バンディング・黒つぶれ確認）',
    description:
      'モニターのガンマ値や階調を全画面パターンで確認できる無料ツールです。グレーランプ、段階パターン、ガンマチェッカー、黒つぶれ・白飛びを表示。ブラウザ内で動作し、データは送信されません。',
    h1: 'モニターのガンマ・階調（バンディング）チェック',
    introHtml:
      'グレーのグラデーションや段階パターンで階調のなめらかさ（バンディング）を、白黒の縞とグレーの比較でガンマ値を、暗部・明部の微妙な差で黒つぶれ・白飛びを確認できます。ドット抜けや色ムラは<a href="/tools/dead-pixel-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ドット抜けチェック</a>、リフレッシュレートは<a href="/tools/refresh-rate-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">リフレッシュレートテスター</a>で確認できます。',
    startLabel: '全画面でチェックを開始',
    startHint:
      '開始後は、クリック・タップ／→・スペースで次のパターン、←で前のパターン、1〜5キーで直接切り替え、Escで終了します。下のボタンを押すと、そのパターンから開始できます。',
    patternsHeading: '開始するパターン',
    patternNames: {
      ramp: 'グレーランプ',
      steps: '段階パターン',
      gamma: 'ガンマチェッカー',
      black: '黒つぶれ',
      white: '白飛び',
    },
    patternDescriptions: {
      ramp: '黒から白への滑らかなグラデーション。縞状の段差（バンディング）が目立たないか確認します。',
      gamma:
        '白黒の細い縞と、各ガンマ値に対応するグレーを並べます。縞と最もなじんで見えるグレーが、画面の実効ガンマの目安です。',
      steps:
        '黒から白までを32段に分けた帯。隣り合う段の差が見分けられるかを確認します。',
      black:
        '黒の背景に、ごくわずかに明るいグレー（1〜16）の四角を並べます。見えない四角が多いほど黒つぶれしています。',
      white:
        '白の背景に、ごくわずかに暗いグレー（254〜239）の四角を並べます。見えない四角が多いほど白飛びしています。',
    },
    stageLabel: 'ガンマ・階調チェックの全画面表示',
    closeLabel: '終了',
    stageHint: 'クリック／→で次　←で前　1〜5で選択　Escで終了',
    estimateHeading: 'ガンマ値の目安を計算',
    estimateHint:
      '「ガンマチェッカー」で、白黒の縞と最もなじんで見えたグレーの数値（階調値）を入力すると、実効ガンマを推定します。',
    levelLabel: 'なじんだグレーの階調値（0〜255）',
    estimateResultLabel: '推定ガンマ',
    estimateInvalid: '1〜254の値を入力してください',
    gammaTableHeading: 'ガンマ値と階調値の対応',
    gammaColumn: 'ガンマ',
    levelColumn: '縞となじむグレー',
    howToHeading: '使い方',
    howToSteps: [
      '画面の明るさとコントラストを普段使う設定にし、できれば周囲を少し暗くします。',
      '「全画面でチェックを開始」を押す（または確認したいパターンのボタンを押す）と、全画面でパターンが表示されます。',
      'クリックや矢印キーでパターンを切り替え、段差・縞との差・見えない四角がないかを確認します。ガンマチェッカーは少し離れて見ると判断しやすくなります。',
      'ガンマチェッカーでなじんだグレーの階調値を「なじんだグレーの階調値（0〜255）」に入力すると、実効ガンマの目安が表示されます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '表示はブラウザ・OS・ビデオカードの色設定、モニターの映像モードに影響されます。判断はあくまで目安です。',
      'ガンマチェッカーは、モニターを正面から見て、ズームを100%にした状態で確認してください。拡大縮小や表示スケールの設定によって縞がにじみ、正しく比較できなくなります。',
      '8bit表示では黒から白まで256段階しかないため、グレーランプにうっすら段差が見えるのは正常な場合があります。HDR設定や色深度の設定でも見え方が変わります。',
      'sRGB基準のモニターは、ガンマ約2.2（厳密には曲線）が標準です。ガンマ値の推定は、肉眼で比較した値による簡易的な目安であり、測定器による校正の代わりにはなりません。',
      'Escで終了するまで同じパターンが表示されます。長時間の表示は焼き付きの原因になることがあるため、確認が済んだら終了してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ガンマ',
        description:
          '入力された階調値と、画面に表示される明るさの関係を表す指数です。Windows・Webの標準（sRGB）はおよそ2.2で、値が大きいほど中間調が暗く表示されます。',
      },
      {
        term: 'バンディング',
        description:
          'なめらかなグラデーションが縞状の段差になって見える現象です。階調数が足りない、または色の圧縮・設定が原因で生じます。',
      },
      {
        term: '黒つぶれ・白飛び',
        description:
          '暗部の差がすべて黒に、明部の差がすべて白に見えて、細部が判別できなくなる現象です。明るさやコントラストの設定が合っていないと目立ちます。',
      },
    ],
  },
  en: {
    title: 'Monitor Gamma & Banding Test – Grayscale and Black Level',
    description:
      'Check gamma, banding and black/white clipping on your monitor with fullscreen gray ramp, step and gamma checker patterns. Runs in your browser.',
    h1: 'Monitor Gamma & Grayscale Banding Test',
    introHtml:
      'Use a gray gradient and step patterns to look for banding, a stripes-versus-gray comparison to estimate gamma, and near-black and near-white patches to check for crushed shadows or clipped highlights. For stuck pixels or uneven color, try the <a href="/en/tools/dead-pixel-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Dead Pixel Test</a>; for refresh rate, the <a href="/en/tools/refresh-rate-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Refresh Rate Tester</a>.',
    startLabel: 'Start fullscreen test',
    startHint:
      'Once started, click or tap (or press → / Space) for the next pattern, ← for the previous one, 1–5 to jump to a pattern, and Esc to exit. You can also pick a pattern below to start from it.',
    patternsHeading: 'Start from a pattern',
    patternNames: {
      ramp: 'Gray ramp',
      steps: 'Gray steps',
      gamma: 'Gamma checker',
      black: 'Black clipping',
      white: 'White clipping',
    },
    patternDescriptions: {
      ramp: 'A smooth black-to-white gradient. Look for visible bands or steps (banding).',
      gamma:
        'Fine black-and-white stripes next to grays matched to common gamma values. The gray that blends in best with the stripes shows your screen’s effective gamma.',
      steps:
        'A strip of 32 gray levels from black to white. Check that you can tell neighboring steps apart.',
      black:
        'Squares of very dark gray (levels 1–16) on a black background. The more squares you cannot see, the more shadow detail is crushed.',
      white:
        'Squares of very light gray (levels 254–239) on a white background. The more squares you cannot see, the more highlights are clipped.',
    },
    stageLabel: 'Fullscreen gamma and grayscale test',
    closeLabel: 'Exit',
    stageHint: 'Click / → next   ← previous   1–5 jump   Esc exit',
    estimateHeading: 'Estimate your gamma',
    estimateHint:
      'In the "Gamma checker", enter the gray level that blends in best with the black-and-white stripes to estimate your effective gamma.',
    levelLabel: 'Matching gray level (0–255)',
    estimateResultLabel: 'Estimated gamma',
    estimateInvalid: 'Enter a value from 1 to 254',
    gammaTableHeading: 'Gamma and matching gray level',
    gammaColumn: 'Gamma',
    levelColumn: 'Gray that matches stripes',
    howToHeading: 'How to use',
    howToSteps: [
      'Set the brightness and contrast to what you normally use, and dim the room a little if you can.',
      'Press "Start fullscreen test" (or a pattern button to start from that pattern) and the pattern fills the screen.',
      'Switch patterns with a click or the arrow keys, and look for bands, stripes that differ from the gray, and squares you cannot see. The gamma checker is easier to judge from a bit farther away.',
      'Enter the gray level that blended in best with the stripes in "Matching gray level (0–255)" to see an estimate of your effective gamma.',
    ],
    notesHeading: 'Notes',
    notes: [
      'What you see depends on the color settings of your browser, OS and graphics card, and on the monitor’s picture mode. Treat the result as a rough guide.',
      'View the gamma checker head-on with the browser zoom at 100%. Zooming or display scaling blurs the stripes and makes the comparison unreliable.',
      '8-bit output has only 256 levels from black to white, so faint steps in the gray ramp can be normal. HDR and color depth settings also change how it looks.',
      'sRGB monitors target a gamma of about 2.2 (technically a curve). The estimate here comes from comparing by eye and is no substitute for calibrating with a colorimeter.',
      'The same pattern stays on screen until you press Esc. Showing a static image for a long time can cause burn-in, so exit when you are done.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Gamma',
        description:
          'The exponent that relates a pixel’s input level to the brightness shown on screen. The standard for Windows and the web (sRGB) is about 2.2; a higher value makes midtones look darker.',
      },
      {
        term: 'Banding',
        description:
          'When a smooth gradient shows up as visible stripes or steps. It comes from too few gray levels, or from color compression and settings.',
      },
      {
        term: 'Crushed blacks / clipped whites',
        description:
          'When differences in dark areas all look black, or differences in bright areas all look white, so detail is lost. It becomes obvious when brightness or contrast is set badly.',
      },
    ],
  },
};
