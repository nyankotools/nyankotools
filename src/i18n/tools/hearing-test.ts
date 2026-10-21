import type { Locale } from '../../data/tools';

export interface HearingTestPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  warning: string;
  volumeLabel: string;
  stepLabel: string;
  stepOptions: Record<'500' | '1000' | '2000', string>;
  listHeading: string;
  listHint: string;
  playLabel: string;
  playingLabel: string;
  heardLabel: string;
  unsupportedLabel: string;
  resetLabel: string;
  resultHeading: string;
  resultNone: string;
  /** {freq} と {age} を置換する */
  resultNormal: string;
  /** {freq} を置換する */
  resultLow: string;
  resultDisclaimer: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: { term: string; description: string }[];
}

export const hearingTestContent: Record<Locale, HearingTestPageContent> = {
  ja: {
    title: '可聴域テスト・モスキート音チェック（年齢の目安）',
    description:
      '8kHz〜20kHzの高周波の音を鳴らして、自分の耳がどこまで聞こえるかを確かめる無料ツール。モスキート音テストと年齢の目安を表示します。音はブラウザ内で生成され、サーバーには送信されません。',
    h1: '可聴域テスト（モスキート音チェック）',
    introHtml:
      '高い周波数の音を順に鳴らし、聞こえた周波数から可聴域の上限と年齢の目安を確認できます。これは医療的な検査ではありません。スピーカーやイヤホン自体の確認は<a href="/tools/speaker-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">スピーカーテスト</a>をご利用ください。音はこのページ内で生成され、外部には送信されません。',
    warning:
      '音量は必ず最小から始め、少しずつ上げてください。上げすぎは耳を傷める原因になります（このツールの音量には上限を設けています）。医療診断ではなく、聞こえにくさが気になる場合は耳鼻咽喉科を受診してください。',
    volumeLabel: '音量',
    stepLabel: '周波数の間隔',
    stepOptions: { '500': '500Hz刻み', '1000': '1kHz刻み', '2000': '2kHz刻み' },
    listHeading: '周波数ごとのテスト',
    listHint:
      '低い周波数から順に「再生」を押し、聞こえたらチェックを入れてください。1回の再生は約2秒です。',
    playLabel: '再生',
    playingLabel: '再生中',
    heardLabel: '聞こえた',
    unsupportedLabel: 'この機器では再生できません',
    resetLabel: 'チェックをすべて外す',
    resultHeading: '結果',
    resultNone: 'まだ「聞こえた」にチェックがありません。',
    resultNormal:
      '聞こえた最高周波数は {freq} です。年齢の目安は、およそ{age}歳以下です。',
    resultLow:
      '聞こえた最高周波数は {freq} です。12kHz未満のため年齢の目安は出せません。音量を少し上げるか、別のイヤホンやスピーカーでも試してください。',
    resultDisclaimer:
      'この結果は一般的な傾向に基づく大まかな目安で、医療診断ではありません。',
    notesHeading: '注意事項',
    notes: [
      'これは医療診断ではありません。聴力に不安がある場合は、耳鼻咽喉科で聴力検査を受けてください。',
      '音量は小さい状態から始めてください。このツールでは耳を守るため音量の上限を設けていますが、OSやアンプ側の音量が大きいと危険です。',
      '機器の再生限界で聞こえない場合があります。ノートPCやスマホの内蔵スピーカーは15kHz以上がほとんど出ないことがあるため、できればイヤホンやヘッドホンで試してください。',
      'Bluetooth接続は音声が圧縮され、高周波が削られることがあります。有線接続で試すと、より正確です。',
      '周囲の騒音、耳の状態、体調、機器の個体差で結果は変わります。年齢の目安はあくまで一般的な傾向です。',
      '耳鳴りやめまい、聞こえにくさがある場合は、このテストを中止してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '可聴域',
        description:
          '人が聞き取れる音の周波数の範囲です。一般にはおよそ20Hz〜20,000Hzとされ、特に高い音は加齢とともに聞こえにくくなります。',
      },
      {
        term: 'モスキート音',
        description:
          '蚊の羽音のような約17kHz前後の高い音です。若い人には聞こえ、年齢が上がると聞こえにくくなる傾向があります。',
      },
      {
        term: '周波数（Hz・kHz）',
        description:
          '音の高さを表す単位で、1秒間に波が振動する回数です。1kHzは1,000Hzです。数値が大きいほど高い音になります。',
      },
    ],
  },
  en: {
    title: 'Hearing Test: Mosquito Tone & Hearing Range Check',
    description:
      'Play high-frequency tones from 8 kHz to 20 kHz to find the upper limit of your hearing, with a rough age guide. Sound is made in your browser.',
    h1: 'Hearing Range Test (Mosquito Tone Check)',
    introHtml:
      'Play high-pitched tones one by one and note which ones you can hear. The tool shows the upper limit of your hearing and a rough age guide. This is not a medical test. To check the speakers or headphones themselves, use the <a href="/en/tools/speaker-tester/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Speaker Test</a>. Sound is generated on this page and nothing is sent anywhere.',
    warning:
      'Always start with the volume at minimum and raise it slowly. Loud sound can damage your ears, so this tool caps its volume. This is not a medical diagnosis; if you are worried about your hearing, see a doctor.',
    volumeLabel: 'Volume',
    stepLabel: 'Frequency step',
    stepOptions: {
      '500': '500 Hz steps',
      '1000': '1 kHz steps',
      '2000': '2 kHz steps',
    },
    listHeading: 'Test each frequency',
    listHint:
      'Press "Play" from the lowest frequency upward, and tick the box when you hear it. Each tone lasts about 2 seconds.',
    playLabel: 'Play',
    playingLabel: 'Playing',
    heardLabel: 'Heard it',
    unsupportedLabel: 'Not playable on this device',
    resetLabel: 'Clear all checks',
    resultHeading: 'Result',
    resultNone: 'Nothing is ticked as "Heard it" yet.',
    resultNormal:
      'The highest frequency you heard is {freq}. As a rough guide, that matches an age of about {age} or younger.',
    resultLow:
      'The highest frequency you heard is {freq}. Below 12 kHz no age guide is given. Try a slightly higher volume or different headphones or speakers.',
    resultDisclaimer:
      'This is a rough guide based on general trends, not a medical diagnosis.',
    notesHeading: 'Notes',
    notes: [
      'This is not a medical diagnosis. If you are concerned about your hearing, get a hearing test from a doctor.',
      'Start at a low volume. The tool caps its own volume to protect your ears, but a high OS or amplifier volume can still be dangerous.',
      'You may not hear a tone simply because your equipment cannot play it. Built-in laptop and phone speakers often produce almost nothing above 15 kHz, so use headphones if you can.',
      'Bluetooth compresses audio and can cut high frequencies. A wired connection gives a more reliable result.',
      'Background noise, your ears, your condition and differences between devices all change the result. The age guide reflects only a general trend.',
      'Stop the test if you have ringing in the ears, dizziness or trouble hearing.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Hearing range',
        description:
          'The range of sound frequencies a person can hear, usually quoted as about 20 Hz to 20,000 Hz. High frequencies in particular become harder to hear with age.',
      },
      {
        term: 'Mosquito tone',
        description:
          'A high-pitched tone of around 17 kHz that sounds like a mosquito. Younger people tend to hear it and older people tend not to.',
      },
      {
        term: 'Frequency (Hz, kHz)',
        description:
          'The pitch of a sound, given as the number of vibrations per second. 1 kHz is 1,000 Hz. A higher number is a higher pitch.',
      },
    ],
  },
};
