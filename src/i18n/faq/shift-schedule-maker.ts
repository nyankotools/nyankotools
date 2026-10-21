import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '担当はどういうルールで割り当てられますか？',
      answer:
        '日付順に、その日に出られる人（希望休でない・連勤上限に達していない人）の中から、担当日数が少ない人を優先して選びます。担当日数が同じなら、最後に担当した日が古い人（ローテーションで回ってきた人）、それも同じなら名簿の上の人が先です。乱数は使わないので、同じ入力なら毎回同じ表になります。',
    },
    {
      question: '「警告」が出た日はどうすればよいですか？',
      answer:
        'その日は必要人数に届いていません。警告には、希望休で出られない人数と連勤上限で出られない人数が出ているので、メンバーを増やす・必要人数を減らす・連勤の上限を増やす・希望休を調整する、のいずれかを試してください。表にはそのとき割り当てられた人だけが入ります。',
    },
    {
      question: '希望休はどのように入力しますか？',
      answer:
        '1行に1人、「田中: 3, 10, 15-17」のように、名前のあとにコロンを付けて日付を並べます。15-17 のように範囲でも指定できます。名簿にない名前や、その月にない日付は無視され、入力欄の下に表示されます。',
    },
    {
      question: '土日祝を休みにすると、祝日はどこまで対応していますか？',
      answer:
        '日本の祝日・振替休日を2000〜2099年の範囲で判定します。それ以外の年は土日のみが休みになります。祝日以外の会社独自の休業日は反映されないため、その日は希望休として全員分入力するか、表を印刷したあとで手直ししてください。',
    },
    {
      question: '作った表をExcelなどで使えますか？',
      answer:
        '「CSVをダウンロード」で保存するか、「CSVをコピー」で貼り付けると、1行目が日付、1列目が名前のメンバー×日付の表になります。ダウンロードしたCSVはExcelで文字化けしないよう、BOM付きUTF-8で保存しています。',
    },
  ],
  en: [
    {
      question: 'How does the tool decide who works each day?',
      answer:
        'Day by day, it looks at everyone who is available (not on requested leave and not at the streak limit) and picks those who have worked the fewest days so far. Ties go to whoever worked longest ago, then to whoever is higher in the member list. No randomness is used, so the same input always produces the same roster.',
    },
    {
      question: 'What should I do about a day with a warning?',
      answer:
        'That day could not be fully staffed. The warning shows how many people were unavailable because of requested leave and how many because of the streak limit. Try adding members, lowering the people needed, raising the streak limit or adjusting requested days off. The roster still shows whoever could be assigned.',
    },
    {
      question: 'How do I enter requested days off?',
      answer:
        'Use one line per member: the name, a colon, then the days, for example "Alice: 3, 10, 15-17". A range such as 15-17 works too. Names that are not in the member list and days that are not in the month are ignored and listed below the field.',
    },
    {
      question: 'Which holidays count when weekends and holidays are off?',
      answer:
        'Japanese national and substitute holidays are recognized for 2000–2099. For other years only Saturdays and Sundays are closed. Company-specific closures are not known to the tool, so enter them as requested days off for everyone or edit the printout afterwards.',
    },
    {
      question: 'Can I use the roster in Excel or Google Sheets?',
      answer:
        'Yes. Download the CSV or copy it and paste it into a spreadsheet: the first row holds the dates and the first column holds the names. The downloaded file is UTF-8 with a BOM so Excel opens non-English names correctly.',
    },
  ],
};
