import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

/** 結果表示の文言 */
export interface KigakuResultFormat {
  /** {m} {d} */
  dateFormat: string;
  /** {y} {m} {d}（立春の日付の案内） */
  risshunInfo: string;
  /** {y} {sy} {m} {d}（立春前で前年扱いのとき） */
  beforeRisshunNote: string;
  /** 立春当日のときの時刻に関する注意 */
  risshunDayNote: string;
  /** 節入り当日のときの時刻に関する注意 */
  setsuDayNote: string;
  /** {date}（月が始まる節入りの日） */
  monthStarts: string;
  /** 1月上旬で、その年の最初の節入り前のとき */
  monthStartsPrevYear: string;
  /** {star} {element} */
  starWithElement: string;
}

export interface KyuseiKigakuPageContent {
  resultFormat: KigakuResultFormat;
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  birthLabel: string;
  birthYearAriaLabel: string;
  birthMonthAriaLabel: string;
  birthDayAriaLabel: string;
  yearUnit: string;
  monthUnit: string;
  dayUnit: string;
  yearPlaceholder: string;
  monthPlaceholder: string;
  dayPlaceholder: string;
  errorInvalidDate: string;
  honmeiLabel: string;
  honmeiDescriptionLabel: string;
  getsumeiLabel: string;
  getsumeiMonthLabel: string;
  judgeLabel: string;
  /** 九星の名前（一白水星〜九紫火星） */
  starNames: string[];
  /** 九星ごとの性格・特徴の説明 */
  starDescriptions: string[];
  /** 五行の表示名 */
  elementNames: Record<'wood' | 'fire' | 'earth' | 'metal' | 'water', string>;
  /** 月命星の月の名前（寅月〜丑月。インデックス0=寅月） */
  monthNames: string[];
  tableHeading: string;
  tableIntro: string;
  tableStarHeader: string;
  tableYearsHeader: string;
  /** 早見表の九星の年の範囲 */
  tableFromYear: number;
  tableToYear: number;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const kyuseiKigakuContent: Record<Locale, KyuseiKigakuPageContent> = {
  ja: {
    resultFormat: {
      dateFormat: '{m}月{d}日',
      risshunInfo: '{y}年の立春は{m}月{d}日です。',
      beforeRisshunNote:
        '{y}年の立春（{m}月{d}日）より前の生まれなので、前年（{sy}年）の本命星として判定しています。',
      risshunDayNote:
        '立春の当日です。この日から新しい年として判定しています。厳密には立春の入りの時刻より前の生まれは前年の星になるため、時刻まで確認したい場合は暦で調べてください。',
      setsuDayNote:
        '節入りの当日です。この日から新しい月として判定しています。厳密には節入りの時刻より前の生まれは前の月の星になります。',
      monthStarts: '{date}の節入りから',
      monthStartsPrevYear: '前年12月の節入りから',
      starWithElement: '{star}（{element}）',
    },
    title: '九星気学の本命星・月命星を調べる｜生年月日から早見・早見表付き',
    description:
      '生年月日を入力するだけで、九星気学の本命星（一白〜九紫）と月命星・五行・性格の目安を調べられます。立春基準の判定と早見表付き。占い・娯楽用で、データはブラウザ内で処理されます。',
    h1: '九星気学の本命星・月命星 早見ツール',
    introHtml:
      '生年月日から、九星気学の本命星（一白水星〜九紫火星）と月命星、五行、性格の目安を調べます。九星の年は立春（2月3日〜5日ごろ）で切り替わるため、1月〜節分に生まれた方は前年の星になります。結果は占い・娯楽としての目安です。入力した生年月日はブラウザ内でのみ処理され、サーバーには送信されません。干支や星座も知りたい場合は <a href="/tools/birthday-info/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">誕生日情報（干支・星座・誕生石）</a> もご利用ください。',
    birthLabel: '生年月日（西暦）',
    birthYearAriaLabel: '生年（西暦）',
    birthMonthAriaLabel: '生まれ月',
    birthDayAriaLabel: '生まれた日',
    yearUnit: '年',
    monthUnit: '月',
    dayUnit: '日',
    yearPlaceholder: '1990',
    monthPlaceholder: '6',
    dayPlaceholder: '15',
    errorInvalidDate:
      '調べられませんでした（西暦1900年〜2100年の実在する日付を入力してください）',
    honmeiLabel: '本命星',
    honmeiDescriptionLabel: '本命星の特徴（目安）',
    getsumeiLabel: '月命星',
    getsumeiMonthLabel: '月命星の月',
    judgeLabel: '立春・節入りの判定',
    starNames: [
      '一白水星',
      '二黒土星',
      '三碧木星',
      '四緑木星',
      '五黄土星',
      '六白金星',
      '七赤金星',
      '八白土星',
      '九紫火星',
    ],
    starDescriptions: [
      '柔軟で協調性があり、忍耐強いタイプとされます。人の気持ちを汲み取るのが得意で、状況に合わせて形を変える水のような性質です。',
      '勤勉で面倒見がよく、地道に努力するタイプとされます。縁の下の力持ちとして周りを支える、大地のような性質です。',
      '明るく行動的で、新しいことに挑戦するタイプとされます。ひらめきと勢いがあり、芽吹く若木のような性質です。',
      '穏やかで誠実、信用を大切にするタイプとされます。人付き合いや調整が得意で、風のように広く人とつながる性質です。',
      '存在感と統率力があり、情に厚いタイプとされます。強い信念で周りを引っ張る、九星の中心にあたる星です。',
      '責任感が強く、気品のあるタイプとされます。正義感があり、人の上に立つことが多い、天のような性質です。',
      '社交的で愛嬌があり、楽しむ力に長けたタイプとされます。話し上手で、人を和ませる性質です。',
      '粘り強く堅実で、変化に強いタイプとされます。蓄えること・守ることが得意で、山のようにどっしりした性質です。',
      '直感とセンスに優れ、情熱的なタイプとされます。華やかで探究心が強く、火のように人を惹きつける性質です。',
    ],
    elementNames: {
      wood: '木',
      fire: '火',
      earth: '土',
      metal: '金',
      water: '水',
    },
    monthNames: [
      '寅月（2月ごろ）',
      '卯月（3月ごろ）',
      '辰月（4月ごろ）',
      '巳月（5月ごろ）',
      '午月（6月ごろ）',
      '未月（7月ごろ）',
      '申月（8月ごろ）',
      '酉月（9月ごろ）',
      '戌月（10月ごろ）',
      '亥月（11月ごろ）',
      '子月（12月ごろ）',
      '丑月（1月ごろ）',
    ],
    tableHeading: '本命星の早見表（年→星）',
    tableIntro:
      '九星の年（立春から翌年の節分まで）ごとの本命星です。1月1日〜節分に生まれた方は、前年の欄を見てください。',
    tableStarHeader: '本命星',
    tableYearsHeader: '該当する年（立春〜翌年の節分）',
    tableFromYear: 1950,
    tableToYear: 2030,
    notesHeading: '注意事項',
    notes: [
      '九星気学の結果は占い・娯楽を目的とした目安です。人生の重要な判断は、ご自身の責任で行ってください。',
      '九星の年は立春で切り替わります。立春は年により2月3日〜5日と変わるため、1月1日から節分（立春の前日）までに生まれた方は前年の本命星になります。',
      'このツールは日付単位で判定し、立春や節入りの当日はその日から新しい年・月として扱います。立春・節入りの当日に生まれた方は、時刻によって前の年・月の星になる場合があります。',
      '月命星は節入り（小寒・立春・啓蟄…）の日から新しい月に切り替わり、寅月（立春〜）を最初の月として本命星ごとの規則で求めています。流派によって月の区切りや計算が異なる場合があります。',
      '立春・節入りの日付は太陽黄経から日本標準時で計算しており、対応範囲は西暦1900年〜2100年です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '本命星（ほんめいせい）',
        description:
          '生まれた年（立春基準）で決まる、その人の基本となる九星です。一白水星から九紫火星までの9種類があり、九星は1年ごとに1つずつ戻りながら9年で一巡します。',
      },
      {
        term: '月命星（げつめいせい）',
        description:
          '生まれた月（節入り基準）で決まる九星です。本命星とあわせて見ることで、内面や気質の傾向をより細かく見るとされます。月は節入りの日から切り替わり、年の九星のグループによって寅月の星が決まります。',
      },
      {
        term: '節入り・立春',
        description:
          '二十四節気のうち、月の始まりにあたる節（小寒・立春・啓蟄など）に太陽が入る日を節入りと呼びます。立春は寅月の最初の節で、九星・干支の占いでは新しい年の始まりとされます。',
      },
      {
        term: '五行（ごぎょう）',
        description:
          '万物を木・火・土・金・水の5つの性質に分ける考え方です。九星にはそれぞれ五行が割り当てられ（例：一白は水、九紫は火）、二黒・五黄・八白はいずれも土です。',
      },
    ],
  },
  en: {
    resultFormat: {
      dateFormat: '{m}/{d}',
      risshunInfo: 'Risshun in {y} falls on {m}/{d}.',
      beforeRisshunNote:
        'This date is before Risshun in {y} ({m}/{d}), so it is counted in the previous Kyusei year ({sy}).',
      risshunDayNote:
        'This is Risshun itself. The tool starts the new year on this day. Strictly, a birth before the exact moment of Risshun belongs to the previous year, so check the time against a calendar if it matters to you.',
      setsuDayNote:
        'This is the day a new solar month begins. The tool switches months on this day. Strictly, a birth before the exact time belongs to the previous month.',
      monthStarts: 'Starts on {date} (solar term)',
      monthStartsPrevYear: 'Started at the solar term in December last year',
      starWithElement: '{star} ({element})',
    },
    title: 'Kyusei Kigaku: Nine Star Ki Calculator (Year & Month Star)',
    description:
      'Find your Nine Star Ki (Kyusei Kigaku) year star and month star from your birth date, with element and traits. Year changes at Risshun. Runs in your browser.',
    h1: 'Nine Star Ki (Kyusei Kigaku) Calculator: Year Star & Month Star',
    introHtml:
      'Enter a date of birth to look up your Nine Star Ki year star (1 White Water to 9 Purple Fire), month star, element, and a short description of the type. The Nine Star Ki year changes at Risshun (the start of spring, February 3-5), so people born from January 1 to the day before Risshun belong to the previous year\'s star. Results are for fortune-telling and entertainment only. Your date is processed only in your browser and is never sent to a server. For the Chinese zodiac and star sign too, see <a href="/en/tools/birthday-info/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Birthday Info</a>.',
    birthLabel: 'Date of birth',
    birthYearAriaLabel: 'Birth year',
    birthMonthAriaLabel: 'Birth month',
    birthDayAriaLabel: 'Birth day',
    yearUnit: '-',
    monthUnit: '-',
    dayUnit: '',
    yearPlaceholder: '1990',
    monthPlaceholder: '6',
    dayPlaceholder: '15',
    errorInvalidDate:
      'Could not look this up (enter a date that exists, between year 1900 and 2100).',
    honmeiLabel: 'Year star (Honmei-sei)',
    honmeiDescriptionLabel: 'About this star (a rough guide)',
    getsumeiLabel: 'Month star (Getsumei-sei)',
    getsumeiMonthLabel: 'Month used for the month star',
    judgeLabel: 'Risshun and month start',
    starNames: [
      '1 White Water',
      '2 Black Earth',
      '3 Jade Wood',
      '4 Green Wood',
      '5 Yellow Earth',
      '6 White Metal',
      '7 Red Metal',
      '8 White Earth',
      '9 Purple Fire',
    ],
    starDescriptions: [
      'Said to be flexible, cooperative and patient. Good at sensing how others feel and adapting to the situation, like water.',
      'Said to be diligent, caring and steady. A reliable supporter behind the scenes, like the earth.',
      'Said to be bright, active and eager to try new things. Quick with ideas and momentum, like a young tree sprouting.',
      'Said to be gentle, sincere and trustworthy. Good with people and at coordinating, connecting widely like the wind.',
      'Said to have presence, leadership and warmth. The center star of the nine, pulling others along with strong conviction.',
      'Said to be responsible and dignified, with a strong sense of justice. Often ends up in a leading role, like the heavens.',
      'Said to be sociable, charming and good at enjoying life. A good talker who puts people at ease.',
      'Said to be persistent, steady and resilient to change. Good at saving and protecting, solid like a mountain.',
      'Said to be intuitive, stylish and passionate. Bright, curious and eye-catching, like fire.',
    ],
    elementNames: {
      wood: 'Wood',
      fire: 'Fire',
      earth: 'Earth',
      metal: 'Metal',
      water: 'Water',
    },
    monthNames: [
      'Tiger month (about Feb)',
      'Rabbit month (about Mar)',
      'Dragon month (about Apr)',
      'Snake month (about May)',
      'Horse month (about Jun)',
      'Goat month (about Jul)',
      'Monkey month (about Aug)',
      'Rooster month (about Sep)',
      'Dog month (about Oct)',
      'Pig month (about Nov)',
      'Rat month (about Dec)',
      'Ox month (about Jan)',
    ],
    tableHeading: 'Year star chart (year to star)',
    tableIntro:
      'The year star for each Kyusei year (from Risshun to the day before the next Risshun). If you were born between January 1 and the day before Risshun, look at the previous year.',
    tableStarHeader: 'Year star',
    tableYearsHeader: 'Years (Risshun to the day before next Risshun)',
    tableFromYear: 1950,
    tableToYear: 2030,
    notesHeading: 'Notes',
    notes: [
      'Nine Star Ki results are for fortune-telling and entertainment only. Make important life decisions on your own judgment.',
      "The Kyusei year changes at Risshun, which falls on February 3, 4 or 5 depending on the year. Anyone born from January 1 to the day before Risshun gets the previous year's star.",
      'The tool works by date: on the day of Risshun or another solar-term start, the new year or month is counted from that day. If you were born on such a day, the exact time may put you in the previous year or month.',
      'The month star changes on the first day of each solar month (Shokan, Risshun, Keichitsu and so on), starting from the Tiger month at Risshun, using the standard rule by year star. Some schools divide or calculate months differently.',
      "Risshun and the solar-term days are calculated from the Sun's ecliptic longitude in Japan Standard Time. The supported range is the years 1900 to 2100.",
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Year star (Honmei-sei)',
        description:
          'Your basic Nine Star Ki number, set by your birth year counted from Risshun. There are nine stars, from 1 White Water to 9 Purple Fire, and the star goes down by one each year, completing a cycle in nine years.',
      },
      {
        term: 'Month star (Getsumei-sei)',
        description:
          'The star for your birth month, counted from the solar-term start of each month. It is read together with the year star for a finer picture of temperament. The star of the Tiger month depends on which group your year star belongs to.',
      },
      {
        term: 'Solar term start (Setsu-iri) and Risshun',
        description:
          'Of the 24 solar terms, the ones that begin a month (Shokan, Risshun, Keichitsu and so on) are called "setsu", and the day the Sun enters one is its start. Risshun begins the Tiger month and marks the new year in Nine Star Ki and zodiac fortune-telling.',
      },
      {
        term: 'Five elements (Gogyo)',
        description:
          'A way of sorting everything into Wood, Fire, Earth, Metal and Water. Each of the nine stars has an element (for example, 1 is Water and 9 is Fire), and 2, 5 and 8 are all Earth.',
      },
    ],
  },
};
