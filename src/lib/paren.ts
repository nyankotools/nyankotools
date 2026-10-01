/** 補足を括弧で添える。日本語は全角括弧、英語は半角括弧（直前にスペース）にする */
export function parenthesize(text: string, lang: string): string {
  return lang === 'en' ? ` (${text})` : `（${text}）`;
}

/** 現在のページの言語（<html lang>）に合わせて括弧を付ける */
export function paren(text: string): string {
  return parenthesize(text, document.documentElement.lang);
}
