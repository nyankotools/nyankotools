import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '画面解像度がディスプレイの物理解像度と違うのはなぜですか？',
      answer:
        '画面解像度は、OSやディスプレイの拡大率（スケーリング）の影響を受けるためです。高DPIの画面では、物理解像度よりも小さい値が表示されます。デバイスピクセル比もあわせて確認してください。',
    },
    {
      question: 'どのブレークポイントが使われていますか？',
      answer:
        'Tailwind CSSのデフォルト値（sm: 640px / md: 768px / lg: 1024px / xl: 1280px / 2xl: 1536px）に基づいて判定します。プロジェクトで変更している場合は、実際の設定と異なります。',
    },
    {
      question: 'サイトのダークモード設定と関係がありますか？',
      answer:
        '「OSのカラースキーム設定」はOSやブラウザのprefers-color-schemeの値で、このサイトのテーマ切り替えとは独立しています。',
    },
  ],
  en: [
    {
      question:
        "Why does the resolution differ from my display's physical resolution?",
      answer:
        'Screen size values are affected by OS or display scaling. On high-DPI displays a smaller value than the physical resolution is reported; check the device pixel ratio as well.',
    },
    {
      question: 'Which breakpoints are used?',
      answer:
        'Tailwind CSS defaults: sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px. If your project customizes them, the result will not match.',
    },
    {
      question: "Is it related to this site's dark mode setting?",
      answer:
        'The "OS color scheme" is the prefers-color-scheme value from your OS or browser and is independent of this site\'s theme switcher.',
    },
  ],
};
