import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: 'SRTとVTTは何が違いますか？ 変換で何が変わりますか？',
      answer:
        '時刻のミリ秒の区切りがSRTはカンマ、VTTはピリオドで、VTTは先頭にWEBVTTの行が必要です。SRT→VTTではこれらを置き換え、VTT→SRTでは位置指定やNOTEなどSRTにない情報が落ち、連番が振り直されます。',
    },
    {
      question: '字幕が音声より何秒かずれているときはどうしますか？',
      answer:
        '「時間をずらす（秒）」に、字幕を遅らせたいなら正の値、早めたいなら負の値を入力します。0.5のような小数も使えます。全体が一定にずれている場合に有効です。',
    },
    {
      question: '最初は合っているのに、だんだんずれていくのはなぜですか？',
      answer:
        '字幕と映像のフレームレートが違う（23.976fpsと25fpsなど）ことが多い症状です。「元のフレームレート」に字幕が作られた映像のfps、「変換先のフレームレート」に字幕を付けたい映像のfpsを選ぶと、時刻を比例して補正します。',
    },
    {
      question: 'Shift_JISの字幕が文字化けします。',
      answer:
        '自動判定はUTF-8として正しく読めるかで決めるため、まれに外れることがあります。「文字コード」をShift_JISまたはUTF-8に手動で切り替えてください。保存はUTF-8になるので、変換後は多くの再生ソフトで文字化けしません。',
    },
    {
      question: 'ASSやSSAの字幕も変換できますか？',
      answer:
        'いいえ、SRTとWebVTTのみ対応しています。ASS・SSAはスタイルやエフェクトの情報を持つため、このツールでは扱えません。',
    },
  ],
  en: [
    {
      question: 'What is the difference between SRT and VTT, and what changes?',
      answer:
        'SRT separates milliseconds with a comma and VTT with a period, and VTT needs a WEBVTT line at the top. SRT to VTT swaps those. VTT to SRT drops information SRT cannot hold, such as positioning and NOTE blocks, and renumbers the cues.',
    },
    {
      question: 'My subtitles are a few seconds off. What should I do?',
      answer:
        'Enter a positive value in "Shift timing (seconds)" to delay the subtitles or a negative value to show them earlier. Decimals such as 0.5 work too. This fixes a constant offset across the whole file.',
    },
    {
      question:
        'The subtitles start in sync but drift further apart over time. Why?',
      answer:
        'That usually means the frame rates differ, for example 23.976 fps versus 25 fps. Choose the fps the subtitles were made for under "Original frame rate" and your video’s fps under "Target frame rate", and all timestamps are scaled proportionally.',
    },
    {
      question: 'A Shift_JIS subtitle file shows garbled text.',
      answer:
        'Auto-detection decides by whether the bytes are valid UTF-8, so it can occasionally guess wrong. Switch "Character encoding" to Shift_JIS or UTF-8 by hand. The output is saved as UTF-8, which most players read correctly.',
    },
    {
      question: 'Can it convert ASS or SSA subtitles?',
      answer:
        'No, only SRT and WebVTT are supported. ASS and SSA carry styles and effects that this tool cannot represent.',
    },
  ],
};
