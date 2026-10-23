import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'シェアを紛失して k 個未満になったら秘密は取り戻せますか？',
      answer:
        '取り戻せません。k 個未満のシェアからは秘密について何も分からない仕組みのため、運営者を含めて誰も復元できません。分割前に、シェアの保管先と、何個まで失っても大丈夫かを決めておいてください。',
    },
    {
      question: '3-of-5 のような n と k はどう決めればよいですか？',
      answer:
        'n は保管先の数、k は「集まれば秘密が分かってよい人数」です。k を大きくすると漏えいに強くなりますが、紛失に弱くなります。n と k の差が、失っても復元できるシェアの数です。たとえば3-of-5なら2個まで失えます。',
    },
    {
      question: '「シェアの形式が正しくありません」と出るのはなぜですか？',
      answer:
        'このツールで作ったシェア（16進文字列）以外が含まれているか、コピー時に文字が欠けたり余分な文字が入ったりしています。1行に1つずつ貼り付け、行数の表示を手がかりに該当行を確認してください。他のツールのシェアとは互換性がありません。',
    },
    {
      question: '「復元できませんでした」と表示されるのはどんなときですか？',
      answer:
        'シェアが1文字でも書き換わっている場合や、別々の秘密から作ったシェアが混ざっている場合です。復元時に秘密末尾のチェックサムを照合して検出しており、間違った秘密が表示されることはありません。',
    },
    {
      question: '同じ秘密を分割すると毎回同じシェアになりますか？',
      answer:
        'なりません。分割のたびに新しい乱数で多項式を作るため、シェアは毎回変わります。古いシェアと新しいシェアを混ぜても復元できないので、再分割したら古いものは破棄してください。',
    },
  ],
  en: [
    {
      question:
        'Can I recover the secret if I lose shares and fewer than k remain?',
      answer:
        'No. With fewer than k shares nothing about the secret can be learned, so nobody can recover it, including the site. Before splitting, decide where each share will be kept and how many you can afford to lose.',
    },
    {
      question: 'How should I choose n and k, for example 3-of-5?',
      answer:
        'n is the number of places you can store shares, and k is how many must come together before the secret may be revealed. A larger k resists leaks better but tolerates fewer losses. The difference n - k is how many shares you can lose; with 3-of-5 you can lose 2.',
    },
    {
      question: 'Why do I get "not a valid share"?',
      answer:
        'The input contains something other than a share (a hex string) made by this tool, or characters were lost or added while copying. Paste one share per line and use the line number in the message to find the culprit. Shares from other tools are not compatible.',
    },
    {
      question: 'When do I see "Could not recover the secret"?',
      answer:
        'When even one character of a share has changed, or when shares from different secrets are mixed. A checksum stored with the secret is verified on recovery, so a wrong secret is never shown as if it were correct.',
    },
    {
      question:
        'Does splitting the same secret give the same shares each time?',
      answer:
        'No. A new random polynomial is generated for every split, so the shares differ each time. Old and new shares cannot be combined, so discard the old ones after splitting again.',
    },
  ],
};
