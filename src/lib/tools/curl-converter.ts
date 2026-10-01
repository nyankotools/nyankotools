export type CurlOutputFormat = 'fetch' | 'axios';

/** 変換時の警告。文言は呼び出し側（UI）で辞書から引く */
export type CurlWarning =
  | { code: 'unsupported-option'; option: string }
  | { code: 'file-reference'; value: string }
  | { code: 'insecure' }
  | { code: 'body-not-allowed'; method: string }
  | { code: 'multiple-urls'; url: string };

export interface ParsedCurl {
  url: string;
  method: string;
  /** 同名ヘッダ（大文字小文字無視）は後勝ち。順序は最初の出現順 */
  headers: [string, string][];
  /** 文字列ボディ（-d / --data-* / --json） */
  body: string | null;
  /** マルチパートフォーム（-F）。name / value のペア */
  /** name / value / ファイル参照（@ または <）かどうか */
  form: [string, string, boolean][] | null;
  basicAuth: { username: string; password: string } | null;
  warnings: CurlWarning[];
}

export type ParseCurlResult =
  | { success: true; value: ParsedCurl }
  | {
      success: false;
      reason: 'empty' | 'not-curl' | 'no-url' | 'unclosed-quote';
    };

// 引数を1つ取るが、変換結果には反映しないオプション
const IGNORED_WITH_VALUE = new Set([
  '-o',
  '--output',
  '-m',
  '--max-time',
  '--connect-timeout',
  '-x',
  '--proxy',
  '-U',
  '--proxy-user',
  '-w',
  '--write-out',
  '-T',
  '--upload-file',
  '--retry',
  '--retry-delay',
  '--retry-max-time',
  '-c',
  '--cookie-jar',
  '--cacert',
  '--capath',
  '-E',
  '--cert',
  '--key',
  '-K',
  '--config',
  '--limit-rate',
  '-r',
  '--range',
  '--resolve',
  '--noproxy',
  '--max-filesize',
  '--proxy-header',
  '--aws-sigv4',
  '--max-redirs',
  '-D',
  '--dump-header',
  '--interface',
  '-z',
  '--time-cond',
  '-C',
  '--continue-at',
  '--local-port',
  '--keepalive-time',
  '--expect100-timeout',
  '--pass',
  '--request-target',
  '--connect-to',
  '--happy-eyeballs-timeout-ms',
  '--proto',
  '--proto-default',
]);

// 引数を取らず、変換結果にも影響しないオプション（警告も出さない）
const IGNORED_FLAGS = new Set([
  '-L',
  '--location',
  '--location-trusted',
  '-s',
  '--silent',
  '-S',
  '--show-error',
  '-v',
  '--verbose',
  '-i',
  '--include',
  '--compressed',
  '-f',
  '--fail',
  '-O',
  '--remote-name',
  '-N',
  '--no-buffer',
  '--http1.1',
  '--http2',
  '--http2-prior-knowledge',
  '--http3',
  '-0',
  '--http1.0',
  '-g',
  '--globoff',
  '--path-as-is',
  '--tcp-nodelay',
  '-#',
  '--progress-bar',
  '--fail-with-body',
  '-j',
  '--junk-session-cookies',
  '--no-keepalive',
  '--tr-encoding',
  '-4',
  '--ipv4',
  '-6',
  '--ipv6',
  '--ssl-no-revoke',
  '--tlsv1.0',
  '--tlsv1.1',
  '--tlsv1.2',
  '--tlsv1.3',
  '--no-progress-meter',
  '--retry-connrefused',
  '-q',
  '--disable',
  '--basic',
]);

/** 引数を取り、値をそのまま保持して意味づけするオプション（短縮形・長形式の別名を含む） */
const VALUE_OPTIONS: Record<string, string> = {
  '-X': 'request',
  '--request': 'request',
  '-H': 'header',
  '--header': 'header',
  '-d': 'data',
  '--data': 'data',
  '--data-ascii': 'data',
  '--data-raw': 'data-raw',
  '--data-binary': 'data-binary',
  '--data-urlencode': 'data-urlencode',
  '--json': 'json',
  '-F': 'form',
  '--form': 'form',
  '--form-string': 'form-string',
  '-u': 'user',
  '--user': 'user',
  '-A': 'user-agent',
  '--user-agent': 'user-agent',
  '-e': 'referer',
  '--referer': 'referer',
  '-b': 'cookie',
  '--cookie': 'cookie',
  '--url': 'url',
  '--oauth2-bearer': 'bearer',
};

