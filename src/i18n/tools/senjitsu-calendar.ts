import type { Locale } from '../../data/tools';
import type {
  OccasionKey,
  RokuyoKey,
  SenjitsuKey,
} from '../../lib/tools/senjitsu-calendar';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SenjitsuCalendarPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  /** Intl.DateTimeFormat に渡すロケール */
  dateLocale: string;

  yearLabel: string;
  monthLabel: string;
  occasionLabel: string;
  occasionNames: Record<OccasionKey, string>;
  scopeLabel: string;
  scopeMonth: string;
  scopeYear: string;
  todayLabel: string;
  /** {min} {max} を置き換える */
  errorYear: string;

  /** 十干（甲〜癸）と十二支（子〜亥）の表記 */
  stems: string[];
  branches: string[];
  /** 二十八宿（角〜軫）の表記 */
  mansionNames: string[];
  rokuyoNames: Record<RokuyoKey, string>;
  senjitsuNames: Record<SenjitsuKey, string>;
  /** カレンダーのマスに出す短い表記 */
  senjitsuShort: Record<SenjitsuKey, string>;
  /** 凡例に出す説明 */
  senjitsuDescriptions: Record<SenjitsuKey, string>;
  leapFull: string;
  /** {leap} {month} {day} を置き換える */
  lunarFull: string;

  legendHeading: string;
  /** カレンダーの色分けの説明 */
  legendHighlight: string;
  listHeadingMonth: string;
  listHeadingYear: string;
  /** {date} {eto} {rokuyo} {tags} を置き換える */
  listItem: string;
  listEmpty: string;

  lookupHeading: string;
  lookupDateLabel: string;
  /** {branch} を置き換える。節月の言い方 */
  sekkiText: string;
  /** {date} {eto} {sekki} {lunar} {rokuyo} {mansion} を置き換える */
  lookupResult: string;
  /** {tags} を置き換える */
  lookupTags: string;
  lookupNoTags: string;
  lookupOutOfRange: string;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const branches = [
  '子',
  '丑',
  '寅',
  '卯',
  '辰',
  '巳',
  '午',
  '未',
  '申',
  '酉',
  '戌',
  '亥',
];
const mansionNames = [
  '角',
  '亢',
  '氐',
  '房',
  '心',
  '尾',
  '箕',
  '斗',
  '牛',
  '女',
  '虚',
  '危',
  '室',
  '壁',
  '奎',
  '婁',
  '胃',
  '昴',
  '畢',
  '觜',
  '参',
  '井',
  '鬼',
  '柳',
  '星',
  '張',
  '翼',
  '軫',
];
const senjitsuShort: Record<SenjitsuKey, string> = {
  tensha: '天',
  ichiryumanbai: '万',
  tora: '寅',
  mi: '巳',
  tsuchinotomi: '己',
  fujoju: '不',
  kishuku: '鬼',
};

export const senjitsuCalendarContent: Record<
  Locale,
  SenjitsuCalendarPageContent
