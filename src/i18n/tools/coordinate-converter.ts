import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface CoordinateConverterPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  pointALabel: string;
  pointBLabel: string;
  pointBHint: string;
  latLabel: string;
  lonLabel: string;
  latPlaceholder: string;
  lonPlaceholder: string;
  inputHint: string;
  sampleButton: string;
  clearButton: string;
  decimalsLabel: string;
  decimalsOption: string;
  convertedHeading: string;
  decimalRowLabel: string;
  dmsRowLabel: string;
  ddmRowLabel: string;
  distanceHeading: string;
  kilometersLabel: string;
  milesLabel: string;
  nauticalMilesLabel: string;
  metersLabel: string;
  initialBearingLabel: string;
  finalBearingLabel: string;
  midpointLabel: string;
  samePoint: string;
  needBothPoints: string;
  copyButton: string;
  copied: string;
  copyFailed: string;
  /** 解析エラー（キーは coordinate-converter.ts の ParseError） */
  errors: Record<
    | 'empty'
    | 'invalidChars'
    | 'tooManyParts'
    | 'directionMismatch'
    | 'minutesOutOfRange'
    | 'secondsOutOfRange'
    | 'notInteger'
    | 'outOfRange',
    string
  >;
  /** 16方位の名称（北から時計回り） */
  compassNames: string[];
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const coordinateConverterContent: Record<
  Locale,
  CoordinateConverterPageContent
