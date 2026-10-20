import { describe, expect, it } from 'vitest';
import {
  buildDmarcRecord,
  buildSpfRecord,
  checkDmarc,
  checkSpf,
  dmarcHost,
  formatQuotedTxt,
  isValidIpv4,
  isValidIpv6,
  splitList,
  splitTxtChunks,
  type DmarcBuildInput,
  type SpfBuildInput,
} from './dmarc-spf-generator';

const spfBase: SpfBuildInput = {
  includes: [],
  ip4: [],
  ip6: [],
  a: false,
  mx: false,
  redirect: '',
  all: '-all',
};

const dmarcBase: DmarcBuildInput = {
  policy: 'none',
  subPolicy: '',
  pct: 100,
  rua: [],
  ruf: [],
  adkim: '',
  aspf: '',
  fo: '',
};

const codes = (r: { issues: { code: string }[] }) =>
  r.issues.map((i) => i.code);

describe('IP validation', () => {
  it('IPv4', () => {
    expect(isValidIpv4('192.0.2.1')).toBe(true);
    expect(isValidIpv4('192.0.2.0/24')).toBe(true);
    expect(isValidIpv4('256.0.0.1')).toBe(false);
    expect(isValidIpv4('192.0.2/24')).toBe(false);
    expect(isValidIpv4('192.0.2.0/33')).toBe(false);
  });
  it('IPv6', () => {
    expect(isValidIpv6('2001:db8::1')).toBe(true);
    expect(isValidIpv6('2001:db8::/32')).toBe(true);
    expect(isValidIpv6('::1')).toBe(true);
    expect(isValidIpv6('::ffff:192.0.2.1')).toBe(true);
    expect(isValidIpv6('2001:db8')).toBe(false);
    expect(isValidIpv6('2001:::1')).toBe(false);
    expect(isValidIpv6('g::1')).toBe(false);
    expect(isValidIpv6('2001:db8::/129')).toBe(false);
  });
});

describe('buildSpfRecord', () => {
  it('組み立てる', () => {
    expect(
      buildSpfRecord({
        ...spfBase,
        includes: ['_spf.google.com', 'Include:Mail.Example.com.'],
        ip4: ['192.0.2.1', 'ip4:198.51.100.0/24'],
        ip6: ['2001:db8::/32'],
        a: true,
        mx: true,
        all: '~all',
      }),
    ).toBe(
      'v=spf1 a mx ip4:192.0.2.1 ip4:198.51.100.0/24 ip6:2001:db8::/32 include:_spf.google.com include:mail.example.com ~all',
    );
  });
  it('all なしで redirect を出す', () => {
    expect(
      buildSpfRecord({ ...spfBase, all: 'none', redirect: 'Example.net' }),
    ).toBe('v=spf1 redirect=example.net');
  });
  it('all があれば redirect は出さない', () => {
    expect(buildSpfRecord({ ...spfBase, redirect: 'example.net' })).toBe(
      'v=spf1 -all',
    );
  });
  it('空でも v=spf1 を返す', () => {
    expect(buildSpfRecord({ ...spfBase, all: 'none' })).toBe('v=spf1');
  });
});

