import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '手順の順番を変えると結果は変わりますか？',
      answer:
        'はい。各手順の出力が次の手順の入力になるため、順番によって結果が変わります。たとえば「Base64エンコード → SHA-256」と「SHA-256 → Base64エンコード」は別の結果になります。「上へ」「下へ」で並べ替えて、各手順の「出力」で途中結果を確認してください。',
    },
    {
      question: 'ハッシュをBase64で出したいときはどうしますか？',
      answer:
        'このツールのハッシュ手順は16進数の文字列を出力します。生のバイト列のBase64にしたい場合は、ハッシュの後ろに「16進数デコード」→「Base64エンコード」の順で追加してください。',
    },
    {
      question: '手順の途中でエラーになるのはなぜですか？',
      answer:
        '直前の出力が、その手順の想定する形式ではないためです。たとえば「Base64デコード」の前に「URLエンコード」を置くと、% を含む文字列がBase64として不正になります。エラーメッセージの手順番号を確認し、手順の順番や種類を見直してください。',
    },
    {
      question: '画像やファイルも変換できますか？',
      answer:
        'このツールはテキスト入力のみに対応しています。画像のBase64変換は「画像のBase64（Data URL）変換」、ファイルのハッシュは「ファイルハッシュ計算」をご利用ください。',
    },
  ],
  en: [
    {
      question: 'Does the order of the steps change the result?',
      answer:
        'Yes. Each step output becomes the next step input, so the order matters. For example "Base64 encode → SHA-256" and "SHA-256 → Base64 encode" give different results. Reorder with "Up" / "Down" and inspect each step "Output" to see the intermediate values.',
    },
    {
      question: 'How do I get a hash as Base64?',
      answer:
        'The hash steps here output a hex string. To get Base64 of the raw hash bytes, add "Hex decode" and then "Base64 encode" after the hash step.',
    },
    {
      question: 'Why does a step in the middle show an error?',
      answer:
        'The previous output is not in the format that step expects. For example, putting "URL encode" before "Base64 decode" leaves % characters that are not valid Base64. Check the step number in the message and review the order or type of the steps.',
    },
    {
      question: 'Can I convert images or files?',
      answer:
        'This tool only accepts text input. For image-to-Base64 use the Image to Base64 converter, and for file hashes use the File Hash Calculator.',
    },
  ],
};
