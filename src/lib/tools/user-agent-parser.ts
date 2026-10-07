export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'bot' | 'unknown';

export interface NameVersion {
  name: string;
  version: string | null;
}

export interface UserAgentResult {
  browser: NameVersion | null;
  engine: NameVersion | null;
  os: NameVersion | null;
  device: DeviceType;
  /** 端末モデル名（取得できる場合のみ）。 */
  model: string | null;
  isBot: boolean;
}

export interface ParseOptions {
  /** navigator.maxTouchPoints。デスクトップ表示のiPadOS（Macintosh を名乗る）の判別に使う。 */
  maxTouchPoints?: number;
}

const BOTS: [string, RegExp][] = [
  ['Googlebot', /Googlebot(?:-[A-Za-z]+)?(?:\/([\d.]+))?/],
  ['Bingbot', /bingbot\/([\d.]+)/i],
  ['Yahoo! Slurp', /Slurp/],
  ['DuckDuckBot', /DuckDuckBot(?:\/([\d.]+))?/],
  ['Baiduspider', /Baiduspider(?:-[a-z]+)?(?:\/([\d.]+))?/i],
  ['YandexBot', /YandexBot(?:\/([\d.]+))?/],
  ['Applebot', /Applebot(?:\/([\d.]+))?/],
  ['GPTBot', /GPTBot(?:\/([\d.]+))?/],
  ['ClaudeBot', /ClaudeBot(?:\/([\d.]+))?/],
  ['Twitterbot', /Twitterbot(?:\/([\d.]+))?/],
  ['facebookexternalhit', /facebookexternalhit(?:\/([\d.]+))?/],
  ['Slackbot', /Slackbot(?:-LinkExpanding)?(?:[ /]([\d.]+))?/],
  ['AhrefsBot', /AhrefsBot(?:\/([\d.]+))?/],
  ['curl', /^curl\/([\d.]+)/i],
  ['Wget', /^Wget\/([\d.]+)/i],
  ['python-requests', /python-requests\/([\d.]+)/i],
  ['Go-http-client', /Go-http-client\/([\d.]+)/i],
  ['Lighthouse', /Chrome-Lighthouse/],
  ['SemrushBot', /SemrushBot(?:\/([\d.]+))?/],
];
const GENERIC_BOT = /bot\b|crawler|spider/i;

function cleanVersion(v: string | undefined): string | null {
  return v ? v.replace(/_/g, '.') : null;
}

function detectBot(ua: string): NameVersion | null {
  for (const [name, re] of BOTS) {
    const m = re.exec(ua);
    if (m) return { name, version: cleanVersion(m[1]) };
  }
  if (GENERIC_BOT.test(ua)) return { name: 'Bot', version: null };
  return null;
}

function detectBrowser(ua: string): NameVersion | null {
  const m1 = /Edg(?:e|A|iOS)?\/([\d.]+)/.exec(ua);
  if (m1) return { name: 'Edge', version: m1[1] };

  const opr = /(?:OPR|OPiOS|OPT)\/([\d.]+)/.exec(ua);
  if (opr) return { name: 'Opera', version: opr[1] };
  if (/Opera\//.test(ua)) {
    const v =
      /Opera\/[\d.]+.*Version\/([\d.]+)/.exec(ua) ?? /Opera\/([\d.]+)/.exec(ua);
    return { name: 'Opera', version: v ? v[1] : null };
  }
  const operaOld = /Opera ([\d.]+)/.exec(ua);
  if (operaOld) return { name: 'Opera', version: operaOld[1] };

  const samsung = /SamsungBrowser\/([\d.]+)/.exec(ua);
  if (samsung) return { name: 'Samsung Internet', version: samsung[1] };

  const vivaldi = /Vivaldi\/([\d.]+)/.exec(ua);
  if (vivaldi) return { name: 'Vivaldi', version: vivaldi[1] };

  const uc = /UCBrowser\/([\d.]+)/.exec(ua);
  if (uc) return { name: 'UC Browser', version: uc[1] };

  // アプリ内ブラウザ（本体のブラウザ名より優先して示す）
  const line = /\bLine\/([\d.]+)/.exec(ua);
  if (line) return { name: 'LINE', version: line[1] };
  const insta = /Instagram ([\d.]+)/.exec(ua);
  if (insta) return { name: 'Instagram', version: insta[1] };
  const fb = /FBAV\/([\d.]+)/.exec(ua);
  if (fb) return { name: 'Facebook', version: fb[1] };

  const ff = /(?:Firefox|FxiOS)\/([\d.]+)/.exec(ua);
  if (ff) return { name: 'Firefox', version: ff[1] };

  const chromium = /Chromium\/([\d.]+)/.exec(ua);
  if (chromium) return { name: 'Chromium', version: chromium[1] };

  const chrome = /(?:Chrome|CriOS)\/([\d.]+)/.exec(ua);
  if (chrome) {
    if (/; wv\)/.test(ua)) {
      return { name: 'Android WebView', version: chrome[1] };
    }
    return { name: 'Chrome', version: chrome[1] };
  }

  const safari = /Version\/([\d.]+).*Safari\//.exec(ua);
  if (safari) return { name: 'Safari', version: safari[1] };

  const msie = /MSIE ([\d.]+)/.exec(ua);
  if (msie) return { name: 'Internet Explorer', version: msie[1] };
  const trident = /Trident\/.*rv:([\d.]+)/.exec(ua);
  if (trident) return { name: 'Internet Explorer', version: trident[1] };

  return null;
}

