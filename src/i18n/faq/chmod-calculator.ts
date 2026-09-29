import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'chmod 755と644は何が違いますか？',
      answer:
        '755は所有者が読み書き実行、グループとその他が読み取りと実行を持つ設定で、実行ファイルやディレクトリによく使います。644は所有者が読み書き、グループとその他が読み取りのみで、通常のファイル向けです。',
    },
    {
      question: 'setuidやスティッキービットとは何ですか？',
      answer:
        'setuidは実行時にファイルの所有者の権限で動作させ、setgidはグループの権限で動作させます。スティッキービットをディレクトリに付けると、所有者以外はその中のファイルを削除できません。8進数では先頭に4桁目として付きます（例: 4755）。',
    },
    {
      question: '777に設定しても大丈夫ですか？',
      answer:
        '777は誰でも読み書き実行できる状態のため、セキュリティ上おすすめできません。必要な権限だけを与える最小権限の考え方で、755や644などから始めるのが安全です。',
    },
  ],
  en: [
    {
      question: 'What is the difference between chmod 755 and 644?',
      answer:
        '755 gives the owner read, write and execute, while group and others get read and execute. It suits executables and directories. 644 gives the owner read and write and everyone else read only, which suits regular files.',
    },
    {
      question: 'What are setuid and the sticky bit?',
      answer:
        "Setuid makes a program run with the file owner's privileges, and setgid with the group's. The sticky bit on a directory prevents users other than the owner from deleting files in it. In octal they appear as a leading fourth digit, for example 4755.",
    },
    {
      question: 'Is it safe to set permissions to 777?',
      answer:
        '777 lets anyone read, write and execute, which is a security risk. Follow the principle of least privilege and start from settings like 755 or 644.',
    },
  ],
};
