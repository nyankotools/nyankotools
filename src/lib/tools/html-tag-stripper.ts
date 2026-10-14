export interface StripOptions {
  /** ブロック要素（p・div・li・br など）の位置で改行する。false なら空白1つにする */
  keepBlockBreaks: boolean;
  /** HTMLの規則どおり連続する空白・改行を1つにまとめ、行頭行末の空白を削る（pre内は保持） */
  collapseWhitespace: boolean;
  /** 連続する空行を1つにまとめ、先頭・末尾の空行を削る */
  compressBlankLines: boolean;
  /** リンクのURLを「テキスト (URL)」の形で残す */
  keepLinkUrls: boolean;
  /** 画像の alt テキストを残す */
  keepImageAlt: boolean;
  /** &amp; や &#12354; などの文字参照をデコードする */
  decodeEntities: boolean;
}

export const defaultStripOptions: StripOptions = {
  keepBlockBreaks: true,
  collapseWhitespace: true,
  compressBlankLines: true,
  keepLinkUrls: false,
  keepImageAlt: false,
  decodeEntities: true,
};

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  copy: '©',
  reg: '®',
  trade: '™',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  laquo: '«',
  raquo: '»',
  bull: '•',
  middot: '·',
  yen: '¥',
  euro: '€',
  pound: '£',
  cent: '¢',
  sect: '§',
  para: '¶',
  deg: '°',
  plusmn: '±',
  times: '×',
  divide: '÷',
  frac12: '½',
  larr: '←',
  rarr: '→',
  uarr: '↑',
  darr: '↓',
  hearts: '♥',
  ensp: ' ',
  emsp: ' ',
  thinsp: ' ',
  zwj: '‍',
  zwnj: '‌',
  shy: '­',
};

