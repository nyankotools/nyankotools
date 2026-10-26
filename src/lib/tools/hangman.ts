/**
 * ハングマン（英単語当て）のロジック。
 * 単語リストから出題し、文字を1つずつ推測する。ミスが MAX_MISSES に達したら負け。
 */
import { secureRandomInt, type RandomInt } from '../random';

export type { RandomInt };

export const MAX_MISSES = 6;

export const CATEGORY_IDS = [
  'animals',
  'food',
  'nature',
  'school',
  'home',
  'travel',
  'jobs',
  'body',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];
export type CategorySelection = CategoryId | 'all';

export interface WordEntry {
  word: string;
  /** 日本語の意味（日本語ページの答え表示に使う） */
  meaning: string;
}

/** 「単語:意味」の形式で書き、下で WordEntry に展開する */
const RAW: Record<CategoryId, string[]> = {
  animals: [
    'elephant:ゾウ',
    'giraffe:キリン',
    'penguin:ペンギン',
    'dolphin:イルカ',
    'rabbit:ウサギ',
    'monkey:サル',
    'tiger:トラ',
    'zebra:シマウマ',
    'kangaroo:カンガルー',
    'turtle:カメ',
    'squirrel:リス',
    'octopus:タコ',
    'butterfly:チョウ',
    'eagle:ワシ',
    'camel:ラクダ',
    'panda:パンダ',
    'hamster:ハムスター',
    'lizard:トカゲ',
    'sheep:ヒツジ',
    'donkey:ロバ',
    'crocodile:ワニ',
    'whale:クジラ',
    'owl:フクロウ',
    'spider:クモ',
    'jellyfish:クラゲ',
    'peacock:クジャク',
    'koala:コアラ',
    'goat:ヤギ',
    'frog:カエル',
    'lion:ライオン',
  ],
  food: [
    'banana:バナナ',
    'pineapple:パイナップル',
    'strawberry:イチゴ',
    'sandwich:サンドイッチ',
    'noodles:麺',
    'chocolate:チョコレート',
    'pancake:パンケーキ',
    'cheese:チーズ',
    'butter:バター',
    'tomato:トマト',
    'potato:ジャガイモ',
    'carrot:ニンジン',
    'cabbage:キャベツ',
    'lemon:レモン',
    'orange:オレンジ',
    'peach:モモ',
    'mushroom:キノコ',
    'cucumber:キュウリ',
    'pumpkin:カボチャ',
    'spinach:ホウレンソウ',
    'sausage:ソーセージ',
    'pepper:コショウ',
    'honey:はちみつ',
    'bread:パン',
    'cookie:クッキー',
    'coffee:コーヒー',
    'yogurt:ヨーグルト',
    'salad:サラダ',
    'soup:スープ',
    'rice:ご飯・米',
  ],
  nature: [
    'mountain:山',
    'river:川',
    'forest:森',
    'ocean:海',
    'desert:砂漠',
    'volcano:火山',
    'rainbow:虹',
    'thunder:雷',
    'island:島',
    'valley:谷',
    'waterfall:滝',
    'glacier:氷河',
    'cloud:雲',
    'sunshine:日光',
    'snowflake:雪の結晶',
    'storm:嵐',
    'planet:惑星',
    'meadow:牧草地',
    'canyon:峡谷',
    'lightning:稲妻',
    'earthquake:地震',
    'tornado:竜巻',
    'moonlight:月明かり',
    'seashore:海岸',
    'swamp:沼地',
    'cave:洞窟',
    'breeze:そよ風',
    'sunset:夕焼け',
    'galaxy:銀河',
    'comet:彗星',
  ],
  school: [
    'teacher:先生',
    'student:生徒',
    'library:図書館',
    'homework:宿題',
    'notebook:ノート',
    'pencil:鉛筆',
    'eraser:消しゴム',
    'textbook:教科書',
    'classroom:教室',
    'science:理科',
    'history:歴史',
    'grammar:文法',
    'language:言語',
    'music:音楽',
    'exam:試験',
    'lesson:授業',
    'calendar:カレンダー',
    'dictionary:辞書',
    'ruler:定規',
    'scissors:はさみ',
    'blackboard:黒板',
    'backpack:リュック',
    'calculator:計算機',
    'vocabulary:語彙',
    'graduate:卒業する',
    'playground:運動場',
    'lunchbox:お弁当箱',
    'uniform:制服',
    'subject:教科',
    'question:質問',
  ],
  home: [
    'kitchen:台所',
    'bedroom:寝室',
    'window:窓',
    'curtain:カーテン',
    'blanket:毛布',
    'pillow:枕',
    'mirror:鏡',
    'bathroom:浴室',
    'refrigerator:冷蔵庫',
    'television:テレビ',
    'staircase:階段',
    'garden:庭',
    'garage:車庫',
    'balcony:ベランダ',
    'ceiling:天井',
    'carpet:じゅうたん',
    'furniture:家具',
    'umbrella:傘',
    'toothbrush:歯ブラシ',
    'towel:タオル',
    'shower:シャワー',
    'cushion:クッション',
    'drawer:引き出し',
    'lamp:ランプ',
    'clock:時計',
    'ladder:はしご',
    'fence:フェンス',
    'doorbell:ドアベル',
    'bookshelf:本棚',
    'microwave:電子レンジ',
  ],
  travel: [
    'airport:空港',
    'passport:パスポート',
    'ticket:切符',
    'luggage:荷物',
    'hotel:ホテル',
    'suitcase:スーツケース',
    'tourist:観光客',
    'museum:博物館',
    'harbor:港',
    'station:駅',
    'journey:旅',
    'vacation:休暇',
    'souvenir:お土産',
    'compass:コンパス',
    'adventure:冒険',
    'highway:高速道路',
    'bridge:橋',
    'tunnel:トンネル',
    'taxi:タクシー',
    'subway:地下鉄',
    'cruise:クルーズ',
    'flight:フライト',
    'reservation:予約',
    'destination:目的地',
    'itinerary:旅程',
    'customs:税関',
    'platform:ホーム',
    'sightseeing:観光',
    'beach:ビーチ',
    'camping:キャンプ',
  ],
  jobs: [
    'doctor:医者',
    'nurse:看護師',
    'farmer:農家',
    'pilot:パイロット',
    'chef:料理人',
    'dentist:歯医者',
    'engineer:技術者',
    'lawyer:弁護士',
    'painter:画家',
    'singer:歌手',
    'baker:パン職人',
    'firefighter:消防士',
    'police:警察',
    'scientist:科学者',
    'carpenter:大工',
    'designer:デザイナー',
    'driver:運転手',
    'librarian:司書',
    'musician:音楽家',
    'programmer:プログラマー',
    'journalist:記者',
    'plumber:配管工',
    'cashier:レジ係',
    'mechanic:整備士',
    'architect:建築家',
    'actor:俳優',
    'dancer:ダンサー',
    'fisherman:漁師',
    'tailor:仕立屋',
    'astronaut:宇宙飛行士',
  ],
  body: [
    'shoulder:肩',
    'elbow:ひじ',
    'finger:指',
    'knee:ひざ',
    'ankle:足首',
    'forehead:額',
    'eyebrow:眉毛',
    'eyelash:まつ毛',
    'stomach:胃・おなか',
    'throat:のど',
    'muscle:筋肉',
    'skeleton:骨格',
    'heartbeat:心拍',
    'brain:脳',
    'tongue:舌',
    'wrist:手首',
    'thumb:親指',
    'fingernail:爪',
    'cheek:ほお',
    'chin:あご',
    'neck:首',
    'lungs:肺',
    'spine:背骨',
    'bone:骨',
    'skin:皮膚',
    'breath:息',
    'fever:熱',
    'headache:頭痛',
    'medicine:薬',
    'bandage:包帯',
  ],
};

