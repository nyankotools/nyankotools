import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '録画した動画はサーバーに送信されますか？',
      answer:
        'いいえ。録画はブラウザの中だけで行われ、動画はブラウザのメモリに保存されます。ダウンロードするまで外部へ出ることはなく、ページを閉じると消えます。',
    },
    {
      question: '音声も一緒に録画できますか？',
      answer:
        '「音声も録音する」にチェックし、共有ダイアログで「音声を共有」を選ぶとタブやシステムの音声を録音できます。ブラウザやOS、選んだ画面の種類によっては録音できません。マイクの音声は録音されません。',
    },
    {
      question: 'スマートフォンでも使えますか？',
      answer:
        '多くのスマートフォンのブラウザは画面録画（getDisplayMedia）に対応していないため、使えません。PC版のChrome・Edge・Firefox・Safariをご利用ください。',
    },
    {
      question: '何分まで録画できますか？',
      answer:
        '最大30分です。録画データをメモリに溜めるため、上限に達すると自動で停止します。長時間の録画には、OS標準の録画機能や専用ソフトをご利用ください。',
    },
    {
      question: '保存した動画が再生できません。',
      answer:
        'ChromeやEdgeではWebM形式で保存されます。WebMに対応していないプレーヤーでは再生できないため、動画変換ツールでMP4などに変換してください。',
    },
  ],
  en: [
    {
      question: 'Is my recording sent to a server?',
      answer:
        'No. Recording happens entirely in your browser and the video is held in browser memory. It goes nowhere until you download it, and it disappears when you close the page.',
    },
    {
      question: 'Can it record audio too?',
      answer:
        'Tick "Record audio too" and choose "Share audio" in the sharing dialog to capture tab or system audio. This is not available in every browser, operating system or source type. Your microphone is not recorded.',
    },
    {
      question: 'Does it work on a phone?',
      answer:
        'Most phone browsers do not support screen capture (getDisplayMedia), so it will not work there. Use desktop Chrome, Edge, Firefox or Safari.',
    },
    {
      question: 'How long can I record?',
      answer:
        'Up to 30 minutes. The recording is kept in memory, so it stops automatically at the limit. For longer sessions, use your operating system’s recorder or dedicated software.',
    },
    {
      question: 'The saved video will not play.',
      answer:
        'Chrome and Edge save WebM files. A player without WebM support cannot open them, so convert the file to MP4 or another format with a video converter.',
    },
  ],
};
