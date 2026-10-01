import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ULIDとUUIDの違いは何ですか？',
      answer:
        'UUID v4は完全にランダムですが、ULIDは先頭に生成時刻を含むため、文字列として並べると生成順になります。26文字でUUID（36文字）より短く、データベースの主キーにしたときにインデックスの効率が落ちにくい点が利点です。',
    },
    {
      question: 'ULIDから生成日時はわかりますか？',
      answer:
        '先頭10文字が生成時刻（ミリ秒）なので、デコードすれば作成日時が分かります。作成日時を公開したくない用途では使わないでください。',
    },
    {
      question: 'NanoIDの長さはどれくらいが適切ですか？',
      answer:
        '既定の21文字・64種類の文字なら、UUID v4と同程度の衝突しにくさです。短くすると衝突の確率が上がるため、必要な件数に対して十分な長さかどうかを確認してから変更してください。',
    },
    {
      question: 'NanoIDの文字セットに日本語や絵文字は使えますか？',
      answer:
        '使えます。2〜256種類の文字を指定でき、絵文字などのサロゲートペアも1文字として数えます。ただし、URLやデータベースで扱いにくくなる場合があります。',
    },
  ],
  en: [
    {
      question: 'How is a ULID different from a UUID?',
      answer:
        'A v4 UUID is fully random, while a ULID starts with a timestamp, so sorting the strings gives creation order. It is also shorter (26 characters vs 36), and tends to keep database indexes more efficient when used as a primary key.',
    },
    {
      question: 'Can the creation time be read from a ULID?',
      answer:
        'Yes. The first 10 characters encode the creation time in milliseconds, so anyone can decode it. Avoid ULIDs where the creation time should stay private.',
    },
    {
      question: 'What length should a NanoID be?',
      answer:
        'The default of 21 characters from a 64-character alphabet has collision resistance comparable to a v4 UUID. Shorter IDs collide more often, so confirm the length is enough for the number of IDs you need before changing it.',
    },
    {
      question: 'Can I use non-ASCII characters or emoji in the alphabet?',
      answer:
        'Yes. You can specify 2 to 256 distinct characters, and characters outside the BMP such as emoji count as one character. They may be harder to handle in URLs or databases, though.',
    },
  ],
};
