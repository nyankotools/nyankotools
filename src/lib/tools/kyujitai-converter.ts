export type KyujitaiDirection = 'toShinjitai' | 'toKyujitai';

export interface KyujitaiOptions {
  direction: KyujitaiDirection;
  /** 旧字体→新字体のとき、人名などの異体字（髙・﨑・邉 など）も新字体にする */
  includeVariants: boolean;
}

export interface KyujitaiChange {
  from: string;
  to: string;
  count: number;
}

export interface KyujitaiResult {
  output: string;
  /** 変換した文字の内訳（初出順） */
  changes: KyujitaiChange[];
  /** 変換した文字の総数 */
  total: number;
}

/**
 * 新字体と旧字体（康熙字典体）の対応。2文字ずつ「新字体・旧字体」の順に並べる。
 * 新字体→旧字体の変換でも、この旧字体が使われる。
 */
const PAIRS =
  '亜亞悪惡圧壓囲圍為爲医醫壱壹隠隱栄榮営營衛衞駅驛円圓塩鹽縁緣艶艷応應欧歐殴毆奥奧横橫温溫穏穩' +
  '仮假価價画畫会會懐懷壊壞拡擴殻殼覚覺学學岳嶽楽樂渇渴缶罐巻卷陥陷勧勸寛寬関關歓歡観觀気氣既旣' +
  '帰歸偽僞犠犧旧舊挙擧虚虛峡峽挟挾狭狹郷鄕暁曉勲勳薫薰径徑茎莖恵惠掲揭渓溪経經蛍螢軽輕鶏鷄芸藝' +
  '研硏県縣倹儉剣劍険險圏圈検檢献獻権權顕顯験驗厳嚴効效広廣恒恆鉱鑛号號国國済濟砕碎斎齋剤劑' +
  '雑雜参參蚕蠶惨慘桟棧産產賛贊残殘糸絲歯齒湿濕写寫釈釋寿壽収收従從渋澁獣獸縦縱粛肅処處緒緖叙敍' +
  '将將称稱渉涉焼燒証證奨獎条條乗乘浄淨剰剩畳疊嬢孃譲讓醸釀触觸嘱囑真眞寝寢慎愼尽盡図圖粋粹酔醉' +
  '随隨髄髓枢樞数數瀬瀨声聲斉齊静靜窃竊摂攝専專浅淺戦戰践踐銭錢潜潛繊纖禅禪双雙壮壯争爭荘莊捜搜' +
  '挿插巣巢装裝蔵藏臓臟増增即卽属屬続續堕墮体體対對帯帶滞滯滝瀧択擇沢澤担擔単單胆膽団團断斷' +
  '弾彈遅遲痴癡昼晝虫蟲鋳鑄庁廳聴聽鎮鎭逓遞鉄鐵点點転轉伝傳灯燈当當党黨盗盜稲稻闘鬪徳德独獨読讀' +
  '届屆縄繩弐貳悩惱脳腦覇霸拝拜廃廢売賣麦麥発發髪髮抜拔蛮蠻秘祕浜濱払拂仏佛並竝変變辺邊舗舖穂穗' +
  '宝寶豊豐翻飜毎每万萬満滿黙默弥彌薬藥与與誉譽揺搖様樣謡謠来來頼賴乱亂覧覽竜龍両兩猟獵緑綠' +
  '塁壘涙淚礼禮励勵戻戾霊靈齢齡暦曆歴歷恋戀錬鍊炉爐労勞楼樓郎郞録錄湾灣歩步黒黑騒騷駆驅駄馱厩廏' +
  '剥剝絵繪総總実實巌巖歳歲拠據区區薮藪戯戲撃擊桜櫻児兒辞辭壌壤説說絶絕蝉蟬隣鄰遥遙亀龜青靑清淸';

/**
 * 旧字体→新字体の一方向のみの対応（新字体→旧字体では使わない）。
 * 旧字体・異体字が複数ある字（弁・辺 など）の、主な旧字体以外もここに入れる。
 */
const TO_SHINJITAI_ONLY: [string, string][] = [
  ['辨', '弁'],
  ['辯', '弁'],
  ['瓣', '弁'],
  ['邉', '辺'],
  ['廻', '回'],
  ['臺', '台'],
  ['豫', '予'],
  ['缺', '欠'],
];

/** 人名などに使われる異体字（includeVariants のときだけ新字体にする） */
const VARIANTS: [string, string][] = [
  ['髙', '高'],
  ['﨑', '崎'],
  ['嶋', '島'],
  ['冨', '富'],
  ['峯', '峰'],
];

/** 新字体→旧字体に変換できない（旧字体が複数あって決められない）新字体 */
export const AMBIGUOUS_SHINJITAI = ['弁', '台', '予', '欠'];

function buildPairs(): [string, string][] {
  const chars = [...PAIRS];
  const pairs: [string, string][] = [];
  for (let i = 0; i + 1 < chars.length; i += 2) {
    pairs.push([chars[i], chars[i + 1]]);
  }
  return pairs;
}

/** [新字体, 旧字体] の一覧（テスト・用語解説用） */
export const KYUJITAI_PAIRS: readonly [string, string][] = buildPairs();

const TO_KYUJITAI = new Map<string, string>(KYUJITAI_PAIRS);

const TO_SHINJITAI = new Map<string, string>([
  ...KYUJITAI_PAIRS.map(([shin, kyu]): [string, string] => [kyu, shin]),
  ...TO_SHINJITAI_ONLY.map(([kyu, shin]): [string, string] => [kyu, shin]),
]);

const VARIANT_MAP = new Map<string, string>(VARIANTS);

export function convertKyujitai(
  text: string,
  options: KyujitaiOptions,
): KyujitaiResult {
  const toShin = options.direction === 'toShinjitai';
  const counts = new Map<string, KyujitaiChange>();
  let total = 0;
  let output = '';

  for (const ch of text) {
    let mapped: string | undefined;
    if (toShin) {
      mapped = TO_SHINJITAI.get(ch);
      if (mapped === undefined && options.includeVariants) {
        mapped = VARIANT_MAP.get(ch);
      }
    } else {
      mapped = TO_KYUJITAI.get(ch);
    }

    if (mapped === undefined) {
      output += ch;
      continue;
    }
    output += mapped;
    total++;
    const entry = counts.get(ch);
    if (entry) entry.count++;
    else counts.set(ch, { from: ch, to: mapped, count: 1 });
  }

  return { output, changes: [...counts.values()], total };
}