/**
 * シェル風にコマンド文字列を分割する。
 * 単一引用符・二重引用符・`$'...'`（ANSI-C）・バックスラッシュエスケープ・行継続（`\` + 改行）に対応。
 * 引用符が閉じていない場合は null を返す。
 */
export function tokenizeCommand(input: string): string[] | null {
  const tokens: string[] = [];
  let current = '';
  let inToken = false;
  let i = 0;
  const n = input.length;

  while (i < n) {
    const ch = input[i];

    // 行継続（`\` + 改行）はトークン区切り（空白）として扱う
    if (ch === '\\' && (input[i + 1] === '\n' || input[i + 1] === '\r')) {
      i += input[i + 1] === '\r' && input[i + 2] === '\n' ? 3 : 2;
      if (inToken) {
        tokens.push(current);
        current = '';
        inToken = false;
      }
      continue;
    }

    if (/\s/.test(ch)) {
      if (inToken) {
        tokens.push(current);
        current = '';
        inToken = false;
      }
      i++;
      continue;
    }

    inToken = true;

    if (ch === "'") {
      const end = input.indexOf("'", i + 1);
      if (end === -1) return null;
      current += input.slice(i + 1, end);
      i = end + 1;
    } else if (ch === '$' && input[i + 1] === "'") {
      i += 2;
      let closed = false;
      while (i < n) {
        const c = input[i];
        if (c === "'") {
          closed = true;
          i++;
          break;
        }
        if (c === '\\' && i + 1 < n) {
          const next = input[i + 1];
          i += 2;
          switch (next) {
            case 'n':
              current += '\n';
              break;
            case 'r':
              current += '\r';
              break;
            case 't':
              current += '\t';
              break;
            case 'u': {
              const m = /^[0-9a-fA-F]{1,4}/.exec(input.slice(i, i + 4));
              if (m) {
                current += String.fromCharCode(parseInt(m[0], 16));
                i += m[0].length;
              } else {
                current += 'u';
              }
              break;
            }
            case 'x': {
              const m = /^[0-9a-fA-F]{1,2}/.exec(input.slice(i, i + 2));
              if (m) {
                current += String.fromCharCode(parseInt(m[0], 16));
                i += m[0].length;
              } else {
                current += 'x';
              }
              break;
            }
            default:
              // \\ \' \" などはそのまま1文字
              current += next;
          }
          continue;
        }
        current += c;
        i++;
      }
      if (!closed) return null;
    } else if (ch === '"') {
      i++;
      let closed = false;
      while (i < n) {
        const c = input[i];
        if (c === '"') {
          closed = true;
          i++;
          break;
        }
        if (c === '\\' && i + 1 < n) {
          const next = input[i + 1];
          if (next === '"' || next === '\\' || next === '$' || next === '`') {
            current += next;
            i += 2;
            continue;
          }
          if (next === '\n') {
            i += 2;
            continue;
          }
          if (next === '\r' && input[i + 2] === '\n') {
            i += 3;
            continue;
          }
        }
        current += c;
        i++;
      }
      if (!closed) return null;
    } else if (ch === '\\' && i + 1 < n) {
      current += input[i + 1];
      i += 2;
    } else {
      current += ch;
      i++;
    }
  }

  if (inToken) tokens.push(current);
  return tokens;
}

function utf8Base64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function setHeader(headers: [string, string][], name: string, value: string) {
  const lower = name.toLowerCase();
  const existing = headers.findIndex(([n]) => n.toLowerCase() === lower);
  if (existing >= 0) headers[existing] = [headers[existing][0], value];
  else headers.push([name, value]);
}

function removeHeader(headers: [string, string][], name: string) {
  const lower = name.toLowerCase();
  const index = headers.findIndex(([n]) => n.toLowerCase() === lower);
  if (index >= 0) headers.splice(index, 1);
}

function getHeader(headers: [string, string][], name: string) {
  const lower = name.toLowerCase();
  return headers.find(([n]) => n.toLowerCase() === lower)?.[1];
}

/** curl の --data-urlencode の値（`name=content` / `=content` / `content`）を変換する */
function encodeDataUrlencode(value: string): string {
  const eq = value.indexOf('=');
  if (eq === -1) return encodeURIComponent(value);
  const name = value.slice(0, eq);
  const content = encodeURIComponent(value.slice(eq + 1));
  return name === '' ? content : `${name}=${content}`;
}

