import { romajiToKana } from './romaji-kana-converter';

export interface EnglishKatakanaOptions {
  /** v の音を ブ（ba）で書くか ヴ（vu）で書くか */
  vSound: 'b' | 'vu';
  /** 全て大文字の短い語（USB・HTML など）を文字読み（ユーエスビー）にする */
  spellAcronyms: boolean;
}

export type EnglishKatakanaMethod = 'dictionary' | 'rules' | 'acronym';

export interface EnglishKatakanaWord {
  source: string;
  kana: string;
  method: EnglishKatakanaMethod;
}

export interface EnglishKatakanaResult {
  output: string;
  words: EnglishKatakanaWord[];
}

/** 綴りのルールでは正しく変換できない頻出語・IT用語 */
const DICTIONARY: Record<string, string> = Object.create(null);
for (const item of (
  'a:ア an:アン the:ザ of:オブ to:トゥ and:アンド is:イズ are:アー i:アイ you:ユー your:ユア ' +
  'he:ヒー she:シー we:ウィー me:ミー be:ビー they:ゼイ this:ディス that:ザット these:ディーズ ' +
  'those:ゾーズ with:ウィズ there:ゼア then:ゼン them:ゼム than:ザン what:ワット where:ウェア ' +
  'when:ウェン who:フー why:ホワイ how:ハウ which:ウィッチ one:ワン two:トゥー three:スリー ' +
  'four:フォー five:ファイブ six:シックス seven:セブン eight:エイト nine:ナイン ten:テン ' +
  'zero:ゼロ hello:ハロー world:ワールド love:ラブ time:タイム people:ピープル water:ウォーター ' +
  'knife:ナイフ know:ノウ night:ナイト light:ライト right:ライト white:ホワイト write:ライト ' +
  'have:ハブ give:ギブ live:ライブ come:カム some:サム done:ダン cat:キャット hat:ハット ' +
  'bag:バッグ map:マップ dog:ドッグ book:ブック look:ルック good:グッド cook:クック foot:フット ' +
  'food:フード moon:ムーン chair:チェア pizza:ピザ jazz:ジャズ table:テーブル able:エイブル ' +
  'example:エグザンプル menu:メニュー computer:コンピューター internet:インターネット ' +
  'software:ソフトウェア hardware:ハードウェア database:データベース data:データ server:サーバー ' +
  'client:クライアント browser:ブラウザ window:ウィンドウ file:ファイル folder:フォルダ ' +
  'button:ボタン user:ユーザー password:パスワード email:イーメール mail:メール code:コード ' +
  'program:プログラム system:システム network:ネットワーク design:デザイン image:イメージ ' +
  'video:ビデオ audio:オーディオ camera:カメラ phone:フォン smartphone:スマートフォン ' +
  'game:ゲーム music:ミュージック photo:フォト coffee:コーヒー tea:ティー hamburger:ハンバーガー ' +
  'orange:オレンジ banana:バナナ apple:アップル error:エラー message:メッセージ version:バージョン ' +
  'google:グーグル github:ギットハブ javascript:ジャバスクリプト typescript:タイプスクリプト ' +
  'python:パイソン java:ジャバ linux:リナックス windows:ウィンドウズ android:アンドロイド ' +
  'iphone:アイフォン twitter:ツイッター youtube:ユーチューブ now:ナウ cow:カウ allow:アラウ ' +
  'any:エニー many:メニー very:ベリー every:エブリー easy:イージー mother:マザー father:ファーザー ' +
  'brother:ブラザー other:アザー weather:ウェザー together:トゥギャザー ' +
  'group:グループ soup:スープ for:フォー friend:フレンド friends:フレンズ cheese:チーズ ' +
  'baby:ベイビー cake:ケーキ name:ネーム result:リザルト cable:ケーブル'
).split(' ')) {
  const [word, kana] = item.split(':');
  DICTIONARY[word] = kana;
}

