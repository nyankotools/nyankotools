import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '和文モールスで濁点（゛）や半濁点（゜）はどう送りますか？',
      answer:
        '濁点・半濁点は、直前のカナとは別の符号です。濁点は「・・」、半濁点は「・・－－・」を、元の文字のあとに送ります。例えば「ガ」は「カ」の符号に濁点の符号を続けた2つの符号になります。解読では、直前のカナと合成して「ガ」「パ」に戻します。',
    },
    {
      question: 'ひらがなや小さい「ッ」「ャ」は変換できますか？',
      answer:
        'ひらがなはカタカナと同じ符号に変換します。小さい「ッ」「ャ」などは、和文モールスには専用の符号がないため、大きい「ツ」「ヤ」と同じ符号で送ります。そのため解読すると「ガツコウ」のように大きい文字に戻ります。漢字や英字は変換できません。',
    },
    {
      question: '欧文と和文で同じ符号が違う文字になるのはなぜですか？',
      answer:
        '欧文モールスと和文モールスは別の符号表だからです。たとえば「・－」は欧文では「A」、和文では「イ」です。解読するときは、「符号の種類」を送られた内容に合わせて選んでください。',
    },
    {
      question: 'モールス信号を解読するとき、区切りはどう入力しますか？',
      answer:
        '文字と文字は半角スペース1つ、単語と単語は「/」または空白2つ以上で区切ります。「・」「－」の全角表記も使えます。符号の並びが表にない場合は、その部分を「□」にして、解読できなかった符号として一覧に示します。',
    },
    {
      question: '光での再生が遅いのはなぜですか？',
      answer:
        '画面の点滅が毎秒3回を超えないようにするためです。短点が続いても点滅が毎秒3回以内に収まるよう、光の再生は最大7 WPMに抑えています。音だけで再生する場合は5〜40 WPMで指定できます。',
    },
  ],
  en: [
    {
      question: 'How are dakuten and handakuten sent in Wabun Morse?',
      answer:
        'They have their own codes and follow the base kana: dakuten is ・・ and handakuten is ・・－－・. For example ガ is sent as the code for カ followed by the dakuten code. When decoding, the tool combines them back into ガ or パ.',
    },
    {
      question: 'Can it convert hiragana or small kana such as ッ and ャ?',
      answer:
        'Hiragana is converted to the same codes as katakana. Wabun has no separate code for small kana, so ッ and ャ are sent as the full-size ツ and ヤ, and they decode as the full-size kana. Kanji and Latin letters cannot be converted.',
    },
    {
      question: 'Why does the same pattern decode to different characters?',
      answer:
        'International and Wabun Morse are different code tables. For example ・－ is "A" in international Morse and イ in Wabun. Choose the code type that matches the message when decoding.',
    },
    {
      question: 'How should I separate letters and words when decoding?',
      answer:
        'Separate letters with a single space and words with "/" or two or more spaces. The ・ and － symbols also work. A pattern that is not in the table is shown as □ and listed as an undecoded code.',
    },
    {
      question: 'Why is light playback slower than sound?',
      answer:
        'To keep the screen from flashing more than 3 times per second. Even a run of dots stays within that limit, so light playback is capped at 7 WPM. Sound alone can be set from 5 to 40 WPM.',
    },
  ],
};
