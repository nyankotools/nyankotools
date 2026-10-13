import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

/** 結果表示の文言 */
export interface BirthdayResultFormat {
  /** {n} */
  fullAge: [string, string];
  /** {w} = 曜日名 */
  weekday: string;
  /** {stem} {branch} */
  sexagenary: string;
  /** {y} {branch} */
  etoYearNow: string;
  /** {y} {age} */
  etoYearNext: string;
  /** 基準日より後の生年月日のときの年齢表示 */
  ageFuture: string;
}

export interface BirthdayInfoPageContent {
  resultFormat: BirthdayResultFormat;
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
  etoLabel: string;
  sexagenaryLabel: string;
  zodiacLabel: string;
  birthstoneLabel: string;
  birthFlowerLabel: string;
  birthstoneMeaningLabel: string;
  birthFlowerMeaningLabel: string;
  weekdayLabel: string;
  ageLabel: string;
  etoYearLabel: string;
  /** 十二支（子〜亥）の表示名 */
  branchNames: string[];
  /** 六十干支の表記に使う十二支の短い名前 */
  branchShortNames: string[];
  /** 十干（甲〜癸）の表示名 */
  stemNames: string[];
  /** 星座（牡羊座〜魚座） */
  zodiacNames: string[];
  /** 1月〜12月の誕生石 */
  birthstones: string[];
  /** 1月〜12月の誕生花 */
  birthFlowers: string[];
  /** 1月〜12月の石言葉 */
  birthstoneMeanings: string[];
  /** 1月〜12月の花言葉 */
  birthFlowerMeanings: string[];
  weekdayLabels: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const birthdayInfoContent: Record<Locale, BirthdayInfoPageContent> = {
  ja: {
    resultFormat: {
      fullAge: ['{n}歳', '{n}歳'],
      weekday: '{w}曜日',
      sexagenary: '{stem}{branch}',
      etoYearNow: '今年（{y}年）は{branch}年で、年男・年女にあたります。',
      etoYearNext: '次に同じ干支の年になるのは{y}年（{age}歳）です。',
      ageFuture: '（基準日より先の日付です）',
    },
    title: '生年月日から干支・星座・誕生石・誕生花を調べる',
    description:
      '生年月日を入力するだけで、干支（十二支・十干十二支）・星座・誕生石・誕生花・生まれた曜日・満年齢・年男年女の年を無料で調べられます。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '誕生日情報（干支・星座・誕生石）早見ツール',
    introHtml:
      '生年月日を入力すると、干支（十二支と十干十二支）・星座・誕生石・誕生花・生まれた曜日・満年齢と、次に同じ干支の年（年男・年女）を一覧で表示します。入力した生年月日はブラウザ内でのみ処理され、サーバーには送信されません。満年齢・数え年や次の誕生日までの日数を知りたい場合は <a href="/tools/age-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">年齢計算機</a>、和暦で確認したい場合は <a href="/tools/japanese-era-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">和暦⇔西暦変換</a> をご利用ください。',
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
      '調べられませんでした（西暦1年〜9999年の実在する日付を入力してください）',
    etoLabel: '干支（十二支）',
    sexagenaryLabel: '十干十二支',
    zodiacLabel: '星座',
    birthstoneLabel: '誕生石',
    birthFlowerLabel: '誕生花（月ごと）',
    birthstoneMeaningLabel: '石言葉',
    birthFlowerMeaningLabel: '花言葉',
    weekdayLabel: '生まれた曜日',
    ageLabel: '満年齢（今日時点）',
    etoYearLabel: '年男・年女',
    branchNames: [
      '子（ねずみ）',
      '丑（うし）',
      '寅（とら）',
      '卯（うさぎ）',
      '辰（たつ）',
      '巳（へび）',
      '午（うま）',
      '未（ひつじ）',
      '申（さる）',
      '酉（とり）',
      '戌（いぬ）',
      '亥（いのしし）',
    ],
    branchShortNames: [
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
    ],
    stemNames: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
    zodiacNames: [
      '牡羊座',
      '牡牛座',
      '双子座',
      '蟹座',
      '獅子座',
      '乙女座',
      '天秤座',
      '蠍座',
      '射手座',
      '山羊座',
      '水瓶座',
      '魚座',
    ],
    birthstones: [
      'ガーネット',
      'アメジスト',
      'アクアマリン',
      'ダイヤモンド',
      'エメラルド',
      '真珠（パール）',
      'ルビー',
      'ペリドット',
      'サファイア',
      'オパール',
      'トパーズ',
      'ターコイズ',
    ],
    birthFlowers: [
      'スノードロップ',
      'スミレ',
      'スイセン',
      'デイジー',
      'スズラン',
      'バラ',
      'デルフィニウム',
      'グラジオラス',
      'アスター',
      'コスモス',
      'キク',
      'ヒイラギ',
    ],
    birthstoneMeanings: [
      '貞操・友愛・勝利',
      '誠実・心の平和',
      '聡明・幸福・沈着',
      '永遠の絆・純潔・不屈',
      '幸運・幸福・夫婦愛',
      '健康・富・純潔',
      '情熱・仁愛・勇気',
      '夫婦の幸福・和合・希望',
      '誠実・慈愛・徳望',
      '希望・創造力・純潔',
      '友情・潔白・希望',
      '成功・繁栄・平和',
    ],
    birthFlowerMeanings: [
      '希望・慰め',
      '誠実・謙虚',
      '尊敬・自己愛',
      '平和・希望',
      '純粋・幸福の再来',
      '愛・美',
      '清明・気高さ',
      '用心・勝利',
      '信じる心・追憶',
      '調和・乙女の真心',
      '高貴・高潔',
      '先見・家庭の団らん',
    ],
    weekdayLabels: ['日', '月', '火', '水', '木', '金', '土'],
    notesHeading: '注意事項',
    notes: [
      '干支は西暦の暦年（1月1日〜12月31日）で判定しています。立春（2月4日ごろ）で干支が切り替わる流派もあるため、1月〜2月上旬生まれの方は占いなどで前年の干支として扱われる場合があります。',
      '星座は一般的な日付区分（例：牡羊座は3月21日〜4月19日）で判定しています。境目の日付は年や資料によって1日ほどずれることがあります。',
      '誕生石・誕生花は月ごとの代表的なものを表示しています。国や宝石業界団体、書籍によって選定が異なります。石言葉・花言葉も出典によって異なる場合があり、代表的なものを表示しています。',
      '満年齢は今日の日付を基準に、誕生日当日に加齢する一般的な数え方で計算しています。',
      '入力範囲は西暦1年〜9999年です。グレゴリオ暦を前提としています。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '十干十二支（じっかんじゅうにし）',
        description:
          '十干（甲・乙・丙・丁・戊・己・庚・辛・壬・癸）と十二支（子・丑・寅…亥）を順に組み合わせた60通りの周期です。「甲子」から始まり、60年で一巡するため、60歳を還暦と呼びます。西暦年から4を引いて60で割った余りで求められます。',
      },
      {
        term: '年男・年女',
        description:
          'その年の干支が、自分の生まれ年の干支と同じ人のことです。12年ごとに巡り、数え年・満年齢のどちらでも、おおむね12歳・24歳・36歳…の年にあたります。節分の豆まきや初詣で、年男・年女が主役となる風習があります。',
      },
      {
        term: '誕生石',
        description:
          '生まれた月ごとに決められた宝石で、身につけると幸運を呼ぶとされます。現在の一覧は米国の宝石業界団体（1912年）などの選定が基になっており、日本では1958年に全国宝石卸商協同組合が定めたものが広く使われています。',
      },
    ],
  },
  en: {
    resultFormat: {
      fullAge: ['{n} year old', '{n} years old'],
      weekday: '{w}',
      sexagenary: '{stem} {branch}',
      etoYearNow:
        'This year ({y}) is your zodiac year, the Year of the {branch} (a "year man / year woman" in Japan).',
      etoYearNext: 'Your zodiac animal comes around again in {y} (age {age}).',
      ageFuture: '(date is after today)',
    },
    title: 'Birthday Info: Chinese Zodiac, Star Sign & Birthstone Lookup',
    description:
      'Enter a date of birth to see the Chinese zodiac animal, star sign, birthstone, birth flower and weekday. Runs in your browser; nothing is sent to a server.',
    h1: 'Birthday Info: Zodiac Animal, Star Sign & Birthstone',
    introHtml:
      'Enter a date of birth to see the Chinese zodiac animal (as used in Japan, "Eto"), the 60-year sexagenary pair, the Western star sign, the birthstone and birth flower for the month, the day of the week you were born, and the current age. Your date is processed only in your browser and is never sent to a server. For exact age, days lived, and the next birthday, try the <a href="/en/tools/age-calculator/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Age Calculator</a>, or convert to Japanese eras with the <a href="/en/tools/japanese-era-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Japanese Era Converter</a>.',
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
      'Could not look this up (enter a date that exists, between year 1 and 9999).',
    etoLabel: 'Chinese zodiac animal',
    sexagenaryLabel: 'Sexagenary cycle (stem and branch)',
    zodiacLabel: 'Star sign',
    birthstoneLabel: 'Birthstone',
    birthFlowerLabel: 'Birth flower (by month)',
    birthstoneMeaningLabel: 'Birthstone meaning',
    birthFlowerMeaningLabel: 'Flower meaning',
    weekdayLabel: 'Day of the week born',
    ageLabel: 'Age (as of today)',
    etoYearLabel: 'Zodiac year',
    branchNames: [
      'Rat',
      'Ox',
      'Tiger',
      'Rabbit',
      'Dragon',
      'Snake',
      'Horse',
      'Goat',
      'Monkey',
      'Rooster',
      'Dog',
      'Pig',
    ],
    branchShortNames: [
      'Rat',
      'Ox',
      'Tiger',
      'Rabbit',
      'Dragon',
      'Snake',
      'Horse',
      'Goat',
      'Monkey',
      'Rooster',
      'Dog',
      'Pig',
    ],
    stemNames: [
      'Yang Wood',
      'Yin Wood',
      'Yang Fire',
      'Yin Fire',
      'Yang Earth',
      'Yin Earth',
      'Yang Metal',
      'Yin Metal',
      'Yang Water',
      'Yin Water',
    ],
    zodiacNames: [
      'Aries',
      'Taurus',
      'Gemini',
      'Cancer',
      'Leo',
      'Virgo',
      'Libra',
      'Scorpio',
      'Sagittarius',
      'Capricorn',
      'Aquarius',
      'Pisces',
    ],
    birthstones: [
      'Garnet',
      'Amethyst',
      'Aquamarine',
      'Diamond',
      'Emerald',
      'Pearl',
      'Ruby',
      'Peridot',
      'Sapphire',
      'Opal',
      'Topaz',
      'Turquoise',
    ],
    birthFlowers: [
      'Snowdrop',
      'Violet',
      'Daffodil',
      'Daisy',
      'Lily of the valley',
      'Rose',
      'Larkspur',
      'Gladiolus',
      'Aster',
      'Cosmos',
      'Chrysanthemum',
      'Holly',
    ],
    birthstoneMeanings: [
      'Fidelity, friendship, victory',
      'Sincerity, peace of mind',
      'Intelligence, happiness, composure',
      'Eternal bond, purity, courage',
      'Good fortune, happiness, marital love',
      'Health, wealth, purity',
      'Passion, compassion, courage',
      'Marital happiness, harmony, hope',
      'Sincerity, compassion, virtue',
      'Hope, creativity, purity',
      'Friendship, innocence, hope',
      'Success, prosperity, peace',
    ],
    birthFlowerMeanings: [
      'Hope, consolation',
      'Faithfulness, modesty',
      'Respect, self-esteem',
      'Peace, hope',
      'Purity, the return of happiness',
      'Love, beauty',
      'Lightness, dignity',
      'Caution, victory',
      'Faith, remembrance',
      'Harmony, a maiden’s sincerity',
      'Nobility, integrity',
      'Foresight, domestic happiness',
    ],
    weekdayLabels: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    notesHeading: 'Notes',
    notes: [
      "The zodiac animal is determined by the calendar year (January 1 to December 31). In the traditional Chinese calendar the animal changes at Lunar New Year, and in some Japanese fortune-telling at Risshun (around February 4), so people born in January or February may be assigned the previous year's animal there.",
      'Star signs use the commonly published date ranges (for example, Aries is March 21 to April 19). The cut-off days can differ by a day depending on the year and the source.',
      'The birthstone and birth flower shown are one representative per month. Lists vary by country, jewelry association, and book. The meanings shown are common ones and also differ by source.',
      'Age is calculated as of today, increasing on the birthday itself.',
      'The supported range is year 1 through 9999 in the Gregorian calendar.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Sexagenary cycle (Jikkan Junishi)',
        description:
          'A 60-year cycle made by pairing the 10 heavenly stems with the 12 earthly branches (the zodiac animals). It starts with Wood Rat (Kinoe-ne, 甲子) and returns after 60 years, which is why the 60th birthday (Kanreki) is celebrated in Japan. The index is (year − 4) mod 60.',
      },
      {
        term: 'Year man / year woman (Toshi-otoko, Toshi-onna)',
        description:
          'A person whose birth-year zodiac animal matches the animal of the current year. It happens every 12 years, around the ages of 12, 24, 36 and so on, and is considered a lucky or special year in Japan, for example at Setsubun bean-throwing and New Year shrine visits.',
      },
      {
        term: 'Birthstone',
        description:
          "A gemstone assigned to each birth month, traditionally believed to bring good luck. The modern list traces back to a 1912 US jewelers' association list, and Japan's widely used list was set by the national jewelry wholesalers' association in 1958.",
      },
    ],
  },
};
