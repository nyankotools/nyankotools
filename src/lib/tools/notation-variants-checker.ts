export type NotationKind =
  | 'okurigana'
  | 'kanjiKana'
  | 'katakana'
  | 'longVowel'
  | 'term'
  | 'width'
  | 'custom';

export const NOTATION_KINDS: readonly NotationKind[] = [
  'okurigana',
  'kanjiKana',
  'katakana',
  'longVowel',
  'term',
  'width',
  'custom',
];

/** 既定で有効にする種別（長音の有無は文書ごとの流儀が分かれるため既定オフ） */
export const DEFAULT_KINDS: Record<NotationKind, boolean> = {
  okurigana: true,
  kanjiKana: true,
  katakana: true,
  longVowel: false,
  term: true,
  width: true,
  custom: true,
};

export interface Finding {
  start: number;
  end: number;
  /** 原文の該当文字列 */
  text: string;
  /** 推奨表記 */
  suggestion: string;
  kind: NotationKind;
  /** 推奨表記も同じ文章内に出現している（表記が混在している） */
  mixed: boolean;
}

export interface CheckOptions {
  kinds?: Partial<Record<NotationKind, boolean>>;
  /** 「変更前>変更後」を1行1件で書いた独自ルール */
  customRules?: string;
}

export interface CheckResult {
  findings: Finding[];
  counts: Record<NotationKind, number>;
  total: number;
}

export interface Segment {
  text: string;
  /** findings の添字。該当箇所でなければ null */
  finding: number | null;
}

/**
 * 辞書の書式は「変更前>推奨表記」。末尾に「|正規表現」を付けると、
 * その正規表現にマッチする文字が直後に続くときは対象外にする。
 */
const RAW_DICTIONARY: Record<
  Exclude<NotationKind, 'width' | 'custom'>,
  string