export function parseCurlCommand(input: string): ParseCurlResult {
  if (input.trim() === '') return { success: false, reason: 'empty' };

  const tokens = tokenizeCommand(input.trim());
  if (tokens === null) return { success: false, reason: 'unclosed-quote' };
  if (tokens.length === 0) return { success: false, reason: 'empty' };

  // 先頭の `$`（シェルのプロンプトのコピペ）や `curl` を読み飛ばす
  let start = 0;
  if (tokens[start] === '$') start++;
  if (tokens[start] !== 'curl') return { success: false, reason: 'not-curl' };
  start++;

  const warnings: CurlWarning[] = [];
  const headers: [string, string][] = [];
  const dataParts: string[] = [];
  const form: [string, string, boolean][] = [];
  let method: string | null = null;
  let useGet = false;
  let useHead = false;
  let jsonMode = false;
  let basicAuth: ParsedCurl['basicAuth'] = null;
  let url: string | null = null;
  const extraUrls: string[] = [];

  const addUrl = (value: string) => {
    if (url === null) url = value;
    else extraUrls.push(value);
  };

  const applyValueOption = (kind: string, value: string, flag: string) => {
    switch (kind) {
      case 'request':
        method = value.toUpperCase();
        break;
      case 'header': {
        const colon = value.indexOf(':');
        if (colon > 0) {
          const name = value.slice(0, colon).trim();
          const headerValue = value.slice(colon + 1).trim();
          // `Name:` のみ（値なし）はそのヘッダを送らない指定
          if (headerValue === '') removeHeader(headers, name);
          else setHeader(headers, name, headerValue);
        } else if (value.endsWith(';') && !value.includes(':')) {
          // `Name;` は値が空のヘッダ
          setHeader(headers, value.slice(0, -1).trim(), '');
        }
        break;
      }
      case 'data':
      case 'data-raw':
      case 'data-binary':
        if (kind !== 'data-raw' && value.startsWith('@')) {
          warnings.push({ code: 'file-reference', value });
        }
        dataParts.push(value);
        break;
      case 'data-urlencode':
        if (/^[^=@]*@/.test(value) || value.startsWith('@')) {
          warnings.push({ code: 'file-reference', value });
        }
        dataParts.push(encodeDataUrlencode(value));
        break;
      case 'json':
        if (value.startsWith('@')) {
          warnings.push({ code: 'file-reference', value });
        }
        jsonMode = true;
        dataParts.push(value);
        break;
      case 'form':
      case 'form-string': {
        const eq = value.indexOf('=');
        const name = eq === -1 ? value : value.slice(0, eq);
        const fieldValue = eq === -1 ? '' : value.slice(eq + 1);
        const isFile = kind === 'form' && /^[@<]/.test(fieldValue);
        if (isFile) {
          warnings.push({ code: 'file-reference', value: fieldValue });
        }
        form.push([name, fieldValue, isFile]);
        break;
      }
      case 'user': {
        const colon = value.indexOf(':');
        basicAuth =
          colon === -1
            ? { username: value, password: '' }
            : {
                username: value.slice(0, colon),
                password: value.slice(colon + 1),
              };
        break;
      }
      case 'user-agent':
        setHeader(headers, 'User-Agent', value);
        break;
      case 'referer':
        setHeader(headers, 'Referer', value);
        break;
      case 'cookie':
        setHeader(headers, 'Cookie', value);
        break;
      case 'url':
        addUrl(value);
        break;
      case 'bearer':
        setHeader(headers, 'Authorization', `Bearer ${value}`);
        break;
      default:
        warnings.push({ code: 'unsupported-option', option: flag });
    }
  };

  for (let i = start; i < tokens.length; i++) {
    const token = tokens[i];

    if (token === '--') {
      for (const rest of tokens.slice(i + 1)) addUrl(rest);
      break;
    }

    if (token.startsWith('--')) {
      let flag = token;
      let inlineValue: string | null = null;
      const eq = token.indexOf('=');
      if (eq !== -1) {
        flag = token.slice(0, eq);
        inlineValue = token.slice(eq + 1);
      }

      const kind = VALUE_OPTIONS[flag];
      if (kind !== undefined) {
        const value = inlineValue ?? tokens[++i];
        if (value === undefined) continue;
        applyValueOption(kind, value, flag);
      } else if (IGNORED_WITH_VALUE.has(flag)) {
        if (inlineValue === null) i++;
      } else if (flag === '--get') {
        useGet = true;
      } else if (flag === '--head') {
        useHead = true;
      } else if (flag === '--insecure') {
        warnings.push({ code: 'insecure' });
      } else if (IGNORED_FLAGS.has(flag)) {
        // 変換結果に影響しない
      } else {
        warnings.push({ code: 'unsupported-option', option: flag });
      }
      continue;
    }

    if (token.startsWith('-') && token.length > 1) {
      // 短縮オプション。`-sSL` のような連結や `-XPOST` のような値の直付けに対応する
      for (let j = 1; j < token.length; j++) {
        const flag = `-${token[j]}`;
        const kind = VALUE_OPTIONS[flag];
        if (kind !== undefined) {
          const attached = token.slice(j + 1);
          const value = attached !== '' ? attached : tokens[++i];
          if (value !== undefined) applyValueOption(kind, value, flag);
          break;
        }
        if (IGNORED_WITH_VALUE.has(flag)) {
          if (token.slice(j + 1) === '') i++;
          break;
        }
        if (flag === '-G') useGet = true;
        else if (flag === '-I') useHead = true;
        else if (flag === '-k') warnings.push({ code: 'insecure' });
        else if (IGNORED_FLAGS.has(flag)) continue;
        else warnings.push({ code: 'unsupported-option', option: flag });
      }
      continue;
    }

    addUrl(token);
  }

  if (url === null) return { success: false, reason: 'no-url' };
  let finalUrl: string = url;
  if (extraUrls.length > 0) {
    warnings.push({ code: 'multiple-urls', url: finalUrl });
  }
  // curl はスキーム省略時 http:// を補う
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(finalUrl)) {
    finalUrl = `http://${finalUrl}`;
  }

  let body: string | null = dataParts.length > 0 ? dataParts.join('&') : null;
  const hasForm = form.length > 0;

  if (useGet && body !== null) {
    const hashIndex = finalUrl.indexOf('#');
    const hash = hashIndex === -1 ? '' : finalUrl.slice(hashIndex);
    const base = hashIndex === -1 ? finalUrl : finalUrl.slice(0, hashIndex);
    finalUrl = `${base}${base.includes('?') ? '&' : '?'}${body}${hash}`;
    body = null;
  }

  if (jsonMode) {
    if (getHeader(headers, 'Content-Type') === undefined) {
      setHeader(headers, 'Content-Type', 'application/json');
    }
    if (getHeader(headers, 'Accept') === undefined) {
      setHeader(headers, 'Accept', 'application/json');
    }
  } else if (
    body !== null &&
    getHeader(headers, 'Content-Type') === undefined
  ) {
    // curl は -d のとき Content-Type を自動で付ける
    setHeader(headers, 'Content-Type', 'application/x-www-form-urlencoded');
  }
  if (hasForm) {
    // multipart の Content-Type（boundary 付き）は実行時に自動設定させる
    removeHeader(headers, 'Content-Type');
  }

  const resolvedMethod =
    method ?? (useHead ? 'HEAD' : body !== null || hasForm ? 'POST' : 'GET');

  if (
    (resolvedMethod === 'GET' || resolvedMethod === 'HEAD') &&
    (body !== null || hasForm)
  ) {
    warnings.push({ code: 'body-not-allowed', method: resolvedMethod });
  }

  return {
    success: true,
    value: {
      url: finalUrl,
      method: resolvedMethod,
      headers,
      body,
      form: hasForm ? form : null,
      basicAuth,
      warnings,
    },
  };
}

