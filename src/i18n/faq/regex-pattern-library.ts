import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '先頭の ^ と末尾の $ は必要ですか？',
      answer:
        '入力欄の値が「全体として」その形式になっているか確認したいときは必要です。付けないと、文字列の一部が一致しただけで true になります。たとえば郵便番号のパターンから ^ と $ を外すと、「abc1000001xyz」も一致してしまいます。ページ内の文章から該当部分を抜き出したい場合は、^ と $ を外して使ってください。',
    },
    {
      question: 'Python・PHP・Java でもそのまま使えますか？',
      answer:
        '基本的な部分はほとんどの言語で動きますが、このページのパターンは JavaScript 向けです。\\p{Script=Han} のような Unicode プロパティは、言語によって書き方が異なったり、非対応だったりします。また、フラグの指定方法（i や m の付け方）も言語ごとに違います。コピー後は、使う言語で実際に試してください。',
    },
    {
      question:
        'メールアドレスのパターンで RFC に完全には従っていないのはなぜですか？',
      answer:
        'RFC に完全に従うと非常に長く複雑になり、実際のサービスで使われない形式まで通してしまうためです。このパターンは、実際によく使われる形を判定する実用的な簡易版です。ただし、形式が正しくてもそのアドレスが実在する保証はありません。確実に確認するには、確認メールを送ってリンクを踏んでもらう方法が必要です。',
    },
    {
      question: '日付のパターンで「2026-02-31」が一致してしまいます。',
      answer:
        '正規表現は文字の並びを調べるだけで、カレンダー上の実在までは判定できません。パターンは月が01〜12、日が01〜31の範囲かを確認します。閏年や月ごとの日数まで確認したいときは、一致を確認したあとで Date オブジェクトや日付ライブラリで実在する日付かを検証してください。',
    },
    {
      question: '全角カタカナのパターンで中黒「・」やスペースを許可するには？',
      answer:
        '文字クラスに足します。たとえば「マイケル・ジャクソン」を許可するなら [ァ-ヶー・]、全角スペースも許可するなら [ァ-ヶー・　] のように指定します。パターンをコピーしたら、正規表現テスターに貼り付けて、許可したい文字が通ることを確認してください。',
    },
  ],
  en: [
    {
      question: 'Do I need the ^ at the start and $ at the end?',
      answer:
        'Yes, when you want to check that the entire value has the format. Without them, a match anywhere in the string makes the test return true. For example, dropping ^ and $ from the postal code pattern would also accept "abc1000001xyz". If you want to pull matches out of longer text, remove them instead.',
    },
    {
      question: 'Can I use these patterns in Python, PHP, or Java as they are?',
      answer:
        'The basics work in most languages, but these patterns are written for JavaScript. Unicode properties such as \\p{Script=Han} are spelled differently or unsupported depending on the language, and so is the way flags like i and m are specified. After copying, try the pattern in the language you actually use.',
    },
    {
      question: 'Why is the email pattern not fully RFC-compliant?',
      answer:
        'A fully compliant pattern would be extremely long and would accept forms that real services never use. This one is a practical simplification that covers the addresses people actually have. A well-formed address still might not exist, so the only reliable check is to send a confirmation email and have the user click the link.',
    },
    {
      question: 'Why does the date pattern accept "2026-02-31"?',
      answer:
        'A regex only inspects the sequence of characters; it cannot know the calendar. The pattern checks that the month is 01-12 and the day is 01-31. To rule out leap-year and month-length errors, validate the matched string with a Date object or a date library afterward.',
    },
    {
      question:
        'How do I allow the middle dot or spaces in the katakana pattern?',
      answer:
        'Add them to the character class. For names like "マイケル・ジャクソン", use [ァ-ヶー・]; to allow a full-width space too, use [ァ-ヶー・　]. Paste the edited pattern into the Regex Tester to confirm the characters you want to allow actually pass.',
    },
  ],
};
