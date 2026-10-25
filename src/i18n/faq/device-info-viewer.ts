import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'CPUコア数やメモリが実際の端末と違うのはなぜですか？',
      answer:
        'ブラウザがフィンガープリント対策として値を丸めたり、固定値を返したりするためです。メモリ容量の目安は最大8GBまでで、SafariやFirefoxでは取得できません。',
    },
    {
      question: 'GPU名が表示されないのはなぜですか？',
      answer:
        'GPU名はWebGLのデバッグ情報から取得します。ブラウザが非公開にしている場合や、WebGLが無効の環境では「取得できません」になります。',
    },
    {
      question: 'Web APIが「対応」なら必ず使えますか？',
      answer:
        'いいえ。APIがブラウザに存在するかを確認しているだけです。HTTPS接続、ユーザーの許可、OSや接続機器の有無によっては使えないことがあります。',
    },
    {
      question: '画面解像度がディスプレイの仕様と違うのはなぜですか？',
      answer:
        'OSの拡大率（スケーリング）の影響で、CSSピクセル単位の値が表示されるためです。DPRを掛けた物理ピクセルの目安もあわせて表示しています。',
    },
  ],
  en: [
    {
      question: 'Why do the CPU cores or memory not match my real device?',
      answer:
        'Browsers may round these values or return fixed ones as fingerprinting protection. Memory is capped at 8 GB and is unavailable in Safari and Firefox.',
    },
    {
      question: 'Why is the GPU name not shown?',
      answer:
        'The GPU name comes from WebGL debug info. It shows as unavailable when the browser hides it or WebGL is disabled.',
    },
    {
      question: 'If an API says Supported, will it definitely work?',
      answer:
        'No. This only checks that the API exists in the browser. HTTPS, user permission, the OS or missing hardware can still prevent it from working.',
    },
    {
      question: 'Why does the resolution differ from my display spec?',
      answer:
        'The value is in CSS pixels and is affected by OS display scaling. An estimate of physical pixels (resolution times DPR) is shown alongside it.',
    },
  ],
};
