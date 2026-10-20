import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '封筒に印刷すると位置がずれます。',
      answer:
        '印刷ダイアログの倍率が100%（実際のサイズ）で、用紙サイズが封筒と同じ寸法になっているか確認してください。封筒の給紙の向きや位置はプリンターによって異なります。普通紙に試し刷りして、封筒に重ねて光に透かすと位置を確かめやすくなります。',
    },
    {
      question: '郵便番号枠がすでに印刷されている封筒はどうすればよいですか？',
      answer:
        '「郵便番号枠を印刷する」をオフにすると、枠を出さずに数字だけを印刷します。枠の位置は封筒の規格と数mmずれることがあるため、普通紙に試し刷りして、実際の枠と数字の位置を合わせてください。',
    },
    {
      question: '縦書きの住所の数字は、算用数字と漢数字のどちらがよいですか？',
      answer:
        'どちらも使われます。「算用数字（縦中横）」は2桁までを横に並べ、番地が読みやすい表記です。「漢数字」は「一丁目二番三号」のように位取りの漢数字（10は一〇）にします。会社や地域の慣習に合わせて選んでください。',
    },
    {
      question: '住所が長いと封筒からはみ出します。',
      answer:
        '縦書きでは、住所が長いと左側の宛名の方向へはみ出します。住所を意味の切れ目で改行して列を分けるか、「住所の文字サイズ（mm）」を小さくしてください。プレビューで確認できます。',
    },
  ],
  en: [
    {
      question: 'The print position is off when I use a real envelope.',
      answer:
        'Check that the print scale is 100% (actual size) and the paper size matches the envelope. How envelopes are fed, and in which orientation, depends on the printer. Print a test on plain paper, lay it over the envelope and hold both up to the light to see how they line up.',
    },
    {
      question: 'My envelope already has postal code boxes. What should I do?',
      answer:
        'Turn off "Print postal code boxes" to print only the digits. The box positions here can be a few millimetres off the official ones, so do a plain-paper test and compare it with your envelope.',
    },
    {
      question:
        'Should I use Arabic digits or kanji numerals in vertical text?',
      answer:
        'Both are used in practice. "Arabic digits (tate-chu-yoko)" sets up to two digits sideways, which keeps street numbers easy to read. "Kanji numerals" writes positional kanji such as 一丁目二番三号 (10 becomes 一〇). Pick whichever matches your convention.',
    },
    {
      question: 'My address runs off the envelope. How do I fix it?',
      answer:
        'In vertical writing, long columns overflow toward the name. Break the address at natural points so it splits into more columns, or reduce "Address font size (mm)". The life-size preview shows the result.',
    },
  ],
};