describe('checkSpf', () => {
  it('正常なレコード', () => {
    const r = checkSpf('v=spf1 include:_spf.google.com ip4:192.0.2.1 -all');
    expect(r.issues).toEqual([]);
    expect(r.lookups).toBe(1);
    expect(r.hasError).toBe(false);
  });
  it('空入力', () => {
    expect(codes(checkSpf('  '))).toEqual(['empty']);
  });
  it('v=spf1 がない・先頭でない', () => {
    expect(codes(checkSpf('include:a.com -all'))).toContain('noVersion');
    expect(codes(checkSpf('-all v=spf1'))).toContain('versionNotFirst');
  });
  it('+all は error', () => {
    const r = checkSpf('v=spf1 +all');
    expect(codes(r)).toContain('plusAll');
    expect(r.hasError).toBe(true);
    expect(codes(checkSpf('v=spf1 all'))).toContain('plusAll');
  });
  it('?all は warn', () => {
    expect(codes(checkSpf('v=spf1 ?all'))).toContain('neutralAll');
  });
  it('~all は問題なし', () => {
    expect(checkSpf('v=spf1 mx ~all').issues).toEqual([]);
  });
  it('all が複数・末尾でない', () => {
    const r = checkSpf('v=spf1 -all mx ~all');
    expect(codes(r)).toContain('multipleAll');
    expect(codes(r)).toContain('allNotLast');
  });
  it('all も redirect もない', () => {
    expect(codes(checkSpf('v=spf1 mx'))).toContain('noAll');
    expect(codes(checkSpf('v=spf1 redirect=example.net'))).not.toContain(
      'noAll',
    );
  });
  it('redirect と all の併用', () => {
    expect(codes(checkSpf('v=spf1 redirect=a.com -all'))).toContain(
      'redirectWithAll',
    );
  });
  it('ルックアップ数を数える（ip4/ip6/all は数えない）', () => {
    const r = checkSpf(
      'v=spf1 a mx include:a.com include:b.com ptr exists:c.com redirect=d.com ip4:192.0.2.1 ip6:::1 -all',
    );
    expect(r.lookups).toBe(7);
  });
  it('11 回で error、8 回で warn', () => {
    const many = (n: number) =>
      'v=spf1 ' +
      Array.from({ length: n }, (_, i) => `include:s${i}.example.com`).join(
        ' ',
      ) +
      ' -all';
    expect(codes(checkSpf(many(11)))).toContain('tooManyLookups');
    expect(codes(checkSpf(many(10)))).toContain('manyLookups');
    expect(codes(checkSpf(many(10)))).not.toContain('tooManyLookups');
    expect(checkSpf(many(7)).issues).toEqual([]);
  });
  it('ptr は warn', () => {
    expect(codes(checkSpf('v=spf1 ptr -all'))).toContain('ptr');
  });
  it('不正な IP', () => {
    expect(codes(checkSpf('v=spf1 ip4:999.1.1.1 -all'))).toContain(
      'invalidIp4',
    );
    expect(codes(checkSpf('v=spf1 ip6:zzz -all'))).toContain('invalidIp6');
  });
  it('include の値なし・不正ドメイン', () => {
    expect(codes(checkSpf('v=spf1 include: -all'))).toContain('missingValue');
    expect(codes(checkSpf('v=spf1 include:bad_domain!.com -all'))).toContain(
      'invalidDomain',
    );
  });
  it('未知のメカニズム', () => {
    expect(codes(checkSpf('v=spf1 foo:bar -all'))).toContain(
      'unknownMechanism',
    );
  });
  it('a / mx の CIDR とドメイン', () => {
    expect(checkSpf('v=spf1 a/24 mx:mail.example.com/24 -all').issues).toEqual(
      [],
    );
  });
  it('重複メカニズム', () => {
    expect(
      codes(checkSpf('v=spf1 include:a.com include:A.com -all')),
    ).toContain('duplicateMechanism');
  });
  it('長さ 255 超で分割案内、450 超で警告', () => {
    const long = (n: number) =>
      'v=spf1 ' +
      Array.from(
        { length: n },
        (_, i) => `ip4:10.0.${i % 250}.${i % 200}`,
      ).join(' ') +
      ' -all';
    const mid = checkSpf(long(25));
    expect(mid.length).toBeGreaterThan(255);
    expect(codes(mid)).toContain('needsSplit');
    expect(mid.chunks.length).toBe(2);
    expect(codes(checkSpf(long(60)))).toContain('tooLongTotal');
  });
  it('大文字・余分な空白を許容する', () => {
    expect(checkSpf('  V=SPF1   MX   -ALL ').issues).toEqual([]);
  });
});

describe('TXT 分割', () => {
  it('255 文字ごとに分割', () => {
    const s = 'a'.repeat(600);
    const chunks = splitTxtChunks(s);
    expect(chunks.map((c) => c.length)).toEqual([255, 255, 90]);
    expect(chunks.join('')).toBe(s);
  });
  it('引用符付き表記', () => {
    expect(formatQuotedTxt('v=spf1 -all')).toBe('"v=spf1 -all"');
    expect(formatQuotedTxt('a'.repeat(300)).split('" "').length).toBe(2);
  });
});

describe('helpers', () => {
  it('splitList', () => {
    expect(splitList('a.com, b.com\nc.com;  ')).toEqual([
      'a.com',
      'b.com',
      'c.com',
    ]);
  });
  it('dmarcHost', () => {
    expect(dmarcHost(' Example.COM. ')).toBe('_dmarc.example.com');
    expect(dmarcHost('')).toBe('_dmarc.example.com');
  });
});

