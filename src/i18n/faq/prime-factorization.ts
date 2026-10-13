import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '何桁の整数まで素因数分解できますか？',
      answer:
        '入力は60桁までです。ただし、実際に分解できるかは数の中身で決まります。小さな素因数が多い数は60桁でも一瞬ですが、十数桁ずつの大きな素数2つの積のような数は、ブラウザ上では時間内に終わらないことがあります。その場合は「分解できませんでした」と表示し、不完全な結果は出しません。',
    },
    {
      question: '1 や 0 を入力するとエラーになるのはなぜですか？',
      answer:
        '0 は素因数分解の対象になりません。1 は素数でも合成数でもなく、素因数を持たないため、2以上の整数だけを受け付けています。最大公約数・最小公倍数の計算でも、0 は最小公倍数が定義しにくいため扱いません。',
    },
    {
      question: '最大公約数・最小公倍数は3つ以上の数でも求められますか？',
      answer:
        '求められます。カンマ・空白・改行で区切って2つ以上（最大1000個）の整数を入力してください。最小公倍数は途中で大きくなっても BigInt で正確に計算します。桁区切りのカンマは区切り文字と区別できないので使えません。',
    },
    {
      question: '約数の一覧が表示されないことがあるのはなぜですか？',
      answer:
        '約数の個数が5000個を超える数では、一覧が非常に長くなるため省略し、個数と総和だけを表示します。素因数分解の結果から、個数は (指数+1) の積で求められます。',
    },
    {
      question: '素数の判定結果は確実ですか？',
      answer:
        '約3.3×10^24 未満の数は、決定的に動作する Miller-Rabin 法で確実に判定します。それ以上の数に含まれる素因数は確率的な判定になり、その場合は画面に注意を表示します。誤判定の確率は実用上無視できる小ささです。',
    },
  ],
  en: [
    {
      question: 'How large an integer can it factor?',
      answer:
        'Input is limited to 60 digits, but whether a number can actually be factored depends on its structure. Numbers with many small factors finish instantly even at 60 digits, while a product of two large primes of a dozen or more digits each may not finish in a browser. In that case the tool says it could not factor the number instead of showing a partial result.',
    },
    {
      question: 'Why are 0 and 1 rejected?',
      answer:
        'Zero cannot be factored. 1 is neither prime nor composite and has no prime factors, so factorization needs an integer of 2 or more. For GCD and LCM, zero is also rejected because the LCM with zero is awkward to define.',
    },
    {
      question: 'Can I find the GCD and LCM of three or more numbers?',
      answer:
        'Yes. Enter two or more integers (up to 1000) separated by commas, spaces or new lines. The LCM is computed exactly with BigInt even when it gets huge. Thousands-separator commas cannot be used there, because a comma is a value separator.',
    },
    {
      question: 'Why is the divisor list sometimes missing?',
      answer:
        'When a number has more than 5000 divisors, the list would be very long, so only the count and sum are shown. The count is the product of (exponent + 1) over the prime factors.',
    },
    {
      question: 'Is the primality result certain?',
      answer:
        'Below about 3.3×10^24 the Miller-Rabin test used here is deterministic, so the result is certain. For prime factors above that it is probabilistic, and the page shows a notice. The chance of a wrong answer is negligible in practice.',
    },
  ],
};
