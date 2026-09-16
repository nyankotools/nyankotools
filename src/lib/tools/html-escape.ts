export type EscapeMode =
  'html-escape' | 'html-unescape' | 'js-escape' | 'js-unescape';

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch]);
}

const HTML_UNESCAPE_NAMED: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

export function unescapeHtml(text: string): string {
  return text.replace(
    /&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g,
    (match, entity: string) => {
      if (entity[0] === '#') {
        const isHex = entity[1] === 'x' || entity[1] === 'X';
        const codePoint = isHex
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
        try {
          return String.fromCodePoint(codePoint);
        } catch {
          return match;
        }
      }
      return HTML_UNESCAPE_NAMED[entity.toLowerCase()] ?? match;
    },
  );
}

export function escapeJsString(text: string): string {
  const jsonEscaped = JSON.stringify(text).slice(1, -1);
  return jsonEscaped.replace(/'/g, "\\'");
}

const JS_SIMPLE_ESCAPES: Record<string, string> = {
  n: '\n',
  r: '\r',
  t: '\t',
  b: '\b',
  f: '\f',
  v: '\v',
  '0': '\0',
  "'": "'",
  '"': '"',
  '`': '`',
  '\\': '\\',
};

export function unescapeJsString(text: string): string {
  return text.replace(
    /\\(?:u\{([0-9a-fA-F]+)\}|u([0-9a-fA-F]{4})|x([0-9a-fA-F]{2})|(.))/g,
    (
      match,
      unicodeBrace: string,
      unicode: string,
      hex: string,
      simple: string,
    ) => {
      if (unicodeBrace !== undefined) {
        try {
          return String.fromCodePoint(parseInt(unicodeBrace, 16));
        } catch {
          return match;
        }
      }
      if (unicode !== undefined) {
        return String.fromCharCode(parseInt(unicode, 16));
      }
      if (hex !== undefined) {
        return String.fromCharCode(parseInt(hex, 16));
      }
      return JS_SIMPLE_ESCAPES[simple] ?? simple;
    },
  );
}

export function convertEscape(text: string, mode: EscapeMode): string {
  switch (mode) {
    case 'html-escape':
      return escapeHtml(text);
    case 'html-unescape':
      return unescapeHtml(text);
    case 'js-escape':
      return escapeJsString(text);
    case 'js-unescape':
      return unescapeJsString(text);
  }
}
