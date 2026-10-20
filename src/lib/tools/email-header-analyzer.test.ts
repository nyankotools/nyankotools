import { describe, expect, it } from 'vitest';
import {
  analyzeEmailHeaders,
  decodeMimeWords,
  formatDuration,
  isAlignedDomain,
  parseAuthResults,
  parseHops,
  parseMailbox,
  parseRawHeaders,
} from './email-header-analyzer';

const SAMPLE = [
  'Delivered-To: me@example.com',
  'Received: from mx.example.com (mx.example.com [203.0.113.5])',
  '        by mail.example.com with ESMTPS id abc;',
  '        Tue, 20 Oct 2026 10:10:30 +0900 (JST)',
  'Received: from relay.sender.net (relay.sender.net [198.51.100.7])',
  '        by mx.example.com with SMTP id def;',
  '        Tue, 20 Oct 2026 10:00:00 +0900',
  'Authentication-Results: mx.example.com;',
  '        spf=pass (sender ok) smtp.mailfrom=sender.net;',
  '        dkim=pass header.d=sender.net;',
  '        dmarc=pass (p=NONE) header.from=sender.net',
  'Return-Path: <bounce@sender.net>',
  'From: "Sender" <info@sender.net>',
  'Subject: =?UTF-8?B?44GT44KT44Gr44Gh44Gv?=',
  'Date: Tue, 20 Oct 2026 10:00:00 +0900',
  'Message-ID: <1@sender.net>',
  '',
  'body text: ignored',
].join('\n');

describe('parseRawHeaders', () => {
  it('折り返し行をunfoldし、本文で止まる', () => {
    const { headers } = parseRawHeaders(SAMPLE);
    const received = headers.find((h) => h.name === 'Received');
    expect(received?.value).toContain(
      'by mail.example.com with ESMTPS id abc;',
    );
    expect(headers.some((h) => h.name === 'body text')).toBe(false);
  });

  it('CRLFでも読める', () => {
    const { headers } = parseRawHeaders('Subject: a\r\n b\r\nFrom: x@y.z\r\n');
    expect(headers[0].value).toBe('a b');
    expect(headers).toHaveLength(2);
  });

  it('読めない行を数える', () => {
    const r = parseRawHeaders('Subject: a\nnot a header\nFrom: x@y.z');
    expect(r.invalidCount).toBe(1);
    expect(r.headers).toHaveLength(2);
  });

  it('空入力は空配列', () => {
    expect(parseRawHeaders('  \n').headers).toEqual([]);
  });
});

describe('decodeMimeWords', () => {
  it('Base64(UTF-8)をデコードする', () => {
    expect(decodeMimeWords('=?UTF-8?B?44GT44KT44Gr44Gh44Gv?=')).toBe(
      'こんにちは',
    );
  });

  it('Q-encodingをデコードする', () => {
    expect(decodeMimeWords('=?UTF-8?Q?caf=C3=A9_menu?=')).toBe('café menu');
  });

  it('隣接するエンコード語を連結し、間の空白を無視する', () => {
    expect(
      decodeMimeWords('=?UTF-8?B?44GT44KT?= =?UTF-8?B?44Gr44Gh44Gv?='),
    ).toBe('こんにちは');
  });

  it('マルチバイトが語をまたいでも壊れない', () => {
    // "あ" = E3 81 82 を2語に分割
    expect(decodeMimeWords('=?UTF-8?Q?=E3=81?= =?UTF-8?Q?=82?=')).toBe('あ');
  });

  it('ISO-2022-JP と平文の混在', () => {
    expect(
      decodeMimeWords('Re: =?ISO-2022-JP?B?GyRCJDMkcyRLJEEkTxsoQg==?='),
    ).toBe('Re: こんにちは');
  });

  it('未知の文字コードはUTF-8にフォールバックし、通常文字列はそのまま', () => {
    expect(decodeMimeWords('plain subject')).toBe('plain subject');
    expect(decodeMimeWords('=?x-unknown?Q?abc?=')).toBe('abc');
  });
});

describe('parseMailbox', () => {
  it('表示名とアドレスを分ける', () => {
    const m = parseMailbox('"Taro Y" <Taro@Example.COM>');
    expect(m).toEqual({
      address: 'taro@example.com',
      domain: 'example.com',
      displayName: 'Taro Y',
    });
  });

  it('エンコードされた表示名をデコードする', () => {
    const m = parseMailbox('=?UTF-8?B?44GT44KT44Gr44Gh44Gv?= <a@b.jp>');
    expect(m?.displayName).toBe('こんにちは');
  });

  it('空のReturn-Path <> はアドレスなし', () => {
    expect(parseMailbox('<>')?.address).toBeNull();
  });

  it('未指定はnull', () => {
    expect(parseMailbox(undefined)).toBeNull();
  });

  it('山括弧なしのアドレス', () => {
    expect(parseMailbox('a@b.com')?.domain).toBe('b.com');
  });
});

describe('isAlignedDomain', () => {
  it('同一・サブドメインは一致とみなす', () => {
    expect(isAlignedDomain('a.com', 'a.com')).toBe(true);
    expect(isAlignedDomain('mail.a.com', 'a.com')).toBe(true);
    expect(isAlignedDomain('a.com', 'b.com')).toBe(false);
    expect(isAlignedDomain('xa.com', 'a.com')).toBe(false);
  });
});

