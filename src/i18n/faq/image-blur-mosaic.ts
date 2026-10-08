import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ぼかしとモザイク、個人情報を隠すにはどちらが安全ですか？',
      answer:
        '塗りつぶしが最も確実で、次に粗いモザイクです。ぼかしは強さや画像によっては元の文字や顔が推測・復元される場合があるため、個人情報の隠蔽には向きません。',
    },
    {
      question: 'スマホでも範囲を指定できますか？',
      answer:
        'はい。画像の上を指でなぞると範囲を指定できます。範囲指定中は画面がスクロールしないようになっているため、画像の外側をなぞってスクロールしてください。',
    },
    {
      question: '間違えて加工した場合は元に戻せますか？',
      answer:
        '「1つ元に戻す」で直前の範囲から順に取り消せ、「すべてリセット」で加工前の状態に戻せます。ダウンロードする前であれば何度でもやり直せます。',
    },
    {
      question: '加工した画像から元の画像を取り出せますか？',
      answer:
        '書き出される画像には加工後のピクセルしか含まれず、元のピクセルは保存されません。ただしぼかしは見た目から推測される可能性があります。また、写真のEXIF（位置情報など）は再エンコードにより取り除かれます。',
    },
  ],
  en: [
    {
      question: 'Which is safer for hiding personal info: blur or mosaic?',
      answer:
        'A solid fill is the most reliable, followed by a coarse mosaic. Blur can let the original text or faces be guessed or reconstructed depending on its strength and the image, so it is not recommended for hiding personal data.',
    },
    {
      question: 'Can I select areas on a phone?',
      answer:
        'Yes. Drag over the image with your finger. The page does not scroll while you drag on the image, so swipe on the area outside it to scroll.',
    },
    {
      question: 'Can I undo a mistake?',
      answer:
        '"Undo last" removes the most recent area, and "Reset all" returns to the unedited image. You can redo as much as you like before downloading.',
    },
    {
      question: 'Can the original be recovered from the exported image?',
      answer:
        'The exported file only contains the edited pixels, not the originals. Blur can still be guessed from its appearance, though. EXIF data such as GPS location is removed because the image is re-encoded.',
    },
  ],
};
