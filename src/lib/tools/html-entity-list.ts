export const ENTITY_CATEGORIES = [
  'basic',
  'symbols',
  'currency',
  'latin',
  'latinExt',
  'greek',
  'punctuation',
  'arrows',
  'math',
  'shapes',
] as const;

export type EntityCategory = (typeof ENTITY_CATEGORIES)[number];

export interface HtmlEntity {
  /** 名前付き文字参照の名前（&と;を除く）。大文字小文字は区別される */
  name: string;
  codePoint: number;
  /** 表示用の文字 */
  char: string;
  category: EntityCategory;
  /** &copy; */
  named: string;
  /** &#169; */
  decimal: string;
  /** &#xA9; */
  hex: string;
}

/** 「名前:16進コードポイント」の空白区切り。Latin-1 の字形は下で生成する */
const RAW: Record<Exclude<EntityCategory, 'latin'>, string> = {
  basic:
    'quot:22 amp:26 apos:27 lt:3C gt:3E nbsp:A0 excl:21 num:23 percnt:25 lpar:28 rpar:29 ast:2A plus:2B comma:2C period:2E sol:2F colon:3A semi:3B equals:3D quest:3F commat:40 lsqb:5B bsol:5C rsqb:5D Hat:5E lowbar:5F grave:60 lcub:7B verbar:7C rcub:7D Tab:9 NewLine:A',
  symbols:
    'iexcl:A1 brvbar:A6 sect:A7 uml:A8 copy:A9 ordf:AA laquo:AB not:AC shy:AD reg:AE macr:AF deg:B0 plusmn:B1 sup2:B2 sup3:B3 acute:B4 micro:B5 para:B6 middot:B7 cedil:B8 sup1:B9 ordm:BA raquo:BB frac14:BC frac12:BD frac34:BE iquest:BF trade:2122 copysr:2117 numero:2116 image:2111 weierp:2118 real:211C alefsym:2135',
  currency: 'dollar:24 cent:A2 pound:A3 curren:A4 yen:A5 euro:20AC',
  latinExt:
    'OElig:152 oelig:153 Scaron:160 scaron:161 Yuml:178 fnof:192 circ:2C6 tilde:2DC Amacr:100 amacr:101 Abreve:102 abreve:103 Aogon:104 aogon:105 Cacute:106 cacute:107 Ccaron:10C ccaron:10D Dcaron:10E dcaron:10F Emacr:112 emacr:113 Eogon:118 eogon:119 Ecaron:11A ecaron:11B Gbreve:11E gbreve:11F Imacr:12A imacr:12B Idot:130 imath:131 Lstrok:141 lstrok:142 Nacute:143 nacute:144 Ncaron:147 ncaron:148 Omacr:14C omacr:14D Odblac:150 odblac:151 Rcaron:158 rcaron:159 Sacute:15A sacute:15B Scedil:15E scedil:15F Tcaron:164 tcaron:165 Umacr:16A umacr:16B Uring:16E uring:16F Udblac:170 udblac:171 Zacute:179 zacute:17A Zdot:17B zdot:17C Zcaron:17D zcaron:17E',
  greek:
    'Alpha:391 Beta:392 Gamma:393 Delta:394 Epsilon:395 Zeta:396 Eta:397 Theta:398 Iota:399 Kappa:39A Lambda:39B Mu:39C Nu:39D Xi:39E Omicron:39F Pi:3A0 Rho:3A1 Sigma:3A3 Tau:3A4 Upsilon:3A5 Phi:3A6 Chi:3A7 Psi:3A8 Omega:3A9 alpha:3B1 beta:3B2 gamma:3B3 delta:3B4 epsilon:3B5 zeta:3B6 eta:3B7 theta:3B8 iota:3B9 kappa:3BA lambda:3BB mu:3BC nu:3BD xi:3BE omicron:3BF pi:3C0 rho:3C1 sigmaf:3C2 sigma:3C3 tau:3C4 upsilon:3C5 phi:3C6 chi:3C7 psi:3C8 omega:3C9 thetasym:3D1 upsih:3D2 piv:3D6',
  punctuation:
    'ensp:2002 emsp:2003 thinsp:2009 zwnj:200C zwj:200D lrm:200E rlm:200F ndash:2013 mdash:2014 lsquo:2018 rsquo:2019 sbquo:201A ldquo:201C rdquo:201D bdquo:201E dagger:2020 Dagger:2021 bull:2022 hellip:2026 permil:2030 prime:2032 Prime:2033 lsaquo:2039 rsaquo:203A oline:203E frasl:2044',
  arrows:
    'larr:2190 uarr:2191 rarr:2192 darr:2193 harr:2194 varr:2195 nwarr:2196 nearr:2197 searr:2198 swarr:2199 crarr:21B5 map:21A6 lArr:21D0 uArr:21D1 rArr:21D2 dArr:21D3 hArr:21D4',
  math: 'forall:2200 part:2202 exist:2203 empty:2205 nabla:2207 isin:2208 notin:2209 ni:220B prod:220F sum:2211 minus:2212 mp:2213 setminus:2216 lowast:2217 compfn:2218 radic:221A prop:221D infin:221E ang:2220 and:2227 or:2228 cap:2229 cup:222A int:222B there4:2234 sim:223C cong:2245 asymp:2248 ne:2260 equiv:2261 nequiv:2262 le:2264 ge:2265 ll:226A gg:226B sub:2282 sup:2283 nsub:2284 sube:2286 supe:2287 oplus:2295 otimes:2297 perp:22A5 sdot:22C5 times:D7 divide:F7 lceil:2308 rceil:2309 lfloor:230A rfloor:230B',
  shapes:
    'loz:25CA squ:25A1 squf:25AA block:2588 blk14:2591 blk12:2592 blk34:2593 boxh:2500 boxv:2502 spades:2660 clubs:2663 hearts:2665 diams:2666 star:2606 starf:2605 phone:260E female:2640 male:2642 sung:266A flat:266D natural:266E sharp:266F check:2713 cross:2717',
};

