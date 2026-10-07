import { describe, expect, it } from 'vitest';
import {
  formatNameVersion,
  parseUserAgent,
  summarizeClientHints,
} from './user-agent-parser';

const UA = {
  chromeWin:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  edgeWin:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.2210.91',
  firefoxWin:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  safariMac:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  safariIphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  chromeIphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1',
  safariIpad:
    'Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  chromeAndroid:
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
  chromeAndroidReduced:
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  chromeAndroidTablet:
    'Mozilla/5.0 (Linux; Android 12; SM-X906C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  samsung:
    'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36',
  firefoxAndroid:
    'Mozilla/5.0 (Android 13; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0',
  oldAndroid:
    'Mozilla/5.0 (Linux; U; Android 4.0.3; ja-jp; SC-06D Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
  opera:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0',
  ie11: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
  linux:
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  chromeOs:
    'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  googlebot:
    'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.71 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
};

describe('parseUserAgent: デスクトップ', () => {
  it('Windows の Chrome', () => {
    const r = parseUserAgent(UA.chromeWin);
    expect(formatNameVersion(r.browser)).toBe('Chrome 120.0.0.0');
    expect(r.engine).toEqual({ name: 'Blink', version: '120.0.0.0' });
    expect(r.os).toEqual({ name: 'Windows', version: '10 / 11' });
    expect(r.device).toBe('desktop');
    expect(r.model).toBeNull();
    expect(r.isBot).toBe(false);
  });

  it('Edge は Chrome トークンを含んでいても Edge と判定する', () => {
    const r = parseUserAgent(UA.edgeWin);
    expect(r.browser).toEqual({ name: 'Edge', version: '120.0.2210.91' });
    expect(r.engine?.name).toBe('Blink');
  });

  it('Opera は OPR トークンで判定する', () => {
    expect(parseUserAgent(UA.opera).browser).toEqual({
      name: 'Opera',
      version: '106.0.0.0',
    });
  });

  it('Firefox は Gecko（rv 値）', () => {
    const r = parseUserAgent(UA.firefoxWin);
    expect(r.browser).toEqual({ name: 'Firefox', version: '121.0' });
    expect(r.engine).toEqual({ name: 'Gecko', version: '121.0' });
  });

  it('macOS の Safari はバージョンの _ を . に直す', () => {
    const r = parseUserAgent(UA.safariMac);
    expect(r.browser).toEqual({ name: 'Safari', version: '17.2' });
    expect(r.engine).toEqual({ name: 'WebKit', version: '605.1.15' });
    expect(r.os).toEqual({ name: 'macOS', version: '10.15.7' });
    expect(r.device).toBe('desktop');
  });

  it('Macintosh を名乗ってもタッチ点が複数なら iPadOS のタブレット', () => {
    const r = parseUserAgent(UA.safariMac, { maxTouchPoints: 5 });
    expect(r.os?.name).toBe('iPadOS');
    expect(r.device).toBe('tablet');
    expect(r.model).toBe('iPad');
    expect(parseUserAgent(UA.safariMac, { maxTouchPoints: 0 }).os?.name).toBe(
      'macOS',
    );
  });

  it('IE11 は Trident', () => {
    const r = parseUserAgent(UA.ie11);
    expect(r.browser).toEqual({ name: 'Internet Explorer', version: '11.0' });
    expect(r.engine).toEqual({ name: 'Trident', version: '7.0' });
    expect(r.os).toEqual({ name: 'Windows', version: '7' });
  });

  it('Linux と ChromeOS', () => {
    expect(parseUserAgent(UA.linux).os).toEqual({
      name: 'Linux',
      version: null,
    });
    const cros = parseUserAgent(UA.chromeOs);
    expect(cros.os).toEqual({ name: 'ChromeOS', version: '14541.0.0' });
    expect(cros.device).toBe('desktop');
  });
});

describe('parseUserAgent: モバイル', () => {
  it('iPhone の Safari', () => {
    const r = parseUserAgent(UA.safariIphone);
    expect(r.browser).toEqual({ name: 'Safari', version: '17.2' });
    expect(r.os).toEqual({ name: 'iOS', version: '17.2' });
    expect(r.device).toBe('mobile');
    expect(r.model).toBe('iPhone');
  });

  it('iOS の Chrome（CriOS）でもエンジンは WebKit', () => {
    const r = parseUserAgent(UA.chromeIphone);
    expect(r.browser).toEqual({ name: 'Chrome', version: '120.0.6099.119' });
    expect(r.engine?.name).toBe('WebKit');
  });

  it('iPad はタブレット（iPadOS 13 以上は iPadOS 表記）', () => {
    const r = parseUserAgent(UA.safariIpad);
    expect(r.os).toEqual({ name: 'iPadOS', version: '16.6' });
    expect(r.device).toBe('tablet');
  });

  it('Android の Chrome は機種名を取り出す', () => {
    const r = parseUserAgent(UA.chromeAndroid);
    expect(r.os).toEqual({ name: 'Android', version: '13' });
    expect(r.device).toBe('mobile');
    expect(r.model).toBe('Pixel 7');
  });

  it('UA 短縮表記（K）は機種不明として扱う', () => {
    const r = parseUserAgent(UA.chromeAndroidReduced);
    expect(r.model).toBeNull();
    expect(r.device).toBe('mobile');
  });

  it('Mobile を含まない Android はタブレット', () => {
    const r = parseUserAgent(UA.chromeAndroidTablet);
    expect(r.device).toBe('tablet');
    expect(r.model).toBe('SM-X906C');
  });

  it('Samsung Internet を Chrome より優先する', () => {
    const r = parseUserAgent(UA.samsung);
    expect(r.browser).toEqual({ name: 'Samsung Internet', version: '23.0' });
    expect(r.model).toBe('SM-S918B');
  });

  it('Android の Firefox は Gecko で機種は不明', () => {
    const r = parseUserAgent(UA.firefoxAndroid);
    expect(r.engine?.name).toBe('Gecko');
    expect(r.device).toBe('mobile');
    expect(r.model).toBeNull();
  });

  it('古い Android UA のロケール表記を機種名にしない', () => {
    const r = parseUserAgent(UA.oldAndroid);
    expect(r.model).toBe('SC-06D');
    expect(r.os).toEqual({ name: 'Android', version: '4.0.3' });
    expect(r.browser?.name).toBe('Safari');
  });

  it('WebView を判定する', () => {
    const ua =
      'Mozilla/5.0 (Linux; Android 12; Pixel 6 Build/SD1A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36';
    expect(parseUserAgent(ua).browser?.name).toBe('Android WebView');
  });

  it('LINE アプリ内ブラウザを判定する', () => {
    const ua = `${UA.safariIphone} Line/13.20.0`;
    expect(parseUserAgent(ua).browser).toEqual({
      name: 'LINE',
      version: '13.20.0',
    });
  });
});

