import type { Locale } from '../../data/tools';

export interface SpeakerTesterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  warning: string;
  channelHeading: string;
  channelLabel: string;
  channels: Record<'left' | 'right' | 'both', string>;
  stopLabel: string;
  playing: string;
  stopped: string;
  toneHeading: string;
  waveLabel: string;
  waves: Record<'sine' | 'square' | 'triangle' | 'sawtooth' | 'noise', string>;
  frequencyLabel: string;
  frequencySliderLabel: string;
  presetsLabel: string;
  volumeLabel: string;
  sweepHeading: string;
  sweepLabel: string;
  sweepStopLabel: string;
  sweepHint: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const speakerTesterContent: Record<Locale, SpeakerTesterPageContent> = {
  ja: {
    title: 'スピーカーテスト（左右チャンネル確認・周波数ジェネレーター）',
    description:
      'スピーカーやイヤホンの左右が正しく鳴るかを確認し、20Hz〜20kHzの任意の周波数の音を再生できる無料ツールです。サイン波・矩形波・ノイズ、周波数スイープに対応。音はブラウザ内で生成され、サーバーには何も送信されません。',
    h1: 'スピーカーテスト（左右確認・周波数ジェネレーター）',
    introHtml:
      'スピーカーやイヤホンの左右が逆になっていないか、片側から音が出ているかを確認できます。周波数を指定した音（テスト音）も鳴らせるので、低音や高音がどこまで出るかのチェックにも使えます。マイクの確認は<a href="/tools/mic-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">マイクテスト</a>をご利用ください。音はこのページ内で生成され、外部には送信されません。',
    warning:
      '音量を最小にしてから再生を始め、少しずつ上げてください。特に高い周波数や矩形波は、耳やスピーカーを傷める場合があります。',
    channelHeading: '左右チャンネルのテスト',
    channelLabel: '再生するチャンネル',
    channels: { left: '左', right: '右', both: '左右同時' },
    stopLabel: '停止',
    playing: '再生中',
    stopped: '停止中',
    toneHeading: 'テスト音の設定',
    waveLabel: '音の種類',
    waves: {
      sine: 'サイン波',
      square: '矩形波',
      triangle: '三角波',
      sawtooth: 'のこぎり波',
      noise: 'ホワイトノイズ',
    },
    frequencyLabel: '周波数（Hz）',
    frequencySliderLabel: '周波数（スライダー）',
    presetsLabel: 'よく使う周波数',
    volumeLabel: '音量',
    sweepHeading: '周波数スイープ（20Hz → 20kHz）',
    sweepLabel: 'スイープを開始',
    sweepStopLabel: 'スイープを停止',
    sweepHint:
      '20秒かけて20Hzから20,000Hzまで滑らかに音程を上げます。音が聞こえなくなる周波数が、再生機器または耳の限界の目安です。',
    notesHeading: '注意事項',
    notes: [
      '再生はボタンを押したときに始まります（ブラウザは、ユーザー操作なしの音声再生を許可しません）。',
      '最初は音量を小さくしてください。耳や機器の保護のため、音量の初期値は低くしています。',
      'ステレオの左右を確認するときは、ブラウザやOSの音声設定がモノラルになっていないことを確認してください。モノラル設定では、左右の区別がつきません。',
      'ノートPCの小型スピーカーなどでは、100Hz以下の低音はほとんど鳴りません。聞こえなくても、故障とは限りません。',
      '20kHz付近の高音は、年齢とともに聞こえにくくなります。聞こえなくても、多くは正常です。',
      '周波数の「聞こえ方」は、機器の特性・部屋の響き・耳の状態に左右されるため、機器の精密な測定の代わりにはなりません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '周波数（Hz）',
        description:
          '音の高さを表す単位で、1秒間に波が何回振動するかを示します。数値が大きいほど高い音になります。人の可聴域は、おおよそ20Hz〜20,000Hzです。',
      },
      {
        term: 'サイン波・矩形波・ノイズ',
        description:
          'サイン波は単一の周波数だけを含む最も素直な音です。矩形波・のこぎり波・三角波は倍音を多く含み、ブザーのような音になります。ホワイトノイズは全ての周波数を同じ強さで含む「サーッ」という音です。',
      },
      {
        term: 'スイープ',
        description:
          '周波数を一定の速さで連続的に変えながら鳴らすテスト音です。再生機器の周波数特性や共振（特定の音域で鳴りすぎる現象）を探すのに使われます。',
      },
    ],
  },
  en: {
    title: 'Speaker Test – Left/Right Channel Check & Tone Generator',
    description:
      'Check left and right channels on speakers or headphones and play tones from 20 Hz to 20 kHz, or a sweep. Sound is generated in your browser.',
    h1: 'Speaker Test (Stereo Check & Tone Generator)',
    introHtml:
      'Check that your speakers or headphones are not swapped left to right and that both sides play. You can also play a tone at any frequency to see how low and how high your gear can go. To test a microphone, use the <a href="/en/tools/mic-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Microphone Test</a>. Sound is generated on this page and nothing is sent anywhere.',
    warning:
      'Turn the volume down before you start playback, then raise it slowly. High frequencies and square waves in particular can hurt your ears or damage speakers.',
    channelHeading: 'Left / right channel test',
    channelLabel: 'Channel to play',
    channels: { left: 'Left', right: 'Right', both: 'Both' },
    stopLabel: 'Stop',
    playing: 'Playing',
    stopped: 'Stopped',
    toneHeading: 'Test tone settings',
    waveLabel: 'Sound type',
    waves: {
      sine: 'Sine wave',
      square: 'Square wave',
      triangle: 'Triangle wave',
      sawtooth: 'Sawtooth wave',
      noise: 'White noise',
    },
    frequencyLabel: 'Frequency (Hz)',
    frequencySliderLabel: 'Frequency (slider)',
    presetsLabel: 'Common frequencies',
    volumeLabel: 'Volume',
    sweepHeading: 'Frequency sweep (20 Hz to 20 kHz)',
    sweepLabel: 'Start sweep',
    sweepStopLabel: 'Stop sweep',
    sweepHint:
      'Raises the pitch smoothly from 20 Hz to 20,000 Hz over 20 seconds. The point where the sound disappears is a rough limit of your equipment or your hearing.',
    notesHeading: 'Notes',
    notes: [
      'Playback starts when you press a button, because browsers do not allow sound without a user action.',
      'Start with a low volume. The default volume is kept low to protect your ears and equipment.',
      'To check stereo left and right, make sure your browser or OS audio is not set to mono, which makes the two sides indistinguishable.',
      'Small speakers such as those in laptops barely reproduce anything below 100 Hz. Not hearing it does not necessarily mean a fault.',
      'Hearing near 20 kHz fades with age, so not hearing it is usually normal.',
      'How a frequency sounds depends on the equipment, the room and your ears, so this is not a substitute for proper measurement.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Frequency (Hz)',
        description:
          'The pitch of a sound, given as how many times the wave vibrates per second. A higher number is a higher pitch. Human hearing spans roughly 20 Hz to 20,000 Hz.',
      },
      {
        term: 'Sine, square and noise',
        description:
          'A sine wave contains a single frequency and is the cleanest tone. Square, sawtooth and triangle waves contain many overtones and sound buzzy. White noise contains all frequencies at equal strength and sounds like static.',
      },
      {
        term: 'Sweep',
        description:
          'A test tone whose frequency changes continuously at a steady rate. It is used to find the frequency response and resonances (ranges that ring too loudly) of playback equipment.',
      },
    ],
  },
};
