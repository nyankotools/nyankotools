import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Base64は暗号化ですか？安全に情報を隠せますか？',
      answer:
        'いいえ。Base64は暗号化ではなく、データを英数字の文字列に変換するエンコード方式です。誰でも簡単に元に戻せるため、パスワードなど秘匿したい情報の保護には使えません。',
    },
    {
      question: '日本語を含むテキストも正しく変換できますか？',
      answer:
        'はい。テキストをUTF-8のバイト列として扱ってからBase64に変換するため、日本語や絵文字などのマルチバイト文字も正しくエンコード・デコードできます。',
    },
    {
      question: 'デコードでエラーになるのはなぜですか？',
      answer:
        '入力がBase64として正しくない場合にエラーになります。文字列の途中に使えない文字が混ざっている、コピー時に一部が切れている、UTF-8のテキストとして解釈できないデータ（Shift_JISのテキストや画像などのバイナリ）である、などが主な原因です。元の文字列を確認してください。',
    },
  ],
  en: [
    {
      question: 'Is Base64 encryption? Can it hide sensitive data?',
      answer:
        'No. Base64 is an encoding, not encryption. Anyone can decode it instantly, so it must not be used to protect passwords or other secrets.',
    },
    {
      question: 'Does it work with non-ASCII text such as Japanese or emoji?',
      answer:
        'Yes. Text is treated as UTF-8 bytes before encoding, so multibyte characters like Japanese and emoji are encoded and decoded correctly.',
    },
    {
      question: 'Why does decoding show an error?',
      answer:
        'The input is not valid Base64. Common causes are stray characters in the string, a truncated copy, or data that is not valid UTF-8 text (such as Shift_JIS text or binary files like images). Check the original string.',
    },
  ],
};
