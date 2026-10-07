import type { Locale } from '../../data/tools';

export interface FuelCostCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  introHtml: string;
  numberLocale: string;
  distanceLabel: string;
  distanceUnit: string;
  economyLabel: string;
  economyUnitLegend: string;
  economyUnitKmPerL: string;
  economyUnitLPer100km: string;
  priceLabel: string;
  extraCostLabel: string;
  extraCostNote: string;
  peopleLabel: string;
  peopleUnit: string;
  error: string;
  resultFuelCostLabel: string;
  resultLitersLabel: string;
  resultFuelPerKmLabel: string;
  resultTotalLabel: string;
  resultTotalPerKmLabel: string;
  resultPerPersonLabel: string;
  resultPerPersonCeilLabel: string;
  litersUnit: string;
  perKmUnit: string;
  notesHeading: string;
  notes: string[];
}

export const fuelCostCalculatorContent: Record<
  Locale,
  FuelCostCalculatorPageContent
> = {
  ja: {
    title: '燃費・ガソリン代計算機｜走行距離から費用と割り勘を計算',
    description:
      '走行距離・燃費・ガソリン単価から燃料代と1km当たりのコストを計算し、高速料金込みの総額を人数で割り勘できる無料ツールです。km/LとL/100kmに対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: '燃費・ガソリン代計算機（旅行の割り勘対応）',
    introHtml:
      '走行距離・燃費・ガソリン単価を入力すると、必要なガソリン量と燃料代、1km当たりのコストをすぐ計算します。高速料金や駐車場代、同乗者の人数を入れれば、旅行やドライブの割り勘額も出せます。ブラウザ内で処理され、入力内容がサーバーに送信されることはありません。<a href="/tools/unit-converter/">単位変換</a>や<a href="/tools/hourly-wage-calculator/">時給換算</a>もあわせてどうぞ。',
    numberLocale: 'ja-JP',
    distanceLabel: '走行距離',
    distanceUnit: 'km',
    economyLabel: '燃費',
    economyUnitLegend: '燃費の単位',
    economyUnitKmPerL: 'km/L',
    economyUnitLPer100km: 'L/100km',
    priceLabel: 'ガソリン単価（円/L）',
    extraCostLabel: '高速料金・駐車場代など（円）',
    extraCostNote: '任意。旅行全体でかかる合計額を入力します。',
    peopleLabel: '割り勘の人数',
    peopleUnit: '人',
    error:
      '計算できませんでした（距離・燃費・単価は0より大きい値、追加費用は0以上、人数は1以上の整数で入力してください）',
    resultFuelCostLabel: '燃料代',
    resultLitersLabel: '必要なガソリン量',
    resultFuelPerKmLabel: '1km当たりの燃料代',
    resultTotalLabel: '総費用（追加費用込み）',
    resultTotalPerKmLabel: '1km当たりの総費用',
    resultPerPersonLabel: '1人当たり（端数あり）',
    resultPerPersonCeilLabel: '1人当たり（1円単位に切り上げ）',
    litersUnit: 'L',
    perKmUnit: '/km',
    notesHeading: '注意事項',
    notes: [
      'カタログ燃費は一定条件での測定値です。渋滞・エアコン・積載量・坂道などで実際の燃費は変わるため、金額は目安としてお使いください。',
      '割り勘額は総費用を人数で割って1円単位に切り上げています。全員が同額を支払えば、端数が出ても総費用に不足しません。',
      'L/100km は100km走るのに必要な燃料のリットル数で、値が小さいほど低燃費です（20L/100km = 5km/L）。',
    ],
  },
  en: {
    title: 'Fuel Cost Calculator: Trip Cost per km and Split by Person',
    description:
      'Calculate fuel cost and cost per km from distance, fuel economy and price, and split it with tolls among passengers. Runs in your browser.',
    h1: 'Fuel Cost Calculator for Road Trips (with Cost Splitting)',
    introHtml:
      'Enter the distance, fuel economy and fuel price to see how much fuel you need, what it costs and the cost per km. Add tolls, parking and the number of people to split a road trip fairly. Everything runs in your browser and nothing you type is sent to a server. You may also want the <a href="/en/tools/unit-converter/">unit converter</a> or the <a href="/en/tools/hourly-wage-calculator/">hourly wage calculator</a>.',
    numberLocale: 'en-US',
    distanceLabel: 'Distance',
    distanceUnit: 'km',
    economyLabel: 'Fuel economy',
    economyUnitLegend: 'Fuel economy unit',
    economyUnitKmPerL: 'km/L',
    economyUnitLPer100km: 'L/100km',
    priceLabel: 'Fuel price (JPY per L)',
    extraCostLabel: 'Tolls, parking, etc. (JPY)',
    extraCostNote: 'Optional. Enter the total for the whole trip.',
    peopleLabel: 'Number of people',
    peopleUnit: 'people',
    error:
      'Could not calculate (distance, economy and price must be above 0, extra costs 0 or more, and people a whole number of 1 or more)',
    resultFuelCostLabel: 'Fuel cost',
    resultLitersLabel: 'Fuel needed',
    resultFuelPerKmLabel: 'Fuel cost per km',
    resultTotalLabel: 'Total cost (with extras)',
    resultTotalPerKmLabel: 'Total cost per km',
    resultPerPersonLabel: 'Per person (exact)',
    resultPerPersonCeilLabel: 'Per person (rounded up to 1 yen)',
    litersUnit: 'L',
    perKmUnit: '/km',
    notesHeading: 'Notes',
    notes: [
      'Rated fuel economy is measured under fixed conditions. Traffic, air conditioning, load and hills change real consumption, so treat the amounts as estimates.',
      'The per-person share is the total divided by the number of people, rounded up to a whole yen so that equal payments always cover the total.',
      'L/100km is the liters needed to drive 100 km, so a smaller value means better economy (20 L/100 km = 5 km/L).',
    ],
  },
};
