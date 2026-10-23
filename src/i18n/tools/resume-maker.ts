import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface ResumeMakerPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;

  privacyNote: string;
  basicHeading: string;
  eraLabel: string;
  eraWareki: string;
  eraSeireki: string;
  dateLabel: string;
  nameKanaLabel: string;
  nameLabel: string;
  birthLabel: string;
  genderLabel: string;
  genderNone: string;
  genderMale: string;
  genderFemale: string;
  postalLabel: string;
  addressKanaLabel: string;
  addressLabel: string;
  phoneLabel: string;
  emailLabel: string;
  photoHeading: string;
  photoHint: string;
  photoRemoveButton: string;
  photoErrorFile: string;
  historyHeading: string;
  historyHint: string;
  educationLabel: string;
  workLabel: string;
  licensesLabel: string;
  licensesHint: string;
  motivationLabel: string;
  wishesLabel: string;
  saveHeading: string;
  saveHint: string;
  saveButton: string;
  clearButton: string;
  savedMessage: string;
  savedFailMessage: string;
  clearedMessage: string;
  loadedMessage: string;
  printButton: string;
  previewLabel: string;
  /** {line} を置き換える */
  issueEntryDate: string;
  /** {limit} {actual} を置き換える */
  issueHistory: string;
  issueLicenses: string;
  issueMotivation: string;
  issueWishes: string;

  /** 書類に印字する見出し（履歴書は日本語の書類なので両言語とも日本語） */
  sheetTitle: string;
  sheetDate: string;
  sheetKana: string;
  sheetName: string;
  sheetBirth: string;
  sheetAge: string;
  sheetAddressKana: string;
  sheetAddress: string;
  sheetPhone: string;
  sheetEmail: string;
  sheetPhoto: string;
  sheetYear: string;
  sheetMonth: string;
  sheetHistory: string;
  sheetEducation: string;
  sheetWork: string;
  sheetEnd: string;
  sheetLicenses: string;
  sheetMotivation: string;
  sheetWishes: string;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const sheet = {
  sheetTitle: '履 歴 書',
  sheetDate: '{date}現在',
  sheetKana: 'ふりがな',
  sheetName: '氏 名',
  sheetBirth: '生年月日',
  sheetAge: '（満{age}歳）',
  sheetAddressKana: 'ふりがな',
  sheetAddress: '現住所',
  sheetPhone: '電話',
  sheetEmail: 'メール',
  sheetPhoto: '写真をはる位置\n（縦40mm×横30mm）',
  sheetYear: '年',
  sheetMonth: '月',
  sheetHistory: '学歴・職歴',
  sheetEducation: '学 歴',
  sheetWork: '職 歴',
  sheetEnd: '以上',
  sheetLicenses: '免許・資格',
  sheetMotivation: '志望の動機、特技、好きな学科、アピールポイントなど',
  sheetWishes:
    '本人希望記入欄（特に給料・職種・勤務時間・勤務地・その他についての希望などがあれば記入）',
};

