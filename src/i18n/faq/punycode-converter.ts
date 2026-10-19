import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '日本語ドメインはなぜ「xn--」で始まる文字列になるのですか？',
      answer:
        'DNSは英数字とハイフンしか扱えないため、日本語などのドメイン名はPunycodeでASCIIに変換されます。変換されたラベルを見分けるため先頭に「xn--」が付きます。ブラウザのアドレスバーでは日本語で表示されても、通信では「xn--」形式が使われます。',
    },
    {
      question: '「ドメイン」と「文字列のみ」はどう違いますか？',
      answer:
        '「ドメイン」はドットで区切ったラベルごとに変換し、日本語を含むラベルにだけ「xn--」を付けます（例: 日本語.jp → xn--wgv71a119e.jp）。「文字列のみ」はRFC 3492のPunycode本体だけを変換し、「xn--」は付けません（例: 日本語 → wgv71a119e）。',
    },
    {
      question: '大文字や全角の英数字を入れると結果が変わりますか？',
      answer:
        '日本語などを含むラベルは、変換前に全角英数を半角にして小文字にそろえます。そのため「ＡＢＣ日本」は「abc日本」として変換されます。英数字だけのラベルや、「文字列のみ」の変換では入力をそのまま扱います。',
    },
    {
      question: 'デコードで「使えない文字」と表示されるのはなぜですか？',
      answer:
        'Punycodeで使えるのは英数字とハイフンだけです。「xn--」の後ろに記号や日本語が混ざっていないか、途中で切れていないかを確認してください。「文字列のみ」では「xn--」も文字列の一部として扱われるため、接頭辞は外して入力してください。',
    },
  ],
  en: [
    {
      question: 'Why do internationalized domain names start with "xn--"?',
      answer:
        'DNS only handles letters, digits and hyphens, so names with Japanese or other non-ASCII characters are converted to ASCII with Punycode. The "xn--" prefix marks a converted label. The address bar may show the readable form, but the network uses the "xn--" form.',
    },
    {
      question: 'What is the difference between "Domain" and "Raw string"?',
      answer:
        '"Domain" converts each dot-separated label and adds "xn--" only to labels with non-ASCII characters (münchen.de becomes xn--mnchen-3ya.de). "Raw string" converts only the RFC 3492 Punycode itself, without the prefix (münchen becomes mnchen-3ya).',
    },
    {
      question: 'Does uppercase or fullwidth input change the result?',
      answer:
        'Labels that contain non-ASCII characters are normalized to NFKC and lowercased before encoding, so "ABCü" is encoded as "abcü". Pure ASCII labels and "Raw string" conversions are used exactly as typed.',
    },
    {
      question: 'Why does decoding say a character is not valid?',
      answer:
        'Punycode only uses letters, digits and hyphens. Check that there are no symbols or non-ASCII characters after "xn--" and that the string is not cut off. In "Raw string" mode, "xn--" is treated as part of the string, so remove the prefix or use "Domain".',
    },
  ],
};
