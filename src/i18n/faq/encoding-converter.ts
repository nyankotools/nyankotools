import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '文字コードの自動判定は確実ですか？',
      answer:
        'いいえ、自動判定はあくまで推測です。Shift_JISとEUC-JPなど、短いテキストでは区別できないことがあります。結果がおかしい場合は「読み込む文字コード」を手動で選び直してください。',
    },
    {
      question: '文字化けしたテキストを元に戻せますか？',
      answer:
        '読み取り時にバイトが失われて「�」になった部分は復元できません。可能であれば、文字化けする前の元ファイルをこのツールに直接読み込ませてください。',
    },
    {
      question: '変換できない文字はどうなりますか？',
      answer:
        'Shift_JISはWindows標準のCP932として扱うため、①などの機種依存文字や「〜」も変換できます。絵文字など変換先の文字コードにない文字は「?」に置き換わります。',
    },
  ],
  en: [
    {
      question: 'Is automatic encoding detection reliable?',
      answer:
        'No, detection is a best guess. Short texts in encodings such as Shift_JIS and EUC-JP can be indistinguishable. If the result looks wrong, choose the source encoding manually.',
    },
    {
      question: 'Can I repair text that is already garbled?',
      answer:
        'Parts that were lost and turned into "�" cannot be restored. If possible, load the original file directly into this tool before it gets garbled.',
    },
    {
      question: 'What happens to characters that cannot be converted?',
      answer:
        'Shift_JIS is handled as Windows CP932, so characters like ① convert fine. Characters absent from the target encoding, such as emoji, are replaced with "?".',
    },
  ],
};