describe('buildDmarcRecord', () => {
  it('最小構成', () => {
    expect(buildDmarcRecord(dmarcBase)).toBe('v=DMARC1; p=none');
  });
  it('全項目', () => {
    expect(
      buildDmarcRecord({
        policy: 'reject',
        subPolicy: 'quarantine',
        pct: 50,
        rua: ['dmarc@example.com', 'mailto:b@example.com'],
        ruf: ['f@example.com'],
        adkim: 's',
        aspf: 'r',
        fo: '1',
      }),
    ).toBe(
      'v=DMARC1; p=reject; sp=quarantine; pct=50; rua=mailto:dmarc@example.com,mailto:b@example.com; ruf=mailto:f@example.com; adkim=s; aspf=r; fo=1',
    );
  });
  it('pct=100 は省略する', () => {
    expect(buildDmarcRecord({ ...dmarcBase, pct: 100 })).not.toContain('pct');
  });
});

describe('checkDmarc', () => {
  it('正常なレコード', () => {
    const r = checkDmarc(
      'v=DMARC1; p=reject; rua=mailto:dmarc@example.com; adkim=s; aspf=s; fo=1:d',
    );
    expect(r.issues).toEqual([]);
  });
  it('空入力', () => {
    expect(codes(checkDmarc(''))).toEqual(['empty']);
  });
  it('v がない・先頭でない', () => {
    expect(codes(checkDmarc('p=none'))).toContain('noVersion');
    expect(codes(checkDmarc('p=none; v=DMARC1'))).toContain('versionNotFirst');
  });
  it('p がない・不正', () => {
    expect(codes(checkDmarc('v=DMARC1; rua=mailto:a@b.co'))).toContain(
      'noPolicy',
    );
    expect(codes(checkDmarc('v=DMARC1; p=block'))).toContain('invalidPolicy');
  });
  it('p が 2 番目でない', () => {
    expect(codes(checkDmarc('v=DMARC1; rua=mailto:a@b.co; p=none'))).toContain(
      'policyNotSecond',
    );
  });
  it('p=none は info', () => {
    const r = checkDmarc('v=DMARC1; p=none; rua=mailto:a@b.co');
    expect(r.issues.map((i) => [i.code, i.severity])).toEqual([
      ['policyNone', 'info'],
    ]);
    expect(r.hasError).toBe(false);
  });
  it('pct の範囲', () => {
    expect(codes(checkDmarc('v=DMARC1; p=reject; pct=150'))).toContain(
      'invalidPct',
    );
    expect(codes(checkDmarc('v=DMARC1; p=reject; pct=abc'))).toContain(
      'invalidPct',
    );
    expect(codes(checkDmarc('v=DMARC1; p=reject; pct=-5'))).toContain(
      'invalidPct',
    );
    expect(codes(checkDmarc('v=DMARC1; p=reject; pct=0'))).toContain(
      'pctPartial',
    );
    expect(codes(checkDmarc('v=DMARC1; p=reject; pct=100'))).not.toContain(
      'pctPartial',
    );
  });
  it('rua の形式', () => {
    expect(
      codes(checkDmarc('v=DMARC1; p=none; rua=dmarc@example.com')),
    ).toContain('invalidUri');
    expect(
      codes(checkDmarc('v=DMARC1; p=none; rua=mailto:not-an-email')),
    ).toContain('invalidUri');
    expect(
      codes(
        checkDmarc(
          'v=DMARC1; p=none; rua=mailto:a@example.com!10m,mailto:b@example.com',
        ),
      ),
    ).not.toContain('invalidUri');
  });
  it('adkim / aspf / fo の値', () => {
    const r = checkDmarc('v=DMARC1; p=none; adkim=x; aspf=y; fo=9');
    expect(codes(r)).toEqual(
      expect.arrayContaining(['invalidAdkim', 'invalidAspf', 'invalidFo']),
    );
  });
  it('sp が p より緩い', () => {
    expect(codes(checkDmarc('v=DMARC1; p=reject; sp=none'))).toContain(
      'subWeaker',
    );
    expect(codes(checkDmarc('v=DMARC1; p=reject; sp=zzz'))).toContain(
      'invalidSubPolicy',
    );
  });
  it('未知・重複タグと構文エラー', () => {
    const r = checkDmarc('v=DMARC1; p=none; p=reject; foo=1; bar');
    expect(codes(r)).toEqual(
      expect.arrayContaining(['duplicateTag', 'unknownTag', 'invalidSyntax']),
    );
  });
  it('末尾セミコロン・大文字小文字を許容する', () => {
    const r = checkDmarc('V=dmarc1; P=Reject; RUA=mailto:a@b.co;');
    expect(r.issues).toEqual([]);
  });
  it('rua なしは info', () => {
    expect(codes(checkDmarc('v=DMARC1; p=reject'))).toContain('noRua');
  });
});