> = {
  okurigana: `
行なう>行う 行ない>行い 行なわ>行わ 行なっ>行っ
表わす>表す 表わし>表し 表われ>表れ 現われる>現れる 現われ>現れ
断わる>断る 断わり>断り
終る>終わる 終り>終わり
変る>変わる 変り>変わり 変って>変わって
代る>代わる 代り>代わり 代って>代わって
取扱う>取り扱う 取扱い>取り扱い
申込む>申し込む 申込み>申し込み
問合せ>問い合わせ 問合わせ>問い合わせ 問い合せ>問い合わせ
打合せ>打ち合わせ 打ち合せ>打ち合わせ 打合わせ>打ち合わせ
組合せ>組み合わせ 組み合せ>組み合わせ 組合わせ>組み合わせ
話合い>話し合い
見積り>見積もり
繰返す>繰り返す 繰返し>繰り返し
立上げ>立ち上げ 立上がる>立ち上がる 立ち上る>立ち上がる
引継ぎ>引き継ぎ 引継ぐ>引き継ぐ
受取る>受け取る 受取り>受け取り
受付け>受け付け 受付ける>受け付ける
取消し>取り消し 取消す>取り消す
持込む>持ち込む 持込み>持ち込み
書込む>書き込む 書込み>書き込み
読込む>読み込む 読込み>読み込み
読取る>読み取る 読取り>読み取り
差替え>差し替え 差替える>差し替える
貼付け>貼り付け 貼付ける>貼り付ける
切替え>切り替え 切替える>切り替える
入替え>入れ替え 入替える>入れ替える
乗換え>乗り換え 乗換える>乗り換える
振込み>振り込み 振込む>振り込む
引落し>引き落とし 引落とし>引き落とし
当る>当たる 当って>当たって 当り>当たり 当った>当たった
浮ぶ>浮かぶ
少い>少ない 危い>危ない
暮す>暮らす
生れる>生まれる 生れ>生まれ
聞える>聞こえる
確める>確かめる
異る>異なる
伴なう>伴う 補なう>補う
恥かしい>恥ずかしい
明かるい>明るい
`,
  kanjiKana: `
出来るだけ>できるだけ 出来る>できる 出来ない>できない 出来ます>できます 出来ません>できません 出来た>できた 出来て>できて
有難う>ありがとう 有り難う>ありがとう 有難い>ありがたい
宜しく>よろしく 宜しい>よろしい 宜しければ>よろしければ
下さい>ください
致します>いたします 致しました>いたしました 致しません>いたしません
頂きます>いただきます 頂きたい>いただきたい 頂いて>いただいて 頂いた>いただいた 頂ければ>いただければ 頂けます>いただけます 頂く>いただく
御座います>ございます 御座いました>ございました
是非>ぜひ|[をの]
殆ど>ほとんど 全て>すべて 全く>まったく 但し>ただし
更に>さらに 既に>すでに 暫く>しばらく 予め>あらかじめ 敢えて>あえて 概ね>おおむね
尚>なお|[早書更]
又>また|[はの]
或いは>あるいは 且つ>かつ
先ず>まず 随分>ずいぶん 恐らく>おそらく 何故>なぜ 何れ>いずれ 遂に>ついに 偶々>たまたま
丁度>ちょうど 一寸>ちょっと 何卒>なにとぞ 直ぐ>すぐ 初めまして>はじめまして
様々>さまざま 色々>いろいろ 沢山>たくさん 何時も>いつも
筈>はず 迄>まで
貰う>もらう 貰って>もらって 貰い>もらい
此の>この 其の>その 此れ>これ 其れ>それ
無い>ない 有る>ある 居る>いる
御連絡>ご連絡 御確認>ご確認 御利用>ご利用 御質問>ご質問 御案内>ご案内 御注意>ご注意
御了承>ご了承 御協力>ご協力 御理解>ご理解 御対応>ご対応 御担当>ご担当 御報告>ご報告
御返信>ご返信 御返事>ご返事 御回答>ご回答 御検討>ご検討 御参加>ご参加 御来場>ご来場
御予約>ご予約 御購入>ご購入 御注文>ご注文 御入力>ご入力 御迷惑>ご迷惑 御覧>ご覧
御願い>お願い 御知らせ>お知らせ 御客様>お客様 御問い合わせ>お問い合わせ 御待ち>お待ち
御世話>お世話 御手数>お手数
`,
  katakana: `
ウインドウ>ウィンドウ ウエブ>ウェブ ソフトウエア>ソフトウェア ハードウエア>ハードウェア
ウィルス>ウイルス ヴァージョン>バージョン ヴァイオリン>バイオリン アドヴァイス>アドバイス
コミニュケーション>コミュニケーション コミュニュケーション>コミュニケーション コミニケーション>コミュニケーション
シュミレーション>シミュレーション シュミレート>シミュレート
エンターテイメント>エンターテインメント エンターテーメント>エンターテインメント
インタフェース>インターフェース インターフェイス>インターフェース インタフェイス>インターフェース
アイディア>アイデア ダイヤログ>ダイアログ ダイヤグラム>ダイアグラム アルゴリスム>アルゴリズム
スマートホン>スマートフォン クォリティ>クオリティ
ウオーター>ウォーター ウオッチ>ウォッチ ウオーク>ウォーク
ディスプレー>ディスプレイ アップデイト>アップデート
ファイアーウォール>ファイアウォール ファイヤーウォール>ファイアウォール ファイアー>ファイア ファイヤー>ファイア
メインテナンス>メンテナンス データーベース>データベース データー>データ|ベ
ディジタル>デジタル ハードデイスク>ハードディスク
キロメーター>キロメートル センチメーター>センチメートル ミリメーター>ミリメートル
`,
  longVowel: `
ユーザ>ユーザー|[ァ-ヺー] サーバ>サーバー|[ァ-ヺー] コンピュータ>コンピューター|[ァ-ヺー] プリンタ>プリンター|[ァ-ヺー]
ブラウザ>ブラウザー|[ァ-ヺー] プロバイダ>プロバイダー|[ァ-ヺー] ドライバ>ドライバー|[ァ-ヺー] エディタ>エディター|[ァ-ヺー]
スキャナ>スキャナー|[ァ-ヺー] モニタ>モニター|[ァ-ヺー] パーティ>パーティー|[ァ-ヺー] カテゴリ>カテゴリー|[ァ-ヺー]
フォルダ>フォルダー|[ァ-ヺー] バッテリ>バッテリー|[ァ-ヺー] エレベータ>エレベーター|[ァ-ヺー] インストーラ>インストーラー|[ァ-ヺー]
コンパイラ>コンパイラー|[ァ-ヺー] インタプリタ>インタプリター|[ァ-ヺー] ジェネレータ>ジェネレーター|[ァ-ヺー]
コンバータ>コンバーター|[ァ-ヺー] メーカ>メーカー|[ァ-ヺー] ルータ>ルーター|[ァ-ヺー] スピーカ>スピーカー|[ァ-ヺー]
マネージャ>マネージャー|[ァ-ヺー] メモリ>メモリー|[ァ-ヺー] ディレクトリ>ディレクトリー|[ァ-ヺー] ライブラリ>ライブラリー|[ァ-ヺー]
ヘッダ>ヘッダー|[ァ-ヺー] フッタ>フッター|[ァ-ヺー]
`,
  term: `
ヶ月>か月 ヵ月>か月 カ月>か月 ケ月>か月
個所>箇所 ヶ所>箇所 ヵ所>箇所 ケ所>箇所 カ所>箇所
引越し>引っ越し 引越す>引っ越す
電子メイル>電子メール
お客さま>お客様
貴方>あなた 貴女>あなた
`,
};

