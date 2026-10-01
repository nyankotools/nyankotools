import { describe, expect, it } from 'vitest';
import { createCronDescriber } from './cron-description';
import { parseCronExpression } from './cron-parser';

function describe_(expr: string, locale: 'ja' | 'en'): string {
  const result = parseCronExpression(expr);
  if (!result.ok) throw new Error(`invalid: ${expr}`);
  return createCronDescriber(locale).buildDescription(result.cron);
}

describe('createCronDescriber', () => {
  it('日本語: 毎分', () => {
    expect(describe_('* * * * *', 'ja')).toBe(
      '1分ごとに実行されます（毎分実行）',
    );
  });
  it('英語: 毎分', () => {
    expect(describe_('* * * * *', 'en')).toBe('Runs every minute.');
  });
  it('日本語: 毎日の時刻指定', () => {
    expect(describe_('30 9 * * *', 'ja')).toBe('毎日9時30分に実行されます');
  });
  it('英語: 毎日の時刻指定', () => {
    expect(describe_('30 9 * * *', 'en')).toBe('Runs at hour 9, minute 30.');
  });
  it('日付と曜日の両方指定は OR で説明する', () => {
    expect(describe_('0 0 1 * 1', 'ja')).toContain('または');
    expect(describe_('0 0 1 * 1', 'en')).toContain(' or ');
  });
});

// 現在の出力を固定する回帰テスト（ページ側の isJa 分岐を cron-description へ抽出した際の同一出力を保つ）
const CASES: [expr: string, ja: string, en: string][] = [
  ['*/15 * * * *', '毎時15分ごとに実行されます', 'Runs every 15 minutes.'],
  ['0 * * * *', '毎時0分に実行されます', 'Runs every hour at minute 0.'],
  [
    '0,30 * * * *',
    '毎時0分、30分に実行されます',
    'Runs every hour at minute 0 and 30.',
  ],
  [
    '1-10/2 * * * *',
    '毎時1分から10分の2分ごとに実行されます',
    'Runs 1-10 every 2 minutes.',
  ],
  [
    '* 9 * * *',
    '毎日9時の間、毎分実行されます',
    'Runs every minute during hour 9.',
  ],
  [
    '0 9-17 * * *',
    '毎日9時から17時0分に実行されます',
    'Runs at hour 9-17, minute 0.',
  ],
  [
    '*/15 9-17 * * *',
    '毎日9時から17時の15分ごとに実行されます',
    'Runs during hours 9-17, every 15 minutes.',
  ],
  [
    '0 */2 * * *',
    '毎日2時間ごと0分に実行されます',
    'Runs every 2 hours, at minute 0.',
  ],
  [
    '0 0 * * 0',
    '毎週日曜日の0時0分に実行されます',
    'Runs on Sunday, at hour 0, minute 0.',
  ],
  [
    '0 0 * * 7',
    '毎週日曜日の0時0分に実行されます',
    'Runs on Sunday, at hour 0, minute 0.',
  ],
  [
    '0 9 * * 1-5',
    '毎週月曜日から金曜日の9時0分に実行されます',
    'Runs on Monday through Friday, at hour 9, minute 0.',
  ],
  [
    '0 9 * * 1,3,5',
    '毎週月曜日、水曜日、金曜日の9時0分に実行されます',
    'Runs on Monday, Wednesday, and Friday, at hour 9, minute 0.',
  ],
  [
    '0 0 1 * *',
    '毎月1日の0時0分に実行されます',
    'Runs on day 1, at hour 0, minute 0.',
  ],
  [
    '0 0 1,15 * *',
    '毎月1日、15日の0時0分に実行されます',
    'Runs on day 1 and 15, at hour 0, minute 0.',
  ],
  [
    '0 0 1-10/2 * *',
    '毎月1日から10日の2日ごとの0時0分に実行されます',
    'Runs on day 1-10 every 2 days, at hour 0, minute 0.',
  ],
  [
    '0 0 1 1 *',
    '毎年1月の1日の0時0分に実行されます',
    'Runs in month 1, on day 1, at hour 0, minute 0.',
  ],
  [
    '0 0 1 */3 *',
    '毎年3ヶ月ごとの1日の0時0分に実行されます',
    'Runs in month every 3 months, on day 1, at hour 0, minute 0.',
  ],
  [
    '0 12 * 6-8 *',
    '毎年6月から8月の12時0分に実行されます',
    'Runs in month 6-8, at hour 12, minute 0.',
  ],
  [
    '0 0 */2 * 1',
    '2日ごとかつ月曜日の0時0分に実行されます',
    'Runs on day every 2 days and Monday, at hour 0, minute 0.',
  ],
  [
    '0 0 1 * 1',
    '1日または月曜日の0時0分に実行されます',
    'Runs on day 1 or Monday, at hour 0, minute 0.',
  ],
];

describe('createCronDescriber: 代表的な式の出力', () => {
  it.each(CASES)('%s', (expr, ja, en) => {
    expect(describe_(expr, 'ja')).toBe(ja);
    expect(describe_(expr, 'en')).toBe(en);
  });

  it('日と曜日の AND（片方が * 始まり）では かつ / and になる', () => {
    const result = parseCronExpression('0 0 */2 * 1');
    if (!result.ok) throw new Error('invalid');
    expect(result.cron.dayFieldsOr).toBe(false);
  });
});