/** 英語圏でよく使われる名前（名・姓）。綴りと発音が一致しないものが多いため辞書で持つ */
const NAMES =
  'john:ジョン james:ジェームズ michael:マイケル david:デビッド robert:ロバート william:ウィリアム thomas:トーマス ' +
  'richard:リチャード charles:チャールズ joseph:ジョセフ daniel:ダニエル matthew:マシュー anthony:アンソニー mark:マーク ' +
  'paul:ポール steven:スティーブン steve:スティーブ andrew:アンドリュー kevin:ケビン brian:ブライアン george:ジョージ ' +
  'edward:エドワード peter:ピーター jack:ジャック henry:ヘンリー jason:ジェイソン eric:エリック ryan:ライアン jacob:ジェイコブ ' +
  'nicholas:ニコラス tom:トム tim:ティム bob:ボブ bill:ビル jim:ジム joe:ジョー mike:マイク dave:デイブ chris:クリス ' +
  'alex:アレックス ben:ベン sam:サム max:マックス adam:アダム luke:ルーク oliver:オリバー harry:ハリー noah:ノア ' +
  'liam:リアム ethan:イーサン lucas:ルーカス jeff:ジェフ scott:スコット patrick:パトリック simon:サイモン martin:マーティン ' +
  'frank:フランク larry:ラリー gary:ゲイリー tony:トニー kyle:カイル justin:ジャスティン brandon:ブランドン nathan:ネイサン ' +
  'mary:メアリー jennifer:ジェニファー emily:エミリー sarah:サラ jessica:ジェシカ elizabeth:エリザベス anna:アンナ ' +
  'emma:エマ olivia:オリビア alice:アリス kate:ケイト katherine:キャサリン catherine:キャサリン susan:スーザン ' +
  'margaret:マーガレット lisa:リサ nancy:ナンシー karen:カレン linda:リンダ barbara:バーバラ jane:ジェーン julia:ジュリア ' +
  'laura:ローラ amy:エイミー rachel:レイチェル rebecca:レベッカ anne:アン ann:アン hannah:ハンナ sophia:ソフィア ' +
  'sophie:ソフィー grace:グレース lily:リリー chloe:クロエ ashley:アシュリー megan:メーガン michelle:ミシェル ' +
  'nicole:ニコール amanda:アマンダ lucy:ルーシー helen:ヘレン claire:クレア ella:エラ mia:ミア isabella:イザベラ ' +
  'ava:エイバ charlotte:シャーロット amelia:アメリア victoria:ビクトリア eva:エバ betty:ベティ sandra:サンドラ ' +
  'carol:キャロル diana:ダイアナ smith:スミス johnson:ジョンソン williams:ウィリアムズ brown:ブラウン jones:ジョーンズ ' +
  'miller:ミラー davis:デイビス wilson:ウィルソン anderson:アンダーソン taylor:テイラー moore:ムーア jackson:ジャクソン ' +
  'lee:リー thompson:トンプソン harris:ハリス clark:クラーク lewis:ルイス robinson:ロビンソン walker:ウォーカー ' +
  'young:ヤング allen:アレン king:キング wright:ライト green:グリーン baker:ベイカー adams:アダムス nelson:ネルソン ' +
  'hill:ヒル campbell:キャンベル mitchell:ミッチェル roberts:ロバーツ carter:カーター phillips:フィリップス ' +
  'evans:エバンス turner:ターナー parker:パーカー collins:コリンズ edwards:エドワーズ stewart:スチュワート morris:モリス ' +
  'murphy:マーフィー rogers:ロジャース cooper:クーパー bailey:ベイリー bell:ベル kelly:ケリー howard:ハワード ' +
  'ward:ウォード cox:コックス richardson:リチャードソン wood:ウッド watson:ワトソン brooks:ブルックス bennett:ベネット ' +
  'gray:グレイ hughes:ヒューズ price:プライス sanders:サンダース myers:マイヤーズ ross:ロス foster:フォスター ' +
  'jordan:ジョーダン';
for (const item of NAMES.split(' ')) {
  const [word, kana] = item.split(':');
  DICTIONARY[word] = kana;
}

