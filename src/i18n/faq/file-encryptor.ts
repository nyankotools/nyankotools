import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'ファイルはサーバーにアップロードされますか？',
      answer:
        'いいえ。ファイルはブラウザ内で暗号化・復号するだけで、外部へは送信されません。ネットワークに接続していない状態でも動作します。',
    },
    {
      question: '暗号化したファイルを他のソフトで開けますか？',
      answer:
        'できません。このツール独自の形式のため、復号はこのツールでのみ行えます。OpenSSLや7-Zip、他の暗号化ツールで作ったファイルもここでは復号できません。',
    },
    {
      question: '何MBのファイルまで暗号化できますか？',
      answer:
        '1ファイル512MBまでです。入力と出力の両方をブラウザのメモリに保持するため、それ以上は扱えません。端末のメモリが少ない場合は、これより小さくても失敗することがあります。',
    },
    {
      question:
        '「復号できませんでした」「途中で切れています」と出るのはなぜですか？',
      answer:
        'パスワードが違うと復号できません。ファイルの末尾が欠けている場合は「途中で切れている」、一部が書き換わっている場合は「改ざん・破損」と区別して表示します。ダウンロードが完了しているか確認してください。',
    },
    {
      question: '元のファイル名や拡張子は復元されますか？',
      answer:
        'はい。ファイル名と種類は暗号文の中に保存され、復号すると元の名前で保存できます。暗号化したファイル自体の名前は「元の名前.enc」になります。',
    },
  ],
  en: [
    {
      question: 'Is my file uploaded to a server?',
      answer:
        'No. The file is encrypted and decrypted inside your browser and is never sent anywhere. It works even when you are offline.',
    },
    {
      question: 'Can I open the encrypted file with other software?',
      answer:
        'No. The format is specific to this tool, so it can only be decrypted here. Files made with OpenSSL, 7-Zip, or other tools cannot be decrypted here either.',
    },
    {
      question: 'How large a file can I encrypt?',
      answer:
        'Up to 512 MB per file. Both the input and the output are held in browser memory, so larger files are not supported. On devices with little memory, smaller files may also fail.',
    },
    {
      question: 'Why do I get "Could not decrypt" or "ends too early"?',
      answer:
        'A wrong password cannot decrypt the file. If the end of the file is missing it is reported as truncated, and if part of it was changed it is reported as altered or corrupted. Check that the download finished.',
    },
    {
      question: 'Are the original file name and extension restored?',
      answer:
        'Yes. The name and type are stored inside the ciphertext, so decrypting offers the file under its original name. The encrypted file itself is named "original-name.enc".',
    },
  ],
};
