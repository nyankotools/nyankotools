import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question:
        'utm_source・utm_medium・utm_campaign のうち、どれが必須ですか？',
      answer:
        'GA4 のキャンペーン集計では utm_source・utm_medium・utm_campaign の3つを揃えるのが一般的です。utm_term（検索キーワード）と utm_content（広告・リンクの識別）は任意です。このツールは未入力の項目があると注意を表示しますが、生成自体は1つでも値があれば行えます。',
    },
    {
      question: '元のURLにすでにクエリやハッシュがある場合はどうなりますか？',
      answer:
        '既存のクエリは順序とエンコードをそのまま保ち、末尾にUTMパラメータを追加します。ハッシュ（#以降）は最後に残るため、「?a=1#top」は「?a=1&utm_source=…#top」になります。同名の utm_* が既にある場合だけ新しい値で置き換えます。',
    },
    {
      question: '値に日本語やスペースを入れても大丈夫ですか？',
      answer:
        '入力した値はパーセントエンコードされ、スペースは「%20」になります。ただし日本語の値はレポート上で読みにくく、表記ゆれも起きやすいため、英小文字とアンダースコアでそろえるのがおすすめです。「値をすべて小文字にそろえる」で大文字小文字の混在を防げます。',
    },
    {
      question: '履歴はどこに保存されますか？',
      answer:
        'コピーしたURLが、このブラウザのlocalStorageに最大20件まで保存されます。サーバーには送信されません。ブラウザの設定で保存が無効な場合は、履歴なしでそのまま使えます。',
    },
  ],
  en: [
    {
      question: 'Which UTM parameters are required?',
      answer:
        'For campaign reports in GA4 you normally set utm_source, utm_medium and utm_campaign together. utm_term (search keyword) and utm_content (ad or link variant) are optional. The tool warns about empty fields, but it will generate a URL as long as at least one value is filled in.',
    },
    {
      question: 'What happens if the URL already has a query or a hash?',
      answer:
        'The existing query keeps its order and encoding, and the UTM parameters are appended at the end. The hash stays last, so "?a=1#top" becomes "?a=1&utm_source=...#top". Only an existing utm_* parameter with the same name is replaced.',
    },
    {
      question: 'Can I use spaces or non-English text in the values?',
      answer:
        'Values are percent-encoded, and a space becomes "%20". Still, non-English values are hard to read in reports and easy to misspell, so lowercase letters and underscores are safer. Use "Lowercase all values" to avoid mixed-case duplicates.',
    },
    {
      question: 'Where is the history stored?',
      answer:
        "Copied URLs are kept in this browser's localStorage, up to 20 entries, and are never sent to a server. If the browser blocks storage, the tool still works without history.",
    },
  ],
};
