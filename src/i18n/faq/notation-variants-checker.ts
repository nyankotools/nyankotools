import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'どのような表記ゆれを検出できますか？',
      answer:
        '送り仮名（行なう／行う）、漢字とかなの使い分け（出来る／できる）、カタカナ表記（ソフトウエア／ソフトウェア）、用語・単位（3ヶ月／3か月）、半角カナ、全角と半角の英数字・括弧・句読点の混在です。辞書にある語と記号ルールが対象で、辞書にない表記ゆれは検出できません。',
    },
    {
      question: '推奨表記が正解とは限らないのですか？',
      answer:
        '限りません。推奨表記は一般的な表記や公用文の考え方を参考にした一例です。固有名詞・引用・専門用語や、媒体・社内の用字用語集では別の表記が正しいことがあります。長音の有無などは流儀が分かれるため、初期設定ではオフにしています。',
    },
    {
      question: '「推奨表記も使用」欄の「あり（混在）」とは何ですか？',
      answer:
        '指摘した表記の推奨形（例: 行ない→行い）が、同じ文章のほかの場所にも出てきている状態です。同じ文章内で書き方が割れているため、優先して統一を検討したい箇所です。',
    },
    {
      question: '独自ルールはどう書けば使えますか？',
      answer:
        '「変更前>推奨表記」の形式で1行に1件書きます（例: お客さま>お客様）。記号は文字として扱われるため正規表現は不要です。辞書と同じ位置に当たる場合は、独自ルールが優先されます。',
    },
    {
      question: '入力した文章は外部に送信されますか？',
      answer:
        'いいえ。すべてブラウザ内で処理され、サーバーには送信されません。未公開の原稿や社内文書のチェックにも使えます。',
    },
  ],
  en: [
    {
      question: 'What kinds of inconsistencies can it detect?',
      answer:
        'Okurigana (行なう vs 行う), kanji vs kana (出来る vs できる), katakana spellings (ソフトウエア vs ソフトウェア), terms and units (3ヶ月 vs 3か月), half-width kana, and mixed full/half-width digits, letters, brackets and punctuation. Only dictionary entries and the symbol rules are covered; other variants are not detected.',
    },
    {
      question: 'Is the recommended form always correct?',
      answer:
        'No. It is one example based on common usage and official-document conventions. Proper nouns, quotations, technical terms, and a publication or company style guide may call for another form. Long vowel marks are off by default because house styles differ.',
    },
    {
      question: 'What does "Yes (mixed)" in the recommended-form column mean?',
      answer:
        'The recommended form of the flagged text (for example 行い for 行ない) also appears elsewhere in the same text, so the writing is split between two forms. Those are the best places to unify first.',
    },
    {
      question: 'How do I write custom rules?',
      answer:
        'Write one "before>recommended" pair per line, for example お客さま>お客様. Symbols are treated as plain characters, so no regular expression is needed. If a custom rule hits the same spot as a dictionary entry, the custom rule wins.',
    },
    {
      question: 'Is my text sent anywhere?',
      answer:
        'No. Everything is processed in your browser, so it is fine for unpublished drafts and internal documents.',
    },
  ],
};
