import type { Locale } from '../../data/tools';

export interface UfoMotionTestPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  warningHeading: string;
  warning: string;
  speedLabel: string;
  speedNames: { '240': string; '480': string; '960': string; '1920': string };
  backgroundLabel: string;
  backgroundNames: { black: string; gray: string; white: string };
  directionLabel: string;
  directionRight: string;
  directionLeft: string;
  startLabel: string;
  startHint: string;
  stageLabel: string;
  closeLabel: string;
  stageHint: string;
  hudRate: string;
  hudSkipped: string;
  hudPerFrame: string;
  pausedLabel: string;
  resultHeading: string;
  resultEmpty: string;
  resultLabels: {
    verdict: string;
    frames: string;
    rate: string;
    skipped: string;
    events: string;
    worst: string;
    ratio: string;
    perFrame: string;
  };
  verdicts: { smooth: string; minor: string; stutter: string };
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const ufoMotionTestContent: Record<Locale, UfoMotionTestPageContent> = {
  ja: {
    title: 'モーション・残像テスト（フレーム飛び確認）',
    description:
      '画面を横切る図形で、モニターやスマホの残像・モーションブラー・フレーム飛び（カクつき）を確認できます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'モーション・残像テスト',
    introHtml:
      '全画面で図形を一定速度で動かし、残像（ゴースト）や動きのぼやけを目視で確認します。同時に <code class="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">requestAnimationFrame</code> の間隔を記録し、フレームが飛んだ回数を数えます。画面のHz数そのものは <a href="/tools/refresh-rate-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">リフレッシュレート測定</a>、ドット抜けは <a href="/tools/dead-pixel-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ドット抜けチェック</a> で確認できます。',
    warningHeading: '光過敏・体調に関する注意',
    warning:
      'テスト中は画面の高速な移動や明暗の大きな切り替えが表示されます。光過敏性発作の既往がある方、気分が悪くなりやすい方は使用しないでください。違和感があればすぐに Esc キーまたは閉じるボタンで中止し、休憩してください。',
    speedLabel: '移動速度',
    speedNames: {
      '240': '遅い',
      '480': '標準',
      '960': '速い',
      '1920': '非常に速い',
    },
    backgroundLabel: '背景',
    backgroundNames: { black: '黒', gray: 'グレー', white: '白' },
    directionLabel: '向き',
    directionRight: '左→右',
    directionLeft: '右→左',
    startLabel: 'テストを開始',
    startHint:
      '全画面に切り替わります。Escキーまたは右上の×で終了、↑↓キーで速度、スペースキーで一時停止できます。',
    stageLabel: 'モーションテスト画面',
    closeLabel: 'テストを終了',
    stageHint: '↑↓: 速度 / Space: 一時停止 / Esc: 終了',
    hudRate: '推定レート',
    hudSkipped: 'フレーム飛び',
    hudPerFrame: '1フレームの移動量',
    pausedLabel: '一時停止中',
    resultHeading: '直近のテスト結果',
    resultEmpty: 'まだテストを実行していません。',
    resultLabels: {
      verdict: '判定',
      frames: '解析したフレーム数',
      rate: '推定リフレッシュレート',
      skipped: 'フレーム飛び（推定）',
      events: 'フレーム飛びの発生回数',
      worst: '最大の連続飛び',
      ratio: 'フレーム飛びの割合',
      perFrame: '1フレームあたりの移動量',
    },
    verdicts: {
      smooth: '良好（フレーム飛びなし）',
      minor: '軽微（ごくまれに飛ぶ）',
      stutter: 'カクつきあり（頻繁にフレームが飛ぶ）',
    },
    howToHeading: '使い方',
    howToSteps: [
      '移動速度・背景・向きを選びます。',
      '「テストを開始」を押すと全画面で図形が動きます。',
      '図形の後ろに尾を引く残像や、動きのぼやけ・カクつきを目で確認します。',
      'Escキーで終了すると、フレーム飛びの推定結果が表示されます。',
    ],
    notesHeading: '注意事項',
    notes: [
      'フレーム飛びは、ブラウザの描画間隔から推定した値です。ディスプレイ自体の応答速度（GtG）や入力遅延を測るものではありません。',
      '残像やぼやけの強さは目視での確認です。同じ条件で別の画面と見比べると違いが分かります。',
      '他のタブやアプリの負荷、省電力モード、画面録画中などはフレーム飛びが増え、結果が悪く出ることがあります。',
      'バックグラウンドのタブなどで描画が止まった期間（約250ms超）は統計から除外します。',
      '本ツールは特定の製品・サービスとは無関係の、汎用的な動作確認ツールです。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '残像（ゴースト）',
        description:
          '動く物体の後ろに薄い尾のような像が残って見える現象です。液晶パネルの応答速度が遅いと目立ちます。',
      },
      {
        term: 'モーションブラー',
        description:
          '動く物体の輪郭がぼやけて見える現象です。パネルの応答に加え、人の目が動きを追う際にも生じるため、リフレッシュレートが高いほど軽減されます。',
      },
      {
        term: 'フレーム飛び（フレームドロップ）',
        description:
          '本来の更新タイミングで描画が間に合わず、1フレーム以上が表示されないまま次へ進むことです。動きがカクついて見える原因になります。',
      },
    ],
  },
  en: {
    title: 'Motion Blur & Frame Skip Test (Ghosting Check)',
    description:
      'Check motion blur, ghosting and skipped frames on your monitor or phone with a moving object in full screen. Runs in your browser; nothing is sent to a server.',
    h1: 'Motion Blur & Frame Skip Test',
    introHtml:
      'Moves an object across the full screen at a steady speed so you can judge ghosting trails and motion blur by eye. At the same time it logs <code class="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800">requestAnimationFrame</code> timing and counts skipped frames. To find out the refresh rate itself, use the <a href="/en/tools/refresh-rate-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Refresh Rate Test</a>; for stuck pixels, try the <a href="/en/tools/dead-pixel-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Dead Pixel Test</a>.',
    warningHeading: 'Photosensitivity and comfort warning',
    warning:
      'The test shows fast-moving objects and strong light/dark contrast. Do not use it if you have a history of photosensitive seizures or tend to feel unwell from motion. If you feel uncomfortable, stop at once with the Esc key or the close button and take a break.',
    speedLabel: 'Speed',
    speedNames: {
      '240': 'Slow',
      '480': 'Normal',
      '960': 'Fast',
      '1920': 'Very fast',
    },
    backgroundLabel: 'Background',
    backgroundNames: { black: 'Black', gray: 'Gray', white: 'White' },
    directionLabel: 'Direction',
    directionRight: 'Left to right',
    directionLeft: 'Right to left',
    startLabel: 'Start test',
    startHint:
      'Switches to full screen. Press Esc or the x at the top right to finish, the up/down keys to change speed, and Space to pause.',
    stageLabel: 'Motion test screen',
    closeLabel: 'End test',
    stageHint: 'Up/Down: speed / Space: pause / Esc: end',
    hudRate: 'Estimated rate',
    hudSkipped: 'Skipped frames',
    hudPerFrame: 'Movement per frame',
    pausedLabel: 'Paused',
    resultHeading: 'Latest result',
    resultEmpty: 'No test has been run yet.',
    resultLabels: {
      verdict: 'Verdict',
      frames: 'Frames analyzed',
      rate: 'Estimated refresh rate',
      skipped: 'Skipped frames (estimated)',
      events: 'Skip events',
      worst: 'Longest skip in a row',
      ratio: 'Share of skipped frames',
      perFrame: 'Movement per frame',
    },
    verdicts: {
      smooth: 'Good (no skipped frames)',
      minor: 'Minor (rare skips)',
      stutter: 'Stuttering (frames are skipped often)',
    },
    howToHeading: 'How to use',
    howToSteps: [
      'Choose the speed, background and direction.',
      'Press "Start test" and an object moves across the full screen.',
      'Look for ghosting trails behind the object, blur and stutter.',
      'Press Esc to finish and see the estimated skipped frames.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Skipped frames are estimated from browser paint timing. This does not measure the panel response time (GtG) or input lag.',
      'Ghosting and blur are judged by eye. Comparing two screens under the same settings makes differences easier to see.',
      'Load from other tabs or apps, power-saving modes and screen recording can add skipped frames and make the result look worse.',
      'Gaps longer than about 250 ms, such as when painting stops in the background, are left out of the statistics.',
      'This is a general-purpose display check and is not affiliated with any particular product or service.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Ghosting',
        description:
          'A faint trail left behind a moving object. It is most visible when the LCD panel responds slowly.',
      },
      {
        term: 'Motion blur',
        description:
          'Blurred edges on moving objects. It comes from panel response and from how the eye tracks motion, so higher refresh rates reduce it.',
      },
      {
        term: 'Skipped frame (frame drop)',
        description:
          'A frame that was not drawn in time, so one or more updates are missed and the next one appears late. It makes motion look jerky.',
      },
    ],
  },
};
