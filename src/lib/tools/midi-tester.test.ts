import { describe, expect, it } from 'vitest';
import {
  clampChannel,
  controllerName,
  formatBytes,
  isNoisy,
  noteOffMessage,
  noteOnMessage,
  parseMidiMessage,
  pushLog,
} from './midi-tester';

describe('parseMidiMessage', () => {
  it('ノートオン', () => {
    const e = parseMidiMessage([0x90, 60, 100])!;
    expect(e).toMatchObject({
      kind: 'noteOn',
      channel: 1,
      note: 60,
      noteName: 'C4',
      value: 100,
    });
  });

  it('ベロシティ0のノートオンはノートオフ', () => {
    expect(parseMidiMessage([0x93, 69, 0])).toMatchObject({
      kind: 'noteOff',
      channel: 4,
      noteName: 'A4',
    });
  });

  it('ノートオフ・ポリプレッシャー', () => {
    expect(parseMidiMessage([0x8f, 36, 64])).toMatchObject({
      kind: 'noteOff',
      channel: 16,
      noteName: 'C2',
    });
    expect(parseMidiMessage([0xa0, 60, 10])?.kind).toBe('polyPressure');
  });

  it('コントロールチェンジ', () => {
    expect(parseMidiMessage([0xb1, 64, 127])).toMatchObject({
      kind: 'controlChange',
      channel: 2,
      controller: 64,
      value: 127,
    });
  });

  it('プログラムチェンジ・チャンネルプレッシャーはデータ1バイト', () => {
    expect(parseMidiMessage([0xc0, 5])).toMatchObject({
      kind: 'programChange',
      value: 5,
    });
    expect(parseMidiMessage([0xd2, 99])).toMatchObject({
      kind: 'channelPressure',
      channel: 3,
      value: 99,
    });
  });

  it('ピッチベンド: 中央・最小・最大', () => {
    expect(parseMidiMessage([0xe0, 0x00, 0x40])).toMatchObject({
      value: 8192,
      bend: 0,
    });
    expect(parseMidiMessage([0xe0, 0, 0])?.bend).toBe(-8192);
    expect(parseMidiMessage([0xe0, 0x7f, 0x7f])).toMatchObject({
      value: 16383,
      bend: 8191,
    });
  });

  it('システムメッセージ', () => {
    expect(parseMidiMessage([0xf8])?.kind).toBe('clock');
    expect(parseMidiMessage([0xfe])?.kind).toBe('activeSensing');
    expect(parseMidiMessage([0xfa])?.kind).toBe('start');
    expect(parseMidiMessage([0xf0, 1, 2, 0xf7])?.kind).toBe('sysex');
    expect(parseMidiMessage([0xf9])?.kind).toBe('unknown');
    expect(parseMidiMessage([0xf8])?.channel).toBeNull();
  });

  it('不正なバイト列は null', () => {
    expect(parseMidiMessage([])).toBeNull();
    expect(parseMidiMessage([60, 100])).toBeNull();
    expect(parseMidiMessage([0x90, 60])).toBeNull();
    expect(parseMidiMessage([0x90, 200, 10])).toBeNull();
    expect(parseMidiMessage([0xc0])).toBeNull();
  });

  it('Uint8Array も受け取れる', () => {
    expect(parseMidiMessage(new Uint8Array([0x90, 61, 1]))?.noteName).toBe(
      'C#4',
    );
  });
});

describe('補助関数', () => {
  it('formatBytes', () => {
    expect(formatBytes([0x90, 0x3c, 0x64])).toBe('90 3C 64');
    expect(formatBytes([1, 2, 3, 4], 2)).toBe('01 02 …');
  });

  it('isNoisy', () => {
    expect(isNoisy(parseMidiMessage([0xf8])!)).toBe(true);
    expect(isNoisy(parseMidiMessage([0x90, 60, 1])!)).toBe(false);
  });

  it('controllerName', () => {
    expect(controllerName(64)).toBe('Sustain Pedal');
    expect(controllerName(99)).toBeNull();
  });

  it('pushLog は新しい順で上限を守り、元の配列を変えない', () => {
    const a = [1, 2, 3];
    expect(pushLog(a, 4, 3)).toEqual([4, 1, 2]);
    expect(a).toEqual([1, 2, 3]);
    expect(pushLog([], 1, 0)).toEqual([1]);
  });

  it('メッセージ生成', () => {
    expect(noteOnMessage(1, 60, 100)).toEqual([0x90, 60, 100]);
    expect(noteOffMessage(16, 60)).toEqual([0x8f, 60, 0]);
    expect(noteOnMessage(99, 500, -5)).toEqual([0x9f, 127, 0]);
    expect(noteOnMessage(NaN, NaN, NaN)).toEqual([0x90, 60, 100]);
    expect(clampChannel(0)).toBe(1);
  });
});
