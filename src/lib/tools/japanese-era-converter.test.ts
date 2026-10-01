import { describe, expect, it } from 'vitest';
import {
  ERAS,
  isValidDate,
  warekiToWestern,
  westernToWareki,
} from './japanese-era-converter';

describe('isValidDate', () => {
  it('実在する日付はtrue', () => {
    expect(isValidDate(2024, 2, 29)).toBe(true); // うるう年
    expect(isValidDate(2024, 1, 31)).toBe(true);
  });

  it('実在しない日付はfalse', () => {
    expect(isValidDate(2023, 2, 29)).toBe(false); // 平年
    expect(isValidDate(2024, 4, 31)).toBe(false);
    expect(isValidDate(2024, 13, 1)).toBe(false);
    expect(isValidDate(2024, 1, 0)).toBe(false);
  });

  it('非整数の値はfalse', () => {
    expect(isValidDate(2024.5, 1, 1)).toBe(false);
    expect(isValidDate(2024, 1.5, 1)).toBe(false);
    expect(isValidDate(2024, 1, 1.5)).toBe(false);
    expect(isValidDate(NaN, 1, 1)).toBe(false);
  });

  it('2桁の年（0〜99）は西暦1900年代に丸められて不一致になりfalse', () => {
    // new Date(50, 0, 1) は 1950年1月1日を指すため、入力の50年とは一致しない
    expect(isValidDate(50, 1, 1)).toBe(false);
    expect(isValidDate(0, 1, 1)).toBe(false);
  });
});

describe('westernToWareki', () => {
  it('各元号の開始日ちょうどは元年と判定する', () => {
    expect(westernToWareki(1868, 1, 25)).toEqual({
      era: ERAS[0],
      eraYear: 1,
    });
    expect(westernToWareki(1912, 7, 30)).toEqual({ era: ERAS[1], eraYear: 1 });
    expect(westernToWareki(1926, 12, 25)).toEqual({
      era: ERAS[2],
      eraYear: 1,
    });
    expect(westernToWareki(1989, 1, 8)).toEqual({ era: ERAS[3], eraYear: 1 });
    expect(westernToWareki(2019, 5, 1)).toEqual({ era: ERAS[4], eraYear: 1 });
  });

  it('改元前日は前の元号の最終年になる', () => {
    expect(westernToWareki(1989, 1, 7)).toEqual({ era: ERAS[2], eraYear: 64 }); // 昭和64年
    expect(westernToWareki(2019, 4, 30)).toEqual({
      era: ERAS[3],
      eraYear: 31,
    }); // 平成31年
  });

  it('元号年をまたぐ通常の日付を変換できる', () => {
    expect(westernToWareki(2024, 6, 15)).toEqual({ era: ERAS[4], eraYear: 6 }); // 令和6年
    expect(westernToWareki(2000, 1, 1)).toEqual({
      era: ERAS[3],
      eraYear: 12,
    }); // 平成12年
  });

  it('明治より前の日付はnull', () => {
    expect(westernToWareki(1868, 1, 24)).toBeNull();
    expect(westernToWareki(1800, 1, 1)).toBeNull();
  });

  it('不正な日付はnull', () => {
    expect(westernToWareki(2024, 2, 30)).toBeNull();
  });

  it('明治→大正の改元日をまたぐ日付を正しく判定する', () => {
    expect(westernToWareki(1912, 7, 29)).toEqual({ era: ERAS[0], eraYear: 45 }); // 明治45年
    expect(westernToWareki(1912, 7, 30)).toEqual({ era: ERAS[1], eraYear: 1 }); // 大正元年
  });

  it('大正→昭和の改元日をまたぐ日付を正しく判定する', () => {
    expect(westernToWareki(1926, 12, 24)).toEqual({
      era: ERAS[1],
      eraYear: 15,
    }); // 大正15年
    expect(westernToWareki(1926, 12, 25)).toEqual({
      era: ERAS[2],
      eraYear: 1,
    }); // 昭和元年
  });

  it('遠い未来の日付でも現行元号として変換できる', () => {
    expect(westernToWareki(9999, 12, 31)).toEqual({
      era: ERAS[4],
      eraYear: 9999 - 2019 + 1,
    });
  });
});

describe('warekiToWestern', () => {
  it('元年を西暦に変換できる', () => {
    expect(warekiToWestern('令和', 1, 5, 1)).toBe(2019);
    expect(warekiToWestern('平成', 1, 1, 8)).toBe(1989);
  });

  it('通常の元号年を西暦に変換できる', () => {
    expect(warekiToWestern('令和', 6, 6, 15)).toBe(2024);
    expect(warekiToWestern('昭和', 64, 1, 7)).toBe(1989);
  });

  it('存在しない元号名はnull', () => {
    expect(warekiToWestern('存在しない元号', 1, 1, 1)).toBeNull();
  });

  it('元号年が0以下はnull', () => {
    expect(warekiToWestern('令和', 0, 1, 1)).toBeNull();
    expect(warekiToWestern('令和', -1, 1, 1)).toBeNull();
  });

  it('元号年が整数でない場合はnull', () => {
    expect(warekiToWestern('令和', 1.5, 1, 1)).toBeNull();
  });

  it('月・日が0以下や存在しない値はnull', () => {
    expect(warekiToWestern('令和', 6, 0, 1)).toBeNull();
    expect(warekiToWestern('令和', 6, 1, 0)).toBeNull();
    expect(warekiToWestern('令和', 6, 13, 1)).toBeNull();
  });

  it('次の元号に切り替わった後の日付はnull（昭和64年は1/7まで）', () => {
    expect(warekiToWestern('昭和', 64, 1, 8)).toBeNull();
  });

  it('元号開始前の日付はnull（令和元年は5/1から）', () => {
    expect(warekiToWestern('令和', 1, 4, 30)).toBeNull();
  });

  it('不正な日付はnull', () => {
    expect(warekiToWestern('令和', 6, 2, 30)).toBeNull();
  });

  it('明治・大正・昭和など他の元号も変換できる', () => {
    expect(warekiToWestern('明治', 1, 1, 25)).toBe(1868);
    expect(warekiToWestern('明治', 45, 7, 29)).toBe(1912);
    expect(warekiToWestern('大正', 1, 7, 30)).toBe(1912);
    expect(warekiToWestern('大正', 15, 12, 24)).toBe(1926);
    expect(warekiToWestern('昭和', 1, 12, 25)).toBe(1926);
  });

  it('月・日が非整数の場合はnull', () => {
    expect(warekiToWestern('令和', 6, 1.5, 1)).toBeNull();
    expect(warekiToWestern('令和', 6, 1, 1.5)).toBeNull();
  });

  it('存在しない元号年（範囲外に大きい年）はnull', () => {
    // 令和は2019年開始なので、令和100年は西暦2118年だが次の元号が無いため有効
    // ここでは明示的に「次の元号の開始日以降」になるケースを確認する
    expect(warekiToWestern('平成', 32, 1, 1)).toBeNull(); // 平成31年4月30日で終了
  });
});
