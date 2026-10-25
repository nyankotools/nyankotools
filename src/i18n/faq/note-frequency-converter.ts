import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'A4=440Hzのとき、C4（中央のド）は何Hzですか？',
      answer:
        '約261.63Hzです。A4（440Hz）から9半音下なので、440×2^(-9/12)で求められます。基準ピッチを442Hzにすると約262.82Hzになります。',
    },
    {
      question: '周波数からMIDIノート番号を求める式は？',
      answer:
        'MIDIノート番号 = 69 + 12 × log2(周波数 ÷ 基準ピッチ) です。440Hzなら69、880Hzなら81です。結果が整数にならないときは、小数部分が音のずれにあたり、100倍するとセントになります。',
    },
    {
      question: '中央のドがC3と表示されるソフトがあるのはなぜですか？',
      answer:
        'オクターブ番号の数え方がソフトによって違うためです。このツールはC4を中央のド（MIDI 60）とする科学的ピッチ表記です。一部のDAWやYAMAHA系の表記ではC3を中央のドとするので、1オクターブずれて見えます。',
    },
    {
      question: '基準ピッチを432Hzや442Hzにすると何が変わりますか？',
      answer:
        'すべての音の周波数が同じ比率で変わります。A4=442Hzなら、全ての音が440Hz基準より約7.85セント高くなります。音名どうしの関係（音程）は変わりません。',
    },
    {
      question: '平均律と純正律では周波数がどのくらい違いますか？',
      answer:
        'たとえば長3度は、平均律で基音の約1.2599倍、純正律では1.25倍です。約14セントの差があり、このツールは平均律のみを扱います。',
    },
  ],
  en: [
    {
      question: 'What is the frequency of middle C (C4) when A4 is 440 Hz?',
      answer:
        'About 261.63 Hz. C4 is nine semitones below A4, so it is 440 × 2^(-9/12). With A4 set to 442 Hz it becomes about 262.82 Hz.',
    },
    {
      question:
        'What is the formula to get a MIDI note number from a frequency?',
      answer:
        'MIDI note = 69 + 12 × log2(frequency / reference pitch). 440 Hz gives 69 and 880 Hz gives 81. When the result is not a whole number, the fractional part is the pitch offset, and multiplying it by 100 gives cents.',
    },
    {
      question: 'Why does some software call middle C "C3"?',
      answer:
        'Programs number octaves differently. This tool uses scientific pitch notation, where C4 is middle C (MIDI 60). Some DAWs and Yamaha-style notation call middle C "C3", so the octave looks shifted by one.',
    },
    {
      question:
        'What changes if I set the reference pitch to 432 Hz or 442 Hz?',
      answer:
        'Every note scales by the same ratio. At A4 = 442 Hz, all notes are about 7.85 cents higher than at 440 Hz. The intervals between notes stay the same.',
    },
    {
      question: 'How different are equal temperament and just intonation?',
      answer:
        'A major third is about 1.2599 times the root in equal temperament but exactly 1.25 times in just intonation, a gap of about 14 cents. This tool only covers equal temperament.',
    },
  ],
};