function detectEngine(
  ua: string,
  browser: NameVersion | null,
  isIos: boolean,
): NameVersion | null {
  if (/\bEdge\/[\d.]+/.test(ua) && !/Edg\//.test(ua)) {
    return { name: 'EdgeHTML', version: /Edge\/([\d.]+)/.exec(ua)![1] };
  }
  if (/Trident\//.test(ua) || /MSIE /.test(ua)) {
    const v = /Trident\/([\d.]+)/.exec(ua);
    return { name: 'Trident', version: v ? v[1] : null };
  }
  if (/Presto\//.test(ua)) {
    return { name: 'Presto', version: /Presto\/([\d.]+)/.exec(ua)![1] };
  }
  const webkit = /AppleWebKit\/([\d.]+)/.exec(ua);
  if (isIos && webkit) return { name: 'WebKit', version: webkit[1] };
  if (browser?.name === 'Firefox') {
    const rv = /rv:([\d.]+)/.exec(ua);
    return { name: 'Gecko', version: rv ? rv[1] : null };
  }
  if (/Chrome\/|Chromium\//.test(ua) && webkit) {
    const v = /(?:Chrome|Chromium)\/([\d.]+)/.exec(ua);
    return { name: 'Blink', version: v ? v[1] : null };
  }
  if (webkit) return { name: 'WebKit', version: webkit[1] };
  if (/Gecko\/[\d]+/.test(ua) && /rv:/.test(ua)) {
    return { name: 'Gecko', version: /rv:([\d.]+)/.exec(ua)![1] };
  }
  return null;
}

const WINDOWS_VERSIONS: Record<string, string> = {
  '10.0': '10 / 11',
  '6.3': '8.1',
  '6.2': '8',
  '6.1': '7',
  '6.0': 'Vista',
  '5.2': 'XP x64',
  '5.1': 'XP',
};

function detectOs(
  ua: string,
  opts: ParseOptions,
): { os: NameVersion | null; isTouchMac: boolean } {
  const ios = /(?:iPhone|iPad|iPod)[^)]*?OS (\d+(?:[_.]\d+)*)/.exec(ua);
  if (ios || /iPhone|iPad|iPod/.test(ua)) {
    const version = cleanVersion(ios?.[1]);
    const major = version ? parseInt(version, 10) : 0;
    const name = /iPad/.test(ua) && major >= 13 ? 'iPadOS' : 'iOS';
    return { os: { name, version }, isTouchMac: false };
  }
  const winPhone = /Windows Phone(?: OS)? (\d+(?:\.\d+)*)/.exec(ua);
  if (winPhone) {
    return {
      os: { name: 'Windows Phone', version: winPhone[1] },
      isTouchMac: false,
    };
  }
  const android = /Android[ /]?(\d+(?:\.\d+)*)/.exec(ua);
  if (android) {
    return { os: { name: 'Android', version: android[1] }, isTouchMac: false };
  }
  if (/Android/.test(ua)) {
    return { os: { name: 'Android', version: null }, isTouchMac: false };
  }
  const cros = /CrOS \S+ ([\d.]+)/.exec(ua);
  if (cros) {
    return { os: { name: 'ChromeOS', version: cros[1] }, isTouchMac: false };
  }
  if (/CrOS/.test(ua)) {
    return { os: { name: 'ChromeOS', version: null }, isTouchMac: false };
  }
  const win = /Windows NT (\d+\.\d+)/.exec(ua);
  if (win) {
    return {
      os: { name: 'Windows', version: WINDOWS_VERSIONS[win[1]] ?? win[1] },
      isTouchMac: false,
    };
  }
  if (/Windows/.test(ua)) {
    return { os: { name: 'Windows', version: null }, isTouchMac: false };
  }
  if (/Macintosh|Mac OS X/.test(ua)) {
    if ((opts.maxTouchPoints ?? 0) > 1) {
      return { os: { name: 'iPadOS', version: null }, isTouchMac: true };
    }
    const mac = /Mac OS X (\d+(?:[_.]\d+)*)/.exec(ua);
    return {
      os: { name: 'macOS', version: cleanVersion(mac?.[1]) },
      isTouchMac: false,
    };
  }
  if (/FreeBSD/.test(ua)) {
    return { os: { name: 'FreeBSD', version: null }, isTouchMac: false };
  }
  if (/Linux|X11/.test(ua)) {
    return { os: { name: 'Linux', version: null }, isTouchMac: false };
  }
  return { os: null, isTouchMac: false };
}

