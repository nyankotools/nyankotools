/**
 * 特殊文字・絵文字一覧のデータと検索ロジック。
 * 表示名はi18n辞書側（グループIDで引く）。ここにはグループごとの文字と、検索用のキーワードだけを持つ。
 */

export interface CharGroup {
  id: string;
  /** 検索に使う語（日本語・英語の両方）。小文字で書く */
  keywords: string[];
  /** 1つ以上のコードポイントからなる文字列（顔文字のように複数文字のものも含む） */
  items: string[];
}

function chars(text: string): string[] {
  return Array.from(text.replace(/\s+/g, ''));
}

export const charGroups: CharGroup[] = [
  {
    id: 'stars',
    keywords: ['星', 'スター', 'star', 'きらきら', 'sparkle'],
    items: chars('★☆✦✧✩✪✫✬✭✮✯✰✱✲✳✴✵✶✷✸✹✺✻✼✽✾✿❀❁❂❃❄❅❆❇❈❉❊❋⁂⁎⁑'),
  },
  {
    id: 'hearts',
    keywords: ['ハート', 'heart', '愛', 'love', 'ラブ'],
    items: chars('♡♥❤❥❣❦❧☙ღ'),
  },
  {
    id: 'arrows',
    keywords: ['矢印', 'arrow', 'やじるし', '方向'],
    items: chars('←↑→↓↔↕↖↗↘↙⇐⇑⇒⇓⇔⇕⇦⇧⇨⇩➔➘➙➚➛➜➝➞➟➠➡➢➣➤➥➦➧➨↩↪↺↻↶↷⟲⟳⤴⤵⏎'),
  },
  {
    id: 'shapes',
    keywords: ['図形', '丸', '四角', '三角', 'shape', 'circle', 'square'],
    items: chars('●○◎◉◯◌◍◐◑◒◓■□▢▣▤▥▦▧▨▩▲△▴▵▶▷▸▹►▻▼▽▾▿◀◁◂◃◄◅◆◇◈◊⬛⬜⬤⬟⬠⬡'),
  },
  {
    id: 'bullets',
    keywords: ['箇条書き', '点', 'bullet', 'dot', '中黒', '記号'],
    items: chars('•‣◦⁃∙・･◘◙▪▫※‼⁇⁈⁉‥…⋯⋮⋰⋱〃〆々ー〜~'),
  },
  {
    id: 'brackets',
    keywords: ['かっこ', '括弧', 'bracket', 'quote', '引用符'],
    items: chars(
      '「」『』【】〔〕〈〉《》〖〗〘〙〚〛（）［］｛｝｟｠‹›«»“”‘’„‚〝〞',
    ),
  },
  {
    id: 'math',
    keywords: ['数学', '数式', 'math', '計算', '不等号', '記号'],
    items: chars('±×÷≠≈≒≡≤≥≦≧≪≫∞√∛∑∏∫∬∮∂∆∇∈∉∋∪∩⊂⊃⊆⊇∧∨¬∀∃∴∵∝∥⊥∠°′″‰‱π'),
  },
  {
    id: 'currency',
    keywords: [
      '通貨',
      'お金',
      '円',
      'ドル',
      'currency',
      'money',
      'yen',
      'dollar',
    ],
    items: chars('¥￥$＄€£¢₩₹₽₿฿₫₪₴₺₱₡₦'),
  },
  {
    id: 'circledNumbers',
    keywords: ['丸数字', '数字', 'ローマ数字', 'circled', 'number', 'roman'],
    items: chars(
      '⓪①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳❶❷❸❹❺❻❼❽❾❿⓿⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹ',
    ),
  },
  {
    id: 'units',
    keywords: ['単位', '㈱', '株式会社', 'unit', '略号', '合字'],
    items: chars(
      '㎜㎝㎞㎎㎏㎡㎥㏄㏈㌔㌘㌢㌧㌫㌻㍉㍊㍍㍑㍗㍿℃℉№℡㈱㈲㈹㊤㊥㊦㊧㊨㊗㊙㊊㊋㊌㊍㊎㊏㊐㍻㍼㍽㍾',
    ),
  },
  {
    id: 'music',
    keywords: ['音符', '音楽', 'music', 'note', 'sharp', 'flat'],
    items: chars('♩♪♫♬♭♮♯𝄞𝄢'),
  },
  {
    id: 'weather',
    keywords: ['天気', '星座', '天体', 'weather', 'zodiac', 'sun', 'moon'],
    items: chars('☀☁☂☃☄☼☽☾☉☊☋☌☍♁♀♂♈♉♊♋♌♍♎♏♐♑♒♓⚡☔'),
  },
  {
    id: 'cards',
    keywords: [
      'トランプ',
      'ゲーム',
      'サイコロ',
      'card',
      'game',
      'dice',
      'chess',
    ],
    items: chars('♠♢♣♤♦♧♔♕♖♗♘♙♚♛♜♝♞♟⚀⚁⚂⚃⚄⚅'),
  },
  {
    id: 'misc',
    keywords: [
      'その他',
      '記号',
      'マーク',
      'mark',
      'check',
      'symbol',
      'copyright',
    ],
    items: chars('✓✔✕✖✗✘☑☒☐✂✆✉✎✏✐☎☏☺☻☹☠☢☣☮☯☸♨♻⚐⚑⚠⚓⚔⚖⚙⚛⚜§¶†‡©®™℗♾'),
  },
  {
    id: 'lines',
    keywords: ['罫線', '線', 'line', 'border', 'box', '区切り'],
    items: chars(
      '─━│┃┄┅┆┇┈┉┊┋┌┍┎┏┐┑┒┓└┕┖┗┘┙┚┛├┝┞┟┠┡┢┣┤┥┦┧┨┩┪┫┬┭┮┯┰┱┲┳┴┵┶┷┸┹┺┻┼═║╔╗╚╝╠╣╦╩╬▀▄█▌▐░▒▓',
    ),
  },
  {
    id: 'kaomoji',
    keywords: [
      '顔文字',
      'かおもじ',
      'kaomoji',
      'emoticon',
      'face',
      'text face',
    ],
    items: [
      '(＾▽＾)',
      '(´▽｀)',
      '(*´ω｀*)',
      '(≧▽≦)',
      '(^_^)',
      '(^o^)/',
      'ヽ(´▽`)/',
      '٩(◕‿◕)٩',
      '(｡･ω･｡)',
      'ʕ•ᴥ•ʔ',
      '(=^･ω･^=)',
      '(・∀・)',
      '(｀・ω・´)',
      '(๑•̀ㅂ•́)و✧',
      '(´；ω；`)',
      '(T_T)',
      '(｡•́︿•̀｡)',
      '(；´Д｀)',
      '(・_・;)',
      '(-_-;)',
      '(¬_¬)',
      '(╬ Ò﹏Ó)',
      '(╯°□°)╯︵ ┻━┻',
      '¯\\_(ツ)_/¯',
      'm(_ _)m',
      'orz',
      '( ˘ω˘ )',
      '(´∀｀)♡',
      '(*´Д`)ﾊｧﾊｧ',
      '(ﾉ´ヮ`)ﾉ*: ･ﾟ',
    ],
  },
  {
    id: 'emojiFaces',
    keywords: ['絵文字', '顔', '表情', 'emoji', 'face', 'smile', 'emotion'],
    items: chars(
      '😀😃😄😁😆😅😂🤣😊😇🙂🙃😉😍🥰😘😗😙😚😋😛😜🤪😝🤑🤗🤭🤫🤔🤐😐😑😶😏😒🙄😬😌😔😪🤤😴😷🤒🤕🤢🤮🤧🥵🥶🥴😵🤯🤠🥳😎🤓🧐😕😟🙁😮😯😲😳🥺😦😧😨😰😥😢😭😱😖😣😞😓😩😫🥱😤😡😠🤬😈👿💀💩🤡👻👽🤖',
    ),
  },
  {
    id: 'emojiHands',
    keywords: [
      '絵文字',
      '手',
      'ジェスチャー',
      '人',
      'emoji',
      'hand',
      'gesture',
      'people',
    ],
    items: [
      ...chars('👍👎👌🤏🤞🤟🤘🤙👈👉👆👇✋🤚👋🤝👏🙌👐🤲🙏💪🦵🦶👀👂👃👄👅'),
      '✌️',
      '☝️',
      '✍️',
      '🖐️',
    ],
  },
  {
    id: 'emojiHearts',
    keywords: ['絵文字', 'ハート', 'emoji', 'heart', 'love'],
    items: [
      '❤️',
      ...chars('🧡💛💚💙💜🖤🤍🤎💔💕💞💓💗💖💘💝💟'),
      '❣️',
      '💋',
      '💯',
      '💢',
      '💥',
      '💫',
      '💦',
      '💤',
    ],
  },
  {
    id: 'emojiAnimals',
    keywords: [
      '絵文字',
      '動物',
      '植物',
      '花',
      'emoji',
      'animal',
      'nature',
      'flower',
    ],
    items: chars(
      '🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐸🐵🙈🙉🙊🐔🐧🐦🐤🦆🦅🦉🦇🐺🐗🐴🦄🐝🐛🦋🐌🐞🐜🐢🐍🦎🐙🦑🦀🐠🐟🐬🐳🦈🐘🦒🦓🐪🐑🐐🌵🌲🌳🌴🌱🌿🍀🍁🍂🍃🌸🌹🌺🌻🌼🌷',
    ),
  },
  {
    id: 'emojiFood',
    keywords: ['絵文字', '食べ物', '飲み物', '食事', 'emoji', 'food', 'drink'],
    items: chars(
      '🍎🍊🍋🍌🍉🍇🍓🍒🍑🍍🥝🍅🥑🍆🥕🌽🥔🍞🥐🧀🍳🥓🍔🍟🍕🌭🌮🍣🍱🍜🍝🍙🍚🍛🍢🍡🍰🎂🍮🍩🍪🍫🍬🍭🍦☕🍵🍺🍻🍷🍸🍶🥂🥤',
    ),
  },
  {
    id: 'emojiObjects',
    keywords: [
      '絵文字',
      '物',
      'お祝い',
      '乗り物',
      'emoji',
      'object',
      'travel',
      'party',
    ],
    items: chars(
      '🎉🎊🎁🎈🎀🔥✨🌟⭐🌈🌙🌞💡📌📎🔒🔑🔔📱💻📷📚📝✅❌⭕❗❓🚫🎵🎶🎮🎯⚽🏀⚾🎾🚗🚲🚀🛫🏠🏫🏥🗼🗻',
    ),
  },
];

/** 検索語をすべて含む（AND）かどうか。大文字小文字・全角半角のスペースの違いは無視する */
export function matchesQuery(haystack: string, query: string): boolean {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const target = haystack.toLowerCase();
  return terms.every((term) => target.includes(term));
}

/** コードポイントを U+2605 の形式で返す（複数文字は + でつなぐ） */
export function codePointLabel(item: string): string {
  return Array.from(item)
    .map(
      (ch) =>
        'U+' + ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0'),
    )
    .join(' ');
}
