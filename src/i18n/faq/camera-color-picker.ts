import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '取得した色が実物の色と違って見えるのはなぜですか？',
      answer:
        'カメラは照明の色や明るさに合わせてホワイトバランスや露出を自動調整するため、映像の色は実物と少しずれます。白い紙を同じ光の下で映して色のずれを確認するか、自然光の下で使うと近づきます。',
    },
    {
      question: '「5×5画素の平均」などは何のためにありますか？',
      answer:
        'カメラ映像は画素ごとにノイズがあり、1画素だけだと値がばらつきます。周囲の画素を平均すると、とくに暗い場所や布のような細かい模様のあるものでも安定した色が得られます。',
    },
    {
      question: 'カメラの映像は保存・送信されますか？',
      answer:
        'いいえ。映像はブラウザ内で処理されるだけで、録画も保存も外部への送信もされません。停止するかページを閉じると破棄されます。',
    },
  ],
  en: [
    {
      question: 'Why does the picked color differ from the real object?',
      answer:
        'Cameras adjust white balance and exposure automatically to the light, so video colors drift from the real thing. Natural light, or checking a white sheet under the same light, gets you closer.',
    },
    {
      question: 'What are the "5×5 average" and similar options for?',
      answer:
        'Camera video has per-pixel noise, so a single pixel can jump around. Averaging nearby pixels gives steadier colors, especially in dim scenes or on textured surfaces like fabric.',
    },
    {
      question: 'Is my camera video saved or uploaded?',
      answer:
        'No. Video is only processed inside your browser: it is not recorded, stored or sent anywhere, and it is discarded when you stop or close the page.',
    },
  ],
};
