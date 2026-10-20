import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '作成した.vcfファイルはどうやってスマホに取り込みますか？',
      answer:
        'iPhoneでは.vcfファイルを開いて「新規連絡先を作成」を選びます。Androidでは連絡先アプリのインポート機能、またはファイルを開いて連絡先アプリで読み込みます。パソコンのOutlookやGoogleコンタクトにもインポートできます。',
    },
    {
      question: 'vCardのバージョンは何ですか？ 4.0には対応していますか？',
      answer:
        'vCard 3.0で出力します。iPhone・Android・Outlookなど主要なアプリで読み込める互換性を優先しています。4.0は対応状況にばらつきがあるため出力しません。',
    },
    {
      question: 'QRコードを読み取っても一部の項目が入らないのはなぜですか？',
      answer:
        'QRコードによるvCardの読み取りは、カメラアプリや連絡先アプリによって対応する項目が異なります。会社名・役職・メモなどが欠けることがあるため、必要な項目だけに絞ると取り込まれやすくなります。',
    },
    {
      question: '項目が多いとQRコードが作れないのはなぜですか？',
      answer:
        'QRコードに入れられるデータ量には上限があり、メモや住所を含めると超えることがあります。項目を減らすか誤り訂正レベルを下げると収まります。.vcfファイルのほうは容量の制限なく保存できます。',
    },
  ],
  en: [
    {
      question: 'How do I import the .vcf file into my phone?',
      answer:
        'On iPhone, open the .vcf file and choose "Create New Contact". On Android, use the import option in the Contacts app or open the file with it. You can also import it into Outlook or Google Contacts on a computer.',
    },
    {
      question: 'Which vCard version is used? Is 4.0 supported?',
      answer:
        'It outputs vCard 3.0, chosen for compatibility with iPhone, Android, Outlook and other major apps. Version 4.0 support is uneven across apps, so it is not offered.',
    },
    {
      question: 'Why are some fields missing after scanning the QR code?',
      answer:
        'Support for vCard QR codes differs between camera and contact apps. Company, job title and note are sometimes dropped, so keeping only the fields you need makes a clean import more likely.',
    },
    {
      question: 'Why can I not make a QR code when there are many fields?',
      answer:
        'A QR code holds a limited amount of data, and a note or full address can exceed it. Remove some fields or lower the error correction level. The .vcf file has no such size limit.',
    },
  ],
};
