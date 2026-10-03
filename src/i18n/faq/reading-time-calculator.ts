import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '読了時間はどのように計算していますか？',
      answer:
        '日本語の文字数を日本語の読む速さ（初期値は1分500字）で、英単語数を英語の読む速さ（初期値は1分230語）で割って足し合わせています。速さは設定で変更できます。',
    },
    {
      question: '空白や改行は文字数に含まれますか？',
      answer:
        '読了時間の計算では、空白や改行は数えません。原稿用紙の換算では、半角文字も1マスとして数え、改行は「改行ごとに行を改める」の設定で扱いが変わります。',
    },
    {
      question: '原稿用紙の枚数はどう決まりますか？',
      answer:
        '1行20字のマス目で、400字詰めは1枚20行、200字詰めは1枚10行として計算します。「改行ごとに行を改める」をオンにすると、段落や空行ごとに行頭から書き始めた場合の枚数になります。',
    },
    {
      question: '朗読やスピーチの時間はあてになりますか？',
      answer:
        '日本語は1分あたり約300字、英語は約130語という一般的な目安で計算しています。話す人の速さや間の取り方で変わるため、あくまで目安としてお使いください。',
    },
  ],
  en: [
    {
      question: 'How is the reading time calculated?',
      answer:
        'Japanese characters are divided by the Japanese reading speed (500 characters per minute by default) and English words by the English reading speed (230 words per minute by default), then the two are added. Both speeds can be changed in the settings.',
    },
    {
      question: 'Do spaces and line breaks count as characters?',
      answer:
        'Reading time ignores spaces and line breaks. For manuscript paper, half-width characters take one cell each, and line breaks are handled according to the "Start a new row at each line break" setting.',
    },
    {
      question: 'How is the number of manuscript sheets decided?',
      answer:
        'Each row holds 20 characters; a 400-character sheet has 20 rows and a 200-character sheet has 10. With "Start a new row at each line break" on, every paragraph or blank line starts a new row.',
    },
    {
      question: 'How accurate is the speaking time?',
      answer:
        'It assumes about 300 Japanese characters or 130 English words per minute. Real speed depends on the speaker and pauses, so treat it as a rough guide.',
    },
  ],
};
