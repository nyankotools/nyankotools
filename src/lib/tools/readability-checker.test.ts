import { describe, expect, it } from 'vitest';
import {
  analyze,
  endingKey,
  scoreLevel,
  splitSentences,
  startsWithConjunction,
} from './readability-checker';

describe('splitSentences', () => {
  it('句点・感嘆符・疑問符で分割し、連結すると元に戻る', () => {
    const text = '今日は晴れです。明日は雨？そうですか！\nよい一日を';
    const parts = splitSentences(text);
    expect(parts).toHaveLength(4);
    expect(parts.join('')).toBe(text);
  });

  it('閉じ括弧は直前の文に含める', () => {
    const parts = splitSentences('彼は「行く。」と言った。');
    expect(parts[0]).toBe('彼は「行く。」');
  });

  it('改行で文を区切り、空行は無視する', () => {
    const parts = splitSentences('一行目\n\n\n二行目');
    expect(parts).toHaveLength(2);
    expect(parts.join('')).toBe('一行目\n\n\n二行目');
  });

  it('英文のピリオドは後ろが空白か末尾のときだけ文末とみなす', () => {
    expect(splitSentences('Pi is 3.14. Yes.')).toHaveLength(2);
  });

  it('空文字・空白のみは空配列', () => {
    expect(splitSentences('')).toEqual([]);
    expect(splitSentences('  \n ')).toEqual([]);
  });
});

describe('endingKey / startsWithConjunction', () => {
  it('既知の文末表現を取り出す', () => {
    expect(endingKey('これはペンです。')).toBe('です');
    expect(endingKey('走りました。')).toBe('ました');
    expect(endingKey('「行く」と言った。')).toBe('た');
  });

  it('日本語を含まない文は対象外', () => {
    expect(endingKey('Hello world.')).toBe('');
  });

  it('接続詞で始まる文を判定する', () => {
    expect(startsWithConjunction('しかし、雨だった。')).toBe(true);
    expect(startsWithConjunction('「また会おう」と言った。')).toBe(true);
    expect(startsWithConjunction('However, it works.')).toBe(true);
    expect(startsWithConjunction('猫が好きだ。')).toBe(false);
  });
});

describe('analyze', () => {
  it('空入力は文なし・スコアnull', () => {
    const r = analyze('');
    expect(r.sentences).toEqual([]);
    expect(r.score).toBeNull();
    expect(r.metrics.find((m) => m.key === 'kanjiRatio')?.value).toBeNull();
  });

  it('短く問題のない文は満点', () => {
    const r = analyze('猫が好きだ。犬も飼いたい。');
    expect(r.sentences.every((s) => s.issues.length === 0)).toBe(true);
    expect(r.score).toBe(100);
  });

  it('長すぎる文を指摘し、しきい値を変えられる', () => {
    const text = 'あ'.repeat(70) + '。';
    expect(analyze(text).sentences[0].issues).toContain('long');
    expect(analyze(text, { maxLength: 100 }).sentences[0].issues).not.toContain(
      'long',
    );
  });

  it('不正なオプション値は既定値に戻る', () => {
    const text = 'あ'.repeat(70) + '。';
    expect(
      analyze(text, { maxLength: Number.NaN }).sentences[0].issues,
    ).toContain('long');
    expect(analyze(text, { maxLength: -1 }).sentences[0].issues).toContain(
      'long',
    );
  });

  it('同じ文末が3回続くと指摘し、2回では指摘しない', () => {
    const three = analyze('私は走る。彼は眠る。母は帰る。');
    expect(
      three.sentences.map((s) => s.issues.includes('endingRepeat')),
    ).toEqual([true, true, true]);
    const two = analyze('私は走る。彼は眠る。母は泳いだ。');
    expect(two.sentences.some((s) => s.issues.includes('endingRepeat'))).toBe(
      false,
    );
  });

  it('接続詞で始まる文が連続すると指摘する', () => {
    const r = analyze('雨が降った。しかし、行った。そして、帰った。');
    expect(r.sentences.map((s) => s.issues.includes('conjunctionRun'))).toEqual(
      [false, true, true],
    );
  });

  it('読点が多すぎる文と、長いのに読点が無い文を指摘する', () => {
    const many = analyze('りんご、みかん、ぶどう、もも、すいかを買った。');
    expect(many.sentences[0].issues).toContain('commaMany');
    const none = analyze('あ'.repeat(45) + '。');
    expect(none.sentences[0].issues).toContain('commaNone');
  });

  it('漢字率は日本語文字に対する割合で、十分な量があるときだけ警告する', () => {
    const short = analyze('漢字だけ。');
    expect(short.metrics.find((m) => m.key === 'kanjiRatio')?.warn).toBe(false);
    const heavy = analyze(
      '国家経済政策総合調査研究報告書提出期限厳守事項確認。'.repeat(2),
    );
    const m = heavy.metrics.find((x) => x.key === 'kanjiRatio');
    expect(m?.value).toBeGreaterThan(0.9);
    expect(m?.warn).toBe(true);
  });

  it('英文は語数×3で長さを換算する', () => {
    const r = analyze('One two three four five.');
    expect(r.sentences[0].length).toBe(15);
  });

  it('問題が重なっても総合スコアは0未満にならない', () => {
    const longSentence = 'あ'.repeat(70) + '。';
    const r = analyze(longSentence.repeat(3));
    expect(r.sentences.every((s) => s.issues.length >= 3)).toBe(true);
    expect(r.score).toBe(0);
  });

  it('CRLFを改行として扱い、スコアは0〜100に収まる', () => {
    const r = analyze(('あ'.repeat(80) + '\r\n').repeat(5));
    expect(r.sentences).toHaveLength(5);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });
});

describe('scoreLevel', () => {
  it('しきい値で区分する', () => {
    expect(scoreLevel(100)).toBe('good');
    expect(scoreLevel(80)).toBe('good');
    expect(scoreLevel(79)).toBe('fair');
    expect(scoreLevel(60)).toBe('fair');
    expect(scoreLevel(59)).toBe('poor');
  });
});