const str = (value: string) => JSON.stringify(value);

function indent(text: string, spaces: number): string {
  const pad = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line, index) => (index === 0 ? line : pad + line))
    .join('\n');
}

function isJsonContentType(headers: [string, string][]): boolean {
  const type = getHeader(headers, 'Content-Type');
  return type !== undefined && /json/i.test(type);
}

/** JSONとして解釈できればそのオブジェクトを返す（できなければ undefined） */
function tryParseJson(body: string): { value: unknown } | undefined {
  try {
    const value = JSON.parse(body);
    // 再シリアライズで値が変わる場合（巨大整数の精度落ち・1.0→1・重複キー・Unicodeエスケープなど）は、
    // 元の文字列をそのまま使うため対象外にする
    const compact = body.replace(/"(?:[^"\\]|\\.)*"|\s+/g, (m) =>
      m[0] === '"' ? m : '',
    );
    if (JSON.stringify(value) !== compact) return undefined;
    return { value };
  } catch {
    return undefined;
  }
}

function formDataLines(form: [string, string, boolean][]): string[] {
  const lines = ['const formData = new FormData();'];
  for (const [name, value, isFile] of form) {
    if (isFile) {
      lines.push(
        `formData.append(${str(name)}, new Blob([/* file contents: ${value.slice(1).replace(/\*\//g, '* /')} */]));`,
      );
    } else {
      lines.push(`formData.append(${str(name)}, ${str(value)});`);
    }
  }
  return lines;
}

