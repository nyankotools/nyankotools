import type { Locale } from '../../data/tools';

export interface NoiseGeneratorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  warning: string;
  typeLabel: string;
  types: Record<'white' | 'pink' | 'brown', string>;
  typeHints: Record<'white' | 'pink' | 'brown', string>;
  volumeLabel: string;
  timerLabel: string;
  timerOff: string;
  /** {n} が分数に置き換わる */
  minutesFormat: string;
  playLabel: string;
  stopLabel: string;
  playing: string;
  stopped: string;
  /** {time} が残り時間に置き換わる */
  remaining: string;
  finished: string;
  unsupported: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const noiseGeneratorContent: Record<Locale, NoiseGeneratorPageContent> =
  {
    ja: {
      title:
        'ノイズジェネレーター（ホワイト・ピンク・ブラウンノイズ／タイマー付き）',
      description:
        '作業・勉強・睡眠用のホワイトノイズ、ピンクノイズ、ブラウンノイズを再生できる無料ツールです。タイマーと終了前のフェードアウト付き。音はブラウザ内で生成され、サーバーには何も送信されません。',
      h1: 'ノイズジェネレーター（ホワイト／ピンク／ブラウンノイズ）',
      introHtml:
        '作業や勉強の集中、睡眠、周囲の雑音を紛らわせたいときに使えるノイズを、ブラウザだけで再生できます。タイマーを設定すると、終了の少し前から音量が下がっていき、静かに止まります。スピーカーの確認には<a href="/tools/speaker-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">スピーカーテスト</a>もご利用ください。音はこのページ内で生成され、外部には送信されません。',
      warning:
        '音量は小さめから始めてください。ヘッドホンやイヤホンで長時間大きな音量で聞き続けると、耳に負担がかかります。',
      typeLabel: 'ノイズの種類',
      types: { white: 'ホワイト', pink: 'ピンク', brown: 'ブラウン' },
      typeHints: {
        white:
          '高音までまんべんなく含む「サーッ」という音。雑音を覆い隠したいときに。',
        pink: '高音がやや抑えられた、雨や滝のような自然な音。作業・睡眠向き。',
        brown: '低音が中心の「ゴーッ」という深い音。風や遠くの雷のような音。',
      },
      volumeLabel: '音量',
      timerLabel: 'タイマー',
      timerOff: 'なし（止めるまで再生）',
      minutesFormat: '{n}分',
      playLabel: '再生',
      stopLabel: '停止',
      playing: '再生中',
      stopped: '停止中',
      remaining: '残り {time}',
      finished: 'タイマーが終了しました',
      unsupported:
        'このブラウザは Web Audio に対応していないため、再生できません。',
      howToHeading: '使い方',
      howToSteps: [
        '「ノイズの種類」でホワイト・ピンク・ブラウンから好みの音を選びます。',
        '「音量」を小さめに合わせ、必要なら「タイマー」で再生時間を選びます。',
        '「再生」を押すと音が鳴り始めます。タイマーを設定した場合は、終了前にゆっくり音量が下がります。',
        '止めたいときは「停止」を押します。',
      ],
      notesHeading: '注意事項',
      notes: [
        '再生は「再生」を押したときに始まります（ブラウザは、ユーザー操作なしの音声再生を許可しません）。',
        '再生中はこのタブを開いたままにしてください。ブラウザやOSの省電力機能で、バックグラウンドのタブは止まることがあります。このツールは他のタブへ移った時点では停止しませんが、スマートフォンなどでは画面ロックで止まる場合があります。',
        'タイマーのフェードアウトは終了前の最大10秒間です。20秒未満の設定では、全体の半分の長さになります。',
        '睡眠用途では、スピーカーを枕元から離し、小さめの音量で使うことをおすすめします。',
        'ノイズは約10秒分をつなぎ目をなじませながらくり返し再生しています。一定の周期で変化しない、安定した音です。',
        '耳鳴りや聴覚に不安がある方は、医師にご相談のうえご利用ください。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: 'ホワイトノイズ',
          description:
            '全ての周波数を同じ強さで含むノイズです。「サーッ」という音で、高音が目立つため、話し声や物音を覆い隠す用途に向きます。',
        },
        {
          term: 'ピンクノイズ',
          description:
            '周波数が高くなるほど弱くなるノイズ（1オクターブごとに約3dB減衰）です。人の聴感に近く、ホワイトノイズより耳に優しい音として、作業や睡眠に使われます。',
        },
        {
          term: 'ブラウンノイズ',
          description:
            'ピンクノイズよりさらに高音が弱く、低音が強いノイズ（1オクターブごとに約6dB減衰）です。「ブラウン」は発見者ロバート・ブラウンに由来する名前で、色の茶色とは関係ありません。',
        },
        {
          term: 'フェードアウト',
          description:
            '音量を徐々に下げて無音にすることです。急に音が止まって目が覚めてしまうのを防ぎます。',
        },
      ],
    },
    en: {
      title: 'Noise Generator – White, Pink & Brown Noise with Timer',
      description:
        'Play white, pink or brown noise for focus, study or sleep, with a timer that fades out at the end. Sound is generated in your browser and never uploaded.',
      h1: 'Noise Generator (White, Pink & Brown Noise with Timer)',
      introHtml:
        'Play steady background noise to focus, study, sleep or cover up distracting sounds, right in your browser. Set a timer and the volume fades out gently before the sound stops. To check your speakers first, try the <a href="/en/tools/speaker-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Speaker Test</a>. Sound is generated on this page and nothing is sent anywhere.',
      warning:
        'Start with a low volume. Listening at a high volume through headphones or earbuds for long periods can strain your ears.',
      typeLabel: 'Noise type',
      types: { white: 'White', pink: 'Pink', brown: 'Brown' },
      typeHints: {
        white:
          'An even hiss across all frequencies, good for masking background noise.',
        pink: 'Softer highs, like steady rain or a waterfall. Popular for work and sleep.',
        brown: 'Deep and bass-heavy, like strong wind or distant thunder.',
      },
      volumeLabel: 'Volume',
      timerLabel: 'Timer',
      timerOff: 'Off (play until stopped)',
      minutesFormat: '{n} min',
      playLabel: 'Play',
      stopLabel: 'Stop',
      playing: 'Playing',
      stopped: 'Stopped',
      remaining: '{time} left',
      finished: 'Timer finished',
      unsupported:
        'This browser does not support Web Audio, so it cannot play.',
      howToHeading: 'How to use',
      howToSteps: [
        'Pick white, pink or brown under "Noise type".',
        'Set "Volume" low, and choose a length under "Timer" if you want one.',
        'Press "Play". With a timer, the volume fades out slowly before it ends.',
        'Press "Stop" whenever you want to end it.',
      ],
      notesHeading: 'Notes',
      notes: [
        'Playback starts when you press "Play", because browsers do not allow sound without a user action.',
        'Keep this tab open while playing. Background tabs can be suspended by battery-saving features, and on phones the sound may stop when the screen locks. Switching to another tab does not stop it here.',
        'The timer fade-out lasts up to 10 seconds. For timers under 20 seconds it is half of the total length.',
        'For sleeping, keep the speaker away from your pillow and the volume low.',
        'The noise is a loop of about 10 seconds with a smoothed seam, so the sound stays steady with no audible cycle.',
        'If you have tinnitus or any concern about your hearing, talk to a doctor before using it.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'White noise',
          description:
            'Noise with equal strength at every frequency. It sounds like a hiss and, because of its bright highs, works well for covering voices and other sounds.',
        },
        {
          term: 'Pink noise',
          description:
            'Noise that gets weaker as frequency rises (about 3 dB less per octave). It is closer to how we hear and gentler than white noise, so it is often used for work and sleep.',
        },
        {
          term: 'Brown noise',
          description:
            'Noise with even weaker highs and stronger bass than pink (about 6 dB less per octave). The name comes from Robert Brown, who studied Brownian motion, not from the color.',
        },
        {
          term: 'Fade-out',
          description:
            'Lowering the volume gradually until silence, so the sound does not cut off abruptly and wake you up.',
        },
      ],
    },
  };
