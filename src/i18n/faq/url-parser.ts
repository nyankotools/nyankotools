import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '同じキーが複数あるクエリ（?a=1&a=2）はどう扱われますか？',
      answer:
        '重複したキーも別々の行として順序どおりに表示・編集でき、再組み立てしても順序と個数が保たれます。重複しているキーは一覧の上に注意として表示されます。',
    },
    {
      question: '相対URLを分解するにはどうしますか？',
      answer:
        '「ベースURL」欄に基準となる絶対URL（例: https://example.com/dir/）を入力すると、「../a?x=1」のような相対URLを絶対URLに解決してから分解します。入力が絶対URLの場合、ベースURLは使われません。',
    },
    {
      question: '組み立て後のURLが元の文字列と少し違うのはなぜですか？',
      answer:
        'クエリはパーセントエンコードの形式に正規化されるためです。たとえばスペースは「%20」（設定で「+」も選択可）になり、日本語はUTF-8のパーセントエンコードになります。ホスト名の大文字も小文字に統一されます。',
    },
    {
      question: 'トークンを含むURLを入力しても安全ですか？',
      answer:
        '入力したURLはブラウザ内で処理され、サーバーには送信されません。ただし、画面共有やスクリーンショットでは見えてしまうため、共有前に値を伏せてください。',
    },
  ],
  en: [
    {
      question: 'How are repeated keys like ?a=1&a=2 handled?',
      answer:
        'Each repeated key appears as its own row in order, and the order and count are preserved when the URL is rebuilt. Duplicate keys are also listed above the parameters as a heads-up.',
    },
    {
      question: 'How do I parse a relative URL?',
      answer:
        'Enter an absolute base URL such as https://example.com/dir/ in the base field. A relative URL like "../a?x=1" is resolved against it before being split. If the input is already absolute, the base is ignored.',
    },
    {
      question: 'Why does the rebuilt URL differ slightly from my original?',
      answer:
        'The query is normalized to percent-encoding. Spaces become "%20" (or "+" if you choose), non-ASCII text becomes UTF-8 percent-encoding, and the hostname is lowercased.',
    },
    {
      question: 'Is it safe to paste a URL that contains a token?',
      answer:
        'The URL is processed in your browser and never sent to a server. Still, a screen share or screenshot can reveal it, so mask the values before sharing.',
    },
  ],
};