> = {
  ja: {
    title: '選日カレンダー（天赦日・一粒万倍日・寅の日・巳の日・不成就日）',
    description:
      '天赦日・一粒万倍日・寅の日・巳の日・己巳の日・不成就日を月間カレンダーと一覧で表示。結婚・開業・財布購入など用途別に吉日を絞り込めます。1900〜2100年対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '選日カレンダー（天赦日・一粒万倍日・寅の日・巳の日・不成就日）',
    introHtml:
      '年月を選ぶと、天赦日・一粒万倍日・寅の日・巳の日・己巳の日・不成就日・鬼宿日を載せた月間カレンダーを表示します。「結婚」「開業」「財布の購入」など用途を選ぶと、その用途に向く日だけを一覧にして、避けたい日は自動で外します。日の干支は通日から、節月は二十四節気（節入り）から、旧暦は朔と太陽黄経から計算しており、入力内容がサーバーに送信されることはありません。大安・仏滅などの六曜は <a href="/tools/rokuyo-calendar/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">六曜・旧暦カレンダー</a> で、印刷用の月間カレンダーは <a href="/tools/calendar-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カレンダー生成</a> で作れます。',
    dateLocale: 'ja-JP',

    yearLabel: '年（1900〜2100）',
    monthLabel: '月',
    occasionLabel: '用途',
    occasionNames: {
      all: 'すべての選日（用途を指定しない）',
      wedding: '結婚・入籍・結婚式',
      opening: '開業・開店・起業',
      wallet: '財布の購入・使い始め',
      move: '引っ越し・納車・契約',
    },
    scopeLabel: '吉日の範囲',
    scopeMonth: 'その月',
    scopeYear: 'その年全体',
    todayLabel: '今日の日付に印を付ける',
    errorYear: '{min}〜{max}の整数で年を入力してください',

    stems,
    branches,
    mansionNames,
    rokuyoNames: {
      taian: '大安',
      shakko: '赤口',
      sensho: '先勝',
      tomobiki: '友引',
      senbu: '先負',
      butsumetsu: '仏滅',
    },
    senjitsuNames: {
      tensha: '天赦日',
      ichiryumanbai: '一粒万倍日',
      tora: '寅の日',
      mi: '巳の日',
      tsuchinotomi: '己巳の日',
      fujoju: '不成就日',
      kishuku: '鬼宿日',
    },
    senjitsuShort,
    senjitsuDescriptions: {
      tensha:
        '百神が天に昇り、天がすべての罪を赦すとされる最上の吉日。春は戊寅、夏は甲午、秋は戊申、冬は甲子の日で、年に数回あります。他の凶日を打ち消すとされます。',
      ichiryumanbai:
        '一粒のもみが万倍にも実るとされる日。開業・開店・仕事始め・財布の使い始めなど、新しく始めることに向くとされます。借金や人から物を借りることは避けます。',
      tora: '「千里を行って千里を帰る」虎にちなみ、使ったお金が戻る日。金運・旅立ちに吉とされますが、結婚・出産には向きません。12日に1度です。',
      mi: '弁財天の使いとされる巳にちなむ金運の日。財布の購入・使い始め、貯金の開始に向くとされます。12日に1度です。',
      tsuchinotomi:
        '巳の日のうち干支が己巳の日。弁財天の縁日にあたり、金運が最も強い日とされます。60日に1度です。',
      fujoju:
        '何事も成就しないとされる凶日。旧暦の月と日で決まります。天赦日と重なる日は、天赦日が打ち消すとされます。',
      kishuku:
        '二十八宿のうち鬼宿にあたる日。婚礼以外は何をしても吉とされますが、婚礼だけは凶とされます。',
    },
    leapFull: '閏',
    lunarFull: '{leap}{month}月{day}日',

    legendHeading: '選日の見方',
    legendHighlight:
      'カレンダーの色付きの日は、選んだ用途に向く日（吉の印があり、避ける印がない日）です。マスの数字の下に、日の干支と選日の印が出ます。',
    listHeadingMonth: '{year}年{month}の吉日（{occasion}）',
    listHeadingYear: '{year}年の吉日（{occasion}）',
    listItem: '{date}（{eto}の日・{rokuyo}）{tags}',
    listEmpty: '条件に合う日はありません。',

    lookupHeading: '日付から選日を調べる',
    lookupDateLabel: '日付',
    sekkiText: '節月は{branch}月',
    lookupResult:
      '{date}は、日の干支が{eto}、{sekki}、旧暦{lunar}、六曜は「{rokuyo}」、二十八宿は{mansion}宿です。',
    lookupTags: '選日: {tags}。',
    lookupNoTags: '選日に当たる日ではありません。',
    lookupOutOfRange: '1900〜2100年の日付を入力してください',

    howToHeading: '使い方',
    howToSteps: [
      '「年」と「月」を選び、「用途」で結婚・開業・財布の購入などを選びます。',
      '「吉日の範囲」を「その月」か「その年全体」にすると、条件に合う日が一覧に並びます。',
      'カレンダーでは用途に合う日に色が付き、各日の干支と選日の印が出ます。印の意味は「選日の見方」で確認できます。',
    ],
    notesHeading: '注意事項',
    notes: [
      '選日は旧暦以来の暦注で、占い・迷信にあたるものです。科学的な根拠はなく、吉凶を保証するものではありません。どの程度気にするかは地域や家庭によって異なり、実際の日取りは式場・店舗・相手の都合を優先して決めてください。',
      '天赦日・一粒万倍日は二十四節気のうち節（立春・立夏・立秋・立冬など）で区切る節月、不成就日・鬼宿日は旧暦の月日を基準にします。節入りや朔が日付の境目（0時の前後10分ほど）にあたる日は、計算上の誤差で1日ずれることがあります。大切な日取りは、暦注を載せた公的な暦でも確認してください。',
      '一粒万倍日の月ごとの十二支、用途ごとの吉凶の分け方には、暦や書籍によって違いがあります。このツールは一般に広く紹介されている規則に従っており、他の暦と一部の日が食い違うことがあります。',
      '用途別の判定では、天赦日は他の凶日を打ち消すものとして扱います。旧暦の閏月は同じ番号の月として不成就日・二十八宿を数えます。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '選日（暦注）',
        description:
          '日の吉凶を表す暦の注記のうち、六曜以外のものをまとめて選日と呼びます。天赦日・一粒万倍日・不成就日・寅の日・巳の日などがあり、日の干支や旧暦、節気から決まります。',
      },
      {
        term: '干支（日の十干十二支）',
        description:
          '十干（甲乙丙丁戊己庚辛壬癸）と十二支（子丑寅卯辰巳午未申酉戌亥）を組み合わせた60通りの周期です。日にも割り当てられ、60日ごとに一巡します。年や月の干支とは別に、毎日順番に進みます。',
      },
      {
        term: '節月',
        description:
          '二十四節気を1つおきに並べた「節」（立春・啓蟄・清明など）で区切る月です。節入りの日から新しい月とみなし、寅月（立春〜）から始まります。旧暦の月とは別の区切りで、天赦日と一粒万倍日の判定に使います。',
      },
      {
        term: '二十八宿',
        description:
          '月の通り道を28に分けた星宿で、角・亢・氐…と並びます。暦では旧暦の月ごとに決まった宿を1日とし、日ごとに1つずつ進めます。そのうち鬼宿の日が鬼宿日です。',
      },
      {
        term: '己巳の日',
        description:
          '日の干支が己巳（つちのとみ）の日です。巳の日の中でも金運が強いとされ、60日に1度めぐります。',
      },
    ],
  },
  en: {
    title: 'Japanese Lucky Day Calendar (Tensha, Ichiryumanbai, Tora)',
    description:
      'Find Japanese lucky days (Tenshanichi, Ichiryumanbai, Tora, Mi) and unlucky Fujoju days. Filter by wedding, business launch or wallet. Runs in your browser.',
    h1: 'Japanese Lucky Day Calendar: Tensha, Ichiryumanbai, Tora & Mi Days',
    introHtml:
      'Pick a year and month to see a calendar of Japanese lucky and unlucky days: Tenshanichi, Ichiryumanbai, Tora no Hi, Mi no Hi, Tsuchinoto-mi, Fujoju and Kishukunichi. Choose a purpose such as a wedding, opening a business or buying a wallet, and the tool lists only the days that suit it and leaves out the ones to avoid. The day’s sexagenary (stem-branch) name is computed from the date, the solar-term month from the 24 solar terms, and the lunar date from the new moon and the sun’s position; nothing you enter is sent to a server. For Taian, Butsumetsu and the rest of the six-day rokuyo cycle, see the <a href="/en/tools/rokuyo-calendar/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Rokuyo &amp; Lunar Calendar</a>; for a printable monthly calendar, use the <a href="/en/tools/calendar-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Calendar Generator</a>.',
    dateLocale: 'en-US',

    yearLabel: 'Year (1900–2100)',
    monthLabel: 'Month',
    occasionLabel: 'Purpose',
    occasionNames: {
      all: 'All lucky days (no specific purpose)',
      wedding: 'Wedding / marriage registration',
      opening: 'Opening a business or shop',
      wallet: 'Buying or starting to use a wallet',
      move: 'Moving, car delivery, signing a contract',
    },
    scopeLabel: 'Range',
    scopeMonth: 'This month',
    scopeYear: 'Whole year',
    todayLabel: "Mark today's date",
    errorYear: 'Enter a whole-number year from {min} to {max}.',

    stems,
    branches,
    mansionNames,
    rokuyoNames: {
      taian: 'Taian (大安)',
      shakko: 'Shakko (赤口)',
      sensho: 'Sensho (先勝)',
      tomobiki: 'Tomobiki (友引)',
      senbu: 'Senbu (先負)',
      butsumetsu: 'Butsumetsu (仏滅)',
    },
    senjitsuNames: {
      tensha: 'Tenshanichi (天赦日)',
      ichiryumanbai: 'Ichiryumanbai (一粒万倍日)',
      tora: 'Tora no Hi (寅の日)',
      mi: 'Mi no Hi (巳の日)',
      tsuchinotomi: 'Tsuchinoto-mi (己巳の日)',
      fujoju: 'Fujoju (不成就日)',
      kishuku: 'Kishukunichi (鬼宿日)',
    },
    senjitsuShort,
    senjitsuDescriptions: {
      tensha:
        'The best lucky day of the year: the gods are said to ascend to heaven and forgive all sins. It falls on a fixed stem-branch day for each season (Tsuchinoe-tora in spring, Kinoe-uma in summer, Tsuchinoe-saru in autumn, Kinoe-ne in winter), a few times a year, and is said to cancel out unlucky days.',
      ichiryumanbai:
        'A day when one grain of rice is said to grow into ten thousand. Good for new beginnings such as opening a business, starting a job or using a new wallet; avoid borrowing money or things.',
      tora: 'Named after the tiger that "goes a thousand ri and returns a thousand ri", so money you spend is said to come back. Good for finances and setting out; poor for weddings and childbirth. Every 12 days.',
      mi: 'Linked to the snake, the messenger of the goddess Benzaiten, and associated with money luck. Good for buying or starting a wallet or beginning to save. Every 12 days.',
      tsuchinotomi:
        'A Mi day whose stem-branch is Tsuchinoto-mi. It is Benzaiten’s festival day and said to be the strongest day for money luck. Every 60 days.',
      fujoju:
        'An unlucky day on which nothing is said to come to fruition. It is decided by the lunar month and day. A Tenshanichi that falls on the same day is said to cancel it.',
      kishuku:
        'A day governed by the Kishuku lunar mansion. Said to be lucky for everything except weddings, for which it is unlucky.',
    },
    leapFull: 'leap ',
    lunarFull: '{leap}month {month}, day {day}',

    legendHeading: 'How to read the marks',
    legendHighlight:
      'Shaded days are suitable for the chosen purpose (at least one lucky mark and no mark to avoid). Under each date you see the day’s stem-branch name and its marks.',
    listHeadingMonth: 'Lucky days in {month} {year} ({occasion})',
    listHeadingYear: 'Lucky days in {year} ({occasion})',
    listItem: '{date}: {eto} day, {rokuyo}. {tags}',
    listEmpty: 'No days match.',

    lookupHeading: 'Look up a date',
    lookupDateLabel: 'Date',
    sekkiText: 'solar-term month {branch}',
    lookupResult:
      '{date}: the day’s stem-branch is {eto}, {sekki}, lunar {lunar}, rokuyo is {rokuyo}, lunar mansion {mansion}.',
    lookupTags: ' Marks: {tags}.',
    lookupNoTags: ' None of the special days apply.',
    lookupOutOfRange: 'Enter a date between 1900 and 2100.',

    howToHeading: 'How to use',
    howToSteps: [
      'Pick the "Year" and "Month", then choose a wedding, business launch or wallet under "Purpose".',
      'Set "Range" to "This month" or "Whole year" to list the days that match.',
      'The calendar shades matching days and shows each day’s stem-branch and marks; see "How to read the marks" for what they mean.',
    ],
    notesHeading: 'Notes',
    notes: [
      'These are old calendar annotations, closer to fortune-telling and superstition than science. They guarantee nothing, and how much weight they carry varies by region and family. Put the venue, the shop and the people involved first when you pick a real date.',
      'Tenshanichi and Ichiryumanbai follow the solar-term month, which starts on the setsu terms (Start of Spring, Start of Summer, Start of Autumn, Start of Winter and so on); Fujoju and Kishukunichi follow the lunar month and day. When a solar term or new moon falls within about ten minutes of midnight, the calculation can be off by one day. For important dates, check an official almanac too.',
      'Almanacs and books differ on the branch table for Ichiryumanbai and on which days suit which purpose. This tool follows the rules most widely published, so a few days may disagree with other calendars.',
      'For purposes, Tenshanichi is treated as cancelling any unlucky day. A lunar leap month is counted with the same number as the month before it for Fujoju and the lunar mansions.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Senjitsu (calendar annotations)',
        description:
          'Days marked as lucky or unlucky in the traditional calendar, apart from rokuyo. Examples are Tenshanichi, Ichiryumanbai, Fujoju, Tora no Hi and Mi no Hi, and they are derived from the day’s stem-branch, the lunar date or the solar terms.',
      },
      {
        term: 'Sexagenary day (kanshi)',
        description:
          'The 60-step cycle formed by pairing the ten heavenly stems with the twelve earthly branches. Every day has a name in it and the cycle repeats every 60 days, independent of the year and month names.',
      },
      {
        term: 'Solar-term month (setsugetsu)',
        description:
          'A month that starts on the setsu solar terms (every other one of the 24, such as Start of Spring and Awakening of Insects). A new month begins on the day the term arrives, starting with the tiger month from Start of Spring. It differs from the lunar month and is used for Tenshanichi and Ichiryumanbai.',
      },
      {
        term: 'Twenty-eight lunar mansions',
        description:
          'Twenty-eight star groups along the moon’s path. In the almanac each lunar month assigns a fixed mansion to its first day and advances one mansion per day. A day of the Kishuku mansion is Kishukunichi.',
      },
      {
        term: 'Tsuchinoto-mi (己巳)',
        description:
          'A day whose stem-branch is Tsuchinoto-mi. Considered the strongest of the Mi days for money luck; it comes round every 60 days.',
      },
    ],
  },
};
