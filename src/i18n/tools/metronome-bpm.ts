import type { Locale } from '../../data/tools';

export interface MetronomeBpmPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  bpmLabel: string;
  bpmSliderLabel: string;
  decreaseLabel: string;
  increaseLabel: string;
  beatsLabel: string;
  beatsOption: string;
  subdivisionLabel: string;
  subdivisions: Record<'1' | '2' | '3' | '4', string>;
  volumeLabel: string;
  startLabel: string;
  stopLabel: string;
  beatsIndicatorLabel: string;
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

export const metronomeBpmContent: Record<Locale, MetronomeBpmPageContent> = {
  ja: {
    title: 'メトロノーム・BPM測定（タップテンポ）',
    description:
      '20〜300 BPMで鳴らせる無料のオンラインメトロノーム。拍子・八分/三連符/十六分の分割・音量を指定でき、リズムに合わせてタップするだけでBPMを測定できます。音はブラウザ内で生成され、サーバーには何も送信されません。',
    h1: 'メトロノーム・BPM測定（タップテンポ）',
    introHtml:
      '楽器の練習やリズムの確認に使えるメトロノームです。テンポは20〜300 BPMで、拍子とクリックの分割も選べます。曲のテンポが分からないときは、「タップ」ボタンを曲に合わせて叩くとBPMを測れます。音の出力確認は<a href="/tools/speaker-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">スピーカーテスト</a>をご利用ください。音はこのページ内で生成され、外部には送信されません。',
    bpmLabel: 'テンポ（BPM）',
    bpmSliderLabel: 'テンポ（スライダー）',
    decreaseLabel: '1下げる',
    increaseLabel: '1上げる',
    beatsLabel: '拍子（1小節の拍数）',
    beatsOption: '{n}拍',
    subdivisionLabel: 'クリックの分割',
    subdivisions: {
      '1': '分割なし（四分）',
      '2': '八分音符',
      '3': '三連符',
      '4': '十六分音符',
    },
    volumeLabel: '音量',
    startLabel: '開始',
    stopLabel: '停止',
    beatsIndicatorLabel: '拍の位置',
    tapHeading: 'タップテンポ（BPM測定）',
    tapLabel: 'タップ',
    tapHint:
      '曲やリズムに合わせて、一定の間隔でボタンを叩いてください。直近8回の平均からBPMを求め、上のテンポに反映します（3秒以上空くと数え直します）。',
    tapEmpty: 'まだタップされていません',
    tapResult: '{bpm} BPM（{count}回の平均）',
    tapNeedMore: 'もう一度タップするとBPMが表示されます',
    tapResetLabel: 'リセット',
    howToHeading: '使い方',
    howToSteps: [
      '「テンポ（BPM）」に数値を入れるか、スライダーや「1下げる」「1上げる」で速さを決めます。',
      '「拍子（1小節の拍数）」と「クリックの分割」を選びます。小節の頭の拍は高い音で鳴ります。',
      '「開始」を押すと鳴り始め、「停止」で止まります。再生中でもテンポは変えられます。',
      '曲のテンポを測るときは、「タップ」を曲に合わせて数回叩くと、BPMが上のテンポに入ります。',
    ],
    notesHeading: '注意事項',
    notes: [
      '再生はボタンを押したときに始まります（ブラウザは、ユーザー操作なしの音声再生を許可しません）。',
      '他のタブに切り替える、またはページを離れると、音は自動で停止します（ブラウザが裏のタブの処理を遅らせ、拍がずれるのを防ぐためです）。',
      'タップテンポは、叩いたタイミングの誤差がそのまま結果に出ます。8回前後を一定の間隔で叩くと安定します。',
      'ブルートゥース接続のイヤホンやスピーカーでは、音が遅れて届く場合があります。有線での確認をおすすめします。',
      'タップで測ったBPMは目安です。曲の途中でテンポが変わる場合や、ゆらぎのある演奏には対応できません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'BPM',
        description:
          'Beats Per Minute の略で、1分間に何拍打つかを表すテンポの単位です。120 BPMなら1拍が0.5秒で、1小節（4拍）が2秒になります。',
      },
      {
        term: '拍子',
        description:
          '1小節の中に拍がいくつあるかを表すものです。4拍子なら「強・弱・弱・弱」のように数え、このメトロノームでは小節の頭の拍を高い音で鳴らします。',
      },
      {
        term: '八分音符・三連符・十六分音符',
        description:
          '1拍を何等分して鳴らすかの違いです。八分音符は1拍を2つ、三連符は3つ、十六分音符は4つに分けます。細かいリズムを正確に刻む練習に使います。',
      },
      {
        term: 'タップテンポ',
        description:
          'ボタンを一定の間隔で叩き、その平均の間隔からBPMを求める方法です。曲のテンポが分からないときや、DJ・打ち込みでBPMを合わせたいときに使われます。',
      },
    ],
  },
  en: {
    title: 'Online Metronome & BPM Tap Tempo Counter',
    description:
      "Free online metronome from 20 to 300 BPM with time signatures and subdivisions, plus a tap tempo counter to find a song's BPM. Runs in your browser.",
    h1: 'Online Metronome & Tap Tempo (BPM Counter)',
    introHtml:
      'A metronome for practising an instrument or checking rhythm, from 20 to 300 BPM with a choice of time signature and click subdivision. If you do not know the tempo of a song, tap the "Tap" button along with it to measure the BPM. To check your audio output, use the <a href="/en/tools/speaker-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Speaker Test</a>. Sound is generated on this page and nothing is sent anywhere.',
    bpmLabel: 'Tempo (BPM)',
    bpmSliderLabel: 'Tempo (slider)',
    decreaseLabel: 'Down by 1',
    increaseLabel: 'Up by 1',
    beatsLabel: 'Time signature (beats per bar)',
    beatsOption: '{n} beats',
    subdivisionLabel: 'Click subdivision',
    subdivisions: {
      '1': 'None (quarter notes)',
      '2': 'Eighth notes',
      '3': 'Triplets',
      '4': 'Sixteenth notes',
    },
    volumeLabel: 'Volume',
    startLabel: 'Start',
    stopLabel: 'Stop',
    beatsIndicatorLabel: 'Beat position',
    tapHeading: 'Tap tempo (BPM counter)',
    tapLabel: 'Tap',
    tapHint:
      'Tap the button at a steady pace along with a song or rhythm. The BPM is taken from the average of your last 8 taps and applied to the tempo above (a pause of 3 seconds or more starts a new count).',
    tapEmpty: 'No taps yet',
    tapResult: '{bpm} BPM (average of {count} taps)',
    tapNeedMore: 'Tap once more to see the BPM',
    tapResetLabel: 'Reset',
    howToHeading: 'How to use',
    howToSteps: [
      'Set the speed by typing a number in "Tempo (BPM)", or use the slider and the "Down by 1" / "Up by 1" buttons.',
      'Choose the "Time signature (beats per bar)" and the "Click subdivision". The first beat of each bar plays a higher click.',
      'Press "Start" to begin and "Stop" to end. You can change the tempo while it is playing.',
      'To measure a song, tap the "Tap" button along with it a few times and the BPM is applied to the tempo above.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Playback starts when you press a button, because browsers do not allow sound without a user action.',
      'The sound stops automatically when you switch to another tab or leave the page, because browsers slow down background tabs and the beat would drift.',
      'Tap tempo reflects every timing error in your taps. Tapping about 8 times at a steady pace gives a stable result.',
      'Bluetooth earphones and speakers can delay the sound. Use a wired connection when timing matters.',
      'A tapped BPM is an estimate. It cannot follow songs that change tempo or performances that drift.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'BPM',
        description:
          'Beats Per Minute: the unit of tempo, counting how many beats fall in one minute. At 120 BPM a beat lasts 0.5 seconds and a 4-beat bar lasts 2 seconds.',
      },
      {
        term: 'Time signature',
        description:
          'How many beats make up one bar. In 4 beats you count strong, weak, weak, weak; this metronome plays the first beat of each bar with a higher click.',
      },
      {
        term: 'Eighth notes, triplets and sixteenth notes',
        description:
          'How each beat is split into clicks: two for eighth notes, three for triplets and four for sixteenth notes. They are used to practise playing fine rhythms accurately.',
      },
      {
        term: 'Tap tempo',
        description:
          'A way of finding the BPM by tapping a button at a steady pace and averaging the gaps between taps. It is used when the tempo of a song is unknown or when matching BPM in DJing and programming.',
      },
    ],
  },
};
