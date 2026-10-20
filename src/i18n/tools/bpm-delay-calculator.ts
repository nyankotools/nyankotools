import type { Locale } from '../../data/tools';

export interface BpmDelayCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  bpmLabel: string;
  unitLabel: string;
  unitMs: string;
  unitHz: string;
  delayHeading: string;
  delayHint: string;
  noteColumn: string;
  kindLabels: Record<'straight' | 'dotted' | 'triplet', string>;
  /** キーは分母（1, 2, 4, 8, 16, 32, 64） */
  noteNames: Record<'1' | '2' | '4' | '8' | '16' | '32' | '64', string>;
  reverbHeading: string;
  reverbHint: string;
  reverbGroupColumn: string;
  reverbValueColumn: string;
  reverbGroups: Record<'predelay' | 'decay', string>;
  /** `{label}` `{value}` を置換する */
  copyCellLabel: string;
  copyAllLabel: string;
  copiedMessage: string;
  copyFailedMessage: string;
  tapHeading: string;
  tapLabel: string;
  tapHint: string;
  tapEmpty: string;
  /** `{bpm}` `{count}` を置換する */
  tapResult: string;
  tapNeedMore: string;
  tapResetLabel: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const bpmDelayCalculatorContent: Record<
  Locale,
  BpmDelayCalculatorPageContent
