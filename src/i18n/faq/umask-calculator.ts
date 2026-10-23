import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'umask 022だと新規ファイルは何パーミッションになりますか？',
      answer:
        'ファイルは666から022を引いた644（rw-r--r--）、ディレクトリは777から022を引いた755（rwxr-xr-x）になります。',
    },
    {
      question: 'なぜファイルの基準は777ではなく666なのですか？',
      answer:
        '通常のファイル作成では実行権限(x)が付かないためです。umaskは権限を取り除くだけで追加はしないので、新規ファイルが実行可能になることはなく、実行権限が必要ならchmodで付与します。',
    },
    {
      question: 'umaskは引き算ではないのですか？',
      answer:
        '厳密にはビットマスク（基準 AND NOT umask）です。022や077のように各ビットが基準に含まれている場合は引き算と同じ結果ですが、ファイルの基準666に含まれない実行ビットを含むumask（例: 011）では引き算と結果が一致しません。',
    },
    {
      question: 'umaskの設定はいつまで有効ですか？',
      answer:
        'シェルで umask コマンドを実行した場合、そのシェルセッションの間だけ有効です。常に使いたい場合は ~/.bashrc や ~/.profile、システム全体なら /etc/login.defs などに設定します。',
    },
  ],
  en: [
    {
      question: 'What permissions do new files get with umask 022?',
      answer:
        'New files get 644 (rw-r--r--), which is 666 with the 022 bits removed, and new directories get 755 (rwxr-xr-x), which is 777 with those bits removed.',
    },
    {
      question: 'Why is the base for files 666 instead of 777?',
      answer:
        'Normal file creation never sets the execute bit. A umask can only remove permissions, never add them, so new files never become executable on their own; use chmod when you need that.',
    },
    {
      question: 'Is umask really a subtraction?',
      answer:
        'Strictly it is a bit mask (base AND NOT umask). For values like 022 or 077 it matches subtraction, but it differs when the umask has execute bits that the file base 666 does not contain (for example 011).',
    },
    {
      question: 'How long does a umask setting last?',
      answer:
        'Running umask in a shell only affects that session. To make it permanent, set it in ~/.bashrc or ~/.profile, or system-wide in a file such as /etc/login.defs.',
    },
  ],
};
