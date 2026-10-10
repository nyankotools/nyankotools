import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '年間カレンダーを1枚の用紙に印刷するには？',
      answer:
        '「年間」を選んで「印刷する」を押し、印刷ダイアログで用紙の向きを「横」にし、余白を「なし」または「最小」にしてください。倍率を「ページに合わせる」にするとさらに収まりやすくなります。PDFとして保存したい場合は、プリンターに「PDFに保存」を選びます。',
    },
    {
      question: '週番号はどの規則で数えていますか？',
      answer:
        'ISO 8601の週番号です。週は月曜日から始まり、その年の最初の木曜日を含む週が第1週になります。日曜始まりで表示している場合でも、日曜日は前の週に属するものとして扱い、その行に月〜土の日があればそれに合わせた番号を表示します。',
    },
    {
      question: '祝日が表示されない年があります。',
      answer:
        '祝日は2000〜2099年のみ対応しています。それ以外の年（1900〜1999年・2100年）では祝日は表示されず、カレンダーだけが生成されます。',
    },
    {
      question: '会社の休日や記念日を書き込むことはできますか？',
      answer:
        'このツールには書き込み機能はありません。カレンダーを印刷するか、PDFとして保存してから手書き・他のソフトで書き込んでください。',
    },
  ],
  en: [
    {
      question: 'How do I print a yearly calendar on a single sheet?',
      answer:
        'Choose “Yearly”, press Print, then set the paper orientation to landscape and the margins to none or minimum in the print dialog. Setting the scale to “fit to page” helps too. To save a PDF instead, pick “Save as PDF” as the printer.',
    },
    {
      question: 'Which rule is used for week numbers?',
      answer:
        'ISO 8601. Weeks start on Monday and week 1 is the week containing the first Thursday of the year. Even when the calendar starts on Sunday, a Sunday counts as the end of the previous week, so each row shows the number of the Monday–Saturday days it contains.',
    },
    {
      question: 'Why are holidays missing for some years?',
      answer:
        'Japanese holidays are supported for 2000–2099 only. For other years (1900–1999 and 2100) only the plain calendar is generated.',
    },
    {
      question: 'Can I add my own events or days off?',
      answer:
        'Not in this tool. Print the calendar or save it as a PDF, then add notes by hand or in another app.',
    },
  ],
};