> = {
  ja: {
    title: 'BPMからディレイタイム計算（音符別ms・Hz）',
    description:
      'BPMを入れるだけで、全音符〜64分音符の通常・付点・3連符のディレイタイムをms・Hzで一覧表示。リバーブのプリディレイ/ディケイの目安やタップテンポ付き。計算はブラウザ内で行われ、サーバーには送信されません。',
    h1: 'BPMからディレイタイム・リバーブタイムを計算',
    introHtml:
      '曲のテンポ（BPM）から、ディレイやリバーブをテンポに合わせるための時間を求めます。全音符〜64分音符の通常・付点・3連符をミリ秒（ms）またはヘルツ（Hz）で一覧にし、値をクリックするとコピーできます。テンポが分からないときは「タップ」で測れます。クリックを鳴らして確認するなら<a href="/tools/metronome-bpm/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">メトロノーム</a>もご利用ください。計算はこのページ内で行われ、外部には送信されません。',
    bpmLabel: 'テンポ（BPM）',
    unitLabel: '表示単位',
    unitMs: 'ミリ秒（ms）',
    unitHz: 'ヘルツ（Hz）',
    delayHeading: 'ディレイタイム一覧',
    delayHint:
      '値をクリックするとコピーします。四分音符を1拍として計算しています。',
    noteColumn: '音符',
    kindLabels: { straight: '通常', dotted: '付点', triplet: '3連符' },
    noteNames: {
      '1': '全音符（1/1）',
      '2': '二分音符（1/2）',
      '4': '四分音符（1/4）',
      '8': '八分音符（1/8）',
      '16': '十六分音符（1/16）',
      '32': '三十二分音符（1/32）',
      '64': '六十四分音符（1/64）',
    },
    reverbHeading: 'リバーブのプリディレイ・ディケイの目安',
    reverbHint:
      'プリディレイは短め（1/64〜1/8）、ディケイは1拍〜1小節（4拍）を出発点にして、最後は耳で調整してください。',
    reverbGroupColumn: '項目',
    reverbValueColumn: '時間',
    reverbGroups: { predelay: 'プリディレイ', decay: 'ディケイ' },
    copyCellLabel: '{label}: {value} をコピー',
    copyAllLabel: '表をコピー',
    copiedMessage: 'コピーしました',
    copyFailedMessage: 'コピーできませんでした',
    tapHeading: 'タップテンポ（BPM測定）',
    tapLabel: 'タップ',
    tapHint:
      '曲に合わせて一定の間隔でボタンを叩いてください。直近8回の平均からBPMを求め、上のテンポに反映します（3秒以上空くと数え直します）。',
    tapEmpty: 'まだタップされていません',
    tapResult: '{bpm} BPM（{count}回の平均）',
    tapNeedMore: 'もう一度タップするとBPMが表示されます',
    tapResetLabel: 'リセット',
    howToHeading: '使い方',
    howToSteps: [
      '「テンポ（BPM）」に曲のBPMを入れます。分からないときは「タップ」を曲に合わせて叩きます。',
      '「表示単位」でミリ秒（ms）かヘルツ（Hz）を選びます。ディレイタイムはms、LFOのレートはHzが使えます。',
      '「ディレイタイム一覧」から使いたい音符と種類（通常・付点・3連符）の値をクリックしてコピーし、プラグインに入力します。',
      'リバーブは「リバーブのプリディレイ・ディケイの目安」を出発点にして、耳で調整します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '四分音符を1拍として計算しています。付点は1.5倍、3連符は2/3倍の長さです。',
      '表示は小数第2位までに丸めています。小数を受け付けないプラグインでは、近い整数を入力してください。',
      'プラグインによってはテンポ同期（シンク）機能で音符を直接選べます。その場合はこの表は確認用に使えます。',
      'リバーブの時間は目安です。曲の密度や音色によって、聴感上ちょうどよい値は変わります。',
      'タップで測ったBPMは目安です。曲の途中でテンポが変わる場合には対応できません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'ディレイタイム',
        description:
          'ディレイ（やまびこ）エフェクトで、元の音から反復音が返ってくるまでの時間です。テンポに合わせた音符の長さにすると、リズムに馴染みます。',
      },
      {
        term: '付点音符',
        description:
          '元の音符の1.5倍の長さを持つ音符です。付点八分のディレイは、四分音符の3/4にあたる跳ねるような反復になります。',
      },
      {
        term: '3連符',
        description:
          '通常の2つ分の長さを3等分した音符です。長さは通常の2/3倍で、ディレイに使うとシャッフルのようなノリが出ます。',
      },
      {
        term: 'プリディレイ',
        description:
          'リバーブで、原音が鳴ってから残響が始まるまでの時間です。長くすると原音が残響に埋もれにくくなります。',
      },
      {
        term: 'ディケイ',
        description:
          'リバーブの残響が減衰するまでの時間（リバーブタイム）です。テンポに合う長さにすると、次の音の前に残響がきれいに消えます。',
      },
    ],
  },
  en: {
    title: 'BPM to Delay Time Calculator (ms and Hz)',
    description:
      'Convert BPM to delay times in ms and Hz for whole to 64th notes, straight, dotted and triplet, plus reverb pre-delay and decay guides and tap tempo. Free.',
    h1: 'BPM to Delay Time & Reverb Time Calculator',
    introHtml:
      'Enter a song tempo to get the delay and reverb times that lock to it. The table lists straight, dotted and triplet values from whole notes to 64th notes in milliseconds or hertz, and you can click any value to copy it. If you do not know the tempo, find it with "Tap". To hear the pulse, try the <a href="/en/tools/metronome-bpm/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Metronome</a>. Everything is calculated on this page and nothing is sent anywhere.',
    bpmLabel: 'Tempo (BPM)',
    unitLabel: 'Display unit',
    unitMs: 'Milliseconds (ms)',
    unitHz: 'Hertz (Hz)',
    delayHeading: 'Delay times',
    delayHint:
      'Click a value to copy it. A quarter note is treated as one beat.',
    noteColumn: 'Note',
    kindLabels: { straight: 'Straight', dotted: 'Dotted', triplet: 'Triplet' },
    noteNames: {
      '1': 'Whole (1/1)',
      '2': 'Half (1/2)',
      '4': 'Quarter (1/4)',
      '8': 'Eighth (1/8)',
      '16': 'Sixteenth (1/16)',
      '32': '32nd (1/32)',
      '64': '64th (1/64)',
    },
    reverbHeading: 'Reverb pre-delay and decay guide',
    reverbHint:
      'Start with a short pre-delay (1/64 to 1/8) and a decay of one beat to one bar (4 beats), then fine-tune by ear.',
    reverbGroupColumn: 'Setting',
    reverbValueColumn: 'Time',
    reverbGroups: { predelay: 'Pre-delay', decay: 'Decay' },
    copyCellLabel: 'Copy {label}: {value}',
    copyAllLabel: 'Copy table',
    copiedMessage: 'Copied',
    copyFailedMessage: 'Could not copy',
    tapHeading: 'Tap tempo (BPM counter)',
    tapLabel: 'Tap',
    tapHint:
      'Tap the button at a steady pace along with a song. The BPM is taken from your last 8 taps and applied to the tempo above (a pause of 3 seconds or more starts a new count).',
    tapEmpty: 'No taps yet',
    tapResult: '{bpm} BPM (average of {count} taps)',
    tapNeedMore: 'Tap once more to see the BPM',
    tapResetLabel: 'Reset',
    howToHeading: 'How to use',
    howToSteps: [
      'Enter the song BPM in "Tempo (BPM)". If you do not know it, tap along with the song using "Tap".',
      'Pick milliseconds (ms) or hertz (Hz) in "Display unit". Use ms for delay times and Hz for LFO rates.',
      'In "Delay times", click the value for the note and type (straight, dotted, triplet) you want to copy it, then paste it into your plugin.',
      'For reverb, use "Reverb pre-delay and decay guide" as a starting point and adjust by ear.',
    ],
    notesHeading: 'Notes',
    notes: [
      'A quarter note is treated as one beat. Dotted notes are 1.5 times as long and triplets are 2/3 as long.',
      'Values are rounded to two decimal places. If a plugin only accepts whole numbers, enter the nearest one.',
      'Many plugins have a tempo sync mode where you can pick the note directly. In that case this table is handy for checking.',
      'Reverb times are only a guide. The right value by ear depends on how dense the mix is and on the sound.',
      'A tapped BPM is an estimate and cannot follow songs that change tempo.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Delay time',
        description:
          'The time between the original sound and its repeat in a delay effect. Setting it to a note length at the song tempo makes the echoes sit in the groove.',
      },
      {
        term: 'Dotted note',
        description:
          'A note 1.5 times as long as the plain note. A dotted eighth delay repeats at three quarters of a beat, giving a bouncing feel.',
      },
      {
        term: 'Triplet',
        description:
          'A note that fits three into the space of two plain notes, so it is 2/3 as long. Used for delay, it gives a shuffle-like feel.',
      },
      {
        term: 'Pre-delay',
        description:
          'The gap between the dry sound and the start of the reverb. A longer pre-delay keeps the original sound from being buried in the reverb.',
      },
      {
        term: 'Decay',
        description:
          'How long the reverb tail takes to fade out (reverb time). Matching it to the tempo lets the tail clear before the next note.',
      },
    ],
  },
};
