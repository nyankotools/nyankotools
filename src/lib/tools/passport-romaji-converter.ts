import { tokenizeKana } from './romaji-kana-converter';

/** オ段の長音の書き方。omit: 省略（ONO） / oh: OH 表記（OHNO） */
export type PassportLongVowel = 'omit' | 'oh';
export type NameOrder = 'surname-first' | 'given-first';

export interface PassportRomajiOptions {
  longVowel: PassportLongVowel;
}

export interface PassportRomajiResult {
  /** 大文字のローマ字。変換できなかった文字はそのまま残る */
  romaji: string;
  /** かな・空白以外で変換できなかった文字（重複なし） */
  unsupported: string[];
}

interface Item {
  r: string;
  kind: 'syl' | 'n' | 'raw';
  /** OH の h を付け済みか */
  hAdded?: boolean;
}

/**
 * ひらがな・カタカナの氏名を、旅券（パスポート）のヘボン式ローマ字表記に変換する。
 * - オ段・ウ段の長音（おう・おお・うう・ゆう など）は表記しない（OH 希望時はオ段のみ OH）
 * - 「ん」は N。b・m・p の前では M。アポストロフィは使わない
 * - 促音は子音を重ねる（ch の前は T）
 * 漢字・英数字・記号は変換できず、unsupported に集めてそのまま残す。
 */
export function toPassportRomaji(
  input: string,
  options: PassportRomajiOptions,
): PassportRomajiResult {
  const units = tokenizeKana(input.trim(), 'hepburn');
  const items: Item[] = [];
  const unsupported = new Set<string>();
  let pendingSokuon = false;

  // 直前の音節に続く長音（おう・おお・うう）を処理する
  const absorbLong = (prev: Item, vowel: string) => {
    if (vowel === 'o' && options.longVowel === 'oh' && !prev.hAdded) {
      prev.r += 'h';
      prev.hAdded = true;
    }
  };

  for (const unit of units) {
    if (unit.kind === 'sokuon') {
      pendingSokuon = true;
      continue;
    }

    // 促音の直後が音節以外（ん・長音符・空白・記号）なら、重ねる先がない
    if (unit.kind !== 'syl' && pendingSokuon) {
      pendingSokuon = false;
      unsupported.add('っ');
    }

    if (unit.kind === 'n') {
      items.push({ r: 'n', kind: 'n' });
      continue;
    }

    if (unit.kind === 'long') {
      const prev = items[items.length - 1];
      const vowel =
        prev?.kind === 'syl' ? prev.r.replace(/h$/, '').slice(-1) : '';
      if (prev !== undefined && (vowel === 'o' || vowel === 'u')) {
        absorbLong(prev, vowel);
      } else if (prev !== undefined && 'aie'.includes(vowel) && vowel !== '') {
        items.push({ r: vowel, kind: 'syl' });
      } else {
        unsupported.add('ー');
        items.push({ r: 'ー', kind: 'raw' });
      }
      continue;
    }

    if (unit.kind === 'raw') {
      if (/\s/.test(unit.r)) {
        items.push({ r: ' ', kind: 'raw' });
      } else {
        unsupported.add(unit.r);
        items.push({ r: unit.r, kind: 'raw' });
      }
      continue;
    }

    let r = unit.r;
    if (pendingSokuon) {
      pendingSokuon = false;
      if ('aiueo'.includes(r[0])) {
        unsupported.add('っ');
      } else {
        r = (r.startsWith('ch') ? 't' : r[0]) + r;
      }
    } else {
      // おう・おお・うう は長音として扱う
      const prev = items[items.length - 1];
      if (prev?.kind === 'syl') {
        const last = prev.r.replace(/h$/, '').slice(-1);
        if (
          (r === 'u' && (last === 'o' || last === 'u')) ||
          (r === 'o' && last === 'o')
        ) {
          absorbLong(prev, last);
          continue;
        }
      }
    }
    items.push({ r, kind: 'syl' });
  }
  if (pendingSokuon) unsupported.add('っ');

  let romaji = '';
  items.forEach((item, index) => {
    if (item.kind === 'n') {
      const next = items[index + 1];
      romaji += next?.kind === 'syl' && 'bmp'.includes(next.r[0]) ? 'm' : 'n';
    } else {
      romaji += item.r;
    }
  });

  return {
    romaji: romaji.replace(/ +/g, ' ').toUpperCase(),
    unsupported: [...unsupported],
  };
}

/** 姓と名を指定の順で並べる。片方が空ならもう片方だけを返す */
export function joinName(
  surname: string,
  given: string,
  order: NameOrder,
): string {
  const parts = order === 'surname-first' ? [surname, given] : [given, surname];
  return parts.filter(Boolean).join(' ');
}
