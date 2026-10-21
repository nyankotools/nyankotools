import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '曲と曲の切り替わりを自然につなげるにはどうしますか？',
      answer:
        '「クリップのつなぎ方」で「クロスフェードで重ねる」を選び、2〜5秒程度の長さを指定します。前の曲の終わりと次の曲の始まりが重なり、音量が滑らかに入れ替わります。',
    },
    {
      question:
        'クロスフェードの長さを長くしても、あまり重ならないのはなぜですか？',
      answer:
        '3つ以上のクリップが同時に重ならないよう、重なりは隣り合うクリップのうち短い方の半分までに自動で制限されます。短い効果音などをつなぐときは、その半分が上限になります。',
    },
    {
      question: 'サンプルレートやチャンネル数が違うファイルも結合できますか？',
      answer:
        'できます。読み込み時にブラウザが共通のサンプルレート（48000 Hz）へ変換します。モノラルとステレオが混ざっている場合は、モノラルを左右に複製してステレオにそろえます。',
    },
    {
      question: '全体の最初と最後だけフェードをかけるには？',
      answer:
        '「先頭のフェードイン（秒）」と「末尾のフェードアウト（秒）」に秒数を入れます。これらは結合後の音声全体の先頭と末尾に適用され、クリップ間のつなぎ方とは別に設定できます。',
    },
    {
      question: '結合できるファイル数や長さに上限はありますか？',
      answer:
        '最大20ファイル、結合後の長さは10分まで、1ファイルは50MBまでです。ブラウザのメモリ上で処理するため、これを超える場合は先に分けて結合してください。出力はWAVのみです。',
    },
  ],
  en: [
    {
      question: 'How do I blend one track into the next smoothly?',
      answer:
        'Choose "A crossfade (overlap)" under "Join clips with" and set a length of about 2 to 5 seconds. The end of one clip overlaps the start of the next, and the volume hands over smoothly.',
    },
    {
      question: 'Why does a long crossfade not overlap as much as I set?',
      answer:
        'To keep three or more clips from overlapping at once, the overlap is automatically limited to half of the shorter of the two neighboring clips. With short sound effects, half of the shortest clip is the cap.',
    },
    {
      question:
        'Can I merge files with different sample rates or channel counts?',
      answer:
        'Yes. Your browser converts everything to one common sample rate (48000 Hz) when loading. If mono and stereo files are mixed, the mono ones are copied to both channels so everything becomes stereo.',
    },
    {
      question: 'How do I fade only the very start and end of the result?',
      answer:
        'Enter seconds in "Fade in at start (seconds)" and "Fade out at end (seconds)". They apply to the start and end of the whole merged track and are independent of how clips are joined.',
    },
    {
      question: 'Is there a limit on the number or length of files?',
      answer:
        'Up to 20 files, 10 minutes of merged audio, and 50 MB per file. Everything is processed in browser memory, so merge longer material in parts. The output is WAV only.',
    },
  ],
};
