import type { Locale } from '../../data/tools';

export interface VirtualPianoPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  timbreLabel: string;
  timbres: Record<'piano' | 'sine' | 'square' | 'sawtooth', string>;
  octaveLabel: string;
  octaveDownLabel: string;
  octaveUpLabel: string;
  /** `{from}` と `{to}` を音名で置換する */
  rangeText: string;
  volumeLabel: string;
  showNamesLabel: string;
  showKeysLabel: string;
  keyboardLabel: string;
  /** 鍵盤ボタンの名前。`{note}` を音名で置換する */
  keyButtonLabel: string;
  startHint: string;
  noAudioError: string;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const virtualPianoContent: Record<Locale, VirtualPianoPageContent> = {
  ja: {
    title: 'バーチャルピアノ（PCキーボード・画面で演奏）',
    description:
      'PCのキーボードやマウス、スマホのタッチで弾ける無料のバーチャルピアノ。ピアノ風・サイン波・矩形波・のこぎり波の4音色、オクターブ切り替え、音量調整、音名表示に対応。音はブラウザ内で生成され、サーバーには送信されません。',
    h1: 'バーチャルピアノ（PCキーボード・画面で演奏）',
    introHtml:
      'PCのキーボード、マウス、スマホのタッチで弾けるオンラインのピアノです。4種類の音色を切り替えられ、同時に何音でも鳴らせます。楽器の音程を確認したいときは<a href="/tools/instrument-tuner/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">楽器チューナー</a>も使えます。音はブラウザ内で作っており、外部への送信はありません。',
    timbreLabel: '音色',
    timbres: {
      piano: 'ピアノ風',
      sine: 'サイン波',
      square: '矩形波',
      sawtooth: 'のこぎり波',
    },
    octaveLabel: 'オクターブ',
    octaveDownLabel: 'オクターブを下げる',
    octaveUpLabel: 'オクターブを上げる',
    rangeText: '{from} 〜 {to}',
    volumeLabel: '音量',
    showNamesLabel: '音名を表示',
    showKeysLabel: 'キー割り当てを表示',
    keyboardLabel: 'ピアノの鍵盤（横にスクロールできます）',
    keyButtonLabel: '{note}',
    startHint:
      '鍵盤をクリック・タップするか、キーボードの Z S X D C V … や Q 2 W 3 E R … を押すと音が鳴ります。',
    noAudioError: 'お使いのブラウザは音の再生（Web Audio）に対応していません。',
    howToHeading: '使い方',
    howToSteps: [
      '「音色」を選びます。まずは「ピアノ風」がおすすめです。',
      '画面の鍵盤をクリック・タップするか、キーボードの Z〜M（低い音）と Q〜P（高い音）を押して弾きます。',
      '音の高さは「オクターブ」の − / + で変えられます。',
      '音が大きすぎる・小さいときは「音量」のスライダーで調整します。',
    ],
    notesHeading: '注意事項',
    notes: [
      '音を鳴らすには、ページ上で一度クリック・タップかキー入力をする必要があります（ブラウザの自動再生制限）。',
      'キーボードでの同時押し数は、キーボードの仕様（ゴースト・キー対策）により制限されることがあります。多くのノートPCでは3〜6音程度までです。',
      'スマホでは鍵盤を横にスクロールできます。スクロールを始めると、押していた鍵は離されます。',
      'ここで鳴るのはブラウザで合成した音で、実際のピアノの録音ではありません。音色の違いは目安としてお使いください。',
      'Ctrl・Alt・Command を押しながらのキー操作や、入力欄・選択欄の操作中は演奏として扱いません（ブラウザのショートカットを妨げないためです）。',
      'スマホやタブレットでは、マナーモードや音量設定で鳴らないことがあります。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'オクターブ',
        description:
          '同じ名前の音で、高さが2倍（周波数）または半分になる間隔です。ドから次のドまでが1オクターブです。このページの鍵盤は3オクターブ強です。',
      },
      {
        term: '矩形波・のこぎり波',
        description:
          '電子楽器でよく使われる波形です。矩形波は「ピー」という硬い音、のこぎり波は倍音が多く明るい音になります。サイン波は倍音を含まない、最も純粋な音です。',
      },
      {
        term: 'エンベロープ（ADSR）',
        description:
          '音の大きさの時間変化です。立ち上がり（アタック）、減衰（ディケイ）、保持（サステイン）、鍵を離した後の余韻（リリース）で表します。ピアノ風の音は、押し続けると少しずつ小さくなります。',
      },
      {
        term: 'MIDIノート番号',
        description:
          '音の高さを0〜127の整数で表す番号です。中央のド（C4）は60、A4は69で、1つ増えると半音高くなります。',
      },
    ],
  },
  en: {
    title: 'Virtual Piano Online (PC Keyboard & Touch)',
    description:
      'Free online virtual piano. Play with your computer keyboard, mouse or touch screen. Four sounds, octave shift and volume control. Runs in your browser.',
    h1: 'Virtual Piano: Play Online with Your Keyboard or Touch Screen',
    introHtml:
      'A piano you can play with your computer keyboard, mouse or touch screen. Pick one of four sounds and play as many notes at once as you like. To check the pitch of a real instrument, try the <a href="/en/tools/instrument-tuner/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Instrument Tuner</a>. Sound is generated in your browser and nothing is sent anywhere.',
    timbreLabel: 'Sound',
    timbres: {
      piano: 'Piano-like',
      sine: 'Sine',
      square: 'Square',
      sawtooth: 'Sawtooth',
    },
    octaveLabel: 'Octave',
    octaveDownLabel: 'Octave down',
    octaveUpLabel: 'Octave up',
    rangeText: '{from} to {to}',
    volumeLabel: 'Volume',
    showNamesLabel: 'Show note names',
    showKeysLabel: 'Show keyboard shortcuts',
    keyboardLabel: 'Piano keyboard (scrolls sideways)',
    keyButtonLabel: '{note}',
    startHint:
      'Click or tap the keys, or press Z S X D C V … and Q 2 W 3 E R … on your keyboard to play.',
    noAudioError: 'Your browser does not support audio playback (Web Audio).',
    howToHeading: 'How to use',
    howToSteps: [
      'Choose a "Sound". "Piano-like" is a good place to start.',
      'Click or tap the on-screen keys, or press Z to M (lower notes) and Q to P (higher notes) on your keyboard.',
      'Change the pitch range with the − / + buttons next to "Octave".',
      'If it is too loud or too quiet, adjust the "Volume" slider.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Browsers block audio until you interact with the page, so click, tap or press a key once before expecting sound.',
      'How many keys you can hold at once depends on your keyboard hardware (ghosting protection). Many laptops manage only about 3 to 6.',
      'On a phone you can scroll the keyboard sideways. When a scroll starts, any key you were holding is released.',
      'The sounds are synthesised in the browser, not recordings of a real piano. Treat the timbres as approximations.',
      'Key presses with Ctrl, Alt or Command held, or while a field or menu is focused, are not treated as playing, so browser shortcuts keep working.',
      'On phones and tablets, silent mode or the device volume can keep the page silent.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Octave',
        description:
          'The interval between two notes with the same name, where the frequency doubles or halves. From one C to the next C is one octave. This keyboard spans just over three octaves.',
      },
      {
        term: 'Square and sawtooth waves',
        description:
          'Waveforms common in synthesizers. A square wave has a hollow, buzzy tone and a sawtooth is bright with many overtones. A sine wave has no overtones and is the purest sound.',
      },
      {
        term: 'Envelope (ADSR)',
        description:
          'How the loudness of a note changes over time: attack (rise), decay (fall), sustain (held level) and release (tail after you let go). The piano-like sound fades gradually while you hold the key.',
      },
      {
        term: 'MIDI note number',
        description:
          'A number from 0 to 127 for pitch. Middle C (C4) is 60 and A4 is 69; each step up is one semitone.',
      },
    ],
  },
};
