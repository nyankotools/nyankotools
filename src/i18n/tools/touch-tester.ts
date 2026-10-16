import type { Locale } from '../../data/tools';

export interface TouchTesterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  padLabel: string;
  padHint: string;
  resetLabel: string;
  statsHeading: string;
  statLabels: {
    current: string;
    max: string;
    total: string;
    coverage: string;
    deviceMax: string;
    pointerType: string;
    pressure: string;
  };
  unsupported: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const touchTesterContent: Record<Locale, TouchTesterPageContent> = {
  ja: {
    title: 'タッチパネルテスト（マルチタッチ・ドラッグ・ゴースト確認）',
    description:
      'スマホ・タブレット・タッチ対応PCの画面をなぞって、同時タッチ数（マルチタッチ）、ドラッグの軌跡、反応しない範囲、勝手に反応するゴースト入力を確認します。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'タッチパネルテスト',
    introHtml:
      '下のテストエリアに指を置いたりなぞったりして、タッチパネルの故障診断ができます。同時に認識されるタッチ数（マルチタッチ）、ドラッグの軌跡の途切れ、一度も反応しなかった範囲、触っていないのに表示される点（ゴースト入力）を確認できます。画面のドット抜けは <a href="/tools/dead-pixel-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ドット抜けチェック</a>、画面の更新頻度は <a href="/tools/refresh-rate-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">リフレッシュレート測定</a> で確認できます。',
    padLabel: 'タッチテストエリア',
    padHint: 'ここを指でなぞってください',
    resetLabel: 'リセット',
    statsHeading: '測定結果',
    statLabels: {
      current: '現在のタッチ数',
      max: '最大同時タッチ数',
      total: 'タッチ回数の合計',
      coverage: '反応した範囲',
      deviceMax: '端末の最大タッチ数（申告値）',
      pointerType: '入力の種類',
      pressure: '筆圧（最新）',
    },
    unsupported: '取得できません',
    howToHeading: '使い方',
    howToSteps: [
      '「タッチテストエリア」に指を置き、複数本の指で同時に触れてみます。',
      '画面全体（特に四隅と端）を指でなぞり、「反応した範囲」を100%に近づけます。',
      '色付きの点や軌跡が途切れていないか、触っていない場所に点が出ないかを確認します。',
      'やり直すときは「リセット」を押します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'ブラウザが認識するタッチ数は、端末・OS・ブラウザの上限に左右されます。iOS Safariでは5本までなど、画面自体は10点対応でも少なく表示されることがあります。',
      'テストエリアの外側（ブラウザのツールバーや画面端のシステムジェスチャー領域）は測定できません。端のジェスチャーが働く場合は、エリア内の端ぎりぎりをなぞってください。',
      '濡れた手・汚れた画面・保護フィルムの影響で反応が悪くなることがあります。画面を拭き、乾いた手で再テストしてください。',
      '触っていないのに点が出る（ゴースト入力）場合は、充電器やケースの影響の可能性もあります。充電器を外して再確認し、改善しなければ修理店やメーカーに相談してください。',
      'マウスやペンでも反応しますが、「入力の種類」で touch 以外が表示されている場合はタッチ入力ではありません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'マルチタッチ',
        description:
          '画面上の複数の接触点を同時に認識する機能です。ピンチ操作や複数本指のジェスチャーに使われ、対応する同時接触数は端末によって異なります。',
      },
      {
        term: 'ゴーストタッチ（ゴースト入力）',
        description:
          '触っていないのにタッチパネルが入力を検知する不具合です。画面の劣化、水滴・汚れ、不良な充電器のノイズ、保護フィルムの浮きなどが原因になります。',
      },
      {
        term: 'Pointer Events',
        description:
          'マウス・タッチ・ペンの入力を共通の形式で扱うブラウザのAPIです。本ツールは、各接触点の座標・筆圧・種類をこのAPIから取得しています。',
      },
    ],
  },
  en: {
    title: 'Touch Screen Test (Multi-Touch, Drag & Ghost Touch Check)',
    description:
      'Swipe your phone, tablet or touch PC screen to check multi-touch, drag trails, dead zones and ghost touches. Runs in your browser; nothing is uploaded.',
    h1: 'Touch Screen Test',
    introHtml:
      'Place fingers on the test area below and swipe around to diagnose your touch screen. You can see how many touches are recognized at once (multi-touch), whether drag trails break up, which areas never responded, and whether dots appear without you touching (ghost touch). To check for stuck pixels, use the <a href="/en/tools/dead-pixel-checker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Dead Pixel Test</a>; for the display update rate, try the <a href="/en/tools/refresh-rate-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Refresh Rate Test</a>.',
    padLabel: 'Touch test area',
    padHint: 'Swipe here with your fingers',
    resetLabel: 'Reset',
    statsHeading: 'Results',
    statLabels: {
      current: 'Current touches',
      max: 'Max simultaneous touches',
      total: 'Total touches',
      coverage: 'Area covered',
      deviceMax: 'Device max touch points (reported)',
      pointerType: 'Input type',
      pressure: 'Pressure (latest)',
    },
    unsupported: 'Unavailable',
    howToHeading: 'How to use',
    howToSteps: [
      'Put fingers on the "Touch test area", using several fingers at once.',
      'Swipe over the whole area, especially the corners and edges, until "Area covered" is close to 100%.',
      'Check that the colored dots and trails do not break up and that no dots appear where you did not touch.',
      'Press "Reset" to start over.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The number of touches the browser reports depends on the device, OS and browser. For example iOS Safari may report up to 5 even if the screen supports 10.',
      'Areas outside the test area, such as browser toolbars and system gesture zones at the screen edge, cannot be measured. If an edge gesture triggers, swipe as close to the edge of the area as you can.',
      'Wet hands, a dirty screen or a screen protector can reduce responsiveness. Wipe the screen and test again with dry hands.',
      'If dots appear without touching (ghost touch), a charger or case may be the cause. Unplug the charger and test again, and if it persists contact a repair shop or the manufacturer.',
      'A mouse or pen also registers, but if "Input type" shows something other than touch, it is not touch input.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Multi-touch',
        description:
          'The ability to recognize several contact points on the screen at once. It powers pinch and multi-finger gestures, and the number of simultaneous points varies by device.',
      },
      {
        term: 'Ghost touch',
        description:
          'A fault where the touch screen registers input without being touched. Causes include screen wear, water or dirt, noise from a faulty charger and a lifted screen protector.',
      },
      {
        term: 'Pointer Events',
        description:
          'A browser API that handles mouse, touch and pen input in one common format. This tool reads each contact point’s position, pressure and type from it.',
      },
    ],
  },
};