const LETTER_NAMES: Record<string, string> = {
  A: 'エー',
  B: 'ビー',
  C: 'シー',
  D: 'ディー',
  E: 'イー',
  F: 'エフ',
  G: 'ジー',
  H: 'エイチ',
  I: 'アイ',
  J: 'ジェー',
  K: 'ケー',
  L: 'エル',
  M: 'エム',
  N: 'エヌ',
  O: 'オー',
  P: 'ピー',
  Q: 'キュー',
  R: 'アール',
  S: 'エス',
  T: 'ティー',
  U: 'ユー',
  V: 'ブイ',
  W: 'ダブリュー',
  X: 'エックス',
  Y: 'ワイ',
  Z: 'ゼット',
};

// ---------------------------------------------------------------------------
// 綴りのルール変換
// ---------------------------------------------------------------------------

/** C: 子音 / V: 母音 / Q: 促音（次の子音を重ねる）/ R: そのまま出すローマ字 */
type Token =
  | { k: 'C'; s: string }
  | { k: 'V'; s: string }
  | { k: 'Q' }
  | { k: 'R'; s: string };

const C = (s: string): Token => ({ k: 'C', s });
const V = (s: string): Token => ({ k: 'V', s });
const Q: Token = { k: 'Q' };
const R = (s: string): Token => ({ k: 'R', s });

interface RuleContext {
  prev: Token | undefined;
  word: string;
  index: number;
}

interface Rule {
  re: RegExp;
  out: (ctx: RuleContext, match: RegExpExecArray) => Token[];
}

/** y を挟まない長音（rule・blue など）になる直前の子音 */
const NO_Y_BEFORE = new Set(['r', 'j', 'ch', 'sh', 'y']);

function longU(ctx: RuleContext): Token[] {
  if (ctx.prev?.k === 'C' && NO_Y_BEFORE.has(ctx.prev.s)) return [V('uu')];
  return [C('y'), V('uu')];
}

const afterVowel = (ctx: RuleContext) => ctx.prev?.k === 'V';