> = {
  ja: {
    title: '緯度経度 度分秒変換・2点間距離計算ツール',
    description:
      '緯度経度を10進度と度分秒（DMS）で相互変換し、2地点の距離・方位・中間点をHaversine公式で計算します。地図は表示せず、ブラウザ内で処理され、サーバーには送信されません。',
    h1: '緯度経度 度分秒変換・2点間距離計算',
    introHtml:
      '緯度・経度を10進度、度分秒、度分の3形式に変換し、2地点を入力するとHaversine公式で大圏距離（km・マイル・海里）、方位角、中間点を計算します。地図を表示しないので、外部へ通信しません。単位の換算は<a href="/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">単位変換</a>もご利用ください。',
    pointALabel: '地点A',
    pointBLabel: '地点B（距離を測る場合）',
    pointBHint: '地点Bを入力すると、地点Aからの距離と方位を計算します。',
    latLabel: '緯度',
    lonLabel: '経度',
    latPlaceholder: '例: 35.6812 / 35°40′52″ N',
    lonPlaceholder: '例: 139.7671 / 139°46′1″ E',
    inputHint:
      '10進度、度分秒（35°40′52″ や 35 40 52）、N/S/E/W・北南東西の付いた形式を読み取ります。南緯・西経はマイナスまたは S/W で指定します。',
    sampleButton: 'サンプル（東京駅→大阪駅）を入れる',
    clearButton: 'クリア',
    decimalsLabel: '秒の小数桁数',
    decimalsOption: '{n}桁',
    convertedHeading: '変換結果',
    decimalRowLabel: '10進度',
    dmsRowLabel: '度分秒',
    ddmRowLabel: '度分',
    distanceHeading: '2点間の距離と方位',
    kilometersLabel: '距離（km）',
    milesLabel: '距離（マイル）',
    nauticalMilesLabel: '距離（海里）',
    metersLabel: '距離（m）',
    initialBearingLabel: 'A→Bの初期方位角',
    finalBearingLabel: 'Bに着くときの方位角',
    midpointLabel: '大圏の中間点',
    samePoint: '2点が同じ位置のため、距離は0で方位角は定まりません。',
    needBothPoints: '地点AとBの両方を入力すると、距離と方位を表示します。',
    copyButton: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    errors: {
      empty: '値を入力してください。',
      invalidChars:
        '読み取れない文字が含まれています。例: 35.6812、35°40′52″ N、35 40 52',
      tooManyParts: '度・分・秒の3つまでで入力してください。',
      directionMismatch:
        '方位が合っていません。緯度は N/S（北南）、経度は E/W（東西）で、1つだけ指定できます。',
      minutesOutOfRange: '分は0以上60未満で入力してください。',
      secondsOutOfRange: '秒は0以上60未満で入力してください。',
      notInteger:
        '分や秒を併記するときは、度（と分）を整数で入力してください。',
      outOfRange: '範囲外です。緯度は±90度、経度は±180度までです。',
    },
    compassNames: [
      '北',
      '北北東',
      '北東',
      '東北東',
      '東',
      '東南東',
      '南東',
      '南南東',
      '南',
      '南南西',
      '南西',
      '西南西',
      '西',
      '西北西',
      '北西',
      '北北西',
    ],
    notesHeading: '注意事項',
    notes: [
      '距離は地球を半径6371.0088kmの球とみなしたHaversine公式による大圏距離（最短経路）で、楕円体モデル（測地線）に比べて最大0.5%程度の誤差があります。測量や航空・航海の用途には専用の計算を使ってください。',
      '道路や鉄道に沿った道のりではなく、地表上の直線的な最短距離です。標高差も考慮しません。',
      '方位角は北を0度として時計回りに測った角度です。大圏航路は進むにつれて方位が変わるため、初期方位角と到着時の方位角は一般に異なります。',
      '測地系（日本測地系と世界測地系など）の違いによる座標のずれは補正しません。GPSや地図アプリの座標は通常WGS84です。',
      '自宅などの位置情報を扱う場合も、入力はブラウザ内だけで処理され、送信・保存されません。地図の読み込みもないため外部への通信は発生しません。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: '度分秒（DMS）',
        description:
          '角度を度・分・秒で表す方式です。1度=60分、1分=60秒なので、35°40′52″ は 35 + 40/60 + 52/3600 ≒ 35.6811度になります。',
      },
      {
        term: 'Haversine公式',
        description:
          '球面上の2点の緯度経度から大圏距離を求める公式です。短い距離でも数値誤差が出にくいのが特徴です。',
      },
      {
        term: '初期方位角',
        description:
          '出発点から目的地へ大圏に沿って進み始めるときの進行方向を、北を0度として時計回りに表した角度です。',
      },
    ],
  },
  en: {
    title: 'Coordinate Converter: Decimal to DMS & Distance',
    description:
      'Convert latitude and longitude between decimal degrees and DMS, and get the Haversine distance, bearing and midpoint of two points. Runs in your browser.',
    h1: 'Lat/Long Decimal to DMS Converter and Distance Calculator',
    introHtml:
      'Convert latitude and longitude between decimal degrees, degrees-minutes-seconds and degrees-decimal-minutes. Enter a second point to get the great-circle distance (km, miles, nautical miles), bearing and midpoint with the Haversine formula. No map is loaded, so nothing leaves your browser. For other units, see the <a href="/en/tools/unit-converter/" class="text-blue-700 underline hover:no-underline dark:text-blue-400">Unit Converter</a>.',
    pointALabel: 'Point A',
    pointBLabel: 'Point B (to measure a distance)',
    pointBHint: 'Enter Point B to get the distance and bearing from Point A.',
    latLabel: 'Latitude',
    lonLabel: 'Longitude',
    latPlaceholder: 'e.g. 35.6812 or 35°40′52″ N',
    lonPlaceholder: 'e.g. 139.7671 or 139°46′1″ E',
    inputHint:
      'Accepts decimal degrees, DMS (35°40′52″ or 35 40 52) and values with N/S/E/W. Use a minus sign or S/W for south latitude and west longitude.',
    sampleButton: 'Insert sample (Tokyo Station to Osaka Station)',
    clearButton: 'Clear',
    decimalsLabel: 'Seconds decimals',
    decimalsOption: '{n}',
    convertedHeading: 'Converted',
    decimalRowLabel: 'Decimal degrees',
    dmsRowLabel: 'DMS',
    ddmRowLabel: 'Degrees and decimal minutes',
    distanceHeading: 'Distance and bearing',
    kilometersLabel: 'Distance (km)',
    milesLabel: 'Distance (miles)',
    nauticalMilesLabel: 'Distance (nautical miles)',
    metersLabel: 'Distance (m)',
    initialBearingLabel: 'Initial bearing A to B',
    finalBearingLabel: 'Bearing on arrival at B',
    midpointLabel: 'Great-circle midpoint',
    samePoint:
      'Both points are the same, so the distance is 0 and there is no bearing.',
    needBothPoints:
      'Enter both Point A and Point B to see the distance and bearing.',
    copyButton: 'Copy results',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    errors: {
      empty: 'Enter a value.',
      invalidChars:
        'Some characters could not be read. Examples: 35.6812, 35°40′52″ N, 35 40 52',
      tooManyParts: 'Use at most three parts: degrees, minutes and seconds.',
      directionMismatch:
        'The direction does not fit. Latitude takes one N or S, longitude takes one E or W.',
      minutesOutOfRange: 'Minutes must be at least 0 and less than 60.',
      secondsOutOfRange: 'Seconds must be at least 0 and less than 60.',
      notInteger:
        'When minutes or seconds are given, degrees (and minutes) must be whole numbers.',
      outOfRange:
        'Out of range. Latitude is limited to ±90 and longitude to ±180 degrees.',
    },
    compassNames: [
      'North',
      'North-northeast',
      'Northeast',
      'East-northeast',
      'East',
      'East-southeast',
      'Southeast',
      'South-southeast',
      'South',
      'South-southwest',
      'Southwest',
      'West-southwest',
      'West',
      'West-northwest',
      'Northwest',
      'North-northwest',
    ],
    notesHeading: 'Notes',
    notes: [
      'Distance is the great-circle (shortest) distance from the Haversine formula, treating the Earth as a sphere of radius 6,371.0088 km. It can differ from an ellipsoidal (geodesic) calculation by up to about 0.5%, so use dedicated tools for surveying, aviation or navigation.',
      'It is the straight-line shortest path over the surface, not the length of a road or rail route, and elevation is ignored.',
      'Bearings are measured clockwise from north (0 degrees). Along a great circle the heading keeps changing, so the initial bearing and the bearing on arrival usually differ.',
      'No datum conversion is applied (for example Tokyo Datum to WGS84). GPS and map apps normally use WGS84.',
      'Even for sensitive locations such as your home, input is processed in your browser only and is neither sent nor stored. No map tiles are loaded, so there is no external request.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'DMS (degrees, minutes, seconds)',
        description:
          'A way to write an angle in degrees, minutes and seconds. One degree is 60 minutes and one minute is 60 seconds, so 35°40′52″ equals 35 + 40/60 + 52/3600, about 35.6811 degrees.',
      },
      {
        term: 'Haversine formula',
        description:
          'A formula for the great-circle distance between two points on a sphere given their latitudes and longitudes. It stays numerically stable even for short distances.',
      },
      {
        term: 'Initial bearing',
        description:
          'The compass direction, measured clockwise from north, in which you start travelling along the great circle from the origin toward the destination.',
      },
    ],
  },
};
