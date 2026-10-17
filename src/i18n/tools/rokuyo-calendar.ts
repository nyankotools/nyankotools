import type { Locale } from '../../data/tools';
import type { RokuyoKey, SolarTermKey } from '../../lib/tools/rokuyo-calendar';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface RokuyoCalendarPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  /** Intl.DateTimeFormat に渡すロケール */
  dateLocale: string;

  yearLabel: string;
  monthLabel: string;
  weekStartLabel: string;
  weekStartSun: string;
  weekStartMon: string;
  holidaysLabel: string;
  /** 祝日表示の初期値（日本語は ON、英語は OFF） */
  holidaysDefault: boolean;
  lunarLabel: string;
  highlightLabel: string;
  highlightNone: string;
  todayLabel: string;
  /** {min} {max} を置き換える */
  errorYear: string;

  /** 一覧・結果文に使う六曜の名前 */
  rokuyoNames: Record<RokuyoKey, string>;
  /** カレンダーのマスに入れる短い六曜名 */
  rokuyoShort: Record<RokuyoKey, string>;
  solarTermNames: Record<SolarTermKey, string>;
  /** 閏月の前に付ける語（結果文用 / マス用） */
  leapFull: string;
  leapShort: string;
  /** {leap} {month} {day} を置き換える */
  lunarFull: string;
  listRokuyoHeading: string;
  listTermsHeading: string;
  /** {date} {name} を置き換える */
  listTermItem: string;
  /** {year} {date} を置き換える */
  newYearText: string;

  lookupHeading: string;
  lookupDateLabel: string;
  /** {date} {lunar} {rokuyo} を置き換える */
  lookupResult: string;
  /** {term} を置き換える。二十四節気の日のとき結果文に足す */
  lookupTermSuffix: string;
  lookupOutOfRange: string;

  howToHeading: string;
  howToSteps: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const rokuyoCalendarContent: Record<Locale, RokuyoCalendarPageContent> =
  {
    ja: {
      title: '六曜・旧暦カレンダー（大安・仏滅・二十四節気）',
      description:
        '月間カレンダーに六曜（大安・友引・先勝・先負・仏滅・赤口）と旧暦の日付、二十四節気、祝日を表示。日付を入れるだけで六曜と旧暦も調べられます。1900〜2100年対応。データはブラウザ内で処理され、サーバーには送信されません。',
      h1: '六曜・旧暦カレンダー（大安・仏滅・二十四節気）',
      introHtml:
        '年月を選ぶと、各日の六曜（大安・友引・先勝・先負・仏滅・赤口）と旧暦の日付を載せた月間カレンダーを表示します。二十四節気と日本の祝日も確認でき、結婚式・納車・引っ越しなど日取りを決めるときに大安の日を拾い出せます。旧暦は朔（新月）と太陽の動きから計算しており、入力内容がサーバーに送信されることはありません。祝日・週番号つきの印刷用カレンダーは <a href="/tools/calendar-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">カレンダー生成</a> をご利用ください。',
      dateLocale: 'ja-JP',

      yearLabel: '年（1900〜2100）',
      monthLabel: '月',
      weekStartLabel: '週の始まり',
      weekStartSun: '日曜日',
      weekStartMon: '月曜日',
      holidaysLabel: '日本の祝日・振替休日を表示する',
      holidaysDefault: true,
      lunarLabel: '旧暦の日付を表示する',
      highlightLabel: '色を付ける六曜',
      highlightNone: 'なし',
      todayLabel: '今日の日付に印を付ける',
      errorYear: '{min}〜{max}の整数で年を入力してください',

      rokuyoNames: {
        taian: '大安',
        shakko: '赤口',
        sensho: '先勝',
        tomobiki: '友引',
        senbu: '先負',
        butsumetsu: '仏滅',
      },
      rokuyoShort: {
        taian: '大安',
        shakko: '赤口',
        sensho: '先勝',
        tomobiki: '友引',
        senbu: '先負',
        butsumetsu: '仏滅',
      },
      solarTermNames: {
        shunbun: '春分',
        seimei: '清明',
        kokuu: '穀雨',
        rikka: '立夏',
        shouman: '小満',
        boushu: '芒種',
        geshi: '夏至',
        shousho: '小暑',
        taisho: '大暑',
        risshuu: '立秋',
        shosho: '処暑',
        hakuro: '白露',
        shuubun: '秋分',
        kanro: '寒露',
        soukou: '霜降',
        rittou: '立冬',
        shousetsu: '小雪',
        taisetsu: '大雪',
        touji: '冬至',
        shoukan: '小寒',
        daikan: '大寒',
        risshun: '立春',
        usui: '雨水',
        keichitsu: '啓蟄',
      },
      leapFull: '閏',
      leapShort: '閏',
      lunarFull: '{leap}{month}月{day}日',
      listRokuyoHeading: '六曜ごとの日',
      listTermsHeading: '二十四節気',
      listTermItem: '{date} {name}',
      newYearText: '{year}年の旧正月（旧暦1月1日）は {date} です。',

      lookupHeading: '日付から六曜・旧暦を調べる',
      lookupDateLabel: '日付',
      lookupResult: '{date}は、旧暦{lunar}、六曜は「{rokuyo}」です。',
      lookupTermSuffix: '（この日は{term}）',
      lookupOutOfRange: '1900〜2100年の日付を入力してください',

      howToHeading: '使い方',
      howToSteps: [
        '「年」と「月」を指定すると、その月のカレンダーに六曜と旧暦が表示されます。',
        '「色を付ける六曜」で大安などを選ぶと、その六曜の日に色が付きます。',
        '特定の日だけ知りたいときは、「日付から六曜・旧暦を調べる」に日付を入力します。',
      ],
      notesHeading: '注意事項',
      notes: [
        '旧暦は朔（新月）と太陽黄経の天文計算から求めており、1900〜2100年に対応します。計算には数分程度の誤差があるため、国立天文台が発表する暦と比べて、朔や節気が日付の境目（0時の前後10分ほど）にあたる日は1日ずれることがあります（例: 2023年の夏至は6月21日23時58分ごろですが、計算上は22日になります）。大切な日取りは、暦注を載せた公的な暦やカレンダーでも確認してください。',
        '六曜は科学的な根拠のない民間の習慣で、吉凶を保証するものではありません。冠婚葬祭などでどの程度気にするかは、地域や家庭によって異なります。',
        '2033年は旧暦の閏月の置き方に諸説あることで知られます。このツールでは、冬至を含む月を11月とし、次の冬至までが13か月なら最初の中気のない月を閏月にする規則に従い、2033年は閏11月として表示します。',
        '祝日は2000〜2099年のみ表示します。祝日法の改正や臨時の祝日は反映されません。',
      ],
      glossaryHeading: '用語解説',
      glossaryTerms: [
        {
          term: '六曜',
          description:
            '大安・友引・先勝・先負・仏滅・赤口の6種類で、日の吉凶を表す暦注です。旧暦の月と日を足して6で割った余りで決まり、余り0から順に大安・赤口・先勝・友引・先負・仏滅となります。月が替わると並びがリセットされるため、新暦では不規則に見えます。',
        },
        {
          term: '旧暦（太陰太陽暦）',
          description:
            '月の満ち欠け（朔から次の朔まで）を1か月とし、季節とのずれを閏月で調整する暦です。日本では明治5年（1872年）まで使われ、現在「旧暦」と呼ぶときは、天保暦の規則を現代の天文計算で当てはめたものを指すのが一般的です。',
        },
        {
          term: '閏月',
          description:
            '旧暦で季節とのずれを直すために加える13番目の月です。中気（二十四節気のうち偶数番目の節気）を含まない月が閏月になり、直前の月と同じ番号に「閏」を付けて呼びます。閏月の六曜は、同じ番号の月と同じ数え方で決まります。',
        },
        {
          term: '二十四節気',
          description:
            '1年を太陽の動き（太陽黄経）で24等分した季節の区切りで、立春・春分・夏至・冬至などがあります。黄経15度ごとの節気が並び、30度ごとの「中気」が旧暦の月名と閏月の判定に使われます。',
        },
      ],
    },
    en: {
      title: 'Rokuyo & Lunar Calendar (Taian, Butsumetsu, Solar Terms)',
      description:
        'Monthly calendar with rokuyo lucky days (Taian, Butsumetsu…), lunar dates, 24 solar terms and holidays, plus a date lookup for 1900–2100. Runs in your browser.',
      h1: 'Rokuyo & Lunar Calendar (Japanese Lucky Days)',
      introHtml:
        'Pick a year and month to see a calendar with each day’s rokuyo (the six-day Japanese luck cycle: Taian, Tomobiki, Sensho, Senbu, Butsumetsu, Shakko) and the old Japanese lunar date. It also marks the 24 solar terms and Japanese national holidays, so you can pick out the lucky Taian days for a wedding, a move or a car delivery. The lunar dates are calculated from the new moon and the sun’s position, and nothing you enter is sent to a server. For a printable calendar with week numbers, try the <a href="/en/tools/calendar-generator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Calendar Generator</a>.',
      dateLocale: 'en-US',

      yearLabel: 'Year (1900–2100)',
      monthLabel: 'Month',
      weekStartLabel: 'Week starts on',
      weekStartSun: 'Sunday',
      weekStartMon: 'Monday',
      holidaysLabel: 'Show Japanese national holidays',
      holidaysDefault: false,
      lunarLabel: 'Show lunar dates',
      highlightLabel: 'Highlight rokuyo',
      highlightNone: 'None',
      todayLabel: "Mark today's date",
      errorYear: 'Enter a whole-number year from {min} to {max}.',

      rokuyoNames: {
        taian: 'Taian (大安)',
        shakko: 'Shakko (赤口)',
        sensho: 'Sensho (先勝)',
        tomobiki: 'Tomobiki (友引)',
        senbu: 'Senbu (先負)',
        butsumetsu: 'Butsumetsu (仏滅)',
      },
      rokuyoShort: {
        taian: '大安',
        shakko: '赤口',
        sensho: '先勝',
        tomobiki: '友引',
        senbu: '先負',
        butsumetsu: '仏滅',
      },
      solarTermNames: {
        shunbun: 'Vernal Equinox (春分)',
        seimei: 'Clear and Bright (清明)',
        kokuu: 'Grain Rain (穀雨)',
        rikka: 'Start of Summer (立夏)',
        shouman: 'Grain Buds (小満)',
        boushu: 'Grain in Ear (芒種)',
        geshi: 'Summer Solstice (夏至)',
        shousho: 'Minor Heat (小暑)',
        taisho: 'Major Heat (大暑)',
        risshuu: 'Start of Autumn (立秋)',
        shosho: 'End of Heat (処暑)',
        hakuro: 'White Dew (白露)',
        shuubun: 'Autumnal Equinox (秋分)',
        kanro: 'Cold Dew (寒露)',
        soukou: 'Frost Descent (霜降)',
        rittou: 'Start of Winter (立冬)',
        shousetsu: 'Minor Snow (小雪)',
        taisetsu: 'Major Snow (大雪)',
        touji: 'Winter Solstice (冬至)',
        shoukan: 'Minor Cold (小寒)',
        daikan: 'Major Cold (大寒)',
        risshun: 'Start of Spring (立春)',
        usui: 'Rain Water (雨水)',
        keichitsu: 'Awakening of Insects (啓蟄)',
      },
      leapFull: 'leap ',
      leapShort: 'L',
      lunarFull: '{leap}month {month}, day {day}',
      listRokuyoHeading: 'Days by rokuyo',
      listTermsHeading: '24 solar terms',
      listTermItem: '{date}: {name}',
      newYearText: 'Lunar New Year (lunar 1/1) in {year} falls on {date}.',

      lookupHeading: 'Look up a date',
      lookupDateLabel: 'Date',
      lookupResult: '{date}: lunar {lunar}, rokuyo is {rokuyo}.',
      lookupTermSuffix: ' This day is {term}.',
      lookupOutOfRange: 'Enter a date between 1900 and 2100.',

      howToHeading: 'How to use',
      howToSteps: [
        'Set the “Year” and “Month” to show that month with rokuyo and lunar dates.',
        'Choose a rokuyo such as Taian under “Highlight rokuyo” to colour those days.',
        'To check a single day, enter it under “Look up a date”.',
      ],
      notesHeading: 'Notes',
      notes: [
        'Lunar dates are computed astronomically from the new moon and the sun’s ecliptic longitude, for 1900–2100. The calculation has an error of a few minutes, so when a new moon or solar term falls within about ten minutes of midnight, the result can differ by one day from the almanac published by the National Astronomical Observatory of Japan (for example, the 2023 summer solstice at about 23:58 JST on June 21 shows as June 22). For important dates, double-check against an official almanac.',
        'Rokuyo is a folk custom with no scientific basis and guarantees nothing. How much weight it carries at weddings, funerals and other events varies by region and family.',
        'The placement of the 2033 leap month is famously disputed. This tool follows the rule “the month containing the winter solstice is month 11; if 13 months pass before the next solstice, the first month without a major solar term is the leap month”, which gives a leap month 11 in 2033.',
        'Holidays are shown for 2000–2099 only, and later legal changes or one-off holidays are not reflected.',
      ],
      glossaryHeading: 'Glossary',
      glossaryTerms: [
        {
          term: 'Rokuyo',
          description:
            'A six-day cycle (Taian, Tomobiki, Sensho, Senbu, Butsumetsu, Shakko) used in Japan to mark the luck of a day. It is the remainder of (lunar month + lunar day) divided by 6, counted as Taian, Shakko, Sensho, Tomobiki, Senbu, Butsumetsu. The count restarts every lunar month, so it looks irregular on the Gregorian calendar.',
        },
        {
          term: 'Lunar calendar (lunisolar)',
          description:
            'A calendar whose months run from one new moon to the next, with leap months inserted to keep it in step with the seasons. Japan used it until 1872. Today “the old calendar” usually means the Tenpō-era rules applied with modern astronomical calculation.',
        },
        {
          term: 'Leap month',
          description:
            'An extra 13th month added to keep the lunar calendar aligned with the seasons. A month that contains no major solar term becomes the leap month and is named after the previous month with “leap” added.',
        },
        {
          term: '24 solar terms',
          description:
            'The year divided into 24 seasonal markers by the sun’s ecliptic longitude, such as Start of Spring, the equinoxes and the solstices. Terms every 15° exist; the “major” ones every 30° decide lunar month names and leap months.',
        },
      ],
    },
  };
