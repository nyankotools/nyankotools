import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'PDFのメタデータには何が入っていますか？',
      answer:
        'タイトル・作成者・件名・キーワード・作成アプリケーション・PDF変換ソフト・作成日時・更新日時などです。WordやPDF作成ソフトから書き出すと、作成者名やファイル名由来のタイトルが自動で入ることがあります。',
    },
    {
      question: '作成者名を完全に消すにはどうすればいいですか？',
      answer:
        '「作成者」を空欄にし、「XMPメタデータも削除する」にチェックを入れたまま保存してください。XMPに同じ情報が重複して入っている場合があるため、両方を消す必要があります。',
    },
    {
      question: 'ページ内の文字や画像の情報も消えますか？',
      answer:
        '消えません。編集できるのはPDFの文書情報だけです。ページに書かれた文字は変わらず、画像に埋め込まれたExifなども対象外です。隠したい内容がある場合はPDF黒塗りツールをご利用ください。',
    },
    {
      question: '更新日時を空欄にするとどうなりますか？',
      answer:
        '更新日時の項目がPDFから削除されます。自動で現在時刻を入れることはしないので、残したい場合は日時を入力してください。',
    },
  ],
  en: [
    {
      question: 'What metadata does a PDF contain?',
      answer:
        'Title, author, subject, keywords, creator application, PDF producer, and creation and modification dates. Files exported from Word or PDF software often carry an author name and a title taken from the file name automatically.',
    },
    {
      question: 'How do I remove the author name completely?',
      answer:
        'Empty the Author field and keep "Also remove XMP metadata" ticked before saving. The same information can be duplicated in the XMP metadata, so both copies need to go.',
    },
    {
      question: 'Does it also remove information inside page text or images?',
      answer:
        'No. Only the PDF’s document properties are edited. Text on the pages stays as is, and data embedded in images such as Exif is not touched. Use the PDF Redactor to hide content on the pages.',
    },
    {
      question: 'What happens if I leave the modified date empty?',
      answer:
        'The field is removed from the PDF. The tool does not insert the current time automatically, so enter a date and time if you want to keep one.',
    },
  ],
};
