import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface EnvelopePrinterPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  envelopeLabel: string;
  envNagagata3: string;
  envNagagata4: string;
  envYoukei2: string;
  envYoukei4: string;
  writingLabel: string;
  writingVertical: string;
  writingHorizontal: string;
  numeralsLabel: string;
  numeralsTcy: string;
  numeralsKanji: string;
  numeralsAsis: string;
  recipientHeading: string;
  recipientPostalLabel: string;
  recipientAddressLabel: string;
  recipientAddressPlaceholder: string;
  recipientNameLabel: string;
  honorificLabel: string;
  honorificSama: string;
  honorificOnchu: string;
  honorificYuki: string;
  honorificDono: string;
  honorificSensei: string;
  honorificNone: string;
  senderHeading: string;
  senderPostalLabel: string;
  senderAddressLabel: string;
  senderNameLabel: string;
  addressSizeLabel: string;
  nameSizeLabel: string;
  senderSizeLabel: string;
  showFramesLabel: string;
  printButton: string;
  previewLabel: string;
  errorPostal: string;
  /** {min} {max} を置き換える */
  errorAddressSize: string;
  errorNameSize: string;
  errorSenderSize: string;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const envelopePrinterContent: Record<
  Locale,
  EnvelopePrinterPageContent
> = {
  ja: {
    title: '封筒の宛名印刷（長形3号・洋形・縦書き）',
    description:
      '長形3号・長形4号・洋形2号・洋形4号の封筒に、宛名・差出人・郵便番号枠を実寸で印刷できます。縦書き・横書きに対応し、住所の数字は縦中横や漢数字にできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '封筒の宛名印刷（長形3号・洋形・縦書き）',
    introHtml:
      '封筒の種類を選び、宛先の郵便番号・住所・宛名と差出人を入力すると、実寸のプレビューを見ながら宛名面を印刷できます。長形3号・長形4号・洋形2号・洋形4号に対応し、縦書きでは住所の数字を縦中横や漢数字にできます。入力した住所や氏名はブラウザ内だけで処理され、サーバーには送信されません。連絡先を電話帳アプリに登録したいときは <a href="/tools/vcard-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">vCard生成</a> もご利用ください。',

    envelopeLabel: '封筒の種類',
    envNagagata3: '長形3号（120×235mm）',
    envNagagata4: '長形4号（90×205mm）',
    envYoukei2: '洋形2号（114×162mm）',
    envYoukei4: '洋形4号（105×235mm）',
    writingLabel: '書き方',
    writingVertical: '縦書き',
    writingHorizontal: '横書き',
    numeralsLabel: '縦書きの数字',
    numeralsTcy: '算用数字（縦中横）',
    numeralsKanji: '漢数字',
    numeralsAsis: '変換しない',
    recipientHeading: '宛先',
    recipientPostalLabel: '宛先の郵便番号',
    recipientAddressLabel: '宛先の住所',
    recipientAddressPlaceholder:
      '1行が1列になります（例）\n東京都千代田区千代田1-1\nサンプルビル2階',
    recipientNameLabel: '宛名',
    honorificLabel: '敬称',
    honorificSama: '様',
    honorificOnchu: '御中',
    honorificYuki: '行',
    honorificDono: '殿',
    honorificSensei: '先生',
    honorificNone: 'なし',
    senderHeading: '差出人',
    senderPostalLabel: '差出人の郵便番号',
    senderAddressLabel: '差出人の住所',
    senderNameLabel: '差出人の氏名',
    addressSizeLabel: '住所の文字サイズ（mm）',
    nameSizeLabel: '宛名の文字サイズ（mm）',
    senderSizeLabel: '差出人の文字サイズ（mm）',
    showFramesLabel: '郵便番号枠を印刷する',
    printButton: '印刷する',
    previewLabel: '実寸プレビュー',
    errorPostal: '郵便番号は7桁の数字で入力してください（例: 100-0001）',
    errorAddressSize: '住所の文字サイズは{min}〜{max}mmで入力してください',
    errorNameSize: '宛名の文字サイズは{min}〜{max}mmで入力してください',
    errorSenderSize: '差出人の文字サイズは{min}〜{max}mmで入力してください',

    howToHeading: '使い方',
    howToSteps: [
      '「封筒の種類」と「書き方」を選びます。縦書きでは「縦書きの数字」で住所の数字の表し方も選べます。',
      '「宛先の郵便番号」「宛先の住所」「宛名」「敬称」と、差出人の欄を入力します。実寸のプレビューで配置を確認できます。',
      '「印刷する」を押し、印刷ダイアログで用紙サイズを封筒に合わせ、倍率を100%にして印刷します。まずは普通紙で試し刷りしてください。',
    ],
    notesHeading: '注意事項',
    notes: [
      '印刷ダイアログの用紙サイズに封筒と同じ寸法を選び、倍率は100%（実際のサイズ）にしてください。封筒の給紙方法と向きはプリンターごとに異なるため、普通紙で試し刷りして位置を確かめてから封筒に印刷することをおすすめします。',
      '文字や枠の位置は一般的な封筒の配置に合わせた目安で、封筒の規格枠とは数mmずれることがあります。すでに郵便番号枠が印刷されている封筒では、「郵便番号枠を印刷する」をオフにして数字だけを印刷してください。',
      '住所の列は、長いと左へはみ出します。その場合は住所を適宜改行するか、「住所の文字サイズ（mm）」を小さくしてください。',
      '「縦書きの数字」の縦中横は2桁までを横に並べ、3桁以上は縦に並べます。ハイフンは数字の間にあるとき「ー」に置き換えます。',
      '入力した宛名・住所はブラウザ内だけで処理され、保存や送信は行われません。ページを閉じると消えます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '長形3号・洋形4号',
        description:
          '封筒の規格サイズです。長形3号は120×235mmでA4を三つ折りにして入れられ、洋形4号は105×235mmで横長の洋風封筒です。いずれも印刷時は横向きの用紙として扱います。',
      },
      {
        term: '縦中横（たてちゅうよこ）',
        description:
          '縦書きの中で、2桁程度の数字を横向きに並べる組み方です。住所の「23番」のような部分が読みやすくなります。CSSではtext-combine-uprightで指定します。',
      },
    ],
  },
  en: {
    title: 'Envelope Address Printer (Nagagata 3, Western Style)',
    description:
      'Print addresses on Japanese envelopes: Nagagata 3/4 and Western style 2/4, vertical or horizontal, with postal code boxes. Runs in your browser.',
    h1: 'Japanese Envelope Address Printer (Nagagata 3 & Western Style)',
    introHtml:
      'Pick an envelope type, enter the recipient postal code, address and name plus your own return address, and print the front at true size while checking a life-size preview. It supports Nagagata 3 and 4 and Western style 2 and 4, in vertical or horizontal writing, with a choice of how numbers appear in vertical text. What you type is processed only in your browser and is never sent to a server. To turn a contact into a phonebook card, see the <a href="/en/tools/vcard-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">vCard Generator</a>.',

    envelopeLabel: 'Envelope type',
    envNagagata3: 'Nagagata 3 (120 × 235 mm)',
    envNagagata4: 'Nagagata 4 (90 × 205 mm)',
    envYoukei2: 'Western style 2 (114 × 162 mm)',
    envYoukei4: 'Western style 4 (105 × 235 mm)',
    writingLabel: 'Writing direction',
    writingVertical: 'Vertical',
    writingHorizontal: 'Horizontal',
    numeralsLabel: 'Numbers in vertical text',
    numeralsTcy: 'Arabic digits (tate-chu-yoko)',
    numeralsKanji: 'Kanji numerals',
    numeralsAsis: 'Leave as typed',
    recipientHeading: 'Recipient',
    recipientPostalLabel: 'Recipient postal code',
    recipientAddressLabel: 'Recipient address',
    recipientAddressPlaceholder:
      'Each line becomes one column, e.g.\n1-1 Chiyoda, Chiyoda-ku, Tokyo\nSample Bldg. 2F',
    recipientNameLabel: 'Recipient name',
    honorificLabel: 'Honorific',
    honorificSama: '様 (sama)',
    honorificOnchu: '御中 (onchū, for companies)',
    honorificYuki: '行 (yuki, for reply envelopes)',
    honorificDono: '殿 (dono)',
    honorificSensei: '先生 (sensei)',
    honorificNone: 'None',
    senderHeading: 'Sender',
    senderPostalLabel: 'Sender postal code',
    senderAddressLabel: 'Sender address',
    senderNameLabel: 'Sender name',
    addressSizeLabel: 'Address font size (mm)',
    nameSizeLabel: 'Name font size (mm)',
    senderSizeLabel: 'Sender font size (mm)',
    showFramesLabel: 'Print postal code boxes',
    printButton: 'Print',
    previewLabel: 'Life-size preview',
    errorPostal: 'Enter a 7-digit postal code, e.g. 100-0001.',
    errorAddressSize: 'Address font size must be between {min} and {max} mm.',
    errorNameSize: 'Name font size must be between {min} and {max} mm.',
    errorSenderSize: 'Sender font size must be between {min} and {max} mm.',

    howToHeading: 'How to use',
    howToSteps: [
      'Choose the "Envelope type" and "Writing direction". For vertical text you can also choose how numbers look under "Numbers in vertical text".',
      'Fill in "Recipient postal code", "Recipient address", "Recipient name" and "Honorific", then the sender fields. The life-size preview shows the layout.',
      'Press "Print", set the paper size to the envelope and the scale to 100% in the print dialog. Do a test print on plain paper first.',
    ],
    notesHeading: 'Notes',
    notes: [
      'In the print dialog pick the envelope size as the paper size and set the scale to 100% (actual size). How envelopes are fed, and in which orientation, differs by printer, so print a test on plain paper before using a real envelope.',
      'Positions are a close approximation of a typical envelope layout and can be a few millimetres off the official boxes. If your envelope already has postal code boxes printed, turn off "Print postal code boxes" so only the digits are printed.',
      'Long address columns run off toward the left. Add line breaks or reduce "Address font size (mm)" if that happens.',
      'In tate-chu-yoko, up to two digits are set sideways in one cell and longer numbers are stacked vertically. A hyphen between digits becomes a long-vowel dash (ー).',
      'Names and addresses you type are processed only in your browser. Nothing is saved or sent, and it disappears when you close the page.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Nagagata 3 / Western style 4',
        description:
          'Standard Japanese envelope sizes. Nagagata 3 is 120 × 235 mm and fits A4 folded in three; Western style 4 is 105 × 235 mm, a wide Western-style envelope. Both are printed as landscape sheets.',
      },
      {
        term: 'Tate-chu-yoko',
        description:
          'A typesetting style where a short run of digits, usually two, is laid out horizontally inside vertical text, which keeps house numbers like 23 readable. In CSS it is text-combine-upright.',
      },
    ],
  },
};