export const WORDS: Record<CategoryId, WordEntry[]> = Object.fromEntries(
  CATEGORY_IDS.map((id) => [
    id,
    RAW[id].map((line) => {
      const [word, meaning] = line.split(':');
      return { word, meaning };
    }),
  ]),
) as Record<CategoryId, WordEntry[]>;

export type Phase = 'playing' | 'won' | 'lost' | 'gaveUp';

export interface GameState {
  category: CategorySelection;
  word: string;
  meaning: string;
  /** 推測した文字（小文字、順番どおり） */
  guessed: string[];
  phase: Phase;
}

export type GuessError = 'invalid' | 'duplicate' | 'finished';

export type GuessResult =
  | { ok: true; state: GameState; hit: boolean }
  | { ok: false; error: GuessError };

/** 出題対象の単語一覧 */
export function wordPool(category: CategorySelection): WordEntry[] {
  if (category === 'all') return CATEGORY_IDS.flatMap((id) => WORDS[id]);
  return WORDS[category] ?? [];
}

/** 新しいゲーム。直前の単語（exclude）は、ほかに選べるなら出さない */
export function newGame(
  category: CategorySelection,
  randomInt: RandomInt = secureRandomInt,
  exclude?: string,
): GameState {
  let pool = wordPool(category);
  if (pool.length === 0) pool = wordPool('all');
  const filtered = pool.filter((e) => e.word !== exclude);
  const candidates = filtered.length > 0 ? filtered : pool;
  const entry = candidates[randomInt(candidates.length)];
  return {
    category,
    word: entry.word,
    meaning: entry.meaning,
    guessed: [],
    phase: 'playing',
  };
}

/** 入力を a〜z 1文字の小文字にする。全角や大文字も受け付け、それ以外は null */
export function normalizeLetter(text: string): string | null {
  const s = text.normalize('NFKC').trim().toLowerCase();
  return /^[a-z]$/.test(s) ? s : null;
}

/** 答えに含まれない推測の一覧 */
export function missedLetters(state: GameState): string[] {
  return state.guessed.filter((l) => !state.word.includes(l));
}

export function missCount(state: GameState): number {
  return missedLetters(state).length;
}

export function remainingMisses(state: GameState): number {
  return Math.max(0, MAX_MISSES - missCount(state));
}

/** 単語を1文字ずつ並べる。当てていない文字は null（reveal で全部見せる） */
export function maskWord(state: GameState, reveal = false): (string | null)[] {
  return Array.from(state.word, (c) =>
    reveal || state.guessed.includes(c) ? c : null,
  );
}

export function isSolved(state: GameState): boolean {
  return Array.from(state.word).every((c) => state.guessed.includes(c));
}

/** 文字を1つ推測する。勝ち負けも判定する */
export function guessLetter(state: GameState, input: string): GuessResult {
  if (state.phase !== 'playing') return { ok: false, error: 'finished' };
  const letter = normalizeLetter(input);
  if (letter === null) return { ok: false, error: 'invalid' };
  if (state.guessed.includes(letter)) return { ok: false, error: 'duplicate' };
  const next: GameState = {
    ...state,
    guessed: [...state.guessed, letter],
  };
  if (isSolved(next)) next.phase = 'won';
  else if (missCount(next) >= MAX_MISSES) next.phase = 'lost';
  return { ok: true, state: next, hit: state.word.includes(letter) };
}

/** ギブアップ。すでに終わっているゲームはそのまま返す */
export function giveUp(state: GameState): GameState {
  return state.phase === 'playing' ? { ...state, phase: 'gaveUp' } : state;
}
