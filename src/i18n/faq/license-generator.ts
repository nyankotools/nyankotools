import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'MITとApache-2.0はどちらを選べばよいですか？',
      answer:
        'どちらも商用利用や改変を認めるライセンスです。MITは短く簡潔で、Apache-2.0は特許の許諾条項と、変更点の明示などの条件が加わります。特許面の明確さを重視するならApache-2.0、とにかく簡単にしたいならMITが選ばれることが多いです。最終的な判断は目的に合わせてご確認ください。',
    },
    {
      question: '著作者名と年には何を書けばよいですか？',
      answer:
        '著作者名には個人名、ハンドルネーム、組織名のいずれかを書きます。年は最初に公開した年が一般的で、「2020-2026」のように範囲で書くこともあります。このツールの年は現在の年が初期値ですが、公開年に書き換えてください。',
    },
    {
      question: 'GPL-3.0やMPL-2.0の全文は出力されないのですか？',
      answer:
        '条文が非常に長く転記ミスを避けたいため、全文は収録していません。代わりにソースファイルの先頭に付ける注記を出力します。LICENSE ファイルには、公式サイトの全文をそのまま保存してください。',
    },
    {
      question: 'SPDX識別子はどこで使いますか？',
      answer:
        'package.json の license フィールドや、ソースファイルの先頭コメント（SPDX-License-Identifier）、依存関係のライセンス検査ツールで使います。本ツールは選んだライセンスの識別子を、貼り付けられる形で出力します。',
    },
  ],
  en: [
    {
      question: 'Should I choose MIT or Apache-2.0?',
      answer:
        'Both allow commercial use and modification. MIT is short and simple; Apache-2.0 adds an explicit patent grant and conditions such as stating changes. Many pick Apache-2.0 when patent clarity matters and MIT when simplicity matters most. Check the choice against your own goals.',
    },
    {
      question: 'What should I put for the copyright holder and year?',
      answer:
        'Use your name, handle or organization as the holder. The year is usually the first year of publication, and a range such as "2020-2026" is also common. The tool starts with the current year, so change it to the year you first published if needed.',
    },
    {
      question: 'Why is there no full text for GPL-3.0 or MPL-2.0?',
      answer:
        'These texts are very long, and a transcription error would defeat the purpose, so the full texts are not included. The tool outputs the notice for source file headers instead. Save the official full text as your LICENSE file.',
    },
    {
      question: 'Where do I use the SPDX identifier?',
      answer:
        'In the license field of package.json, in a SPDX-License-Identifier comment at the top of source files, and by license-checking tools that scan dependencies. The tool outputs the identifier of the chosen license in a ready-to-paste form.',
    },
  ],
};
