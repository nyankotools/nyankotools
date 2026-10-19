import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'Java の MM と mm、HH と hh は何が違いますか？',
      answer:
        '大文字と小文字で意味が変わります。MM は月、mm は分、HH は24時間制の時（0〜23）、hh は12時間制の時（01〜12）です。yyyy-mm-dd のように月を mm と書くと、月の場所に分が入ってしまいます。strftime では %m が月、%M が分、%H が24時間制、%I が12時間制と、同じ大文字小文字の使い分けになっています。',
    },
    {
      question: '03/04/2026 は 3月4日と 4月3日のどちらとして判別されますか？',
      answer:
        '日と月がどちらも12以下で見分けがつかない場合は推測です。スラッシュ区切りなら 月/日/年（米国式）、ドット区切りなら 日.月.年（欧州式）として扱い、その旨を画面に表示します。19/04/2026 のように日が13以上なら、順序を確定できます。違っていたら、下の書式文字列の欄で直接書き換えてください。',
    },
    {
      question: 'ゼロ埋めなしの月や日（%-d）が Windows で動きません',
      answer:
        '%-d や %-m は glibc（Linux）や macOS、Ruby の拡張で、Windows の C ランタイムでは使えません。Windows では %#d のように # を使います。Python は実行する OS の C ライブラリに従うため、同じコードでも OS によって結果が変わります。移植性を重視するなら、strftime ではなく Python の f-string などで整形する方法もあります。',
    },
    {
      question: 'ミリ秒やタイムゾーンはどの書式でも使えますか？',
      answer:
        'ミリ秒は Java の SSS、PHP の v、Day.js / Moment.js の SSS、.NET の fff で表せます。strftime には標準のミリ秒指定がなく、Ruby の %L（Python の %f はマイクロ秒で6桁）が近いものです。タイムゾーンの +09:00 形式は Java の XXX、PHP の P、Day.js / Moment.js の Z、.NET の zzz、strftime では %:z にあたります。対応する指定がないものは、省略して画面に表示します。',
    },
    {
      question: 'T や年・月といった文字はどう書式に含めればよいですか？',
      answer:
        "書式で意味を持つアルファベットをそのまま出力したい場合は、引用符で囲みます。Java と .NET は 'T' のように単一引用符、PHP は \\T のようにバックスラッシュ、Day.js / Moment.js は [T] のように角括弧です。strftime は % で始まる指定以外がそのまま出るため引用は不要です（% 自体は %% と書きます）。このツールは変換時に自動で適切な形にします。",
    },
  ],
  en: [
    {
      question:
        'What is the difference between MM and mm, or HH and hh, in Java?',
      answer:
        'Case changes the meaning. MM is the month, mm is the minute, HH is the 24-hour hour (0-23), and hh is the 12-hour hour (01-12). Writing yyyy-mm-dd puts the minute where the month should be. strftime follows the same idea: %m is the month, %M the minute, %H the 24-hour hour, and %I the 12-hour hour.',
    },
    {
      question: 'Is 03/04/2026 read as March 4 or April 3?',
      answer:
        'When both numbers are 12 or less, the order cannot be known, so the tool guesses: slashes are read as month/day/year (US style) and dots as day.month.year (European style), and it tells you it guessed. A date like 19/04/2026 is unambiguous because 19 cannot be a month. If the guess is wrong, edit the format string in the field below.',
    },
    {
      question: 'Why does the no-padding %-d not work on Windows?',
      answer:
        '%-d and %-m are glibc (Linux), macOS, and Ruby extensions; the Windows C runtime does not support them and uses %#d instead. Python defers to the C library of the OS it runs on, so the same code can behave differently by platform. If portability matters, format the value with an f-string or similar instead of strftime.',
    },
    {
      question: 'Can I use milliseconds and time zones in every syntax?',
      answer:
        "Milliseconds are SSS in Java, v in PHP, SSS in Day.js / Moment.js, and fff in .NET. strftime has no standard millisecond specifier; Ruby offers %L, while Python's %f is microseconds (6 digits). The +09:00 style offset is XXX in Java, P in PHP, Z in Day.js / Moment.js, zzz in .NET, and %:z in strftime. Anything without an equivalent is left out and listed on the page.",
    },
    {
      question: 'How do I include a literal T or other letters in a format?',
      answer:
        "Letters that have a meaning in the format must be quoted to print as-is. Java and .NET use single quotes such as 'T', PHP uses a backslash such as \\T, and Day.js / Moment.js use square brackets such as [T]. strftime prints anything outside a %-specifier as written, so no quoting is needed (a literal % is written %%). The tool applies the right escaping automatically when it converts.",
    },
  ],
};
