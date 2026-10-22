import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '日本語も上下反転できますか？',
      answer:
        'できません。対応しているのは英数字と一部の記号だけです。ひらがな・カタカナ・漢字は文字そのものは変わらず、並び順だけが逆になります。変換できなかった文字数は結果の下に表示されます。',
    },
    {
      question: '上下反転と左右反転（鏡文字）の違いは？',
      answer:
        '上下反転は文字を180度回したように見える形（a → ɐ）に置き換えて逆順に並べます。左右反転は鏡に映したような形（a → ɒ）に置き換えます。左右対称の文字（A、H、Oなど）は、そのままの形が使われます。',
    },
    {
      question: '反転した文字が□や？で表示されます',
      answer:
        '使っているフォントがその文字に対応していません。ɐ や ǝ などはよく表示されますが、ꟻ のような珍しい文字は環境によって表示されないことがあります。別のモードを試すか、貼り付け先で確認してください。',
    },
    {
      question: '反転した文字を元に戻せますか？',
      answer:
        '同じ方式で変換し直すと、多くの場合は元に戻ります。ただし対応表にない文字や、複数の文字が同じ形になるものは完全には戻りません。',
    },
  ],
  en: [
    {
      question: 'Can it flip Japanese text upside down?',
      answer:
        'No. Only letters, digits and some symbols have flipped forms. Japanese characters stay as they are and only their order is reversed. The number of characters that could not be converted is shown under each result.',
    },
    {
      question: 'What is the difference between upside down and mirror?',
      answer:
        'Upside down swaps each character for one that looks rotated 180 degrees (a becomes ɐ) and reverses the order. Mirror swaps it for a left-right reflection (a becomes ɒ). Symmetric characters such as A, H and O keep their shape.',
    },
    {
      question: 'Some flipped characters show as □ or ?',
      answer:
        'The font you are using does not include that character. Common ones such as ɐ and ǝ usually display fine, but rarer ones like ꟻ may not. Try another mode or check the text in the app where you will use it.',
    },
    {
      question: 'Can I turn the flipped text back?',
      answer:
        'Usually, if you run the same mode again. Characters that are not in the conversion table, or that share the same flipped shape, cannot be restored exactly.',
    },
  ],
};
