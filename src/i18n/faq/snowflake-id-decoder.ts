import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'TwitterとDiscordのSnowflake IDは何が違いますか？',
      answer:
        'ビットの並び（上位41bitが時刻、10bitがマシンID、12bitがシーケンス）は同じですが、時刻の起点（エポック）が異なります。Twitterは1288834974657（2010-11-04）、Discordは1420070400000（2015-01-01）です。エポックの選択を間違えると生成時刻が数年ずれます。',
    },
    {
      question: '19桁の数値IDを正確に扱えますか？',
      answer:
        'はい。内部では64bit整数（BigInt）で計算するため、JavaScriptの数値で丸められる2の53乗を超えるIDでも下位のビットまで正確に読み取れます。',
    },
    {
      question: 'UUIDのどのバージョンから生成時刻が分かりますか？',
      answer:
        'v1・v6・v7です。v1・v6は1582年10月15日からの100ナノ秒単位、v7はUNIXミリ秒を持っています。v4はランダム、v3・v5は名前のハッシュなので、時刻は含まれません。',
    },
    {
      question: 'ObjectIDの時刻はミリ秒まで分かりますか？',
      answer:
        '分かりません。ObjectIDの時刻は先頭4バイトの秒単位で、ミリ秒の情報は含まれていません。続く5バイトはプロセスごとのランダム値、末尾3バイトはカウンタです。',
    },
    {
      question: '独自のSnowflake形式のIDも読み取れますか？',
      answer:
        '時刻が上位41bit、下位22bitが機械・連番という一般的な並びで、エポックが分かっていれば「カスタム」で時刻を読み取れます。ビット幅が異なる形式（Sonyflakeなど）には対応していません。',
    },
  ],
  en: [
    {
      question: 'How do Twitter and Discord Snowflake IDs differ?',
      answer:
        'The bit layout is the same (41 bits of time, 10 bits of machine ID, 12 bits of sequence), but the epoch differs: Twitter counts from 1288834974657 (2010-11-04) and Discord from 1420070400000 (2015-01-01). Choosing the wrong epoch shifts the time by years.',
    },
    {
      question: 'Are 19-digit numeric IDs handled accurately?',
      answer:
        'Yes. The tool calculates with 64-bit integers (BigInt), so IDs above 2^53, which plain JavaScript numbers would round, are still read down to the lowest bit.',
    },
    {
      question: 'Which UUID versions contain a creation time?',
      answer:
        'Versions 1, 6 and 7. v1 and v6 store 100-nanosecond ticks since 1582-10-15, and v7 stores Unix milliseconds. v4 is random and v3/v5 are name-based hashes, so they carry no time.',
    },
    {
      question: 'Can the ObjectID time be read to the millisecond?',
      answer:
        'No. The ObjectID timestamp is the first 4 bytes in whole seconds. The next 5 bytes are a per-process random value and the last 3 bytes are a counter.',
    },
    {
      question: 'Does it work with custom Snowflake-style IDs?',
      answer:
        'If your ID uses the common layout (time in the upper 41 bits, machine and sequence in the lower 22) and you know the epoch, choose Custom and enter it. Layouts with different bit widths, such as Sonyflake, are not supported.',
    },
  ],
};
