import { describe, expect, it } from 'vitest';
import {
  MAX_OCR_FILE_SIZE,
  cleanOcrText,
  confidenceLevel,
  isOcrLanguage,
  languageCodes,
  validateOcrFile,
} from './image-ocr';

describe('languageCodes', () => {
  it('単一言語はそのまま配列にする', () => {
    expect(languageCodes('jpn')).toEqual(['jpn']);
    expect(languageCodes('eng')).toEqual(['eng']);
  });
  it('jpn+eng は2つに分ける', () => {
    expect(languageCodes('jpn+eng')).toEqual(['jpn', 'eng']);
  });
});

describe('isOcrLanguage', () => {
  it('対応言語のみ true', () => {
    expect(isOcrLanguage('jpn')).toBe(true);
    expect(isOcrLanguage('jpn+eng')).toBe(true);
    expect(isOcrLanguage('fra')).toBe(false);
    expect(isOcrLanguage('')).toBe(false);
  });
});

describe('validateOcrFile', () => {
  it('画像でなければ notImage', () => {
    expect(validateOcrFile({ type: 'application/pdf', size: 10 })).toBe(
      'notImage',
    );
    expect(validateOcrFile({ type: '', size: 10 })).toBe('notImage');
  });
  it('上限を超えると tooLarge、ちょうどなら許可', () => {
    expect(
      validateOcrFile({ type: 'image/png', size: MAX_OCR_FILE_SIZE + 1 }),
    ).toBe('tooLarge');
    expect(
      validateOcrFile({ type: 'image/png', size: MAX_OCR_FILE_SIZE }),
    ).toBeNull();
  });
});

describe('cleanOcrText', () => {
  it('日本語文字の間の空白を除く', () => {
    expect(cleanOcrText('こ ん に ち は 世 界', 'jpn')).toBe('こんにちは世界');
  });
  it('日本語と英単語の間の空白は残す', () => {
    expect(cleanOcrText('Apple を 食べる', 'jpn+eng')).toBe('Apple を食べる');
  });
  it('英語のみのときは単語間の空白を保つ', () => {
    expect(cleanOcrText('hello  world', 'eng')).toBe('hello  world');
  });
  it('英語モードでは日本語間の空白も触らない', () => {
    expect(cleanOcrText('あ い', 'eng')).toBe('あ い');
  });
  it('CRLFをLFにし、行末空白と余分な空行を整える', () => {
    expect(cleanOcrText('a  \r\n\r\n\r\n\r\nb\r\n', 'eng')).toBe('a\n\nb');
  });
  it('CR のみの改行も LF に統一する', () => {
    expect(cleanOcrText('a\rb\r\rc', 'eng')).toBe('a\nb\n\nc');
  });
  it('日本語の絵文字・サロゲートペアを壊さない', () => {
    // サロゲートペアが途中で分断されないこと（絵文字の前後の空白は現状対象外）
    const out = cleanOcrText('😀 テスト 😀', 'jpn+eng');
    expect(out).toContain('😀');
    expect(out).toContain('テスト');
    expect([...out].filter((c) => c === '😀').length).toBe(2);
  });
  it('大きな入力（10万文字）でも処理できる', () => {
    const big = 'あ い\n'.repeat(100_000);
    const out = cleanOcrText(big, 'jpn');
    expect(out.length).toBe(300_000 - 1);
    expect(out.startsWith('あい\nあい')).toBe(true);
  });
  it('空文字は空文字', () => {
    expect(cleanOcrText('', 'jpn')).toBe('');
    expect(cleanOcrText(' \n ', 'jpn')).toBe('');
  });
});

describe('confidenceLevel', () => {
  it('境界値で3段階に分ける', () => {
    expect(confidenceLevel(95)).toBe('high');
    expect(confidenceLevel(80)).toBe('high');
    expect(confidenceLevel(79.9)).toBe('medium');
    expect(confidenceLevel(60)).toBe('medium');
    expect(confidenceLevel(59.9)).toBe('low');
    expect(confidenceLevel(0)).toBe('low');
  });
});
