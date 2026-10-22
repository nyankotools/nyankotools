export const COLOR_GROUPS = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'neutral',
] as const;

export type ColorGroup = (typeof COLOR_GROUPS)[number];

export interface CssColor {
  name: string;
  hex: string;
  rgb: string;
  group: ColorGroup;
}

/** CSS Color Module Level 4 のキーワード色（148個。transparent / currentColor は含めない）。「名前:HEX」 */
const RAW =
  'aliceblue:f0f8ff antiquewhite:faebd7 aqua:00ffff aquamarine:7fffd4 azure:f0ffff beige:f5f5dc bisque:ffe4c4 black:000000 blanchedalmond:ffebcd blue:0000ff blueviolet:8a2be2 brown:a52a2a burlywood:deb887 cadetblue:5f9ea0 chartreuse:7fff00 chocolate:d2691e coral:ff7f50 cornflowerblue:6495ed cornsilk:fff8dc crimson:dc143c cyan:00ffff darkblue:00008b darkcyan:008b8b darkgoldenrod:b8860b darkgray:a9a9a9 darkgreen:006400 darkgrey:a9a9a9 darkkhaki:bdb76b darkmagenta:8b008b darkolivegreen:556b2f darkorange:ff8c00 darkorchid:9932cc darkred:8b0000 darksalmon:e9967a darkseagreen:8fbc8f darkslateblue:483d8b darkslategray:2f4f4f darkslategrey:2f4f4f darkturquoise:00ced1 darkviolet:9400d3 deeppink:ff1493 deepskyblue:00bfff dimgray:696969 dimgrey:696969 dodgerblue:1e90ff firebrick:b22222 floralwhite:fffaf0 forestgreen:228b22 fuchsia:ff00ff gainsboro:dcdcdc ghostwhite:f8f8ff gold:ffd700 goldenrod:daa520 gray:808080 grey:808080 green:008000 greenyellow:adff2f honeydew:f0fff0 hotpink:ff69b4 indianred:cd5c5c indigo:4b0082 ivory:fffff0 khaki:f0e68c lavender:e6e6fa lavenderblush:fff0f5 lawngreen:7cfc00 lemonchiffon:fffacd lightblue:add8e6 lightcoral:f08080 lightcyan:e0ffff lightgoldenrodyellow:fafad2 lightgray:d3d3d3 lightgreen:90ee90 lightgrey:d3d3d3 lightpink:ffb6c1 lightsalmon:ffa07a lightseagreen:20b2aa lightskyblue:87cefa lightslategray:778899 lightslategrey:778899 lightsteelblue:b0c4de lightyellow:ffffe0 lime:00ff00 limegreen:32cd32 linen:faf0e6 magenta:ff00ff maroon:800000 mediumaquamarine:66cdaa mediumblue:0000cd mediumorchid:ba55d3 mediumpurple:9370db mediumseagreen:3cb371 mediumslateblue:7b68ee mediumspringgreen:00fa9a mediumturquoise:48d1cc mediumvioletred:c71585 midnightblue:191970 mintcream:f5fffa mistyrose:ffe4e1 moccasin:ffe4b5 navajowhite:ffdead navy:000080 oldlace:fdf5e6 olive:808000 olivedrab:6b8e23 orange:ffa500 orangered:ff4500 orchid:da70d6 palegoldenrod:eee8aa palegreen:98fb98 paleturquoise:afeeee palevioletred:db7093 papayawhip:ffefd5 peachpuff:ffdab9 peru:cd853f pink:ffc0cb plum:dda0dd powderblue:b0e0e6 purple:800080 rebeccapurple:663399 red:ff0000 rosybrown:bc8f8f royalblue:4169e1 saddlebrown:8b4513 salmon:fa8072 sandybrown:f4a460 seagreen:2e8b57 seashell:fff5ee sienna:a0522d silver:c0c0c0 skyblue:87ceeb slateblue:6a5acd slategray:708090 slategrey:708090 snow:fffafa springgreen:00ff7f steelblue:4682b4 tan:d2b48c teal:008080 thistle:d8bfd8 tomato:ff6347 turquoise:40e0d0 violet:ee82ee wheat:f5deb3 white:ffffff whitesmoke:f5f5f5 yellow:ffff00 yellowgreen:9acd32';

function parseHex(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** 色相・彩度・明度から大まかな系統を決める（彩度が低い色と非常に明るい色は「白・灰・黒」） */
export function classifyColor(hex: string): ColorGroup {
  const { r, g, b } = parseHex(hex);
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const chroma = max - min;
  const light = (max + min) / 2;
  if (chroma < 0.12 || light > 0.95) return 'neutral';
  let h: number;
  if (max * 255 === r) h = (((g - b) / 255 / chroma) % 6) * 60;
  else if (max * 255 === g) h = ((b - r) / 255 / chroma + 2) * 60;
  else h = ((r - g) / 255 / chroma + 4) * 60;
  if (h < 0) h += 360;
  if (h >= 335 || h < 15) return 'red';
  if (h < 45) return 'orange';
  if (h < 70) return 'yellow';
  if (h < 165) return 'green';
  if (h < 260) return 'blue';
  return 'purple';
}

function buildColors(): CssColor[] {
  return RAW.split(' ').map((entry) => {
    const [name, body] = entry.split(':');
    const hex = `#${body}`;
    const { r, g, b } = parseHex(hex);
    return {
      name,
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      group: classifyColor(hex),
    };
  });
}

export const CSS_COLORS: CssColor[] = buildColors();

/**
 * 色名・HEXで検索する。空のクエリは全件、区分は 'all' で絞り込みなし。
 * 色名は大文字小文字・空白・ハイフンを無視（"dark blue" で darkblue に一致）、HEXは「#」の有無を問わず部分一致する。
 */
export function filterColors(
  query: string,
  group: ColorGroup | 'all' = 'all',
  colors: CssColor[] = CSS_COLORS,
): CssColor[] {
  const q = query.normalize('NFKC').trim().toLowerCase();
  const nameQuery = q.replace(/[\s_-]+/g, '');
  const hexQuery =
    /^#?[0-9a-f]{3,6}$/.test(q) && (q.startsWith('#') || /\d/.test(q))
      ? q.replace(/^#/, '')
      : '';
  return colors.filter((c) => {
    if (group !== 'all' && c.group !== group) return false;
    if (q === '') return true;
    return (
      (nameQuery !== '' && c.name.includes(nameQuery)) ||
      (hexQuery !== '' && c.hex.slice(1).includes(hexQuery))
    );
  });
}

function channelLuminance(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** 背景HEXの上に載せる文字色（黒または白）を、コントラスト比が高いほうで選ぶ */
export function readableTextColor(hex: string): '#000000' | '#ffffff' {
  const { r, g, b } = parseHex(hex);
  const lum =
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b);
  return 1.05 / (lum + 0.05) > (lum + 0.05) / 0.05 ? '#ffffff' : '#000000';
}