const NUMERIC_OR_NAMED = /&(#[0-9]+|#[xX][0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]*);/g;

/** 文字参照を1回だけデコードする（&amp;lt; は &lt; になる）。未知の名前はそのまま残す */
export function decodeHtmlEntities(text: string): string {
  return text.replace(NUMERIC_OR_NAMED, (whole, body: string) => {
    if (body[0] === '#') {
      const hex = body[1] === 'x' || body[1] === 'X';
      const cp = parseInt(body.slice(hex ? 2 : 1), hex ? 16 : 10);
      if (cp === 0) return '�';
      if (!Number.isFinite(cp) || cp > 0x10ffff) return whole;
      if (cp >= 0xd800 && cp <= 0xdfff) return '�';
      return String.fromCodePoint(cp);
    }
    return NAMED_ENTITIES[body] ?? whole;
  });
}

const SKIP_CONTENT = new Set([
  'script',
  'style',
  'template',
  'noscript',
  'head',
]);

/** 前後に空行（段落の区切り）を入れる要素 */
const BREAK_2 = new Set([
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'pre',
  'table',
  'ul',
  'ol',
  'dl',
  'figure',
  'fieldset',
  'hr',
]);

/** 前後で改行する要素 */
const BREAK_1 = new Set([
  'div',
  'section',
  'article',
  'header',
  'footer',
  'nav',
  'aside',
  'main',
  'li',
  'tr',
  'dt',
  'dd',
  'address',
  'figcaption',
  'details',
  'summary',
  'caption',
  'thead',
  'tbody',
  'tfoot',
  'form',
  'legend',
  'option',
  'body',
  'html',
]);

const PRE_TAB = '\u0003';
const PRE_NL = '\u0002';
const PRE_SP = '\u0001';

/** タグの終端 '>' の位置（属性値の引用符の中は無視）。無ければ -1 */
function findTagEnd(html: string, from: number): number {
  let quote = '';
  for (let i = from; i < html.length; i++) {
    const c = html[i];
    if (quote) {
      if (c === quote) quote = '';
    } else if (c === '>') {
      return i;
    } else if (c === '"' || c === "'") {
      let j = i - 1;
      while (j >= from && /\s/.test(html[j])) j--;
      if (j >= from && html[j] === '=') quote = c;
    }
  }
  return -1;
}

const ATTR_RE =
  /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function parseAttrs(source: string): Map<string, string> {
  const attrs = new Map<string, string>();
  for (const m of source.matchAll(ATTR_RE)) {
    const name = m[1].toLowerCase();
    if (attrs.has(name)) continue;
    attrs.set(name, m[2] ?? m[3] ?? m[4] ?? '');
  }
  return attrs;
}

function isSafeHref(href: string): boolean {
  if (href === '' || href.startsWith('#')) return false;
  // 制御文字・空白を除いてスキームを判定する
  // eslint-disable-next-line no-control-regex
  const compact = href.replace(/[\u0000- ]/g, '').toLowerCase();
  return !/^(javascript|vbscript|data):/.test(compact);
}

/**
 * HTML文字列からプレーンテキストを取り出す。
 * ブラウザのDOMには一切渡さず、文字列だけで処理するためスクリプトは実行されない。
 */
export function stripHtml(
  html: string,
  options: Partial<StripOptions> = {},
): string {
  const opt: StripOptions = { ...defaultStripOptions, ...options };
  // 長さを変えないよう ASCII のみ小文字化する（İ 等で添字がずれるのを防ぐ）
  const lower = html.replace(/[A-Z]/g, (c) => c.toLowerCase());
  const lastGt = html.lastIndexOf('>');
  const decode = (s: string) =>
    opt.decodeEntities ? decodeHtmlEntities(s) : s;

  let out = '';
  let pending = 0;
  let preDepth = 0;
  const links: { href: string; start: number }[] = [];

  const trailingNewlines = () => {
    let n = 0;
    while (n < out.length && out[out.length - 1 - n] === '\n') n++;
    return n;
  };

  const setBreak = (n: number) => {
    if (!opt.keepBlockBreaks) {
      if (n > 0) pending = Math.max(pending, 1);
      return;
    }
    pending = Math.max(pending, n);
  };

  const flushPending = () => {
    if (pending > 0 && out !== '') {
      if (opt.keepBlockBreaks) {
        const need = pending - trailingNewlines();
        if (need > 0) out += '\n'.repeat(need);
      } else if (!/[ \n]$/.test(out)) {
        out += ' ';
      }
    }
    pending = 0;
  };

  const emitText = (raw: string) => {
    if (raw === '') return;
    let s = decode(raw);
    if (preDepth > 0 && opt.collapseWhitespace) {
      flushPending();
      out += s
        .replace(/\r\n?/g, '\n')
        .replace(/ /g, PRE_SP)
        .replace(/\n/g, PRE_NL)
        .replace(/\t/g, PRE_TAB);
      return;
    }
    if (opt.collapseWhitespace) {
      s = s.replace(/[ \t\n\r\f\u00a0]+/g, ' ');
      if (s === ' ') {
        // 単独の空白: ブロック境界や行頭では捨てる
        if (pending > 0 || out === '' || /[ \n\t]$/.test(out)) return;
        out += ' ';
        return;
      }
      flushPending();
      if (out === '' || /[ \n\t]$/.test(out)) s = s.replace(/^ /, '');
      out += s;
      return;
    }
    if (s.trim() !== '') flushPending();
    out += s;
  };

  let i = 0;
  const n = html.length;
  let textStart = 0;

  const flushText = (end: number) => {
    if (end > textStart) emitText(html.slice(textStart, end));
  };

  while (i < n) {
    const lt = html.indexOf('<', i);
    if (lt === -1) break;
    const next = html[lt + 1] ?? '';

    if (html.startsWith('<!--', lt)) {
      flushText(lt);
      const end = html.indexOf('-->', lt + 4);
      i = end === -1 ? n : end + 3;
      textStart = i;
      continue;
    }
    if (html.startsWith('<![CDATA[', lt)) {
      flushText(lt);
      const end = html.indexOf(']]>', lt + 9);
      i = end === -1 ? n : end + 3;
      textStart = i;
      continue;
    }
    if (next === '!' || next === '?') {
      flushText(lt);
      const end = html.indexOf('>', lt + 2);
      i = end === -1 ? n : end + 1;
      textStart = i;
      continue;
    }

    const closing = next === '/';
    const nameStart = closing ? lt + 2 : lt + 1;
    const nameMatch = /^[A-Za-z][^\s/>]*/.exec(
      html.slice(nameStart, nameStart + 64),
    );
    if (!nameMatch) {
      // タグではない '<'（例: "1 < 2"）は文字として扱う
      i = lt + 1;
      continue;
    }
    // 以降に '>' が1つも無ければ走査せず打ち切る（'<a' の連続で二乗時間になるのを防ぐ）
    const end =
      nameStart > lastGt
        ? -1
        : findTagEnd(html, nameStart + nameMatch[0].length);
    if (end === -1) {
      i = lt + 1;
      continue;
    }

    flushText(lt);
    const name = nameMatch[0].toLowerCase();
    const attrSource = html.slice(nameStart + nameMatch[0].length, end);
    i = end + 1;
    textStart = i;

    if (closing) {
      if (name === 'a' && links.length > 0) {
        const link = links.pop()!;
        const label = out.slice(link.start).trim();
        if (opt.keepLinkUrls && link.href !== '') {
          if (label === '') out += link.href;
          else if (label !== link.href) out += ` (${link.href})`;
        }
      }
      if (name === 'pre' && preDepth > 0) preDepth--;
      if (BREAK_2.has(name)) setBreak(2);
      else if (BREAK_1.has(name)) setBreak(1);
      continue;
    }

    if (SKIP_CONTENT.has(name)) {
      if (!/\/\s*$/.test(attrSource)) {
        const close = lower.indexOf(`</${name}`, i);
        if (close === -1) {
          i = n;
        } else {
          const gt = html.indexOf('>', close);
          i = gt === -1 ? n : gt + 1;
        }
        textStart = i;
      }
      continue;
    }

    if (name === 'br') {
      flushPending();
      if (opt.keepBlockBreaks) out += '\n';
      else if (!/[ \n]$/.test(out) && out !== '') out += ' ';
      continue;
    }

    if (name === 'a') {
      const href = decode(parseAttrs(attrSource).get('href') ?? '').trim();
      links.push({
        href: opt.keepLinkUrls && isSafeHref(href) ? href : '',
        start: out.length,
      });
      // 閉じタグが無い場合に備え、空hrefは何も足さない
      continue;
    }

    if (name === 'img') {
      if (opt.keepImageAlt) {
        const alt = parseAttrs(attrSource).get('alt');
        if (alt !== undefined && alt.trim() !== '') {
          const shown = decode(alt);
          flushPending();
          out += shown;
        }
      }
      continue;
    }

    if (name === 'td' || name === 'th') {
      if (out !== '' && pending === 0 && !/[\n\t]$/.test(out)) {
        out += opt.keepBlockBreaks ? '\t' : ' ';
      }
      continue;
    }

    if (name === 'pre') preDepth++;
    if (BREAK_2.has(name)) setBreak(2);
    else if (BREAK_1.has(name)) setBreak(1);
  }
  if (textStart < n) emitText(html.slice(textStart));

  let result = out;
  if (opt.collapseWhitespace) {
    result = result
      .split('\n')
      .map((line) => line.replace(/^[ \t]+|[ \t]+$/g, ''))
      .join('\n');
  }
  if (opt.compressBlankLines) {
    result = result.replace(/\n{3,}/g, '\n\n').replace(/^\n+|\n+$/g, '');
  }
  return result
    .replace(new RegExp(PRE_SP, 'g'), ' ')
    .replace(new RegExp(PRE_NL, 'g'), '\n')
    .replace(new RegExp(PRE_TAB, 'g'), '\t');
}