// 大文字は「マジックe」で長くなる母音の印（前処理で付ける）
const RULES: Rule[] = [
  { re: /A/y, out: () => [V('ei')] },
  { re: /E/y, out: () => [V('ii')] },
  { re: /I/y, out: () => [V('ai')] },
  { re: /O/y, out: () => [V('oo')] },
  { re: /U/y, out: longU },
  { re: /tch/y, out: () => [Q, C('ch')] },
  { re: /dge$/y, out: () => [Q, C('j')] },
  { re: /ck/y, out: (ctx) => (afterVowel(ctx) ? [Q, C('k')] : [C('k')]) },
  { re: /sch/y, out: () => [C('s'), C('k')] },
  { re: /chr/y, out: () => [C('k'), C('r')] },
  { re: /ch/y, out: () => [C('ch')] },
  { re: /sh/y, out: () => [C('sh')] },
  { re: /th/y, out: () => [C('s')] },
  { re: /ph/y, out: () => [C('f')] },
  { re: /igh/y, out: () => [V('ai')] },
  { re: /eigh/y, out: () => [V('ei')] },
  { re: /gh$/y, out: () => [] },
  { re: /gh/y, out: () => [C('g')] },
  {
    re: /(?<![a-z])(kn|wr|gn)/y,
    out: (_, m) => [C(m[1] === 'wr' ? 'r' : 'n')],
  },
  { re: /(?<![a-z])wh/y, out: () => [R('ho'), C('w')] },
  { re: /mb$/y, out: () => [C('m')] },
  { re: /qu/y, out: () => [R('ku')] },
  { re: /q/y, out: () => [C('k')] },
  {
    re: /x(?=$|[aeiouy])/y,
    out: (ctx) => (afterVowel(ctx) ? [Q, C('k'), C('s')] : [C('k'), C('s')]),
  },
  { re: /x/y, out: (ctx) => (ctx.index === 0 ? [C('z')] : [C('k'), C('s')]) },
  { re: /ds$/y, out: () => [C('z')] },
  { re: /ts/y, out: () => [C('ts')] },
  { re: /ss$/y, out: () => [C('s')] },
  { re: /ff$/y, out: () => [Q, C('f')] },
  { re: /(l|m|n|r)\1/y, out: (_, m) => [C(m[1] === 'l' ? 'r' : m[1])] },
  { re: /tt(?=er)/y, out: () => [C('t')] },
  {
    re: /([bdfgkpstz])\1/y,
    out: (ctx, m) => (afterVowel(ctx) ? [Q, C(m[1])] : [C(m[1])]),
  },
  { re: /wor/y, out: () => [C('w'), V('aa')] },
  { re: /or$/y, out: () => [V('aa')] },
  { re: /ee|ea/y, out: () => [V('ii')] },
  { re: /oo/y, out: () => [V('uu')] },
  { re: /ai|ay/y, out: () => [V('ei')] },
  { re: /au|aw/y, out: () => [V('oo')] },
  { re: /ou/y, out: () => [V('au')] },
  { re: /ow$/y, out: () => [V('oo')] },
  { re: /ow/y, out: () => [V('au')] },
  { re: /oa/y, out: () => [V('oo')] },
  { re: /oi|oy/y, out: () => [V('oi')] },
  { re: /ie/y, out: () => [V('ii')] },
  { re: /ey$/y, out: () => [V('ii')] },
  { re: /ei/y, out: () => [V('ei')] },
  { re: /ew/y, out: longU },
  { re: /ue$/y, out: () => [V('uu')] },
  { re: /ui/y, out: () => [V('uu')] },
  {
    re: /[aeiou]r(?=[^aeiou]|$)/y,
    out: (_, m) => [V(m[0][0] === 'o' ? 'oo' : 'aa')],
  },
  {
    re: /le$/y,
    out: (ctx) => (ctx.prev?.k === 'C' ? [R('ru')] : [C('r'), V('e')]),
  },
  {
    re: /e$/y,
    out: (ctx) => (ctx.prev?.k === 'C' && ctx.word.length > 2 ? [] : [V('ii')]),
  },
  { re: /a/y, out: () => [V('a')] },
  { re: /e/y, out: () => [V('e')] },
  { re: /i/y, out: () => [V('i')] },
  { re: /o/y, out: () => [V('o')] },
  {
    re: /u(?=[^aeiou])/y,
    out: () => [V('a')],
  },
  {
    re: /u$/y,
    out: () => [V('uu')],
  },
  { re: /u/y, out: () => [V('u')] },
  {
    re: /y(?=[aeiou])/y,
    out: () => [C('y')],
  },
  {
    re: /y/y,
    out: (ctx) => {
      if (ctx.index === 0) return [C('y')];
      if (ctx.index === ctx.word.length - 1) {
        const hasOtherVowel = /[aeiou]/i.test(ctx.word);
        return [V(hasOtherVowel ? 'ii' : 'ai')];
      }
      return [V('i')];
    },
  },
  { re: /c(?=[eiy])/y, out: () => [C('s')] },
  { re: /c/y, out: () => [C('k')] },
  { re: /g(?=[ey])/y, out: () => [C('j')] },
  { re: /l/y, out: () => [C('r')] },
  { re: /[a-z]/y, out: (_, m) => [C(m[0])] },
];

/** 語末が「母音＋子音＋e」なら、母音を長く読む印（大文字）にして e を落とす */
function markMagicE(word: string): string {
  const m = /^(.*[^aeiou])?([aeiou])([bcdfgklmnprstvz])e$/.exec(word);
  if (m === null) return word;
  const consonant = m[3] === 'c' ? 's' : m[3] === 'g' ? 'j' : m[3];
  return (m[1] ?? '') + m[2].toUpperCase() + consonant;
}

function tokenize(word: string): Token[] {
  const marked = markMagicE(word);
  const tokens: Token[] = [];
  let i = 0;
  while (i < marked.length) {
    let matched = false;
    for (const rule of RULES) {
      rule.re.lastIndex = i;
      const m = rule.re.exec(marked);
      if (m === null) continue;
      tokens.push(
        ...rule.out(
          { prev: tokens[tokens.length - 1], word: marked, index: i },
          m,
        ),
      );
      i += m[0].length;
      matched = true;
      break;
    }
    if (!matched) i += 1;
  }
  return tokens;
}

