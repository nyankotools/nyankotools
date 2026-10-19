import { describe, expect, it } from 'vitest';
import {
  LICENSES,
  currentYear,
  generateLicenseText,
  getLicense,
  isValidYear,
  licenseFilename,
  packageJsonSnippet,
  spdxHeader,
} from './license-generator';

const input = { year: '2026', holder: 'Taro Yamada' };

describe('generateLicenseText', () => {
  it('MITは著作権表示を入れ、公式の文言を保つ', () => {
    const t = generateLicenseText('MIT', input);
    expect(
      t.startsWith('MIT License\n\nCopyright (c) 2026 Taro Yamada\n'),
    ).toBe(true);
    expect(t).toContain('(the "Software")');
    expect(t).toContain(
      'IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE',
    );
    expect(t.endsWith('IN THE SOFTWARE.\n')).toBe(true);
  });

  it('ISCと0BSDは同じ免責文を使う', () => {
    const isc = generateLicenseText('ISC', input);
    const zero = generateLicenseText('0BSD', input);
    expect(isc).toContain('Copyright (c) 2026 Taro Yamada');
    expect(zero).toContain('Copyright (C) 2026 by Taro Yamada');
    expect(isc).toContain('AUTHOR DISCLAIMS ALL WARRANTIES');
    expect(zero).toContain('AUTHOR DISCLAIMS ALL WARRANTIES');
  });

  it('BSD-2は2条件、BSD-3は3条件', () => {
    const b2 = generateLicenseText('BSD-2-Clause', input);
    const b3 = generateLicenseText('BSD-3-Clause', input);
    expect(b2).toContain(
      'Copyright (c) 2026, Taro Yamada\nAll rights reserved.',
    );
    expect(b2).not.toContain('3. Neither');
    expect(b3).toContain('3. Neither the name of the copyright holder');
  });

  it('Unlicenseには著作者を入れない', () => {
    const t = generateLicenseText('Unlicense', input);
    expect(t).not.toContain('Taro Yamada');
    expect(t).toContain('<https://unlicense.org>');
  });

  it('Apache-2.0は全文を保ち、付録の著作権行だけ置換する', () => {
    const t = generateLicenseText('Apache-2.0', input);
    expect(t).toContain('   Copyright 2026 Taro Yamada\n');
    expect(t).not.toContain('{COPYRIGHT}');
    expect(t).toContain(
      'TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION',
    );
    expect(t).toContain('END OF TERMS AND CONDITIONS');
    expect(t).toContain('9. Accepting Warranty or Additional Liability.');
    expect(t.endsWith('limitations under the License.\n')).toBe(true);
  });

  it('未入力はプレースホルダーを残す', () => {
    const t = generateLicenseText('MIT', { year: ' ', holder: '' });
    expect(t).toContain('Copyright (c) <year> <copyright holder>');
  });

  it('MPL-2.0は公式のヘッダー注記を返す', () => {
    const t = generateLicenseText('MPL-2.0', input);
    expect(t).toContain('Mozilla Public\nLicense, v. 2.0.');
    expect(t).toContain('http://mozilla.org/MPL/2.0/.');
  });

  it('GPL/LGPLはソース用注記に著作者を入れる', () => {
    expect(generateLicenseText('GPL-3.0', input)).toContain(
      'Copyright (C) 2026 Taro Yamada',
    );
    expect(generateLicenseText('GPL-3.0', input)).toContain(
      'GNU General Public License as published',
    );
    expect(generateLicenseText('LGPL-3.0', input)).toContain(
      'GNU Lesser General Public',
    );
  });

  it('全ライセンスで本文が空でない', () => {
    for (const l of LICENSES) {
      expect(generateLicenseText(l.id, input).length).toBeGreaterThan(100);
    }
  });
});

describe('メタ情報', () => {
  it('SPDX識別子とファイル名を返す', () => {
    expect(getLicense('MIT')?.spdx).toBe('MIT');
    expect(getLicense('GPL-3.0')?.spdx).toBe('GPL-3.0-or-later');
    expect(getLicense('none')).toBeUndefined();
    expect(licenseFilename('MIT')).toBe('LICENSE');
    expect(licenseFilename('GPL-3.0')).toBe('LICENSE-NOTICE.txt');
    expect(packageJsonSnippet('Apache-2.0')).toBe('"license": "Apache-2.0"');
  });

  it('SPDXヘッダーはUnlicenseでは著作権行を付けない', () => {
    expect(spdxHeader('MIT', input)).toBe(
      '// SPDX-FileCopyrightText: 2026 Taro Yamada\n// SPDX-License-Identifier: MIT',
    );
    expect(spdxHeader('Unlicense', input)).toBe(
      '// SPDX-License-Identifier: Unlicense',
    );
  });
});

describe('年', () => {
  it('現在年を返す', () => {
    expect(currentYear(new Date(2030, 5, 1))).toBe('2030');
  });
  it('年の形式を検証する', () => {
    expect(isValidYear('2026')).toBe(true);
    expect(isValidYear('2020-2026')).toBe(true);
    expect(isValidYear('2020, 2026')).toBe(true);
    expect(isValidYear('')).toBe(false);
    expect(isValidYear('26')).toBe(false);
    expect(isValidYear('abcd')).toBe(false);
  });
});