function headersWithAuth(parsed: ParsedCurl): [string, string][] {
  const headers = [...parsed.headers];
  if (parsed.basicAuth) {
    const { username, password } = parsed.basicAuth;
    setHeader(
      headers,
      'Authorization',
      `Basic ${utf8Base64(`${username}:${password}`)}`,
    );
  }
  return headers;
}

export function generateFetch(parsed: ParsedCurl): string {
  const headers = headersWithAuth(parsed);
  const options: string[] = [];

  if (parsed.method !== 'GET') {
    options.push(`  method: ${str(parsed.method)},`);
  }
  if (headers.length > 0) {
    const entries = headers
      .map(([name, value]) => `    ${str(name)}: ${str(value)},`)
      .join('\n');
    options.push(`  headers: {\n${entries}\n  },`);
  }
  if (parsed.form) {
    options.push('  body: formData,');
  } else if (parsed.body !== null) {
    const json = isJsonContentType(headers)
      ? tryParseJson(parsed.body)
      : undefined;
    if (json) {
      options.push(
        `  body: JSON.stringify(${indent(JSON.stringify(json.value, null, 2), 2)}),`,
      );
    } else {
      options.push(`  body: ${str(parsed.body)},`);
    }
  }

  const lines: string[] = [];
  if (parsed.form) lines.push(...formDataLines(parsed.form), '');
  lines.push(
    options.length > 0
      ? `const response = await fetch(${str(parsed.url)}, {\n${options.join('\n')}\n});`
      : `const response = await fetch(${str(parsed.url)});`,
    'const data = await response.text();',
    'console.log(data);',
  );
  return lines.join('\n');
}

// 生成コード中の文字列。`from "..."` の形だと optimizeDeps の import 検査に外部パッケージ import と誤検出されるため分割している
const AXIOS_IMPORT = ['import axios', 'from "axios";'].join(' ');

export function generateAxios(parsed: ParsedCurl): string {
  // Basic認証は axios の auth オプションに任せる
  const headers = parsed.headers;
  const options: string[] = [
    `  method: ${str(parsed.method.toLowerCase())},`,
    `  url: ${str(parsed.url)},`,
  ];

  if (headers.length > 0) {
    const entries = headers
      .map(([name, value]) => `    ${str(name)}: ${str(value)},`)
      .join('\n');
    options.push(`  headers: {\n${entries}\n  },`);
  }
  if (parsed.form) {
    options.push('  data: formData,');
  } else if (parsed.body !== null) {
    const json = isJsonContentType(headers)
      ? tryParseJson(parsed.body)
      : undefined;
    if (json) {
      options.push(
        `  data: ${indent(JSON.stringify(json.value, null, 2), 2)},`,
      );
    } else {
      options.push(`  data: ${str(parsed.body)},`);
    }
  }
  if (parsed.basicAuth) {
    options.push(
      `  auth: {\n    username: ${str(parsed.basicAuth.username)},\n    password: ${str(parsed.basicAuth.password)},\n  },`,
    );
  }

  const lines = [AXIOS_IMPORT, ''];
  if (parsed.form) lines.push(...formDataLines(parsed.form), '');
  lines.push(
    `const response = await axios({\n${options.join('\n')}\n});`,
    'console.log(response.data);',
  );
  return lines.join('\n');
}

export function generateCode(
  parsed: ParsedCurl,
  format: CurlOutputFormat,
): string {
  return format === 'axios' ? generateAxios(parsed) : generateFetch(parsed);
}

export type ConvertCurlResult =
  | { success: true; code: string; warnings: CurlWarning[] }
  | {
      success: false;
      reason: 'empty' | 'not-curl' | 'no-url' | 'unclosed-quote';
    };

export function convertCurl(
  input: string,
  format: CurlOutputFormat,
): ConvertCurlResult {
  const parsed = parseCurlCommand(input);
  if (!parsed.success) return parsed;
  return {
    success: true,
    code: generateCode(parsed.value, format),
    warnings: parsed.value.warnings,
  };
}