/** 語末の「短母音＋破裂音など」は促音を入れる（cut → カット、pocket → ポケット） */
const GEMINATE_FINAL = new Set([
  't',
  'p',
  'k',
  'g',
  'd',
  'b',
  'ch',
  'sh',
  'ts',
]);
const SHORT_VOWELS = new Set(['a', 'e', 'i', 'o']);

function addFinalGemination(tokens: Token[]): Token[] {
  const last = tokens[tokens.length - 1];
  const beforeLast = tokens[tokens.length - 2];
  if (
    last?.k === 'C' &&
    GEMINATE_FINAL.has(last.s) &&
    beforeLast?.k === 'V' &&
    SHORT_VOWELS.has(beforeLast.s)
  ) {
    return [...tokens.slice(0, -1), Q, last];
  }
  return tokens;
}

function epentheticVowel(consonant: string): string {
  if (consonant === 't' || consonant === 'd') return 'o';
  if (consonant === 'ch' || consonant === 'j') return 'i';
  return 'u';
}

function render(tokens: Token[], vSound: 'b' | 'vu'): string {
  let romaji = '';
  let pendingQ = false;
  tokens.forEach((token, index) => {
    const next = tokens[index + 1];
    if (token.k === 'Q') {
      pendingQ = true;
      return;
    }
    if (token.k === 'R') {
      if (pendingQ) romaji += 't';
      pendingQ = false;
      romaji += token.s;
      return;
    }
    if (token.k === 'V') {
      if (pendingQ) romaji += 't';
      pendingQ = false;
      romaji +=
        token.s.length === 2 && token.s[0] === token.s[1]
          ? `${token.s[0]}-`
          : token.s;
      return;
    }

    const followedByVowel = next?.k === 'V';
    const followedByGlide =
      next?.k === 'C' && next.s === 'y' && tokens[index + 2]?.k === 'V';

    let sound = token.s === 'v' && vSound === 'b' ? 'b' : token.s;
    // ティ・ディ・トゥ・ドゥ は IME の入力に合わせた綴りで出す
    if (
      followedByVowel &&
      (token.s === 't' || token.s === 'd') &&
      /^(i|ii|u|uu)$/.test(next.s)
    ) {
      sound = token.s + (next.s.startsWith('u') ? 'w' : 'h');
    }
    if (pendingQ) {
      sound = (sound === 'ch' ? 't' : sound[0]) + sound;
      pendingQ = false;
    }

    if (token.s === 'n' || followedByVowel || followedByGlide) {
      romaji += sound;
      return;
    }
    romaji += sound + epentheticVowel(token.s);
  });
  if (pendingQ) romaji += 't';
  return romaji.replace(/wo/g, 'uxo');
}

function convertWord(word: string, vSound: 'b' | 'vu'): string {
  const tokens = addFinalGemination(tokenize(word.toLowerCase()));
  return romajiToKana(render(tokens, vSound), { script: 'katakana' });
}

const WORD_PATTERN = /[A-Za-z]+(?:['’][A-Za-z]+)*/g;

/**
 * 英単語を綴りのルールで片仮名表記に変換する（簡易版）。
 * 実際の発音とは異なる結果になることがあるため、あくまで目安として使う。
 */
export function convertEnglishToKatakana(
  text: string,
  options: EnglishKatakanaOptions,
): EnglishKatakanaResult {
  const words: EnglishKatakanaWord[] = [];
  const output = text.replace(WORD_PATTERN, (source) => {
    const lower = source.toLowerCase();
    const entry = DICTIONARY[lower];
    if (entry !== undefined) {
      words.push({ source, kana: entry, method: 'dictionary' });
      return entry;
    }
    if (options.spellAcronyms && /^[A-Z]{2,4}$/.test(source)) {
      const kana = Array.from(source, (c) => LETTER_NAMES[c]).join('');
      words.push({ source, kana, method: 'acronym' });
      return kana;
    }
    const parts = source.split(/['’]/);
    const kana = parts
      .map(
        (part) =>
          DICTIONARY[part.toLowerCase()] ?? convertWord(part, options.vSound),
      )
      .join('');
    words.push({ source, kana, method: 'rules' });
    return kana;
  });
  return { output, words };
}
