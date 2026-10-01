import {
  FIELD_RANGES,
  parseFieldItems,
  type CronFieldItem,
  type ParsedCron,
} from './cron-parser';

export type CronDescriptionLocale = 'ja' | 'en';

/** cron 式の各フィールドと全体の説明文を、言語ごとの文法で組み立てる関数群を返す */
export function createCronDescriber(locale: CronDescriptionLocale) {
  const isJa = locale === 'ja';

  const WEEKDAY_NAMES_JA = [
    '日曜日',
    '月曜日',
    '火曜日',
    '水曜日',
    '木曜日',
    '金曜日',
    '土曜日',
  ];
  const WEEKDAY_NAMES_EN = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const WEEKDAY_NAMES = isJa ? WEEKDAY_NAMES_JA : WEEKDAY_NAMES_EN;

  type UnitKey = 'minute' | 'hour' | 'day' | 'month';
  const UNITS: Record<
    UnitKey,
    { ja: string; jaPeriod?: string; en: string; enPlural: string }
  > = {
    minute: { ja: '分', en: 'minute', enPlural: 'minutes' },
    // 「時」「月」は時刻・月名（3時、3月=March）を指す単位だが、「〜ごと」という
    // 間隔（周期）を表す場合はそれぞれ「2時間ごと」「3ヶ月ごと」が正しいため、
    // 間隔専用の単位を別に持たせる
    hour: { ja: '時', jaPeriod: '時間', en: 'hour', enPlural: 'hours' },
    day: { ja: '日', en: 'day', enPlural: 'days' },
    month: { ja: '月', jaPeriod: 'ヶ月', en: 'month', enPlural: 'months' },
  };

  // 英語の複数項目は "A, B, and C" のように接続する
  const listFormatterEn = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
  });

  function describeItemJa(
    item: CronFieldItem,
    unit: string,
    periodUnit: string,
  ): string {
    if (item.isWildcard) {
      return item.step !== undefined
        ? `${item.step}${periodUnit}ごと`
        : `毎${unit}`;
    }
    if (item.step !== undefined) {
      return `${item.start}${unit}から${item.end}${unit}の${item.step}${periodUnit}ごと`;
    }
    if (item.end !== item.start) {
      return `${item.start}${unit}から${item.end}${unit}`;
    }
    return `${item.start}${unit}`;
  }

  function describeItemEn(
    item: CronFieldItem,
    unitSingular: string,
    unitPlural: string,
  ): string {
    if (item.isWildcard) {
      return item.step !== undefined
        ? `every ${item.step} ${unitPlural}`
        : `every ${unitSingular}`;
    }
    if (item.step !== undefined) {
      return `every ${item.step} ${unitPlural} from ${item.start} through ${item.end}`;
    }
    if (item.end !== item.start) {
      return `${item.start}-${item.end}`;
    }
    return `${item.start}`;
  }

  function describeField(
    raw: string,
    unitKey: UnitKey,
    min: number,
    max: number,
  ): string {
    const items = parseFieldItems(raw, min, max);
    if (!items) return raw;
    const unit = UNITS[unitKey];
    return isJa
      ? items
          .map((item) =>
            describeItemJa(item, unit.ja, unit.jaPeriod ?? unit.ja),
          )
          .join('、')
      : listFormatterEn.format(
          items.map((item) => describeItemEn(item, unit.en, unit.enPlural)),
        );
  }

  function describeWeekdayItem(item: CronFieldItem): string {
    if (item.isWildcard) return isJa ? '毎日' : 'every day';
    if (item.end !== item.start) {
      return isJa
        ? `${WEEKDAY_NAMES[item.start]}から${WEEKDAY_NAMES[item.end]}`
        : `${WEEKDAY_NAMES[item.start]} through ${WEEKDAY_NAMES[item.end]}`;
    }
    return WEEKDAY_NAMES[item.start];
  }

  function describeWeekdays(raw: string): string {
    const items = parseFieldItems(raw, 0, 7);
    if (!items) return raw;
    const mapped = items
      .map((item) => ({
        ...item,
        start: item.start % 7,
        end: item.end % 7,
      }))
      .map((item) => describeWeekdayItem(item));
    return isJa ? mapped.join('、') : listFormatterEn.format(mapped);
  }

  function combineHourMinute(hourRaw: string, minuteRaw: string): string {
    const hourIsStar = hourRaw === '*';
    const minuteIsStar = minuteRaw === '*';

    if (hourIsStar && minuteIsStar) return isJa ? '毎分' : 'every minute';

    if (hourIsStar) {
      const minuteDesc = describeField(
        minuteRaw,
        'minute',
        ...FIELD_RANGES.minute,
      );
      if (isJa) return `毎時${minuteDesc}`;
      // ステップ指定（例: */15 → "every 15 minutes"）は既に完結した文なので、
      // 「every hour at minute」で二重に囲むと "minute every 15 minutes" のように破綻する
      return minuteDesc.includes('every')
        ? minuteDesc
        : `every hour at minute ${minuteDesc}`;
    }

    const hourDesc = describeField(hourRaw, 'hour', ...FIELD_RANGES.hour);
    if (minuteIsStar) {
      if (isJa) return `${hourDesc}の間、毎分`;
      return hourDesc.includes('every')
        ? `${hourDesc}, every minute`
        : `every minute during hour ${hourDesc}`;
    }

    const minuteDesc = describeField(
      minuteRaw,
      'minute',
      ...FIELD_RANGES.minute,
    );
    if (isJa) {
      const joiner =
        minuteDesc.includes('ごと') ||
        hourDesc.includes('ごと') ||
        hourDesc.includes('から')
          ? 'の'
          : '';
      return `${hourDesc}${joiner}${minuteDesc}`;
    }

    const hourHasEvery = hourDesc.includes('every');
    const minuteHasEvery = minuteDesc.includes('every');
    if (hourHasEvery && minuteHasEvery) return `${hourDesc}, ${minuteDesc}`;
    if (hourHasEvery) return `${hourDesc}, at minute ${minuteDesc}`;
    if (minuteHasEvery) return `during hours ${hourDesc}, ${minuteDesc}`;
    return `at hour ${hourDesc}, minute ${minuteDesc}`;
  }

  function buildDescription(cron: ParsedCron): string {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = cron.fields;

    if (
      minute === '*' &&
      hour === '*' &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      return isJa ? '1分ごとに実行されます（毎分実行）' : 'Runs every minute.';
    }

    if (!isJa) {
      const parts: string[] = [];
      // 単一の間隔指定（"every 3 months" など）は既に完結しているので "in month" / "on day" で囲まない。
      // "1 and every 3 months" のような混在リストは囲む
      const withPrefix = (
        raw: string,
        unitKey: UnitKey,
        range: readonly [number, number],
        prefix: string,
      ) => {
        const desc = describeField(raw, unitKey, ...range);
        const items = parseFieldItems(raw, ...range);
        return items?.length === 1 && items[0].step !== undefined
          ? desc
          : `${prefix} ${desc}`;
      };
      if (cron.monthRestricted) {
        parts.push(withPrefix(month, 'month', FIELD_RANGES.month, 'in month'));
      }
      const dayDesc = cron.dayOfMonthRestricted
        ? withPrefix(dayOfMonth, 'day', FIELD_RANGES.dayOfMonth, 'on day')
        : '';
      if (cron.dayOfMonthRestricted && cron.dayOfWeekRestricted) {
        parts.push(
          `${dayDesc} ${cron.dayFieldsOr ? 'or' : 'and'} ${describeWeekdays(dayOfWeek)}`,
        );
      } else if (cron.dayOfMonthRestricted) {
        parts.push(dayDesc);
      } else if (cron.dayOfWeekRestricted) {
        parts.push(`on ${describeWeekdays(dayOfWeek)}`);
      }

      const timePart = combineHourMinute(hour, minute);
      return parts.length > 0
        ? `Runs ${parts.join(', ')}, ${timePart}.`
        : `Runs ${timePart}.`;
    }

    let prefix = '';
    let dayPart = '';

    if (cron.monthRestricted) {
      prefix = `毎年${describeField(month, 'month', ...FIELD_RANGES.month)}の`;
    }

    if (cron.dayOfMonthRestricted && cron.dayOfWeekRestricted) {
      dayPart = `${describeField(dayOfMonth, 'day', ...FIELD_RANGES.dayOfMonth)}${cron.dayFieldsOr ? 'または' : 'かつ'}${describeWeekdays(dayOfWeek)}の`;
    } else if (cron.dayOfMonthRestricted) {
      dayPart = `${describeField(dayOfMonth, 'day', ...FIELD_RANGES.dayOfMonth)}の`;
      if (!cron.monthRestricted) prefix = '毎月';
    } else if (cron.dayOfWeekRestricted) {
      dayPart = `${describeWeekdays(dayOfWeek)}の`;
      if (!cron.monthRestricted) prefix = '毎週';
    } else if (!cron.monthRestricted) {
      // 時が*の場合は「毎時」の時点で毎日の意味を含むため、「毎日」は付けない
      prefix = hour === '*' ? '' : '毎日';
    }

    const timePart = combineHourMinute(hour, minute);
    const ending = timePart.endsWith('毎分')
      ? '実行されます'
      : 'に実行されます';

    return `${prefix}${dayPart}${timePart}${ending}`;
  }

  return { describeField, describeWeekdays, buildDescription };
}
