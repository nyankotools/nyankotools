import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Exif情報とは何ですか？どんな情報が含まれますか？',
      answer:
        '写真ファイルに埋め込まれる撮影情報です。撮影日時、カメラ機種、レンズ、露出設定、GPS位置情報などが含まれます。スマートフォンで撮った写真には位置情報が入っていることがあります。',
    },
    {
      question: 'Exifを削除すると画質は落ちますか？',
      answer:
        '落ちません。JPEGの中のExif部分だけを取り除き、画像を再圧縮しないので、画質・解像度は元のままです。ただし回転情報も消えるため、一部のビューアでは向きが変わることがあります。',
    },
    {
      question: 'PNGやWebPの画像も確認できますか？',
      answer:
        '対応しているのはJPEG（.jpg/.jpeg）のみです。PNGやWebPはExifを持たないか扱いが異なるため、対象外としています。',
    },
  ],
  en: [
    {
      question: 'What is Exif data and what does it contain?',
      answer:
        'Exif is metadata embedded in photo files: capture date, camera model, lens, exposure settings, GPS location and more. Photos taken with smartphones may include location data.',
    },
    {
      question: 'Does removing Exif reduce image quality?',
      answer:
        'No. Only the Exif segment is stripped and the image is not re-encoded, so quality and resolution stay the same. Orientation data is removed too, so a few viewers may display the image rotated.',
    },
    {
      question: 'Can I check PNG or WebP images?',
      answer:
        'Only JPEG (.jpg/.jpeg) is supported. PNG and WebP either lack Exif or handle it differently.',
    },
  ],
};
