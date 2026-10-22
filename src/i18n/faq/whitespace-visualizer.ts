import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question:
        '半角スペースと全角スペース、ノーブレークスペースの見分け方は？',
      answer:
        'このツールでは、半角スペースを「·」、全角スペースを「□」、ノーブレークスペースを「°」で表示します。見た目が同じでも記号が違うので、混在していることを確認できます。',
    },
    {
      question: '改行がLFかCRLFかを確認できますか？',
      answer:
        'できます。LFは「↵」、CRLFは「␍↵」と表示し、内訳の表で件数も確認できます。LFとCRLFが混在している場合は、両方の行が表に出ます。',
    },
    {
      question: 'ゼロ幅スペースも表示されますか？',
      answer:
        'はい。ゼロ幅スペースやBOMなどの不可視文字は「⟦200B⟧」のようにコードポイントで表示します。削除したい場合は、ゼロ幅文字の検出・除去ツールを使ってください。',
    },
    {
      question: '可視化した結果を元のテキストとして使えますか？',
      answer:
        'いいえ。結果は空白などを記号に置き換えた確認用のテキストです。元のテキストの加工には使わず、見つけた位置を確認する目的で利用してください。',
    },
  ],
  en: [
    {
      question:
        'How can I tell a regular space from an ideographic or no-break space?',
      answer:
        'Regular spaces are shown as "·", ideographic spaces as "□" and no-break spaces as "°". They can look identical in normal text, but the symbols make mixed use easy to spot.',
    },
    {
      question: 'Can I check whether line breaks are LF or CRLF?',
      answer:
        'Yes. LF is shown as "↵" and CRLF as "␍↵", and the breakdown table counts each kind. If the text mixes both, both rows appear in the table.',
    },
    {
      question: 'Are zero-width spaces shown as well?',
      answer:
        'Yes. Invisible characters such as the zero-width space or BOM are shown by code point, like "⟦200B⟧". To delete them, use the zero-width character remover.',
    },
    {
      question: 'Can I use the visualized result as my original text?',
      answer:
        'No. The result is a review copy where whitespace is replaced with symbols. Use it to find positions, not to process the original text.',
    },
  ],
};
