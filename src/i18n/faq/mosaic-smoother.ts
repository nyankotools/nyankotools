import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'モザイクの下の元の絵を復元できますか？',
      answer:
        'できません。モザイクはブロックごとの平均色だけを残す処理なので、細かい情報は失われています。このツールは、ブロックの色と周囲の色から「それらしいなめらかな色の変化」を作って置き換えるだけで、顔や文字などは再現されません。',
    },
    {
      question: 'どんな画像だときれいに仕上がりますか？',
      answer:
        '空・壁・肌・グラデーション背景など、色がなだらかに変わる場所が得意です。細かい模様や文字、写り込みのある背景では、のっぺりした色の面になります。',
    },
    {
      question: 'ブロックサイズが自動検出されないときは？',
      answer:
        '「ブロックサイズを自動検出する」をオフにして、モザイクの1ブロックの辺の長さを手動で指定してください。JPEG圧縮でブロックの境目がにじんでいる場合や、範囲にモザイクでない部分が多く含まれる場合は検出に失敗しやすくなります。検出できなくても、周囲の色だけで補間して仕上げます。',
    },
    {
      question: '置き換えた部分がのっぺりして目立つときは？',
      answer:
        '「粒状感（ノイズ）」を上げると、周囲の画像のざらつきに合わせたノイズが加わり、なじみやすくなります。また、モザイクの範囲をぴったりではなく少し大きめに囲むと、境目が目立ちにくくなります。',
    },
  ],
  en: [
    {
      question: 'Can it recover the original picture under the mosaic?',
      answer:
        'No. A mosaic keeps only the average color of each block, so the fine detail is gone. This tool just builds a plausible smooth color transition from the block colors and the surrounding pixels; faces and text are not reproduced.',
    },
    {
      question: 'What kind of image gives the best result?',
      answer:
        'Places where color changes gently, such as sky, walls, skin, and gradient backgrounds. Fine patterns, text, or busy backgrounds turn into soft, flat patches of color.',
    },
    {
      question: 'What if the block size is not detected automatically?',
      answer:
        'Turn off "Auto-detect block size" and enter the side length of one mosaic block yourself. Detection is more likely to fail when JPEG compression has smeared the block edges or when the box contains a lot of non-mosaic area. Even without detection, the area is still filled from the surrounding colors.',
    },
    {
      question:
        'The replaced area looks too flat and stands out. What can I do?',
      answer:
        'Raise "Grain (noise)" to add noise matching the surrounding image so it blends in. Also select a little more than the mosaic instead of fitting it exactly, which makes the seam less visible.',
    },
  ],
};