describe('parseHops', () => {
  it('送信元に近い順に並べ、遅延を計算する', () => {
    const { headers } = parseRawHeaders(SAMPLE);
    const hops = parseHops(
      headers.filter((h) => h.name === 'Received').map((h) => h.value),
    );
    expect(hops).toHaveLength(2);
    expect(hops[0].from).toBe('relay.sender.net');
    expect(hops[0].ip).toBe('198.51.100.7');
    expect(hops[0].delaySeconds).toBeNull();
    expect(hops[1].by).toBe('mail.example.com');
    expect(hops[1].with).toBe('ESMTPS');
    expect(hops[1].delaySeconds).toBe(630);
  });

  it('日時が読めないホップは遅延null', () => {
    const hops = parseHops(['from a by b; invalid date', 'from c by d']);
    expect(hops.every((h) => h.delaySeconds === null)).toBe(true);
  });

  it('IPv6を取り出す', () => {
    const hops = parseHops([
      'from x (x [IPv6:2001:db8::1]) by y; Tue, 20 Oct 2026 10:00:00 +0000',
    ]);
    expect(hops[0].ip).toBe('2001:db8::1');
  });
});

describe('formatDuration', () => {
  it('各桁を整形する', () => {
    expect(formatDuration(5)).toBe('5s');
    expect(formatDuration(65)).toBe('1m 05s');
    expect(formatDuration(3723)).toBe('1h 02m 03s');
    expect(formatDuration(-30)).toBe('-30s');
  });
});

describe('parseAuthResults', () => {
  it('spf/dkim/dmarc を取り出す（コメントは無視）', () => {
    const { headers } = parseRawHeaders(SAMPLE);
    const auth = parseAuthResults(headers);
    expect(auth.map((a) => `${a.method}=${a.result}`)).toEqual([
      'spf=pass',
      'dkim=pass',
      'dmarc=pass',
    ]);
    expect(auth[1].detail).toBe('header.d=sender.net');
    expect(auth.every((a) => a.status === 'pass')).toBe(true);
  });

  it('Received-SPF も読む', () => {
    const auth = parseAuthResults([
      { name: 'Received-SPF', value: 'softfail (domain not designated)' },
    ]);
    expect(auth[0]).toMatchObject({ method: 'spf', result: 'softfail' });
    expect(auth[0].status).toBe('warn');
  });
});

describe('analyzeEmailHeaders', () => {
  it('正常なメールは警告が出ず、経路と総遅延が出る', () => {
    const { headers } = parseRawHeaders(SAMPLE);
    const a = analyzeEmailHeaders(headers);
    expect(a.summary.subject).toBe('こんにちは');
    expect(a.totalDelaySeconds).toBe(630);
    expect(a.warnings.map((w) => w.code)).toEqual(['longDelay']);
  });

  it('認証失敗とドメイン不一致を警告する', () => {
    const { headers } = parseRawHeaders(
      [
        'Authentication-Results: mx; spf=fail; dkim=none; dmarc=fail',
        'Return-Path: <x@evil.example>',
        'From: "ceo@bank.com" <a@good.example>',
        'Reply-To: <r@other.example>',
        'Received: from a by b; Tue, 20 Oct 2026 10:00:00 +0000',
        'Message-ID: <1@x>',
        'Date: Tue, 20 Oct 2026 10:00:00 +0000',
      ].join('\n'),
    );
    const codes = analyzeEmailHeaders(headers).warnings.map((w) => w.code);
    expect(codes).toEqual(
      expect.arrayContaining([
        'spfFail',
        'authNotPass',
        'dmarcFail',
        'returnPathMismatch',
        'replyToMismatch',
        'displayNameSpoof',
      ]),
    );
  });

  it('時刻の逆転を検出する', () => {
    const { headers } = parseRawHeaders(
      [
        'Received: from a by b; Tue, 20 Oct 2026 09:00:00 +0000',
        'Received: from c by d; Tue, 20 Oct 2026 10:00:00 +0000',
        'From: a@b.com',
      ].join('\n'),
    );
    const codes = analyzeEmailHeaders(headers).warnings.map((w) => w.code);
    expect(codes).toContain('negativeDelay');
  });

  it('認証結果・Received・Message-IDがないと警告する', () => {
    const codes = analyzeEmailHeaders([
      { name: 'From', value: 'a@b.com' },
    ]).warnings.map((w) => w.code);
    expect(codes).toEqual(
      expect.arrayContaining([
        'noAuthResults',
        'noReceived',
        'noMessageId',
        'noDate',
      ]),
    );
  });

  it('空の入力でも例外にならず、警告と空の要約を返す', () => {
    const r = analyzeEmailHeaders([]);
    expect(r.hops).toEqual([]);
    expect(r.totalDelaySeconds).toBeNull();
    expect(r.auth).toEqual([]);
    expect(r.summary.subject).toBe('');
    expect(r.summary.from).toBeNull();
    expect(r.warnings.map((w) => w.code)).toContain('noAuthResults');
  });
});

describe('エッジケース（改行・マルチバイト）', () => {
  it('CRのみの改行（旧Mac形式）でも折り返しを含めて読める', () => {
    const r = parseRawHeaders('Subject: a\r  b\rFrom: x@y.z\r\rbody');
    expect(r.headers).toEqual([
      { name: 'Subject', value: 'a b' },
      { name: 'From', value: 'x@y.z' },
    ]);
    expect(r.invalidCount).toBe(0);
  });

  it('絵文字（4バイトUTF-8）を含むBase64の件名をデコードできる', () => {
    // "🐱 nyanko" を UTF-8 で Base64 化したもの
    const b64 = Buffer.from('🐱 nyanko', 'utf8').toString('base64');
    expect(decodeMimeWords(`=?UTF-8?B?${b64}?=`)).toBe('🐱 nyanko');
  });
});
