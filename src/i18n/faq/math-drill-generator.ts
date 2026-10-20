import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '問題用紙と答えシートを別々に印刷できますか？',
      answer:
        '「表示・印刷する内容」を「問題」にして印刷し、続けて「答え」に切り替えて印刷してください。答えには赤字で解答が入ります。設定とシードが同じなら同じ問題の答えになるので、間に設定を変えないようにしてください。',
    },
    {
      question: '同じ問題をあとからもう一度作れますか？',
      answer:
        '「シード」に同じ数値を入れると、同じ設定で同じ問題が再現されます。シードを控えておけば、後日答えだけを印刷し直すこともできます。「問題を作り直す」を押すと新しいシードに変わります。',
    },
    {
      question: 'わり算の問題はあまりが出ますか？',
      answer:
        'いいえ、すべて割り切れる問題です。たとえば2桁÷1桁なら、76 ÷ 4 = 19 のような問題だけが出ます。わる数は2以上で、わられる数を超えることはありません。',
    },
    {
      question: 'ひき算で答えがマイナスになる問題は出ますか？',
      answer:
        '初期設定では出ません。大きいほうの数が先になるよう入れ替えます。「ひき算の答えが負になってもよい」にチェックを入れると、負の答えになる問題も作られます。',
    },
    {
      question: '問題数を増やすと何ページになりますか？',
      answer:
        '1ページに入る数は「式の形」と「列数」、「用紙サイズ」で決まり、足りなければ自動で次のページに送られます。たとえばA4の横書き2列なら1ページ36問です。ページ数は画面の表示で確認できます。',
    },
  ],
  en: [
    {
      question: 'Can I print the worksheet and the answer sheet separately?',
      answer:
        'Yes. Set "Show and print" to "Problems" and print, then switch it to "Answers" and print again. The answers appear in red. Do not change any setting in between, because the problems are rebuilt from the same settings and seed.',
    },
    {
      question: 'How can I get the same problems again later?',
      answer:
        'Enter the same number in "Seed" with the same settings and the same problems come back. Note the seed, and you can print the answers again on another day. "Shuffle problems" switches to a new seed.',
    },
    {
      question: 'Do the division problems have remainders?',
      answer:
        'No, every division problem divides evenly. For example, a 2-digit by 1-digit setting gives problems like 76 ÷ 4 = 19. The divisor is at least 2 and never larger than the dividend.',
    },
    {
      question: 'Can subtraction give negative answers?',
      answer:
        'Not by default: the larger number is placed first. Tick "Allow negative subtraction results" if you also want problems whose answer is below zero.',
    },
    {
      question: 'How many pages will I get with more problems?',
      answer:
        'How many fit on one page depends on the format, the columns and the paper size, and extra problems flow onto the next page. For example, side-by-side format with 2 columns on A4 holds 36 problems per page. The page count is shown above the preview.',
    },
  ],
};