interface Rule {
  variant: string;
  preferred: string;
  kind: NotationKind;
  re: RegExp;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function makeRule(
  variant: string,
  preferred: string,
  kind: NotationKind,
  after?: string,
): Rule {
  const source = escapeRegExp(variant) + (after ? `(?!${after})` : '');
  return { variant, preferred, kind, re: new RegExp(source, 'g') };
}

function parseDictionary(
  raw: string,
): { variant: string; preferred: string; after?: string }[] {
  const items: { variant: string; preferred: string; after?: string }[] = [];
  for (const token of raw.split(/\s+/)) {
    if (!token) continue;
    const bar = token.indexOf('|');
    const pair = bar >= 0 ? token.slice(0, bar) : token;
    const after = bar >= 0 ? token.slice(bar + 1) : undefined;
    const gt = pair.indexOf('>');
    if (gt <= 0) continue;
    items.push({
      variant: pair.slice(0, gt),
      preferred: pair.slice(gt + 1),
      after,
    });
  }
  return items;
}

let dictionaryRules: Rule[] | null = null;

function getDictionaryRules(): Rule[] {
  if (dictionaryRules) return dictionaryRules;
  const rules: Rule[] = [];
  const seen = new Set<string>();
  for (const [kind, raw] of Object.entries(RAW_DICTIONARY)) {
    for (const item of parseDictionary(raw)) {
      if (seen.has(item.variant) || item.variant === item.preferred) continue;
      seen.add(item.variant);
      rules.push(
        makeRule(
          item.variant,
          item.preferred,
          kind as NotationKind,
          item.after,
        ),
      );
    }
  }
  dictionaryRules = rules;
  return rules;
}

/** 辞書に登録されている「変更前>推奨」の件数 */
export function dictionarySize(): number {
  return getDictionaryRules().length;
}

/** 辞書ルールの一覧（テスト・件数表示用） */
export function listDictionary(): {
  variant: string;
  preferred: string;
  kind: NotationKind;
}[] {
  return getDictionaryRules().map(({ variant, preferred, kind }) => ({
    variant,
    preferred,
    kind,
  }));
}

/** 「変更前>変更後」形式の独自ルールを解析する（不正な行・空要素・同一表記は無視） */
export function parseCustomRules(
  source: string,
): { variant: string; preferred: string }[] {
  const rules: { variant: string; preferred: string }[] = [];
  const seen = new Set<string>();
  for (const line of source.split(/\r?\n/)) {
    const gt = line.indexOf('>');
    if (gt < 0) continue;
    const variant = line.slice(0, gt).trim();
    const preferred = line.slice(gt + 1).trim();
    if (!variant || !preferred || variant === preferred) continue;
    if (seen.has(variant)) continue;
    seen.add(variant);
    rules.push({ variant, preferred });
  }
  return rules;
}

function collectRuleMatches(text: string, rules: Rule[], out: Finding[]): void {
  for (const rule of rules) {
    rule.re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = rule.re.exec(text)) !== null) {
      out.push({
        start: m.index,
        end: m.index + m[0].length,
        text: m[0],
        suggestion: rule.preferred,
        kind: rule.kind,
        mixed: text.includes(rule.preferred),
      });
      if (m[0].length === 0) rule.re.lastIndex++;
    }
  }
}

const JA_CHAR = /[぀-ヿ㐀-鿿]/;

function isJa(ch: string | undefined): boolean {
  return ch !== undefined && ch !== '' && JA_CHAR.test(ch);
}

/** 同じ役割の記号グループ。先頭ほど優先（同数のとき先頭を推奨にする） */
const SYMBOL_GROUPS: readonly (readonly string[])[] = [
  ['（', '('],
  ['）', ')'],
  ['！', '!'],
  ['？', '?'],
  ['、', '，', ','],
  ['。', '．', '.'],
];

