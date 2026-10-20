import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'トグルスイッチはJavaScriptなしで動きますか？',
      answer:
        '動きます。`input type="checkbox"`の`:checked`状態を`+`（隣接セレクタ）で拾い、つまみの位置と背景色を切り替えています。`label`で全体を囲んでいるので、スイッチのどこをクリックしても切り替わります。',
    },
    {
      question: 'CSSだけで三角形を作るにはどうしますか？',
      answer:
        '幅と高さを0にした要素に`border`を引き、三角形にしたい辺以外を`transparent`にします。向きによってどの辺に色を付けるかが変わります。このツールで向きとサイズを選ぶと、border-widthとborder-colorの組み合わせを出力します。',
    },
    {
      question: '生成したCSSが既存のスタイルと衝突しませんか？',
      answer:
        'クラス名はすべて`nk-`で始まる名前（`nk-btn`、`nk-toggle`など）にしています。それでも同じ名前を使っていないか確認し、必要なら置換してください。要素セレクタ（`button`など）への指定は含みません。',
    },
    {
      question: 'ボタンのコントラスト比はどう計算していますか？',
      answer:
        'WCAG 2.xの相対輝度の式で、文字色と背景色から1〜21の比率を出しています。文字色は背景色に対して白か濃い色のうち比率が高い方を自動で選びます。淡色スタイルは濃いめの同系色を文字にします。',
    },
    {
      question: 'スマートフォンでホバー効果は動きますか？',
      answer:
        'タッチ端末にはホバーがないため、タップした直後に状態が残ったり、まったく反応しなかったりと端末によって異なります。ホバーだけに重要な情報を頼らないようにしてください。',
    },
  ],
  en: [
    {
      question: 'Does the toggle switch work without JavaScript?',
      answer:
        'Yes. The CSS reads the :checked state of the checkbox through the adjacent sibling selector (+) and moves the knob and changes the track color. The whole switch is wrapped in a label, so clicking anywhere on it toggles it.',
    },
    {
      question: 'How do you make a triangle with only CSS?',
      answer:
        'Give a zero-width, zero-height element thick borders and make every side except the one you want transparent. Which side carries the color depends on the direction. Pick a direction and size here to get the matching border-width and border-color values.',
    },
    {
      question: 'Will the generated CSS clash with my existing styles?',
      answer:
        'Every class name starts with nk- (nk-btn, nk-toggle, and so on), and no element selectors such as button are used. Still, check that you do not already use those names, and rename them if you do.',
    },
    {
      question: 'How is the button contrast ratio calculated?',
      answer:
        'It uses the WCAG 2.x relative luminance formula on the text and background colors, giving a ratio from 1 to 21. The text color is chosen automatically, white or a dark gray, whichever contrasts more. The soft style uses a darker shade of the same hue.',
    },
    {
      question: 'Does the hover effect work on phones?',
      answer:
        'Touch devices have no real hover, so the state may stick after a tap or never appear, depending on the device. Do not rely on hover alone to convey important information.',
    },
  ],
};
