import type { Locale } from '../../data/tools';

interface GlossaryTerm {
  term: string;
  description: string;
}

export interface SemverCalculatorPageContent {
  title: string;
  description: string;
  h1: string;
  /** set:html で描画するため、開発者管理の固定リテラルのみを入れること（ユーザー入力を混ぜない） */
  introHtml: string;
  compareHeading: string;
  versionALabel: string;
  versionBLabel: string;
  versionAPlaceholder: string;
  versionBPlaceholder: string;
  invalidVersion: string;
  compareLess: string;
  compareEqual: string;
  compareGreater: string;
  diffLabel: string;
  diffSame: string;
  diffMajor: string;
  diffMinor: string;
  diffPatch: string;
  diffPrerelease: string;
  rangeHeading: string;
  rangeLabel: string;
  rangePlaceholder: string;
  rangeInvalid: string;
  normalizedLabel: string;
  versionsLabel: string;
  versionsPlaceholder: string;
  includePrereleaseLabel: string;
  sortLabel: string;
  sortInput: string;
  sortAsc: string;
  sortDesc: string;
  columnVersion: string;
  columnNormalized: string;
  columnResult: string;
  matchYes: string;
  matchNo: string;
  matchInvalid: string;
  highestLabel: string;
  lowestLabel: string;
  noMatch: string;
  copyResult: string;
  copied: string;
  copyFailed: string;
  notesHeading: string;
  notes: string[];
  glossaryHeading: string;
  glossaryTerms: GlossaryTerm[];
}

export const semverCalculatorContent: Record<
  Locale,
  SemverCalculatorPageContent