export const resumeMakerContent: Record<Locale, ResumeMakerPageContent> = {
  ja: {
    title: '履歴書作成（印刷用・JIS様式風・証明写真つき）',
    description:
      '氏名・住所・学歴職歴・免許資格・志望動機・本人希望を入力して、JIS様式風の履歴書をA4で印刷できます。和暦・西暦の切り替え、証明写真の読み込み、ブラウザへの保存に対応。入力内容はブラウザ内で処理され、サーバーには送信されません。',
    h1: '履歴書作成（A4印刷・JIS様式風）',
    introHtml:
      '氏名・住所・学歴・職歴・免許・資格・志望動機・本人希望を入力すると、JIS様式風の履歴書（A4・2ページ）が実寸のプレビューに組み上がり、そのまま印刷できます。学歴・職歴は「2015-04 ○○高等学校 入学」のように1行ずつ書くだけで、和暦・西暦の年月欄に整います。証明写真は <a href="/tools/id-photo-maker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">証明写真メーカー</a> で作った画像をそのまま読み込めます。入力内容はブラウザ内だけで処理され、サーバーには送信されません。',

    privacyNote:
      '個人情報を扱うツールです。入力内容と写真はこの端末のブラウザの中だけで処理され、外部には送信されません。ブラウザへの保存は下の「ブラウザに保存」を押したときだけ行われます（写真は保存されません）。共有のパソコンでは使用後に「保存データを消去」を押してください。',
    basicHeading: '基本情報',
    eraLabel: '年の表記',
    eraWareki: '和暦（令和・平成）',
    eraSeireki: '西暦',
    dateLabel: '提出日',
    nameKanaLabel: '氏名のふりがな',
    nameLabel: '氏名',
    birthLabel: '生年月日',
    genderLabel: '性別（任意）',
    genderNone: '記入しない',
    genderMale: '男',
    genderFemale: '女',
    postalLabel: '郵便番号',
    addressKanaLabel: '住所のふりがな',
    addressLabel: '現住所',
    phoneLabel: '電話番号',
    emailLabel: 'メールアドレス',
    photoHeading: '証明写真',
    photoHint:
      '縦4:横3の写真を選ぶか、ここにドラッグ＆ドロップします（証明写真メーカーの出力画像が使えます）。写真は保存されません。',
    photoRemoveButton: '写真を外す',
    photoErrorFile:
      '画像として読み込めませんでした。別のファイルを選んでください。',
    historyHeading: '学歴・職歴・免許・資格',
    historyHint:
      '1行に1項目、行頭に「年-月」を書きます（例: 2015-04 ○○高等学校 入学）。「2015年4月」「令和元年5月」の書き方も読めます。年月のない行は、そのまま内容欄に出ます。',
    educationLabel: '学歴',
    workLabel: '職歴',
    licensesLabel: '免許・資格',
    licensesHint: '例: 2018-06 普通自動車第一種運転免許 取得',
    motivationLabel: '志望動機',
    wishesLabel: '本人希望記入欄',
    saveHeading: 'ブラウザへの保存',
    saveHint:
      '保存先はこの端末のこのブラウザだけです。サーバーには送信されません。写真は保存されないので、開き直したら選び直してください。',
    saveButton: 'ブラウザに保存',
    clearButton: '保存データを消去',
    savedMessage: 'この端末のブラウザに保存しました。',
    savedFailMessage:
      '保存できませんでした。ブラウザの設定で保存が禁止されている可能性があります。',
    clearedMessage: '保存データを消去しました。',
    loadedMessage: '保存してあった内容を読み込みました。',
    printButton: '印刷する',
    previewLabel: '実寸プレビュー（A4・2ページ）',
    issueEntryDate: '日付として読めない行があります: {line}',
    issueHistory:
      '学歴・職歴が欄に収まりません（{limit}行まで、現在{actual}行）。項目を減らすか、短くしてください。',
    issueLicenses:
      '免許・資格が欄に収まりません（{limit}行まで、現在{actual}行）。',
    issueMotivation:
      '志望動機が欄に収まりません（{limit}行まで、現在{actual}行）。',
    issueWishes:
      '本人希望が欄に収まりません（{limit}行まで、現在{actual}行）。',

    ...sheet,

    howToHeading: '使い方',
    howToSteps: [
      '「提出日」「氏名」「生年月日」「現住所」などの基本情報を入力し、「証明写真」を選びます。',
      '「学歴」「職歴」「免許・資格」を、1行に1項目ずつ「2015-04 ○○高等学校 入学」の形で書きます。「志望動機」「本人希望記入欄」も入力します。',
      '実寸のプレビューで2ページの収まりを確認し、「ブラウザに保存」で次回用に残せます。「印刷する」で用紙をA4、倍率を100%にして印刷します。',
    ],
    notesHeading: '注意事項',
    notes: [
      'レイアウトはJIS規格様式を参考にした独自の配置で、市販の履歴書用紙とは寸法が一致しません。応募先が指定する様式や、手書きを求められる場合はそちらに従ってください。',
      '学歴・職歴は最大21行、免許・資格は8行、志望動機は11行、本人希望は8行まで印刷できます。長い行は自動で折り返し、収まらないと印刷ボタンが無効になります。',
      '印刷ダイアログで用紙サイズをA4、倍率を100%（実際のサイズ）にし、ヘッダーとフッターの印刷を切ってください。まず普通紙で確認することをおすすめします。',
      '年の表記を和暦にすると、月だけが分かる場合は月の中ごろで元号を判定します。改元の月（1989年1月、2019年4月・5月など）は、結果を確かめてください。',
      '「ブラウザに保存」は、この端末のこのブラウザのlocalStorageだけに書き込みます。写真は容量が大きいため保存しません。共有の端末では使用後に「保存データを消去」を押してください。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'JIS規格の履歴書',
        description:
          '日本産業規格（旧JIS）に基づく様式として長く使われてきた履歴書の書式です。近年は厚生労働省が性別欄を任意にした様式例を示しており、このツールも性別を記入しない選択ができます。',
      },
      {
        term: '本人希望記入欄',
        description:
          '給料・職種・勤務時間・勤務地などの希望を書く欄です。特に希望がなければ「貴社の規定に従います」と書くのが一般的です。',
      },
    ],
  },
  en: {
    title: 'Japanese Resume Maker (Rirekisho, A4 Print)',
    description:
      'Make a Japanese-style resume (rirekisho) in a JIS-like layout and print it on A4. Add an ID photo and save a draft in this browser only. Nothing is uploaded.',
    h1: 'Japanese Resume (Rirekisho) Maker for A4 Printing',
    introHtml:
      'Fill in your name, address, education, work history, licenses, motivation and preferences, and a JIS-style Japanese resume (two A4 pages) builds itself in a life-size preview, ready to print. Write each history entry on one line like "2015-04 Sample High School, enrolled" and the year and month columns are filled in for you, in Japanese era years or Western years. For the photo, load the image you made with the <a href="/en/tools/id-photo-maker/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">ID Photo Maker</a>. Everything is processed in your browser and nothing is sent to a server.',

    privacyNote:
      'This tool handles personal data. What you type and your photo are processed only in this browser and are never sent anywhere. Your entries are stored on this device only when you press "Save in browser" below (the photo is never stored). On a shared computer, press "Delete saved data" when you are done.',
    basicHeading: 'Basic information',
    eraLabel: 'Year style',
    eraWareki: 'Japanese era (Reiwa, Heisei)',
    eraSeireki: 'Western year',
    dateLabel: 'Date',
    nameKanaLabel: 'Name in furigana',
    nameLabel: 'Name',
    birthLabel: 'Date of birth',
    genderLabel: 'Gender (optional)',
    genderNone: 'Leave blank',
    genderMale: 'Male (男)',
    genderFemale: 'Female (女)',
    postalLabel: 'Postal code',
    addressKanaLabel: 'Address in furigana',
    addressLabel: 'Current address',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    photoHeading: 'ID photo',
    photoHint:
      'Choose a portrait photo (4:3 tall) or drop it here. An image made with the ID Photo Maker works. The photo is not stored.',
    photoRemoveButton: 'Remove photo',
    photoErrorFile:
      'That file could not be read as an image. Choose another one.',
    historyHeading: 'Education, work history, licenses',
    historyHint:
      'One entry per line, starting with "year-month" (e.g. 2015-04 Sample High School, enrolled). "2015年4月" and "令和元年5月" also work. A line without a date goes straight into the content column.',
    educationLabel: 'Education',
    workLabel: 'Work history',
    licensesLabel: 'Licenses and certificates',
    licensesHint: 'e.g. 2018-06 Standard driver license (class 1)',
    motivationLabel: 'Motivation',
    wishesLabel: 'Requests',
    saveHeading: 'Saving in this browser',
    saveHint:
      'Data is stored only in this browser on this device and never sent to a server. The photo is not stored, so choose it again after reopening.',
    saveButton: 'Save in browser',
    clearButton: 'Delete saved data',
    savedMessage: 'Saved in this browser.',
    savedFailMessage:
      'Could not save. Your browser settings may block local storage.',
    clearedMessage: 'Saved data deleted.',
    loadedMessage: 'Loaded your saved entries.',
    printButton: 'Print',
    previewLabel: 'Life-size preview (A4, 2 pages)',
    issueEntryDate: 'This line has a date that cannot be read: {line}',
    issueHistory:
      'The education and work history do not fit ({limit} rows max, now {actual}). Remove or shorten some entries.',
    issueLicenses: 'The licenses do not fit ({limit} rows max, now {actual}).',
    issueMotivation:
      'The motivation text does not fit ({limit} rows max, now {actual}).',
    issueWishes:
      'The requests text does not fit ({limit} rows max, now {actual}).',

    ...sheet,

    howToHeading: 'How to use',
    howToSteps: [
      'Fill in basic details such as "Date", "Name", "Date of birth" and "Current address", then choose an "ID photo".',
      'Write "Education", "Work history" and "Licenses and certificates" one entry per line, like "2015-04 Sample High School, enrolled". Then fill in "Motivation" and "Requests".',
      'Check the two pages in the life-size preview, and use "Save in browser" to keep a draft for next time. Press "Print", set the paper to A4 and the scale to 100%.',
    ],
    notesHeading: 'Notes',
    notes: [
      'The layout is an original arrangement modeled on the JIS-style form and does not match store-bought rirekisho paper exactly. If an employer asks for its own form, or for a handwritten one, follow that.',
      'You can print up to 21 rows of education and work history, 8 rows of licenses, 11 lines of motivation and 8 lines of requests. Long lines wrap automatically, and Print is disabled when something does not fit.',
      'In the print dialog set the paper to A4, the scale to 100% (actual size) and turn off headers and footers. Test on plain paper first.',
      'With Japanese era years, an entry that has only a month is judged by the middle of that month. Check the result around era changes (January 1989, April and May 2019).',
      '"Save in browser" writes only to this browser\'s local storage on this device. The photo is too large to store. On a shared computer, press "Delete saved data" afterwards.',
      'The printed resume itself is in Japanese regardless of the page language, since it is meant for Japanese employers.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Rirekisho (履歴書)',
        description:
          'The standard Japanese resume form. It lists personal details, a photo, education, work history, licenses, motivation and requests in a fixed layout, and is often handwritten or printed on a set form.',
      },
      {
        term: 'Wareki (和暦)',
        description:
          'Japanese era years such as Reiwa (since May 2019) and Heisei (1989 to April 2019). Many resumes use them for the year columns, but Western years are also accepted.',
      },
    ],
  },
};