function collectWidthFindings(text: string, out: Finding[]): void {
  // 半角カナ（常に全角カナへ）
  for (const m of text.matchAll(/[｡-ﾟ]+/g)) {
    out.push({
      start: m.index,
      end: m.index + m[0].length,
      text: m[0],
      suggestion: m[0].normalize('NFKC'),
      kind: 'width',
      mixed: false,
    });
  }

  // 全角英数字（半角英数字が同じ文章にあるときだけ混在として指摘する）
  const alnumClasses: [RegExp, RegExp][] = [
    [/[０-９]+/g, /[0-9]/],
    [/[Ａ-Ｚａ-ｚ]+/g, /[A-Za-z]/],
  ];
  for (const [fullRe, halfRe] of alnumClasses) {
    if (!halfRe.test(text)) continue;
    for (const m of text.matchAll(fullRe)) {
      out.push({
        start: m.index,
        end: m.index + m[0].length,
        text: m[0],
        suggestion: m[0].normalize('NFKC'),
        kind: 'width',
        mixed: true,
      });
    }
  }

  // 記号の全角・半角（多数派に揃える。半角は前後が日本語のときだけ数える）
  for (const group of SYMBOL_GROUPS) {
    const occurrences: { index: number; ch: string }[] = [];
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (!group.includes(ch)) continue;
      if (ch.charCodeAt(0) < 0x80) {
        const prev = text[i - 1];
        const next = text[i + 1];
        const periodLike = ch === '.' || ch === ',';
        if (periodLike) {
          if (!isJa(prev) || (next !== undefined && /[0-9A-Za-z]/.test(next))) {
            continue;
          }
        } else if (!isJa(prev) && !isJa(next)) {
          continue;
        }
      }
      occurrences.push({ index: i, ch });
    }
    const counts = new Map<string, number>();
    for (const o of occurrences) counts.set(o.ch, (counts.get(o.ch) ?? 0) + 1);
    if (counts.size < 2) continue;
    let winner = group[0];
    let best = -1;
    for (const ch of group) {
      const c = counts.get(ch) ?? 0;
      if (c > best) {
        best = c;
        winner = ch;
      }
    }
    for (const o of occurrences) {
      if (o.ch === winner) continue;
      out.push({
        start: o.index,
        end: o.index + 1,
        text: o.ch,
        suggestion: winner,
        kind: 'width',
        mixed: true,
      });
    }
  }
}

/** 重なる指摘は、開始位置が早いもの→長いもの→独自ルール優先の順で1つに絞る */
function resolveOverlaps(findings: Finding[]): Finding[] {
  const sorted = [...findings].sort(
    (a, b) =>
      a.start - b.start ||
      b.end - b.start - (a.end - a.start) ||
      Number(b.kind === 'custom') - Number(a.kind === 'custom'),
  );
  const result: Finding[] = [];
  let lastEnd = 0;
  for (const f of sorted) {
    if (f.start < lastEnd) continue;
    result.push(f);
    lastEnd = f.end;
  }
  return result;
}

export function checkNotation(
  text: string,
  options: CheckOptions = {},
): CheckResult {
  const kinds = { ...DEFAULT_KINDS, ...options.kinds };
  const raw: Finding[] = [];

  const rules = getDictionaryRules().filter((r) => kinds[r.kind]);
  collectRuleMatches(text, rules, raw);

  if (kinds.custom && options.customRules) {
    const custom = parseCustomRules(options.customRules).map((r) =>
      makeRule(r.variant, r.preferred, 'custom'),
    );
    collectRuleMatches(text, custom, raw);
  }
  if (kinds.width) collectWidthFindings(text, raw);

  const findings = resolveOverlaps(raw);
  const counts = Object.fromEntries(
    NOTATION_KINDS.map((k) => [k, 0]),
  ) as Record<NotationKind, number>;
  for (const f of findings) counts[f.kind]++;
  return { findings, counts, total: findings.length };
}

/** 原文を「該当箇所／それ以外」に分割する（表示側で textContent に流し込む想定） */
export function buildSegments(text: string, findings: Finding[]): Segment[] {
  const segments: Segment[] = [];
  let pos = 0;
  findings.forEach((f, i) => {
    if (f.start > pos) {
      segments.push({ text: text.slice(pos, f.start), finding: null });
    }
    segments.push({ text: text.slice(f.start, f.end), finding: i });
    pos = f.end;
  });
  if (pos < text.length) {
    segments.push({ text: text.slice(pos), finding: null });
  }
  return segments;
}

/** すべての指摘を推奨表記に置き換えた文章を返す */
export function applySuggestions(text: string, findings: Finding[]): string {
  return buildSegments(text, findings)
    .map((s) => (s.finding === null ? s.text : findings[s.finding].suggestion))
    .join('');
}
