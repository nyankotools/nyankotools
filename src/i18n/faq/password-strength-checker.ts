import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '入力したパスワードはサーバーに送信されますか？',
      answer:
        '送信されません。判定はすべてブラウザ内のスクリプトで行い、入力内容の保存もしません。ただし、実際に使っているパスワードは、画面共有や録画に映る可能性があるため入力しないことをおすすめします。',
    },
    {
      question: '「非常に強い」と表示されれば絶対に安全ですか？',
      answer:
        'いいえ。このツールが見るのは長さ・文字種・単純なパターンだけです。ほかのサービスと使い回していたり、過去の情報漏えいで流出していたりすると、強度とは関係なく破られます。',
    },
    {
      question: '推定エントロピーのビット数はどう計算していますか？',
      answer:
        '使われている文字種（英小文字26・大文字26・数字10・記号33など）から1文字あたりの情報量を求め、文字数を掛けています。繰り返し・連番・キーボード配列の部分は文字数から割り引いています。',
    },
    {
      question: '解読時間が実際より短く（長く）見えるのはなぜですか？',
      answer:
        '表示は総当たりの平均を、オンライン攻撃（毎秒100回）とオフライン攻撃（毎秒100億回）の2つの前提で計算した理論値です。実際の攻撃速度は、サービスの保護やハッシュ方式によって大きく変わります。',
    },
    {
      question: '日本語のパスワードはどう評価されますか？',
      answer:
        'ASCII以外の文字は、1文字あたり約100種類から選んだものとして評価します。ただし、よく使われる単語やローマ字の語は推測されやすいため、実際にはもっと弱い場合があります。',
    },
  ],
  en: [
    {
      question: 'Is the password I type sent to a server?',
      answer:
        'No. The check runs entirely in a script in your browser, and nothing you type is stored. Still, avoid entering a password you actually use, since a screen share or recording could capture it.',
    },
    {
      question: 'Is a password safe if it says "Very strong"?',
      answer:
        'Not necessarily. This tool only looks at length, character types, and simple patterns. A password that is reused on other services or appeared in a past breach can be broken regardless of its rating.',
    },
    {
      question: 'How are the bits of entropy calculated?',
      answer:
        'The character types in use (26 lowercase, 26 uppercase, 10 digits, 33 symbols, and so on) set the information per character, which is multiplied by the length. Repeated, sequential, and keyboard-run characters are discounted from the length.',
    },
    {
      question: 'Why might the crack time look too short or too long?',
      answer:
        'The figures are theoretical average brute-force times under two assumptions: an online attack at 100 guesses per second and an offline attack at 10 billion per second. Real attack speed depends heavily on the service’s protections and the hashing method used.',
    },
    {
      question: 'How are non-English passwords rated?',
      answer:
        'Characters outside ASCII are treated as drawn from roughly 100 possibilities each. Common words and romanized phrases are easy to guess, though, so the real strength may be lower than shown.',
    },
  ],
};