describe('parseUserAgent: ボット・不明', () => {
  it('Googlebot はボットとして扱う', () => {
    const r = parseUserAgent(UA.googlebot);
    expect(r.isBot).toBe(true);
    expect(r.device).toBe('bot');
    expect(r.browser).toEqual({ name: 'Googlebot', version: '2.1' });
    expect(r.engine).toBeNull();
  });

  it('汎用 bot 表記', () => {
    const r = parseUserAgent('SomeCrawler/1.0');
    expect(r.isBot).toBe(true);
  });

  it('空文字・空白のみは全て不明', () => {
    for (const s of ['', '   \n']) {
      const r = parseUserAgent(s);
      expect(r.browser).toBeNull();
      expect(r.engine).toBeNull();
      expect(r.os).toBeNull();
      expect(r.device).toBe('unknown');
    }
  });

  it('解釈できない文字列は null / unknown', () => {
    const r = parseUserAgent('hello world');
    expect(r.browser).toBeNull();
    expect(r.os).toBeNull();
    expect(r.device).toBe('unknown');
    expect(r.isBot).toBe(false);
  });

  it('curl などは OS 不明のまま', () => {
    expect(parseUserAgent('curl/8.4.0').os).toBeNull();
  });

  it('前後の空白は無視する', () => {
    expect(parseUserAgent(`  ${UA.firefoxWin}\n`).browser?.name).toBe(
      'Firefox',
    );
  });
});

describe('formatNameVersion', () => {
  it('バージョンの有無で整形する', () => {
    expect(formatNameVersion(null)).toBeNull();
    expect(formatNameVersion({ name: 'Linux', version: null })).toBe('Linux');
    expect(formatNameVersion({ name: 'Edge', version: '1.2' })).toBe(
      'Edge 1.2',
    );
  });
});

describe('summarizeClientHints', () => {
  it('GREASE ブランドを除き fullVersionList を優先する', () => {
    const r = summarizeClientHints({
      brands: [
        { brand: 'Not_A Brand', version: '8' },
        { brand: 'Chromium', version: '120' },
      ],
      fullVersionList: [
        { brand: 'Not_A Brand', version: '8.0.0.0' },
        { brand: 'Chromium', version: '120.0.6099.109' },
        { brand: 'Google Chrome', version: '120.0.6099.109' },
      ],
    });
    expect(r.brands).toBe(
      'Chromium 120.0.6099.109, Google Chrome 120.0.6099.109',
    );
  });

  it('Windows 11 を platformVersion から判定する', () => {
    expect(
      summarizeClientHints({ platform: 'Windows', platformVersion: '15.0.0' })
        .platform,
    ).toBe('Windows 11 (15.0.0)');
    expect(
      summarizeClientHints({ platform: 'Windows', platformVersion: '10.0.0' })
        .platform,
    ).toBe('Windows 10 (10.0.0)');
    expect(
      summarizeClientHints({ platform: 'Windows', platformVersion: '0.1.0' })
        .platform,
    ).toBe('Windows (0.1.0)');
  });

  it('アーキテクチャ・機種・mobile を整形し、空は null', () => {
    const r = summarizeClientHints({
      platform: 'Android',
      platformVersion: '13.0.0',
      architecture: 'arm',
      bitness: '64',
      model: 'Pixel 7',
      mobile: true,
    });
    expect(r.platform).toBe('Android 13.0.0');
    expect(r.architecture).toBe('arm (64-bit)');
    expect(r.model).toBe('Pixel 7');
    expect(r.mobile).toBe(true);

    const empty = summarizeClientHints({ model: '' });
    expect(empty).toEqual({
      brands: null,
      platform: null,
      architecture: null,
      model: null,
      mobile: null,
    });
  });
});

describe('parseUserAgent: ツール・テレビ・Windows Phone', () => {
  it('curl / python-requests はボット扱い', () => {
    expect(parseUserAgent('curl/8.4.0').isBot).toBe(true);
    expect(parseUserAgent('python-requests/2.31.0').browser?.name).toBe(
      'python-requests',
    );
  });

  it('スマートTVは desktop にしない', () => {
    const r = parseUserAgent(
      'Mozilla/5.0 (SMART-TV; Linux; Tizen 6.0) AppleWebKit/537.36 (KHTML, like Gecko) Version/6.0 TV Safari/537.36',
    );
    expect(r.device).toBe('unknown');
  });

  it('Windows Phone は Android と判定しない', () => {
    const r = parseUserAgent(
      'Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Mobile Safari/537.36 Edge/15.15254',
    );
    expect(r.os?.name).toBe('Windows Phone');
    expect(r.device).toBe('mobile');
  });
});