const NON_MODEL = /^(?:K|Mobile|Tablet|wv|U|rv:.*|[a-z]{2}(?:-[a-z]{2})?)$/i;

function detectAndroidModel(ua: string): string | null {
  const group = /\(([^)]*Android[^)]*)\)/.exec(ua);
  if (!group) return null;
  const parts = group[1].split(';').map((p) => p.trim());
  const idx = parts.findIndex((p) => /^Android/.test(p));
  for (const raw of parts.slice(idx + 1)) {
    const model = raw.replace(/\s+Build\/.*$/, '').trim();
    if (model && !NON_MODEL.test(model)) return model;
  }
  return null;
}

/** User-Agent文字列からブラウザ・エンジン・OS・デバイス種別を推定する。判定できない項目は null / 'unknown'。 */
export function parseUserAgent(
  input: string,
  opts: ParseOptions = {},
): UserAgentResult {
  const ua = input.trim();
  if (ua === '') {
    return {
      browser: null,
      engine: null,
      os: null,
      device: 'unknown',
      model: null,
      isBot: false,
    };
  }

  const bot = detectBot(ua);
  const { os, isTouchMac } = detectOs(ua, opts);
  const isIos = os?.name === 'iOS' || os?.name === 'iPadOS';
  const browser = bot ?? detectBrowser(ua);
  const engine = bot ? null : detectEngine(ua, browser, isIos);

  let device: DeviceType = 'unknown';
  let model: string | null = null;
  if (bot) {
    device = 'bot';
  } else if (/iPad/.test(ua) || isTouchMac) {
    device = 'tablet';
    model = 'iPad';
  } else if (/iPhone|iPod/.test(ua)) {
    device = 'mobile';
    model = /iPod/.test(ua) ? 'iPod touch' : 'iPhone';
  } else if (os?.name === 'Android') {
    device = /Mobile/.test(ua) ? 'mobile' : 'tablet';
    if (/Tablet/.test(ua)) device = 'tablet';
    model = detectAndroidModel(ua);
  } else if (/Kindle|Silk\/|PlayBook/.test(ua)) {
    device = 'tablet';
  } else if (
    /SMART-TV|SmartTV|HbbTV|Tizen|Web0S|PlayStation|Nintendo|Xbox|AppleTV|CrKey/i.test(
      ua,
    )
  ) {
    // テレビ・ゲーム機はデスクトップ/モバイルのどちらでもないため判定しない
    device = 'unknown';
  } else if (os) {
    device = /Mobile/.test(ua) ? 'mobile' : 'desktop';
  }

  return { browser, engine, os, device, model, isBot: bot !== null };
}

/** 「Chrome 120.0.0.0」のような表示用文字列にする。null は null のまま返す。 */
export function formatNameVersion(v: NameVersion | null): string | null {
  if (!v) return null;
  return v.version ? `${v.name} ${v.version}` : v.name;
}

export interface ClientHintsInput {
  brands?: { brand: string; version: string }[];
  fullVersionList?: { brand: string; version: string }[];
  mobile?: boolean;
  platform?: string;
  platformVersion?: string;
  architecture?: string;
  bitness?: string;
  model?: string;
}

export interface ClientHintsView {
  brands: string | null;
  platform: string | null;
  architecture: string | null;
  model: string | null;
  mobile: boolean | null;
}

const GREASE_BRAND = /^Not.?A.?Brand/i;

function windowsLabel(platformVersion: string): string {
  const major = parseInt(platformVersion, 10);
  if (Number.isNaN(major)) return 'Windows';
  if (major >= 13) return `Windows 11 (${platformVersion})`;
  if (major >= 1) return `Windows 10 (${platformVersion})`;
  return `Windows (${platformVersion})`;
}

/** userAgentData（高エントロピー値を含む）を表示用にまとめる。値が空の項目は null。 */
export function summarizeClientHints(h: ClientHintsInput): ClientHintsView {
  const list =
    h.fullVersionList && h.fullVersionList.length > 0
      ? h.fullVersionList
      : (h.brands ?? []);
  const brands = list
    .filter((b) => !GREASE_BRAND.test(b.brand))
    .map((b) => `${b.brand} ${b.version}`.trim())
    .join(', ');

  let platform: string | null = null;
  if (h.platform) {
    if (h.platform === 'Windows' && h.platformVersion) {
      platform = windowsLabel(h.platformVersion);
    } else {
      platform = `${h.platform} ${h.platformVersion ?? ''}`.trim();
    }
  }

  let architecture: string | null = null;
  if (h.architecture) {
    architecture = h.bitness
      ? `${h.architecture} (${h.bitness}-bit)`
      : h.architecture;
  }

  return {
    brands: brands === '' ? null : brands,
    platform,
    architecture,
    model: h.model ? h.model : null,
    mobile: typeof h.mobile === 'boolean' ? h.mobile : null,
  };
}
