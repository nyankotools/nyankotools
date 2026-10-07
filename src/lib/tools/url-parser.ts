export interface UrlParts {
  /** コロンなし（例: "https"） */
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  /** 先頭の # なし */
  hash: string;
}

export interface QueryParam {
  key: string;
  value: string;
}

export type UrlParseError = 'empty' | 'invalid' | 'invalidBase';

export type ParseUrlResult =
  | {
      success: true;
      /** 解決後の絶対URL */
      href: string;
      /** 相対URLをbase指定で解決した場合 true */
      resolvedFromBase: boolean;
      /** 「host:3000/path」のようにスキームなしで書かれ、ホスト名が空になった疑いがある場合 true */
      missingScheme: boolean;
      /** 元のクエリ文字列（先頭の ? なし）。編集していないときの再組み立てに使う */
      rawQuery: string;
      origin: string;
      parts: UrlParts;
      params: QueryParam[];
    }
  | { success: false; error: UrlParseError };

export type BuildUrlResult =
  { success: true; url: string } | { success: false; error: 'invalid' };

function toParts(url: URL): UrlParts {
  return {
    protocol: url.protocol.replace(/:$/, ''),
    username: url.username,
    password: url.password,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    hash: url.hash.replace(/^#/, ''),
  };
}

/** URL文字列を要素に分解する。相対URLは base を使って解決する。 */
export function parseUrl(input: string, base = ''): ParseUrlResult {
  const text = input.trim();
  if (text === '') return { success: false, error: 'empty' };

  let url: URL;
  let resolvedFromBase = false;
  try {
    url = new URL(text);
  } catch {
    const baseText = base.trim();
    if (baseText === '') return { success: false, error: 'invalid' };
    let baseUrl: URL;
    try {
      baseUrl = new URL(baseText);
    } catch {
      return { success: false, error: 'invalidBase' };
    }
    try {
      url = new URL(text, baseUrl);
      resolvedFromBase = true;
    } catch {
      return { success: false, error: 'invalid' };
    }
  }

  return {
    success: true,
    href: url.href,
    resolvedFromBase,
    missingScheme:
      !resolvedFromBase &&
      url.hostname === '' &&
      /^[^:/?#]+:\d+(?:[/?#]|$)/.test(text),
    rawQuery: url.search.replace(/^\?/, ''),
    origin: url.origin,
    parts: toParts(url),
    params: Array.from(url.searchParams.entries()).map(([key, value]) => ({
      key,
      value,
    })),
  };
}

/** クエリ文字列を組み立てる（先頭の ? なし）。重複キー・順序を保持する。 */
export function buildQuery(params: QueryParam[], plusForSpace = false): string {
  const search = new URLSearchParams();
  for (const { key, value } of params) search.append(key, value);
  const text = search.toString();
  return plusForSpace ? text : text.replace(/\+/g, '%20');
}

/**
 * 要素とクエリパラメータからURLを再組み立てする。
 * base には元のURL（解決後）を渡し、各要素を上書きする。
 */
export function buildUrl(
  baseHref: string,
  parts: UrlParts,
  params: QueryParam[],
  plusForSpace = false,
  /** 指定すると、params が original.params と同一のとき raw をそのまま使う */
  original?: { params: QueryParam[]; raw: string },
): BuildUrlResult {
  let url: URL;
  try {
    url = new URL(baseHref);
  } catch {
    return { success: false, error: 'invalid' };
  }

  const protocol = parts.protocol.replace(/:$/, '').trim();
  if (!/^[A-Za-z][A-Za-z0-9+.-]*$/.test(protocol)) {
    return { success: false, error: 'invalid' };
  }
  if (parts.port !== '' && !/^\d{1,5}$/.test(parts.port)) {
    return { success: false, error: 'invalid' };
  }
  if (parts.port !== '' && Number(parts.port) > 65535) {
    return { success: false, error: 'invalid' };
  }

  url.protocol = protocol;
  // special/non-special 間のスキーム変更はブラウザに無視される
  if (url.protocol.toLowerCase() !== `${protocol.toLowerCase()}:`) {
    return { success: false, error: 'invalid' };
  }
  url.username = parts.username;
  url.password = parts.password;
  if (parts.hostname !== '' || url.hostname !== '') {
    const previous = url.hostname;
    url.hostname = parts.hostname;
    // 不正なホスト名はブラウザに無視され、値が変わらない
    if (
      parts.hostname !== '' &&
      (url.hostname === '' ||
        (url.hostname === previous &&
          parts.hostname.toLowerCase() !== previous))
    ) {
      return { success: false, error: 'invalid' };
    }
  }
  url.port = parts.port;
  url.pathname = parts.pathname;
  url.hash = parts.hash;
  // search はクエリ配列から組み立てる（空のときは ? も付けない）
  const unchanged =
    original !== undefined &&
    original.params.length === params.length &&
    original.params.every(
      (p, i) => p.key === params[i].key && p.value === params[i].value,
    );
  const query = unchanged ? original.raw : buildQuery(params, plusForSpace);
  url.search = '';
  let href = url.href;
  if (query !== '') {
    const hashIndex = href.indexOf('#');
    const head = hashIndex === -1 ? href : href.slice(0, hashIndex);
    const tail = hashIndex === -1 ? '' : href.slice(hashIndex);
    href = `${head}?${query}${tail}`;
  }
  return { success: true, url: href };
}

export function addParam(params: QueryParam[], key = '', value = '') {
  return [...params, { key, value }];
}

export function removeParam(params: QueryParam[], index: number) {
  return params.filter((_, i) => i !== index);
}

export function updateParam(
  params: QueryParam[],
  index: number,
  patch: Partial<QueryParam>,
) {
  return params.map((p, i) => (i === index ? { ...p, ...patch } : p));
}

/** index の要素を delta（-1 で上、+1 で下）だけ移動する。範囲外なら変更なし。 */
export function moveParam(
  params: QueryParam[],
  index: number,
  delta: number,
): QueryParam[] {
  const target = index + delta;
  if (
    index < 0 ||
    index >= params.length ||
    target < 0 ||
    target >= params.length
  ) {
    return params;
  }
  const next = [...params];
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}

/** キーの昇順（同一キーの相対順は維持）で並べ替える。 */
export function sortParams(params: QueryParam[]): QueryParam[] {
  return params
    .map((p, i) => ({ p, i }))
    .sort((a, b) => {
      if (a.p.key < b.p.key) return -1;
      if (a.p.key > b.p.key) return 1;
      return a.i - b.i;
    })
    .map(({ p }) => p);
}

/** 2回以上現れるキーの一覧 */
export function findDuplicateKeys(params: QueryParam[]): string[] {
  const counts = new Map<string, number>();
  for (const { key } of params) counts.set(key, (counts.get(key) ?? 0) + 1);
  return Array.from(counts.entries())
    .filter(([, n]) => n > 1)
    .map(([key]) => key);
}
