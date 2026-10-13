import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'URLごとに更新日や優先度を変えられますか？',
      answer:
        'できます。URLの後ろに空白区切りで「2026-10-01」「weekly」「0.8」のように書くと、その行だけ共通設定を上書きします。順番は問いません。',
    },
    {
      question: 'URLが50,000件を超えたらどうなりますか？',
      answer:
        '1ファイルの上限（50,000件・非圧縮50MB）に収まるように sitemap-1.xml, sitemap-2.xml … へ自動で分割し、それらをまとめる sitemap-index.xml も生成します。サーチコンソールにはインデックスを送信してください。',
    },
    {
      question: '重複や無効なURLはどう扱われますか？',
      answer:
        'http/https以外や解釈できないURLは出力から除外され、行番号と理由が一覧に表示されます。ルートURLの末尾スラッシュの有無（example.com と example.com/）、ホスト名の大文字小文字、フラグメント（#以降）だけが違うURLは同一とみなして重複を除きます。/about と /about/ のようなパスの末尾スラッシュは別URLとして扱います。',
    },
    {
      question: 'changefreqやpriorityは必ず入れるべきですか？',
      answer:
        '必須ではありません。Googleはこれらをほとんど参照せず、lastmodも実際の更新と合わないと無視します。正確な更新日が分からないなら、空のままで問題ありません。',
    },
  ],
  en: [
    {
      question: 'Can I set a different date or priority per URL?',
      answer:
        'Yes. Add values after the URL separated by spaces, such as "2026-10-01", "weekly" or "0.8". They override the shared settings for that line only, in any order.',
    },
    {
      question: 'What happens with more than 50,000 URLs?',
      answer:
        'The list is split automatically into sitemap-1.xml, sitemap-2.xml and so on, each within 50,000 URLs and 50 MB, and a sitemap-index.xml tying them together is generated. Submit the index in Search Console.',
    },
    {
      question: 'How are duplicates and invalid URLs handled?',
      answer:
        'Non-http(s) or unparsable URLs are left out and listed with their line number and reason. URLs that differ only by a root trailing slash (example.com vs example.com/), host letter case or a #fragment are treated as the same URL and de-duplicated. Path trailing slashes such as /about and /about/ are kept as separate URLs.',
    },
    {
      question: 'Do I have to include changefreq and priority?',
      answer:
        'No. Google mostly ignores them, and it disregards lastmod when it does not match real changes. If you do not know the accurate date, leaving them empty is fine.',
    },
  ],
};
