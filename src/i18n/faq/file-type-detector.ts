import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ファイルはサーバーにアップロードされますか？',
      answer:
        'いいえ。ファイルの先頭部分をブラウザ内で読み込んで判定するだけで、外部へは送信されません。ネットワークに接続していない状態でも動作します。',
    },
    {
      question: 'マジックナンバーとは何ですか？拡張子とどう違いますか？',
      answer:
        'ファイルの先頭にある、形式ごとに決まったバイト列です。拡張子はファイル名を変えれば簡単に書き換えられますが、マジックナンバーは中身そのものなので、名前を変えても変わりません。このツールは中身から本当の形式を判定します。',
    },
    {
      question:
        '画像として保存したのに開けないファイルの原因を調べられますか？',
      answer:
        'はい。ダウンロードに失敗してエラーページ（HTML）が .jpg や .pdf として保存されていると、中身は「HTML」と判定され、拡張子との不一致が警告されます。HEIC画像を .jpg に名前変更しただけのファイルなども見分けられます。',
    },
    {
      question: '拡張子が一致していれば、安全なファイルですか？',
      answer:
        'いいえ。このツールが確認するのは形式だけで、中身が安全かどうかは判定できません。出どころの分からない実行ファイルや書類は、拡張子が正しくても開かないでください。',
    },
    {
      question: 'docx・xlsx・pptx が「ZIP」と表示されるのはなぜですか？',
      answer:
        'Office文書の実体はZIP形式のアーカイブです。ZIP内のファイル名（word/・xl/・ppt/ など）で種類を推定しますが、ファイルの先頭付近に手掛かりが無い場合は「ZIP」と表示されます。その場合も .docx や .xlsx などの拡張子は一致扱いになります。',
    },
  ],
  en: [
    {
      question: 'Are my files uploaded to a server?',
      answer:
        'No. The tool reads the start of each file inside your browser and nothing is sent anywhere. It also works offline.',
    },
    {
      question:
        'What is a magic number, and how is it different from an extension?',
      answer:
        'A magic number is a fixed byte sequence at the start of a file that identifies its format. An extension is just part of the file name and is easy to change, whereas the magic number is part of the contents. This tool identifies the real format from the contents.',
    },
    {
      question: 'Can it explain why a downloaded image or PDF will not open?',
      answer:
        'Often, yes. If a failed download saved an HTML error page as .jpg or .pdf, the contents are detected as HTML and the extension mismatch is flagged. It also reveals files that were only renamed, such as a HEIC photo saved with a .jpg name.',
    },
    {
      question: 'Is a file safe if its extension matches?',
      answer:
        'No. The tool only checks the format, not whether the contents are safe. Do not open executables or documents from unknown sources even if the extension looks right.',
    },
    {
      question: 'Why is my docx, xlsx, or pptx shown as ZIP?',
      answer:
        'Office documents are ZIP archives internally. The tool identifies the kind from entry names such as word/, xl/, and ppt/, but if there is no clue near the start of the file it reports ZIP. In that case extensions like .docx and .xlsx are still treated as a match.',
    },
  ],
};
