import type { FaqContent } from '../faq';

export const faq: FaqContent = {
  ja: [
    {
      question: '^1.2.3 と ~1.2.3 の違いは何ですか？',
      answer:
        '^1.2.3 は >=1.2.3 <2.0.0（マイナーとパッチの更新を許可）、~1.2.3 は >=1.2.3 <1.3.0（パッチの更新だけ許可）です。ただし ^0.2.3 は >=0.2.3 <0.3.0、^0.0.3 は 0.0.3 のみというように、0 で始まるバージョンの ^ は範囲がより狭くなります。',
    },
    {
      question: '^1.0.0 の範囲に 1.5.0-beta.1 が適合しないのはなぜですか？',
      answer:
        'npmの仕様では、プレリリース付きバージョンは、範囲式に同じ「メジャー.マイナー.パッチ」でプレリリース付きの条件（例: ^1.5.0-alpha）がない限り適合しません。意図しない先行版の混入を防ぐためです。このツールでは「プレリリースも対象に含める」を選ぶと適合扱いにできます。',
    },
    {
      question: '1.0.0-beta.2 と 1.0.0-beta.11 はどちらが新しいですか？',
      answer:
        'beta.11 の方が新しいです。プレリリースの識別子はドットで区切って左から比較し、数字だけの識別子は数値として比べます（2 < 11）。英数字を含む識別子は文字列として比較し、数字のみの識別子は英数字より小さくなります。',
    },
    {
      question: '1.0.0+build.1 と 1.0.0+build.2 は区別されますか？',
      answer:
        '区別されません。+ 以降のビルドメタデータは優先順位の比較に使われないため、2つは同じ順位として扱われます。',
    },
    {
      question: '"1.2" や "1" のようなバージョンも比較できますか？',
      answer:
        'バージョン同士の比較では、X.Y.Z の3つの数字が揃った形式のみ受け付けます。"1.2" や "1.x" は範囲式としてなら使え、"1.2" は >=1.2.0 <1.3.0 に展開されます。',
    },
  ],
  en: [
    {
      question: 'What is the difference between ^1.2.3 and ~1.2.3?',
      answer:
        '^1.2.3 means >=1.2.3 <2.0.0 (minor and patch updates allowed), while ~1.2.3 means >=1.2.3 <1.3.0 (patch updates only). Versions starting with 0 are stricter: ^0.2.3 means >=0.2.3 <0.3.0 and ^0.0.3 matches only 0.0.3.',
    },
    {
      question: 'Why does 1.5.0-beta.1 not satisfy ^1.0.0?',
      answer:
        'In npm\'s rules, a prerelease version only satisfies a range if the range itself contains a prerelease comparator on the same major.minor.patch (for example ^1.5.0-alpha). This keeps unstable builds from sneaking in. Turn on "Include prereleases" in this tool to treat them as normal versions.',
    },
    {
      question: 'Which is newer, 1.0.0-beta.2 or 1.0.0-beta.11?',
      answer:
        'beta.11 is newer. Prerelease identifiers are split on dots and compared left to right; numeric identifiers are compared as numbers (2 < 11). Alphanumeric identifiers are compared as strings, and numeric ones always sort lower than alphanumeric ones.',
    },
    {
      question: 'Are 1.0.0+build.1 and 1.0.0+build.2 treated as different?',
      answer:
        'No. Build metadata after "+" does not take part in precedence, so both have the same rank.',
    },
    {
      question: 'Can I compare short versions like "1.2" or "1"?',
      answer:
        'Version-to-version comparison needs the full X.Y.Z form. Short forms such as "1.2" or "1.x" are accepted only inside a range expression, where "1.2" expands to >=1.2.0 <1.3.0.',
    },
  ],
};
