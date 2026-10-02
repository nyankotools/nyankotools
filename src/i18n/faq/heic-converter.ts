import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '変換した写真に位置情報（GPS）は残りますか？',
      answer:
        '残りません。このツールはHEICを画像として読み込んでから再エンコードするため、撮影日時や位置情報などのEXIFは出力ファイルに引き継がれません。',
    },
    {
      question: 'HEICをJPEGにすると画質は落ちますか？',
      answer:
        'JPEGは非可逆圧縮のため、わずかに劣化します。画質を高め（90%前後）にすれば見た目の差はほとんどありません。劣化を避けたい場合は可逆のPNGを選べますが、ファイルサイズは大きくなります。',
    },
    {
      question: 'iPhoneの写真がHEICではなくJPEGで保存されるようにできますか？',
      answer:
        'iPhoneの「設定」→「カメラ」→「フォーマット」で「互換性優先」を選ぶと、今後の撮影がJPEGになります。すでに撮影した写真は、このツールで変換できます。',
    },
    {
      question: '一度に何枚まで変換できますか？',
      answer:
        '1回につき20枚まで、1ファイル50MBまでです。枚数が多い場合は数回に分けてください。',
    },
  ],
  en: [
    {
      question: 'Is the GPS location kept in the converted photo?',
      answer:
        'No. The HEIC is decoded and re-encoded as a new image, so EXIF data such as the shooting date and GPS location is not carried over to the output file.',
    },
    {
      question: 'Does converting HEIC to JPEG reduce quality?',
      answer:
        'JPEG is lossy, so there is slight loss. At a high quality setting (around 90%) the difference is barely visible. Choose PNG to avoid loss, at the cost of a much larger file.',
    },
    {
      question: 'Can I make my iPhone save photos as JPEG instead of HEIC?',
      answer:
        'Go to Settings → Camera → Formats and choose "Most Compatible" to shoot in JPEG from now on. Photos you have already taken can be converted with this tool.',
    },
    {
      question: 'How many files can I convert at once?',
      answer:
        'Up to 20 files per batch, 50 MB each. Split larger sets into several batches.',
    },
  ],
};