> = {
  ja: {
    title: 'セマンティックバージョン比較・範囲判定（semver）',
    description:
      'semverのバージョン同士の比較・ソートと、^ ~ >= || x 範囲・ハイフン範囲がバージョンに適合するかの判定をブラウザ上で行えます。npm互換でprereleaseにも対応。データはブラウザ内で処理され、サーバーには送信されません。',
    h1: 'セマンティックバージョン比較・範囲判定ツール',
    introHtml:
      'semver（セマンティックバージョニング）のバージョン2つの大小比較と、npmのpackage.jsonで使う範囲式（<code>^1.2.3</code>、<code>~1.2</code>、<code>&gt;=1.0.0 &lt;2.0.0</code>、<code>1.x</code>、<code>1.2.3 - 2.0.0</code>、<code>||</code>）にバージョンが適合するかを判定します。複数のバージョンを貼り付けて、適合判定と昇順・降順の並べ替えもできます。npm（node-semver）の仕様に沿って判定し、処理はすべてブラウザ内で完結します。入力内容がサーバーに送信されることはありません。',
    compareHeading: 'バージョンの比較',
    versionALabel: 'バージョンA',
    versionBLabel: 'バージョンB',
    versionAPlaceholder: '1.2.3',
    versionBPlaceholder: '1.10.0-rc.1',
    invalidVersion: 'semver形式ではありません（例: 1.2.3 / 1.0.0-beta.1）',
    compareLess: 'A < B（Aの方が古い）',
    compareEqual: 'A = B（優先順位は同じ。+ビルド情報は比較しません）',
    compareGreater: 'A > B（Aの方が新しい）',
    diffLabel: '違いのある桁',
    diffSame: 'なし',
    diffMajor: 'メジャー',
    diffMinor: 'マイナー',
    diffPatch: 'パッチ',
    diffPrerelease: 'プレリリース',
    rangeHeading: '範囲式の判定',
    rangeLabel: '範囲式',
    rangePlaceholder: '^1.2.3 || >=3.0.0 <4.0.0',
    rangeInvalid: '範囲式を解釈できません（例: ^1.2.3 / ~1.2 / 1.x / >=1 <2）',
    normalizedLabel: '展開した範囲',
    versionsLabel: 'バージョン一覧（1行に1件）',
    versionsPlaceholder: '1.0.0\n1.2.3\n1.10.0\n2.0.0-beta.1\n2.0.0',
    includePrereleaseLabel: 'プレリリースも対象に含める',
    sortLabel: '並び順',
    sortInput: '入力順',
    sortAsc: '昇順',
    sortDesc: '降順',
    columnVersion: '入力',
    columnNormalized: '正規化',
    columnResult: '判定',
    matchYes: '適合',
    matchNo: '不適合',
    matchInvalid: '形式エラー',
    highestLabel: '適合する最新',
    lowestLabel: '適合する最古',
    noMatch: 'なし',
    copyResult: '結果をコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーに失敗しました',
    notesHeading: '注意事項',
    notes: [
      '範囲式の判定はnpmのnode-semverの標準（strict）モードに沿っています。"1.2" のような短い表記はバージョン一覧には使えず、範囲式の中でのみ使えます。',
      'プレリリース付きのバージョン（例: 1.3.0-beta.1）は、範囲式に同じ「メジャー.マイナー.パッチ」のプレリリース付き条件（例: ^1.3.0-beta.0）がない限り、既定では適合しません。含めたい場合は「プレリリースも対象に含める」を選んでください。',
      '+以降のビルドメタデータ（例: 1.0.0+build.5）は、比較・範囲判定では無視されます。',
      'Python（PEP 440）やRubyGemsなど、semver以外のバージョン規則は対象外です。',
    ],
    glossaryHeading: '用語解説',
    glossaryTerms: [
      {
        term: 'セマンティックバージョニング（semver）',
        description:
          '「メジャー.マイナー.パッチ」の3つの数字でバージョンを表す規約です。互換性を壊す変更でメジャー、後方互換の機能追加でマイナー、バグ修正でパッチを上げます。',
      },
      {
        term: '^（キャレット）範囲',
        description:
          '一番左の0でない桁を固定し、それより右を自由に上げてよい範囲です。^1.2.3 は >=1.2.3 <2.0.0、^0.2.3 は >=0.2.3 <0.3.0、^0.0.3 は 0.0.3 のみに適合します。',
      },
      {
        term: '~（チルダ）範囲',
        description:
          'マイナーまで指定されていればパッチだけ、マイナーが省略されていればマイナーとパッチを上げてよい範囲です。~1.2.3 は >=1.2.3 <1.3.0、~1 は >=1.0.0 <2.0.0 と同じです。',
      },
      {
        term: 'プレリリース（-beta.1 など）',
        description:
          'ハイフンの後ろに付く先行版の識別子です。同じ番号の正式版より小さく、識別子はドット区切りで左から順に比較し、数字は数値として、英数字は文字列として比較します（数字の方が英数字より小さい）。',
      },
    ],
  },
  en: {
    title: 'Semver Calculator: Compare Versions & Check Ranges',
    description:
      'Compare and sort semantic versions and test ranges like ^1.2.3, ~1.2, >=1 <2, 1.x or 1.2.3 - 2.0.0 the way npm does. Runs in your browser; nothing is uploaded.',
    h1: 'Semver Calculator: Version Comparison & Range Checker',
    introHtml:
      'Compare two semantic versions, or check whether versions satisfy a range expression such as <code>^1.2.3</code>, <code>~1.2</code>, <code>&gt;=1.0.0 &lt;2.0.0</code>, <code>1.x</code>, <code>1.2.3 - 2.0.0</code> or <code>||</code>, just like the ranges in package.json. Paste a whole list of versions to see which ones match and sort them in ascending or descending order. Matching follows npm (node-semver) rules, and everything runs in your browser. Nothing you type is ever sent to a server.',
    compareHeading: 'Compare two versions',
    versionALabel: 'Version A',
    versionBLabel: 'Version B',
    versionAPlaceholder: '1.2.3',
    versionBPlaceholder: '1.10.0-rc.1',
    invalidVersion: 'Not a valid semver (e.g. 1.2.3 or 1.0.0-beta.1)',
    compareLess: 'A < B (A is older)',
    compareEqual: 'A = B (same precedence; +build metadata is ignored)',
    compareGreater: 'A > B (A is newer)',
    diffLabel: 'Differs in',
    diffSame: 'nothing',
    diffMajor: 'major',
    diffMinor: 'minor',
    diffPatch: 'patch',
    diffPrerelease: 'prerelease',
    rangeHeading: 'Check against a range',
    rangeLabel: 'Range expression',
    rangePlaceholder: '^1.2.3 || >=3.0.0 <4.0.0',
    rangeInvalid: 'Could not parse the range (e.g. ^1.2.3, ~1.2, 1.x, >=1 <2)',
    normalizedLabel: 'Expanded range',
    versionsLabel: 'Versions (one per line)',
    versionsPlaceholder: '1.0.0\n1.2.3\n1.10.0\n2.0.0-beta.1\n2.0.0',
    includePrereleaseLabel: 'Include prereleases',
    sortLabel: 'Order',
    sortInput: 'As entered',
    sortAsc: 'Ascending',
    sortDesc: 'Descending',
    columnVersion: 'Input',
    columnNormalized: 'Normalized',
    columnResult: 'Result',
    matchYes: 'Satisfies',
    matchNo: 'No match',
    matchInvalid: 'Invalid',
    highestLabel: 'Highest match',
    lowestLabel: 'Lowest match',
    noMatch: 'none',
    copyResult: 'Copy result',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    notesHeading: 'Notes',
    notes: [
      'Range matching follows the default (strict) mode of npm\'s node-semver. Short forms like "1.2" work inside a range expression but are not accepted in the version list.',
      'A prerelease version (e.g. 1.3.0-beta.1) does not satisfy a range by default unless the range has a prerelease comparator for the same major.minor.patch (e.g. ^1.3.0-beta.0). Turn on "Include prereleases" to match them anyway.',
      'Build metadata after "+" (e.g. 1.0.0+build.5) is ignored in comparisons and range matching.',
      'Other versioning schemes such as Python (PEP 440) or RubyGems are not supported.',
    ],
    glossaryHeading: 'Glossary',
    glossaryTerms: [
      {
        term: 'Semantic versioning (semver)',
        description:
          'A convention that writes a version as MAJOR.MINOR.PATCH. Bump major for breaking changes, minor for backward-compatible features, and patch for bug fixes.',
      },
      {
        term: 'Caret range (^)',
        description:
          'Allows changes that do not modify the left-most non-zero digit. ^1.2.3 means >=1.2.3 <2.0.0, ^0.2.3 means >=0.2.3 <0.3.0, and ^0.0.3 matches only 0.0.3.',
      },
      {
        term: 'Tilde range (~)',
        description:
          'Allows patch-level updates when a minor version is given, or minor-level updates when it is not. ~1.2.3 means >=1.2.3 <1.3.0 and ~1 means >=1.0.0 <2.0.0.',
      },
      {
        term: 'Prerelease (-beta.1 etc.)',
        description:
          'An identifier after a hyphen that marks a pre-release build. It sorts below the same release version, and identifiers are compared left to right: numbers numerically, words as strings, with numbers sorting lower than words.',
      },
    ],
  },
};
