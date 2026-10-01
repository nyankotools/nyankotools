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
