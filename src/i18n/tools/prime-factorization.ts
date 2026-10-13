import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface PrimeFactorizationPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeFactor: string;
  modeGcd: string;
  factorInputLabel: string;
  factorPlaceholder: string;
  gcdInputLabel: string;
  gcdPlaceholder: string;
  factorizationLabel: string;
  primeStatusLabel: string;
  statusPrime: string;
  statusComposite: string;
  divisorCountLabel: string;
  divisorSumLabel: string;
  divisorsLabel: string;
  /** {count} を置換 */
  divisorsOmitted: string;
  probableNotice: string;
  gcdLabel: string;
  lcmLabel: string;
  coprimeNotice: string;
  copy: string;
  copied: string;
  copyFailed: string;
  /** 以下のエラーは {max} {index} {token} を置換して表示する */
  errorInvalid: string;
  errorDecimal: string;
  errorNegative: string;
  errorZero: string;
  errorOne: string;
  errorTooLong: string;
  errorGaveUp: string;
  errorTooFew: string;
  errorTooMany: string;
  itemErrorPrefix: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const primeFactorizationContent: Record<
  Locale,
  PrimeFactorizationPageContent
> = {
  ja: {
    title: '素因数分解・最大公約数・最小公倍数の計算｜約数一覧つき',
    description:
      '整数を素因数分解し、約数の一覧・個数・総和と素数判定を表示します。複数の整数の最大公約数（GCD）・最小公倍数（LCM）も計算。巨大な整数（BigInt）対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '素因数分解・最大公約数（GCD）・最小公倍数（LCM）計算',
    introHtml:
      '整数を素数の積に分解して、約数の一覧・個数・総和、素数かどうかを表示します。複数の整数を入力すれば、最大公約数と最小公倍数も求められます。JavaScriptの通常の数値では扱えない大きな整数も、BigIntで正確に計算します。比を約分したいときは <a href="/tools/ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">割合・比率計算機</a>、2進数・16進数への変換は <a href="/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">進数変換</a> をご利用ください。',
    modeLabel: '計算の種類',
    modeFactor: '素因数分解',
    modeGcd: '最大公約数・最小公倍数',
    factorInputLabel: '整数（2以上）',
    factorPlaceholder: '例: 360',
    gcdInputLabel: '整数（2つ以上。カンマ・空白・改行で区切る）',
    gcdPlaceholder: '例: 12, 18, 30',
    factorizationLabel: '素因数分解',
    primeStatusLabel: '素数判定',
    statusPrime: '素数です',
    statusComposite: '合成数です（素数ではありません）',
    divisorCountLabel: '約数の個数',
    divisorSumLabel: '約数の総和',
    divisorsLabel: '約数一覧',
    divisorsOmitted:
      '約数が {count} 個と多いため、一覧は表示していません（個数と総和のみ）。',
    probableNotice:
      '3.3×10^24 以上の素数を含むため、素数の判定は確率的な方法（Miller-Rabin法）によるものです。誤判定の確率は無視できるほど小さいですが、数学的な証明ではありません。',
    gcdLabel: '最大公約数（GCD）',
    lcmLabel: '最小公倍数（LCM）',
    coprimeNotice: '最大公約数が1なので、これらは互いに素です。',
    copy: 'コピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errorInvalid:
      '整数として読めません。半角または全角の数字だけを入力してください。',
    errorDecimal: '小数は扱えません。整数を入力してください。',
    errorNegative: '負の数は扱えません。1以上の整数を入力してください。',
    errorZero: '0 は扱えません。1以上の整数を入力してください。',
    errorOne:
      '1 は素数でも合成数でもなく、素因数を持ちません。2以上の整数を入力してください。',
    errorTooLong: '桁数が多すぎます。{max} 桁以内で入力してください。',
    errorGaveUp:
      '時間内に分解できませんでした。大きな素因数を2つ以上含む巨大な整数は、ブラウザ上では分解が終わらないことがあります（途中の結果は表示しません）。',
    errorTooFew: '整数を2つ以上入力してください。',
    errorTooMany: '値が多すぎます。{max} 個以内で入力してください。',
    itemErrorPrefix: '{index} 個目「{token}」: ',
    notesHeading: '注意事項',
    notes: [
      '素因数分解は、小さな素数による試し割りと Pollard の rho 法・Miller-Rabin 法で行います。大きな素因数を2つ以上含む巨大な整数（目安として十数桁ずつの素数の積）は、時間内に終わらない場合があります。その場合は「分解できませんでした」と表示し、不完全な結果は出しません。',
      '入力できるのは 1 以上の整数で、最大 60 桁です。0・負数・小数はエラーになります。素因数分解では 1 も素因数を持たないためエラーにしています。',
      '桁区切りのカンマは、素因数分解の入力では無視されます。最大公約数・最小公倍数の入力ではカンマが区切り文字になるため、桁区切りは使わないでください（1,000 は 1 と 000 の2つに読まれ、000 はエラーになります）。',
      '約数の個数が 5000 を超える場合は、一覧を省略して個数と総和だけを表示します。',
      '素因数分解の結果の「^」は累乗です（2^3 = 2×2×2）。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '素因数分解',
        description:
          '1より大きい整数を、素数だけの積として表すことです。順序を除けば、どの整数も一通りの表し方に決まります（360 = 2^3 × 3^2 × 5）。',
      },
      {
        term: '最大公約数（GCD）・最小公倍数（LCM）',
        description:
          '複数の整数に共通する約数のうち最大のものが最大公約数、共通する倍数のうち最小のものが最小公倍数です。2つの整数 a, b では a × b = GCD × LCM が成り立ちます。',
      },
      {
        term: '互いに素',
        description:
          '最大公約数が1である整数の組のことです。共通する素因数を持たないため、分数 a/b はこれ以上約分できません。',
      },
      {
        term: '約数の個数と総和',
        description:
          '素因数分解が p^a × q^b × … のとき、約数の個数は (a+1)(b+1)… 個です。総和は各素数について 1 + p + … + p^a を求めて掛け合わせます。',
      },
    ],
  },
  en: {
    title: 'Prime Factorization, GCD & LCM Calculator – Divisors',
    description:
      'Factor any integer into primes and see its divisors, their count and sum, and whether it is prime. Also computes the GCD and LCM of several integers.',
    h1: 'Prime Factorization, GCD and LCM Calculator',
    introHtml:
      'Break an integer into a product of primes and see all its divisors, the divisor count and sum, and whether it is prime. Enter several integers to get their greatest common divisor and least common multiple. Large integers beyond normal JavaScript numbers are computed exactly with BigInt. To simplify a ratio, try the <a href="/en/tools/ratio-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Ratio &amp; Percentage Calculator</a>; for binary or hexadecimal, use the <a href="/en/tools/base-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Base Converter</a>.',
    modeLabel: 'Calculation',
    modeFactor: 'Prime factorization',
    modeGcd: 'GCD / LCM',
    factorInputLabel: 'Integer (2 or more)',
    factorPlaceholder: 'e.g. 360',
    gcdInputLabel:
      'Integers (two or more, separated by commas, spaces or new lines)',
    gcdPlaceholder: 'e.g. 12, 18, 30',
    factorizationLabel: 'Prime factorization',
    primeStatusLabel: 'Primality',
    statusPrime: 'Prime',
    statusComposite: 'Composite (not prime)',
    divisorCountLabel: 'Number of divisors',
    divisorSumLabel: 'Sum of divisors',
    divisorsLabel: 'Divisors',
    divisorsOmitted:
      'There are {count} divisors, so the list is not shown (count and sum only).',
    probableNotice:
      'This number has a prime factor of 3.3×10^24 or more, so primality is checked with a probabilistic method (Miller-Rabin). The chance of error is negligible, but it is not a proof.',
    gcdLabel: 'Greatest common divisor (GCD)',
    lcmLabel: 'Least common multiple (LCM)',
    coprimeNotice: 'The GCD is 1, so these numbers are coprime.',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errorInvalid: 'That is not an integer. Enter digits only.',
    errorDecimal: 'Decimals are not supported. Enter a whole number.',
    errorNegative:
      'Negative numbers are not supported. Enter an integer of 1 or more.',
    errorZero: 'Zero is not supported. Enter an integer of 1 or more.',
    errorOne:
      '1 is neither prime nor composite and has no prime factors. Enter an integer of 2 or more.',
    errorTooLong: 'Too many digits. Enter at most {max} digits.',
    errorGaveUp:
      'Could not factor this number in time. Huge integers made of two or more large prime factors may not finish in a browser (no partial result is shown).',
    errorTooFew: 'Enter at least two integers.',
    errorTooMany: 'Too many values. Enter at most {max}.',
    itemErrorPrefix: 'Value {index} "{token}": ',
    notesHeading: 'Notes',
    notes: [
      "Factorization uses trial division by small primes, then Pollard's rho and Miller-Rabin. Huge integers with two or more large prime factors (roughly a product of primes of a dozen or more digits each) may not finish in time. In that case the tool says it could not factor the number and shows no partial result.",
      'Inputs must be integers of 1 or more, up to 60 digits. Zero, negative numbers and decimals are errors. For factorization, 1 is also rejected because it has no prime factors.',
      'Thousands separators (commas) are ignored in the factorization input. In the GCD / LCM input a comma separates values, so do not use thousands separators there (1,000 would be read as 1 and 000, and 000 is an error).',
      'If a number has more than 5000 divisors, the list is omitted and only the count and sum are shown.',
      'In the result, "^" means a power (2^3 = 2×2×2).',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Prime factorization',
        description:
          'Writing an integer greater than 1 as a product of primes. Apart from order, every integer has exactly one such form (360 = 2^3 × 3^2 × 5).',
      },
      {
        term: 'GCD and LCM',
        description:
          'The greatest common divisor is the largest integer that divides all the numbers; the least common multiple is the smallest positive integer that all of them divide. For two numbers a and b, a × b = GCD × LCM.',
      },
      {
        term: 'Coprime',
        description:
          'Integers whose GCD is 1. They share no prime factor, so a fraction a/b cannot be reduced any further.',
      },
      {
        term: 'Divisor count and sum',
        description:
          'If the factorization is p^a × q^b × …, the number of divisors is (a+1)(b+1)…. The sum is the product, over each prime, of 1 + p + … + p^a.',
      },
    ],
  },
};
