import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'シーザー暗号のシフト数が分からないとき、どう解読しますか？',
      answer:
        'シフト数が分からない場合は、暗号方式を「シーザー暗号」にして入力すると表示される総当たり一覧を見てください。シフト数1〜25で復号した25通りが並ぶので、意味の通る文章になっている行が正解です。候補が25通りしかないため、手作業でもすぐ見つかります。',
    },
    {
      question: 'ROT13で数字や日本語はどうなりますか？',
      answer:
        'ROT13はアルファベット（A-Z、a-z）だけを13文字ずらし、数字・記号・日本語などはそのまま残ります。ROT47を使うと、数字や記号を含むASCIIの印字可能文字（!〜~）が変換されますが、日本語はやはり変わりません。',
    },
    {
      question: 'ヴィジュネル暗号の鍵に数字や記号を入れるとどうなりますか？',
      answer:
        '鍵のうちA〜Zの英字だけが使われ（大文字小文字は区別しません）、数字や記号、スペースは無視されます。英字が1文字も無い鍵はエラーになります。また、入力側のスペースや記号では鍵が進まないため、他のツールとは結果が異なる場合があります。',
    },
    {
      question: '古典暗号でパスワードや個人情報を守れますか？',
      answer:
        'いいえ。シーザー暗号・ROT13・ヴィジュネル暗号・アトバシュ暗号は、現代では数秒で解読できます。学習やパズル、ネタバレの目隠しなどの用途に限り、実際の情報保護にはAESなどの現代暗号を使うテキスト暗号化・復号ツールをご利用ください。',
    },
  ],
  en: [
    {
      question: 'How do I crack a Caesar cipher when I do not know the shift?',
      answer:
        'Choose the Caesar cipher and paste the text: the brute-force list shows the input decrypted with all 25 shifts. The row that reads as real text is the answer, and its shift is the key. With only 25 candidates, it takes seconds even by eye.',
    },
    {
      question: 'What does ROT13 do to digits and non-English text?',
      answer:
        'ROT13 rotates only the English letters A-Z and a-z by 13. Digits, symbols, and Japanese or other non-Latin characters are left as they are. ROT47 also rotates digits and symbols across printable ASCII (! to ~), but non-ASCII text is still untouched.',
    },
    {
      question: 'What happens if a Vigenere key contains digits or symbols?',
      answer:
        'Only the letters A-Z in the key are used (case does not matter); digits, symbols, and spaces are ignored. A key with no letters at all shows an error. Also note that the key does not advance on spaces or punctuation in your text, so results can differ from tools that count every character.',
    },
    {
      question: 'Can a classical cipher protect passwords or personal data?',
      answer:
        'No. The Caesar, ROT13, Vigenere, and Atbash ciphers can be broken in seconds today. Use them for puzzles, learning, or hiding spoilers, and use a modern AES-based encryptor when you need real protection.',
    },
  ],
};