const LATIN_UPPER_NAMES = [
  'Agrave',
  'Aacute',
  'Acirc',
  'Atilde',
  'Auml',
  'Aring',
  'AElig',
  'Ccedil',
  'Egrave',
  'Eacute',
  'Ecirc',
  'Euml',
  'Igrave',
  'Iacute',
  'Icirc',
  'Iuml',
  'ETH',
  'Ntilde',
  'Ograve',
  'Oacute',
  'Ocirc',
  'Otilde',
  'Ouml',
  null, // D7 は times（数学記号）
  'Oslash',
  'Ugrave',
  'Uacute',
  'Ucirc',
  'Uuml',
  'Yacute',
  'THORN',
] as const;

const LATIN_LOWER_NAMES = [
  'agrave',
  'aacute',
  'acirc',
  'atilde',
  'auml',
  'aring',
  'aelig',
  'ccedil',
  'egrave',
  'eacute',
  'ecirc',
  'euml',
  'igrave',
  'iacute',
  'icirc',
  'iuml',
  'eth',
  'ntilde',
  'ograve',
  'oacute',
  'ocirc',
  'otilde',
  'ouml',
  null, // F7 は divide（数学記号）
  'oslash',
  'ugrave',
  'uacute',
  'ucirc',
  'uuml',
  'yacute',
  'thorn',
] as const;

export function makeEntity(
  name: string,
  codePoint: number,
  category: EntityCategory,
): HtmlEntity {
  const upperHex = codePoint.toString(16).toUpperCase();
  return {
    name,
    codePoint,
    char: String.fromCodePoint(codePoint),
    category,
    named: `&${name};`,
    decimal: `&#${codePoint};`,
    hex: `&#x${upperHex};`,
  };
}

function buildEntities(): HtmlEntity[] {
  const list: HtmlEntity[] = [];
  for (const category of ENTITY_CATEGORIES) {
    if (category === 'latin') {
      LATIN_UPPER_NAMES.forEach((n, i) => {
        if (n) list.push(makeEntity(n, 0xc0 + i, 'latin'));
      });
      list.push(makeEntity('szlig', 0xdf, 'latin'));
      LATIN_LOWER_NAMES.forEach((n, i) => {
        if (n) list.push(makeEntity(n, 0xe0 + i, 'latin'));
      });
      list.push(makeEntity('yuml', 0xff, 'latin'));
      continue;
    }
    for (const item of RAW[category].split(' ')) {
      const [name, cp] = item.split(':');
      list.push(makeEntity(name, parseInt(cp, 16), category));
    }
  }
  return list;
}

export const HTML_ENTITIES: readonly HtmlEntity[] = buildEntities();

const INVISIBLE = new Set([
  0x9, 0xa, 0xa0, 0xad, 0x2002, 0x2003, 0x2009, 0x200c, 0x200d, 0x200e, 0x200f,
]);

/** 画面上で空白・制御文字になり、見ただけでは分からない文字か */
export function isInvisible(codePoint: number): boolean {
  return INVISIBLE.has(codePoint);
}

/** 一覧のプレビューに出す文字。見えない文字は可視の記号に置き換える */
export function previewChar(entity: HtmlEntity): string {
  if (entity.codePoint === 0x9) return '␉';
  if (entity.codePoint === 0xa) return '␊';
  if (isInvisible(entity.codePoint)) return '␣';
  return entity.char;
}

/** 先頭の & と末尾の ; を取り除く */
function stripAmpSemi(q: string): string {
  return q.replace(/^&/, '').replace(/;$/, '');
}

/**
 * 名前（&copy; / copy）、10進（&#169; / #169 / 169）、16進（&#xA9; / x A9 / U+00A9）、
 * 文字そのもので検索する。空の検索語は絞り込みなし。
 */
export function filterEntities(
  query: string,
  category: EntityCategory | 'all',
  entities: readonly HtmlEntity[] = HTML_ENTITIES,
): HtmlEntity[] {
  const base =
    category === 'all'
      ? entities
      : entities.filter((e) => e.category === category);
  const raw = query.trim();
  if (raw === '') return [...base];

  const q = stripAmpSemi(raw);
  const lower = q.toLowerCase();
  let numeric: number | null = null;
  const dec = /^#?(\d{1,7})$/.exec(q);
  const hex = /^(?:#x|x|u\+|0x)([0-9a-f]{1,6})$/i.exec(q);
  if (dec) numeric = parseInt(dec[1], 10);
  else if (hex) numeric = parseInt(hex[1], 16);
  const isSingleChar = Array.from(raw).length === 1;

  return base.filter((e) => {
    if (numeric !== null && e.codePoint === numeric) return true;
    if (isSingleChar && e.char === raw) return true;
    return lower !== '' && e.name.toLowerCase().includes(lower);
  });
}
