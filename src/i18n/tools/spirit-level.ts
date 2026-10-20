import type { Locale } from '../../data/tools';

export interface SpiritLevelPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  startLabel: string;
  stopLabel: string;
  idleMessage: string;
  modeLabel: string;
  modeFlat: string;
  modeUpright: string;
  modeHintFlat: string;
  modeHintUpright: string;
  bubbleAriaLabel: string;
  statusLevel: string;
  statusTilted: string;
  statusNotMeasurable: string;
  angleLabel: string;
  xLabel: string;
  yLabel: string;
  slopeLabel: string;
  degreeUnit: string;
  zeroHeading: string;
  zeroHint: string;
  zeroLabel: string;
  zeroResetLabel: string;
  zeroActive: string;
  toleranceLabel: string;
  errors: {
    unsupported: string;
    denied: string;
    'no-sensor': string;
    insecure: string;
  };
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const spiritLevelContent: Record<Locale, SpiritLevelPageContent> = {
  ja: {
    title: '水平器（スマホの傾きセンサーで水平・角度を測る）',
    description:
      'スマホの傾きセンサーを使う無料のオンライン水平器です。気泡で水平を確認し、角度と傾斜率を表示。ゼロ点補正にも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '水平器（スマホの傾きセンサーで水平を測る）',
    introHtml:
      'スマホやタブレットの傾きセンサーで、棚や机、床がどれだけ水平かを気泡で確認できます。角度（度）と傾斜率（%）も表示します。センサーの値はブラウザ内だけで処理され、送信も保存もされません。長さを測りたいときは<a href="/tools/screen-ruler/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">画面定規</a>もご利用ください。',
    startLabel: 'センサーを開始',
    stopLabel: 'センサーを停止',
    idleMessage:
      '「センサーを開始」を押してください。iPhone・iPadでは、動きと向きのアクセス許可の確認が表示されます。',
    modeLabel: '測り方',
    modeFlat: '置いて測る',
    modeUpright: '立てて測る',
    modeHintFlat:
      '画面を上にして、机・棚・床などに置きます。気泡が中央の円に入れば水平です。',
    modeHintUpright:
      'スマホを縦（または横）に立てて、壁や柱、額縁の辺に当てます。左右の傾きだけを測ります。',
    bubbleAriaLabel: '水平器の気泡（傾きを円内の位置で表示）',
    statusLevel: '水平です',
    statusTilted: '傾いています',
    statusNotMeasurable:
      'この向きでは測れません。「置いて測る」は画面を上に、「立てて測る」は端末を立ててください。',
    angleLabel: '傾き',
    xLabel: '左右',
    yLabel: '前後',
    slopeLabel: '傾斜率',
    degreeUnit: '°',
    zeroHeading: 'ゼロ点（補正）',
    zeroHint:
      '置いた面が水平でない場合など、いまの位置を基準（0°）にできます。反対向きにも置いて見比べると、端末のずれも確認できます。',
    zeroLabel: '現在の位置をゼロ点にする',
    zeroResetLabel: 'ゼロ点をリセット',
    zeroActive: 'ゼロ点を設定済み',
    toleranceLabel: '水平とみなす許容角',
    errors: {
      unsupported:
        'お使いのブラウザは傾きセンサー（向きと動き）に対応していません。',
      denied:
        '動きと向きのアクセスが許可されていません。ブラウザやiOSの設定からこのサイトを許可して、もう一度お試しください。',
      'no-sensor':
        '傾きセンサーの値が取得できませんでした。PCなどセンサーのない端末では使えません。スマホ・タブレットでお試しください。',
      insecure:
        'この環境では傾きセンサーを利用できません（HTTPS接続が必要です）。',
    },
    howToHeading: '使い方',
    howToSteps: [
      '「センサーを開始」を押します。iPhone・iPadでは、確認画面で「許可」を選びます。',
      '「置いて測る」（机や床）か「立てて測る」（壁や柱）を選び、測りたい面に端末を当てます。',
      '気泡が中央に入り「水平です」と出れば水平です。角度と傾斜率も確認できます。',
      '面が傾いていて基準にしたいときは、「現在の位置をゼロ点にする」で補正します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'スマホの傾きセンサーは機種ごとに数度の誤差があります。精密な施工や設置には、専用の水平器で確認してください。',
      '端末の置き方や、ケース・カメラの出っ張りで面とのずれが出ます。反対向きにも置いて、値が逆になるかを見ると端末のずれを確認できます。',
      'PCなど傾きセンサーのない端末では使えません。また、ブラウザや端末の設定で動きと向きのアクセスが無効だと値が取得できません。',
      '画面の自動回転は切り、縦向きで使うと分かりやすくなります。',
      'センサーの値は画面に表示するだけで、保存も送信もしません。ゼロ点もページを開き直すと元に戻ります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '傾斜率（%）',
        description:
          '水平方向に100進んだとき何だけ上がるかを示す値です。角度のtan（正接）に100を掛けたもので、45°で100%、1°で約1.7%になります。',
      },
      {
        term: 'ゼロ点（キャリブレーション）',
        description:
          '現在の傾きを基準（0°）として登録し、以降の表示からその分を差し引く補正です。面や端末にもともとあるずれを打ち消すために使います。',
      },
    ],
  },
  en: {
    title: 'Spirit Level – Online Bubble Level for Your Phone',
    description:
      'A free online spirit level that uses your phone’s tilt sensor. See a bubble, the angle and slope, and set a zero point. Runs in your browser; nothing is sent.',
    h1: 'Spirit Level (Bubble Level With Your Phone’s Tilt Sensor)',
    introHtml:
      'Use your phone or tablet’s tilt sensor to check whether a shelf, desk or floor is level, with a bubble you can read at a glance. It also shows the angle in degrees and the slope in percent. Sensor values are processed only in your browser and are never sent or saved. To measure lengths, try the <a href="/en/tools/screen-ruler/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Screen Ruler</a>.',
    startLabel: 'Start sensor',
    stopLabel: 'Stop sensor',
    idleMessage:
      'Press "Start sensor". On iPhone and iPad you will be asked to allow access to motion and orientation.',
    modeLabel: 'Position',
    modeFlat: 'Lay flat',
    modeUpright: 'Stand upright',
    modeHintFlat:
      'Lay the phone face up on a desk, shelf or floor. When the bubble sits in the center circle, the surface is level.',
    modeHintUpright:
      'Stand the phone on its long (or short) edge against a wall, post or picture frame. Only the left-right tilt is measured.',
    bubbleAriaLabel: 'Level bubble (tilt shown as position inside the circle)',
    statusLevel: 'Level',
    statusTilted: 'Tilted',
    statusNotMeasurable:
      'This position can’t be measured. For "Lay flat" keep the screen facing up; for "Stand upright" hold the phone on its edge.',
    angleLabel: 'Tilt',
    xLabel: 'Left-right',
    yLabel: 'Front-back',
    slopeLabel: 'Slope',
    degreeUnit: '°',
    zeroHeading: 'Zero point (calibration)',
    zeroHint:
      'If the surface you rest on is not level, you can treat the current position as 0°. Turning the phone around and comparing also reveals any offset in the device itself.',
    zeroLabel: 'Set current position as zero',
    zeroResetLabel: 'Reset zero point',
    zeroActive: 'Zero point is set',
    toleranceLabel: 'Tolerance for "level"',
    errors: {
      unsupported:
        'Your browser does not support the tilt sensor (device orientation).',
      denied:
        'Access to motion and orientation was denied. Allow it for this site in your browser or iOS settings, then try again.',
      'no-sensor':
        'No tilt sensor data was received. This does not work on devices without a sensor, such as most PCs. Try a phone or tablet.',
      insecure:
        'The tilt sensor is unavailable here (an HTTPS connection is required).',
    },
    howToHeading: 'How to use',
    howToSteps: [
      'Press "Start sensor". On iPhone and iPad, choose "Allow" in the prompt.',
      'Pick "Lay flat" (desk or floor) or "Stand upright" (wall or post), then place the phone against the surface.',
      'When the bubble is centered and "Level" appears, the surface is level. The angle and slope are shown too.',
      'If the surface itself is tilted and you want it as the reference, press "Set current position as zero".',
    ],
    notesHeading: 'Notes',
    notes: [
      'Phone tilt sensors are off by a degree or so depending on the model. For precision work, check with a dedicated spirit level.',
      'A case or a protruding camera can keep the phone from sitting flush. Rotate the phone 180 degrees and check that the reading flips sign to spot any device offset.',
      'This does not work on devices without a tilt sensor, such as most PCs, or when motion and orientation access is disabled in the browser or device settings.',
      'It is easiest to read with auto-rotate turned off and the phone held in portrait.',
      'Sensor values are only shown on screen, never saved or sent. The zero point also resets when you reload the page.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Slope (%)',
        description:
          'How much the surface rises per 100 units of horizontal distance: the tangent of the angle times 100. 45° is 100%, and 1° is about 1.7%.',
      },
      {
        term: 'Zero point (calibration)',
        description:
          'Registers the current tilt as the reference (0°) and subtracts it from later readings. Use it to cancel an offset that is already in the surface or the device.',
      },
    ],
  },
};
