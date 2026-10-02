import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'マイクの音声は録音・保存・送信されますか？',
      answer:
        'テスト中の音声はブラウザ内で入力レベルの表示にだけ使われ、サーバーには送信されません。「録音を開始」を押したときだけこのブラウザ内に録音され、ページを閉じるか録音し直すと破棄されます。',
    },
    {
      question: '入力レベルのメーターが動きません。',
      answer:
        'ブラウザの使用許可が「許可」になっているか、別のマイクを選んでいないかを確認してください。パソコン側でマイクがミュートされている、またはヘッドセットの物理ミュートスイッチが入っている場合も音を拾えません。',
    },
    {
      question: '「音が割れています」と表示されたらどうすればよいですか？',
      answer:
        '入力が大きすぎて波形が上限に達しています。マイクから少し離れる、OSやマイクの入力音量（ゲイン）を下げる、自動音量調整をオフにする、のいずれかを試してください。',
    },
    {
      question:
        'エコーキャンセルやノイズ抑制はオンとオフのどちらがよいですか？',
      answer:
        'Web会議などの通話ではオンのままが一般的です。マイク本来の性能や素の音量を確かめたいとき、楽器や歌を録音するときはオフにすると、ブラウザの音声処理による変化を避けられます。',
    },
  ],
  en: [
    {
      question: 'Is my microphone audio recorded, saved or uploaded?',
      answer:
        'While testing, audio is only used in your browser to draw the input level and is never sent to a server. A recording is made, in this browser only, when you press "Start recording", and it is discarded when you close the page or record again.',
    },
    {
      question: 'The level meter does not move. What should I check?',
      answer:
        'Make sure the browser permission is set to "Allow" and that you picked the right microphone. A microphone muted in your operating system, or a physical mute switch on a headset, also produces no sound.',
    },
    {
      question: 'What should I do if it says the sound is distorting?',
      answer:
        'The input is so loud that the waveform reaches its limit. Move a little away from the microphone, lower the input volume (gain) in your OS or on the microphone, or turn off auto gain control.',
    },
    {
      question: 'Should echo cancellation and noise suppression be on or off?',
      answer:
        'Leave them on for calls such as video meetings. Turn them off when you want to judge the microphone’s own performance and raw level, or when recording instruments or singing, to avoid the browser’s processing changing the sound.',
    },
  ],
};
