import { describe, expect, it } from 'vitest';
import {
  SERVICE_IDS,
  SERVICES,
  checkParcel,
  type ParcelCheckResult,
  type ServiceId,
} from './parcel-size-checker';

function check(l: number, w: number, h: number, kg: number): ParcelCheckResult {
  const r = checkParcel({ lengthCm: l, widthCm: w, heightCm: h, weightKg: kg });
  if (r === null) throw new Error('null result');
  return r;
}

function svc(r: ParcelCheckResult, id: ServiceId) {
  return r.services.find((s) => s.id === id)!;
}

describe('checkParcel', () => {
  it('全サービスを定義順に返す', () => {
    const r = check(10, 10, 10, 1);
    expect(r.services.map((s) => s.id)).toEqual([...SERVICE_IDS]);
    expect(SERVICES.length).toBe(SERVICE_IDS.length);
  });

  it('3辺合計と辺の並び替えを返す', () => {
    const r = check(20, 40, 30, 3);
    expect(r.sum).toBe(90);
    expect(r.longest).toBe(40);
    expect(r.middle).toBe(30);
    expect(r.shortest).toBe(20);
  });

  it('宅急便: 3辺合計で区分が決まる', () => {
    const r = check(40, 30, 20, 3);
    const s = svc(r, 'yamato-takkyubin');
    expect(s.fits).toBe(true);
    expect(s.size).toBe(100);
    expect(s.decidedBy).toBe('sum');
  });

  it('宅急便: 重量のほうが大きい区分になることがある', () => {
    const r = check(20, 20, 20, 12);
    const s = svc(r, 'yamato-takkyubin');
    expect(s.size).toBe(120);
    expect(s.decidedBy).toBe('weight');
  });

  it('宅急便: 境界値（合計60cm・2kgちょうどは60、超えると80）', () => {
    expect(svc(check(20, 20, 20, 2), 'yamato-takkyubin').size).toBe(60);
    expect(svc(check(20, 20, 20.1, 2), 'yamato-takkyubin').size).toBe(80);
    expect(svc(check(20, 20, 20, 2.01), 'yamato-takkyubin').size).toBe(80);
  });

  it('宅急便: 200サイズ・30kgまで、超えると理由が出る', () => {
    expect(svc(check(100, 60, 40, 30), 'yamato-takkyubin').size).toBe(200);
    const over = svc(check(100, 60, 41, 31), 'yamato-takkyubin');
    expect(over.fits).toBe(false);
    expect(over.exceeded.map((e) => e.kind)).toEqual(['sum', 'weight']);
    expect(over.exceeded[0]).toMatchObject({ limit: 200, actual: 201 });
    expect(over.exceeded[1]).toMatchObject({ limit: 30, actual: 31 });
  });

  it('宅急便: 重量だけ超えた場合は重量のみが理由', () => {
    const over = svc(check(30, 30, 30, 31), 'yamato-takkyubin');
    expect(over.fits).toBe(false);
    expect(over.exceeded.map((e) => e.kind)).toEqual(['weight']);
  });

  it('ゆうパック: 重量は25kgまで、区分は3辺合計のみで決まる', () => {
    const light = svc(check(30, 30, 30, 20), 'yupack');
    expect(light.size).toBe(100);
    expect(light.decidedBy).toBe('sum');
    expect(svc(check(60, 60, 50, 25), 'yupack').size).toBe(170);
    const heavy = svc(check(30, 30, 30, 26), 'yupack');
    expect(heavy.fits).toBe(false);
    expect(heavy.exceeded).toEqual([{ kind: 'weight', limit: 25, actual: 26 }]);
    const big = svc(check(60, 60, 51, 5), 'yupack');
    expect(big.fits).toBe(false);
    expect(big.exceeded[0]).toMatchObject({ kind: 'sum', limit: 170 });
  });

  it('ゆうパケット: 長辺34・厚さ3・合計60・1kg', () => {
    expect(svc(check(30, 20, 3, 0.5), 'yupacket').fits).toBe(true);
    const thick = svc(check(30, 20, 3.1, 0.5), 'yupacket');
    expect(thick.fits).toBe(false);
    expect(thick.exceeded.map((e) => e.kind)).toEqual(['thickness']);
    // 長辺34・中間23・厚さ3 = 60 ちょうど
    expect(svc(check(34, 23, 3, 1), 'yupacket').fits).toBe(true);
    const sumOver = svc(check(34, 24, 3, 1), 'yupacket');
    expect(sumOver.fits).toBe(false);
    expect(sumOver.exceeded.map((e) => e.kind)).toEqual(['sum']);
    expect(svc(check(30, 20, 3, 1.01), 'yupacket').fits).toBe(false);
  });

  it('辺の入力順は結果に影響しない（厚さは最短辺で判定）', () => {
    const a = check(3, 30, 20, 0.5);
    const b = check(30, 20, 3, 0.5);
    expect(svc(a, 'yupacket').fits).toBe(true);
    expect(a.services).toEqual(b.services);
  });

  it('ネコポス: 31.2×22.8×3.5cm・1kg（小数の境界）', () => {
    expect(svc(check(31.2, 22.8, 3.5, 1), 'yamato-nekopos').fits).toBe(true);
    const over = svc(check(31.3, 22.8, 3.5, 1), 'yamato-nekopos');
    expect(over.fits).toBe(false);
    expect(over.exceeded[0]).toMatchObject({ kind: 'longest', limit: 31.2 });
  });

  it('宅急便コンパクト: 専用BOXの外寸に収まるか', () => {
    expect(svc(check(25, 20, 5, 2), 'yamato-compact').fits).toBe(true);
    const over = svc(check(26, 21, 6, 2), 'yamato-compact');
    expect(over.exceeded.map((e) => e.kind)).toEqual([
      'longest',
      'middle',
      'thickness',
    ]);
  });

  it('レターパックライトは厚さ3cm、プラスは厚さ制限なし', () => {
    expect(svc(check(34, 24.8, 3, 4), 'letterpack-light').fits).toBe(true);
    expect(svc(check(34, 24.8, 5, 4), 'letterpack-light').fits).toBe(false);
    expect(svc(check(34, 24.8, 5, 4), 'letterpack-plus').fits).toBe(true);
    expect(svc(check(34, 24.8, 5, 4.1), 'letterpack-plus').fits).toBe(false);
  });

  it('定形外郵便: 規格内と規格外', () => {
    const small = check(30, 20, 2, 0.2);
    expect(svc(small, 'teikeigai-standard').fits).toBe(true);
    expect(svc(small, 'teikeigai-irregular').fits).toBe(true);
    const box = check(40, 25, 20, 3);
    expect(svc(box, 'teikeigai-standard').fits).toBe(false);
    expect(svc(box, 'teikeigai-irregular').fits).toBe(true);
    const long = svc(check(61, 10, 10, 1), 'teikeigai-irregular');
    expect(long.fits).toBe(false);
    expect(long.exceeded.map((e) => e.kind)).toEqual(['longest']);
  });

  it('不正な入力は null', () => {
    const base = { lengthCm: 10, widthCm: 10, heightCm: 10, weightKg: 1 };
    expect(checkParcel({ ...base, lengthCm: 0 })).toBeNull();
    expect(checkParcel({ ...base, widthCm: -1 })).toBeNull();
    expect(checkParcel({ ...base, heightCm: NaN })).toBeNull();
    expect(checkParcel({ ...base, weightKg: Infinity })).toBeNull();
    expect(checkParcel({ ...base, weightKg: 0 })).toBeNull();
  });

  it('飛脚宅配便は120サイズが無く、100の次は140になる', () => {
    expect(svc(check(30, 30, 30, 8), 'sagawa-hikyaku').size).toBe(100);
    expect(svc(check(40, 40, 30, 3), 'sagawa-hikyaku').size).toBe(140);
  });

  it('飛脚宅配便は重量で区分が上がり、160サイズ・30kgまで', () => {
    const w = svc(check(20, 20, 20, 4), 'sagawa-hikyaku');
    expect(w.size).toBe(80);
    expect(w.decidedBy).toBe('weight');
    expect(svc(check(60, 60, 40, 30), 'sagawa-hikyaku').size).toBe(160);
    const over = svc(check(60, 60, 41, 30), 'sagawa-hikyaku');
    expect(over.fits).toBe(false);
    expect(over.exceeded.map((e) => e.kind)).toEqual(['sum']);
    expect(svc(check(30, 30, 30, 31), 'sagawa-hikyaku').fits).toBe(false);
  });

  it('飛脚ラージサイズ宅配便は3辺合計260cm・50kgまで', () => {
    expect(svc(check(100, 100, 60, 50), 'sagawa-large').fits).toBe(true);
    const r = svc(check(100, 100, 61, 51), 'sagawa-large');
    expect(r.fits).toBe(false);
    expect(r.exceeded.map((e) => e.kind).sort()).toEqual(['sum', 'weight']);
  });
});
