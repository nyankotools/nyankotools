import type { Locale } from '../../data/tools';
import type { SeatErrorCode } from '../../lib/tools/seat-shuffler';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SeatShufflerPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  modeLabel: string;
  modeSeats: string;
  modeOrder: string;
  namesLabel: string;
  namesPlaceholder: string;
  defaultNames: string;
  /** {count} を置換して表示する */
  countInfo: string;
  rowsLabel: string;
  colsLabel: string;
  fixedLabel: string;
  fixedHint: string;
  fixedPlaceholder: string;
  pairsLabel: string;
  pairsHint: string;
  pairsPlaceholder: string;
  diagonalLabel: string;
  generate: string;
  copy: string;
  copied: string;
  copyFailed: string;
  frontLabel: string;
  emptySeat: string;
  resultHeading: string;
  seatsAria: string;
  orderAria: string;
  /** {detail} を置換して表示する。{max} などは固定値 */
  errors: Record<SeatErrorCode, string>;
  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const seatShufflerContent: Record<Locale, SeatShufflerPageContent> = {
  ja: {
    title: '席替えツール｜座席表と発表順をランダムに決める無料ツール',
    description:
      '名簿を入れるだけで席替えの座席表と発表順をランダムに作成。行×列の指定、固定席、離したい組み合わせ、空席に対応し、結果はテキストでコピーできます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '席替え・順番決めツール',
    introHtml:
      '名簿を1行に1人ずつ入力し、行数と列数を指定すると、席替えの座席表をランダムに作ります。席を動かさない人（固定席）や、近くに座らせたくない組み合わせも指定できます。「発表順」に切り替えれば、番号付きの順番決めにも使えます。グループ分けは <a href="/tools/team-splitter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">チーム分けツール</a>、ゴールの割り当てなら <a href="/tools/amidakuji-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">あみだくじ生成</a> をご利用ください。',
    modeLabel: '作るもの',
    modeSeats: '座席表（席替え）',
    modeOrder: '発表順',
    namesLabel: '名簿（1行に1人）',
    namesPlaceholder: '名前を1行に1人ずつ入力',
    defaultNames:
      '青木\n伊藤\n上田\n遠藤\n岡田\n加藤\n木村\n工藤\n小林\n斎藤\n佐藤\n鈴木',
    countInfo: '{count}人',
    rowsLabel: '行数（前から後ろ）',
    colsLabel: '列数（左から右）',
    fixedLabel: '固定席（任意）',
    fixedHint: '1行に1人、「名前@行,列」の形式。1行目が前（教卓側）です。',
    fixedPlaceholder: '例: 青木@1,1',
    pairsLabel: '離したい組み合わせ（任意）',
    pairsHint: '1行に1組、「名前,名前」の形式。',
    pairsPlaceholder: '例: 伊藤,上田',
    diagonalLabel: '斜めの席も「近い」とみなして離す',
    generate: 'シャッフルする',
    copy: '結果をコピー',
    copied: 'コピーしました。',
    copyFailed: 'コピーに失敗しました。',
    frontLabel: '前（教卓側）',
    emptySeat: '空席',
    resultHeading: '結果',
    seatsAria: '座席表',
    orderAria: '発表順',
    errors: {
      noNames: '名簿を入力してください。',
      tooManyNames: '名簿は100人までです。',
      badSize: '行数・列数は1〜10の整数で入力してください。',
      notEnoughSeats: '席が足りません。行数×列数を人数以上にしてください。',
      duplicateName:
        '同じ名前が重複しています: {detail}（区別できる名前にしてください）',
      badFixed: '固定席の形式が正しくありません: {detail}',
      unknownFixedName: '固定席の名前が名簿にありません: {detail}',
      fixedOutOfRange: '固定席の行・列が座席表の範囲外です: {detail}',
      fixedSeatTaken: '同じ席が重複して固定されています: {detail}',
      fixedNameTwice: '固定席に同じ人が複数指定されています: {detail}',
      badPair: '離したい組み合わせの形式が正しくありません: {detail}',
      unknownPairName: '離したい組み合わせの名前が名簿にありません: {detail}',
      samePair: '同じ人同士は指定できません: {detail}',
      unsatisfiable:
        '5000回試しましたが、条件を満たす配置が見つかりませんでした。固定席や離したい組み合わせを減らすか、席数を増やしてください。',
    },
    howToHeading: '使い方',
    howToSteps: [
      '「作るもの」で座席表か発表順を選び、名簿を1行に1人ずつ入力します。',
      '座席表では行数・列数を指定し、必要なら固定席と離したい組み合わせを入力します。',
      '「シャッフルする」を押します。条件を変えなくても、押すたびに結果が変わります。',
      '「結果をコピー」でテキストとして貼り付けられます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '名簿は100人まで、座席は10行×10列までです。同じ名前が複数いる場合は『田中A』『田中B』のように区別してください（発表順では同名でも使えます）。',
      '座席表の1行目が前（教卓側）です。席数が人数より多いと、空席の位置もランダムに決まります。',
      '固定席は「名前@行,列」で指定します（例: 青木@1,1）。名前に「@」を含む場合は最後の「@」で区切ります。離したい組み合わせは「名前,名前」で指定し、名前に「,」「、」は使えません。',
      '「離す」は上下左右に隣り合わないことを指します。斜めも離したいときはオプションをオンにしてください。条件を満たす配置が見つかるまで最大5000回やり直し、見つからなければエラーを表示します。',
      '乱数はブラウザの暗号用乱数（crypto.getRandomValues）で生成します。名簿はこのページ内でのみ処理され、サーバーへ送信・保存されません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '固定席',
        description:
          'シャッフルの対象にならず、指定した席に必ず座る人の席です。視力の都合で前列にする場合などに使います。',
      },
      {
        term: '離したい組み合わせ',
        description:
          '近くに座らせたくない2人の指定です。条件を満たすまでシャッフルをやり直して配置を探します。',
      },
    ],
  },
  en: {
    title: 'Seating Chart Randomizer – Shuffle Seats & Speaking Order',
    description:
      'Randomize a classroom seating chart or speaking order from a name list. Pin fixed seats and keep pairs apart. Runs in your browser; nothing is sent to a server.',
    h1: 'Seating Chart Randomizer & Order Shuffler',
    introHtml:
      'Enter one name per line, choose the number of rows and columns, and get a randomized seating chart. You can pin some people to fixed seats and keep certain pairs from sitting near each other. Switch to “Speaking order” for a numbered random order. To split people into groups, use the <a href="/en/tools/team-splitter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Team Splitter</a>; for assigning outcomes, try the <a href="/en/tools/amidakuji-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Amidakuji Generator</a>.',
    modeLabel: 'What to make',
    modeSeats: 'Seating chart',
    modeOrder: 'Speaking order',
    namesLabel: 'Names (one per line)',
    namesPlaceholder: 'Enter one name per line',
    defaultNames:
      'Alice\nBob\nCarol\nDave\nEve\nFrank\nGrace\nHeidi\nIvan\nJudy\nKen\nLaura',
    countInfo: '{count} name(s)',
    rowsLabel: 'Rows (front to back)',
    colsLabel: 'Columns (left to right)',
    fixedLabel: 'Fixed seats (optional)',
    fixedHint:
      'One per line as “Name@row,column”. Row 1 is the front of the room.',
    fixedPlaceholder: 'e.g. Alice@1,1',
    pairsLabel: 'Keep apart (optional)',
    pairsHint: 'One pair per line as “Name,Name”.',
    pairsPlaceholder: 'e.g. Bob,Carol',
    diagonalLabel: 'Also keep pairs apart diagonally',
    generate: 'Shuffle',
    copy: 'Copy result',
    copied: 'Copied.',
    copyFailed: 'Could not copy.',
    frontLabel: 'Front of the room',
    emptySeat: 'Empty',
    resultHeading: 'Result',
    seatsAria: 'Seating chart',
    orderAria: 'Speaking order',
    errors: {
      noNames: 'Enter at least one name.',
      tooManyNames: 'You can enter up to 100 names.',
      badSize: 'Rows and columns must be whole numbers from 1 to 10.',
      notEnoughSeats:
        'Not enough seats. Make rows × columns at least the number of names.',
      duplicateName:
        'Duplicate name: {detail}. Make each name unique (e.g. “Sam A”, “Sam B”).',
      badFixed: 'Invalid fixed seat format: {detail}',
      unknownFixedName: 'A fixed-seat name is not in the list: {detail}',
      fixedOutOfRange: 'A fixed seat is outside the chart: {detail}',
      fixedSeatTaken: 'Two people are pinned to the same seat: {detail}',
      fixedNameTwice: 'The same person is pinned more than once: {detail}',
      badPair: 'Invalid “keep apart” format: {detail}',
      unknownPairName: 'A “keep apart” name is not in the list: {detail}',
      samePair: 'A pair needs two different people: {detail}',
      unsatisfiable:
        'No arrangement met your conditions after 5,000 tries. Remove some fixed seats or pairs, or add more seats.',
    },
    howToHeading: 'How to use',
    howToSteps: [
      'Choose “Seating chart” or “Speaking order” and enter one name per line.',
      'For a seating chart, set the rows and columns, and add fixed seats or pairs to keep apart if needed.',
      'Press “Shuffle”. The result changes every time you press it.',
      'Use “Copy result” to paste it as text.',
    ],
    notesHeading: 'Notes',
    notes: [
      'Up to 100 names and a 10 × 10 chart. If two people share a name, tell them apart (e.g. “Sam A”, “Sam B”); duplicates are fine in speaking order.',
      'Row 1 of the chart is the front of the room. When there are more seats than people, the empty seats are placed at random too.',
      'Pin people with “Name@row,column” (e.g. Alice@1,1); if a name contains “@”, the last one is the separator. Pairs use “Name,Name”, so names cannot contain commas.',
      '“Apart” means not directly next to each other (left, right, front or back). Turn on the diagonal option to include diagonals. The tool retries up to 5,000 times and shows an error if no arrangement works.',
      'Randomness comes from the browser’s crypto.getRandomValues. Your list is processed only on this page and is never sent or stored.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Fixed seat',
        description:
          'A seat that a person always gets, excluded from the shuffle. Useful, for example, for someone who needs to sit at the front.',
      },
      {
        term: 'Keep apart',
        description:
          'A pair who should not sit near each other. The tool reshuffles until the pair is separated.',
      },
    ],
  },
};
