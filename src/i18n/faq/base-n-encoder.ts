import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Base32・Base58・Base62・Base85はどう使い分けますか？',
      answer:
        'Base32は大文字小文字を区別せず読み間違いが少ないためTOTPの秘密鍵などに、Base58は紛らわしい文字を除くためビットコインアドレスなどに、Base62は記号を含まないため短縮URLのIDなどに、Base85はBase64より出力を短くしたいときに使われます。',
    },
    {
      question: 'デコードで「使えない文字」と表示されるのはなぜですか？',
      answer:
        '選んだ形式のアルファベットにない文字が含まれています。たとえばBase58では0・O・I・lが使えず、Base32では0・1・8・9が使えません。形式の選択が合っているか、コピー時に余計な文字が混ざっていないか確認してください。空白と改行は無視されます。',
    },
    {
      question: 'Base58は他のツールと結果が違うことがありますか？',
      answer:
        'このツールはビットコインで使われる文字セット（123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz）を使い、先頭の0x00バイトを「1」で表します。Rippleなど文字の並びが異なるBase58や、チェックサム付きのBase58Checkとは結果が一致しません。',
    },
    {
      question: 'Base85は「<~」「~>」付きの文字列もデコードできますか？',
      answer:
        'はい。Ascii85形式の前後の「<~」「~>」は自動で取り除きます。0x00が4バイト続く部分を表す「z」にも対応しています。Z85など文字セットが異なる方式には対応していません。',
    },
  ],
  en: [
    {
      question: 'When should I use Base32, Base58, Base62 or Base85?',
      answer:
        'Base32 is case-insensitive and easy to read aloud, so it is used for TOTP secrets. Base58 drops look-alike characters, which is why Bitcoin addresses use it. Base62 has no symbols, making it handy for short-URL IDs. Base85 gives shorter output than Base64.',
    },
    {
      question: 'Why does decoding say a character is not valid?',
      answer:
        'The input contains a character that is not in the alphabet of the selected format. Base58 has no 0, O, I or l, and Base32 has no 0, 1, 8 or 9. Check that the format matches and that no extra characters were copied. Spaces and line breaks are ignored.',
    },
    {
      question: 'Can the Base58 result differ from other tools?',
      answer:
        'This tool uses the Bitcoin alphabet (123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz) and writes each leading 0x00 byte as "1". Results will not match Base58 variants with a different alphabet, such as Ripple, or Base58Check, which adds a checksum.',
    },
    {
      question: 'Can it decode Base85 wrapped in "<~" and "~>"?',
      answer:
        'Yes. The "<~" and "~>" markers around Ascii85 data are removed automatically, and the "z" shortcut for four zero bytes is supported. Variants with a different alphabet, such as Z85, are not supported.',
    },
  ],
};
