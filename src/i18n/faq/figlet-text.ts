import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '日本語（ひらがな・カタカナ・漢字）をアート文字にできますか？',
      answer:
        '「ドット（日本語対応・美咲フォント）」書体なら、ひらがな・カタカナ・漢字（JIS第1・第2水準）を変換できます。ほかの書体は半角の英数字と記号（ASCII）の字形しか持たないため、日本語・全角文字・絵文字は表示されず、画面に「字形がない文字」として知らせます。ドット書体でも「𠮟」「﨑」などJIS第3水準以降の字や、絵文字は表示できません。',
    },
    {
      question: '貼り付けた先で形が崩れるのはなぜですか？',
      answer:
        'アート文字は等幅フォントで並べる前提で作られています。メールの本文、チャット、SNSなどの比例フォントでは、文字の幅が揃わず崩れます。コードエディタやターミナル、README（コードブロック内）に貼り付けてください。',
    },
    {
      question: '「字間」の選択肢は何が違いますか？',
      answer:
        '「書体の標準」は書体の作者が想定した詰め方です。「詰めない」は各文字を隙間を空けて並べ、「接するまで詰める」は隣の文字に触れる位置まで寄せます。「重ねて詰める」はさらに端の記号を重ねて1つにまとめるため最も幅が狭くなりますが、書体によっては読みにくくなります。',
    },
    {
      question: 'ソースコードの先頭に貼るにはどうすればよいですか？',
      answer:
        '「コメント形式」で、使っている言語に合うものを選んでからコピーしてください。JavaScript・Java・C系などは「// 行コメント」か「/* */」、Python・シェルスクリプト・YAMLは「# 行コメント」、HTMLは「<!-- -->」が使えます。',
    },
  ],
  en: [
    {
      question:
        'Can I turn Japanese text (hiragana, katakana, kanji) into ASCII art?',
      answer:
        'Yes, with the "Dot (Japanese, Misaki font)" font, which covers hiragana, katakana and kanji (JIS level 1 and 2). The other fonts only contain ASCII letters, digits and symbols, so Japanese, full-width characters and emoji are left out and the tool lists which characters were skipped. Even the dot font cannot draw emoji or characters outside JIS level 2, such as 𠮟 and 﨑.',
    },
    {
      question: 'Why does the banner look broken after I paste it?',
      answer:
        'ASCII lettering assumes a monospaced font. In proportional fonts, such as email bodies, chat apps and social media posts, the characters have different widths and the shapes fall apart. Paste it into a code editor, a terminal, or a README code block.',
    },
    {
      question: 'What do the letter-spacing options do?',
      answer:
        '"Font default" uses the spacing the font author intended. "Full width" leaves a gap between letters, and "Fitted" moves each letter until it touches its neighbour. "Smushed" goes one step further and merges overlapping edge characters into one, giving the narrowest result, though some fonts become hard to read.',
    },
    {
      question: 'How do I put the banner at the top of a source file?',
      answer:
        'Pick the comment style that fits your language before copying. Use "// line comment" or "/* */" for JavaScript, Java and C-family languages, "# line comment" for Python, shell scripts and YAML, and "<!-- -->" for HTML.',
    },
  ],
};
