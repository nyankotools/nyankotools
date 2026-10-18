import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Macのファイル名の濁点が分離してしまうのはなぜですか？',
      answer:
        'macOSの従来のファイルシステムは、ファイル名を「か」＋濁点のように分解した形（NFD寄り）で保存するためです。見た目は同じでも別の文字列になるので、検索や比較が一致しません。NFCに変換すると1文字にまとまります。',
    },
    {
      question: 'NFCとNFKCのどちらを選べばよいですか？',
      answer:
        '濁点の分離を直すだけならNFCです。NFKCは半角カナを全角にする、全角英数を半角にするなど互換文字も置き換えるため、意図せず見た目が変わることがあります。',
    },
    {
      question: '変換しても貼り付け先でまた分離することはありますか？',
      answer:
        'あります。保存先のOSやアプリがファイル名を分解して保存する場合は、貼り付けた後に再び分離した形になることがあります。',
    },
    {
      question: '絵文字や漢字も変換されますか？',
      answer:
        'ほとんどの絵文字や漢字は変化しません。ただし一部の互換漢字は各形式で標準の漢字に置き換わり、合字や丸数字はNFKC・NFKDで別の文字に置き換わることがあります。',
    },
  ],
  en: [
    {
      question: 'Why do Japanese dakuten split apart in Mac filenames?',
      answer:
        'Older macOS file systems store filenames in a decomposed (NFD-like) form, such as a base kana plus a combining dakuten. It looks identical but is a different string, so searches and comparisons fail. Converting to NFC merges them.',
    },
    {
      question: 'Should I choose NFC or NFKC?',
      answer:
        'To repair split dakuten or accents, NFC is enough. NFKC also replaces compatibility characters, such as half-width katakana or full-width letters, so the text can change visibly.',
    },
    {
      question: 'Can the text decompose again after I paste it somewhere?',
      answer:
        'Yes. If the destination OS or app stores filenames in decomposed form, the pasted text may be split again when saved.',
    },
    {
      question: 'Are emoji and kanji affected?',
      answer:
        'Most emoji and kanji stay as they are. A few compatibility ideographs are replaced by standard ones in every form, and ligatures and circled digits change under NFKC or NFKD.',
    },
  ],
};
