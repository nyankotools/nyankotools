import { describe, expect, it } from 'vitest';
import { brailleDots, brailleToText, textToBraille } from './braille-converter';

describe('textToBraille', () => {
  it('清音を変換する', () => {
    expect(textToBraille('あいうえお').braille).toBe('⠁⠃⠉⠋⠊');
    expect(textToBraille('さくら').braille).toBe('⠱⠩⠑');
    expect(textToBraille('わをん').braille).toBe('⠄⠔⠴');
  });

  it('カタカナ・半角カナもひらがなと同じ点字になる', () => {
    expect(textToBraille('サクラ').braille).toBe('⠱⠩⠑');
    expect(textToBraille('ｻｸﾗ').braille).toBe('⠱⠩⠑');
  });

  it('濁音・半濁音は前置符を付ける', () => {
    expect(textToBraille('が').braille).toBe('⠐⠡');
    expect(textToBraille('ぱ').braille).toBe('⠠⠥');
    expect(textToBraille('ヴ').braille).toBe('⠐⠉');
    expect(textToBraille('ガ').braille).toBe('⠐⠡');
  });

  it('拗音・拗濁音・拗半濁音を変換する', () => {
    expect(textToBraille('きゃ').braille).toBe('⠈⠡');
    expect(textToBraille('しゅ').braille).toBe('⠈⠹');
    expect(textToBraille('ぎょ').braille).toBe('⠘⠪');
    expect(textToBraille('ぴゅ').braille).toBe('⠨⠭');
  });

  it('促音・長音・句読点を変換する', () => {
    expect(textToBraille('がっこう。').braille).toBe('⠐⠡⠂⠪⠉⠲');
    expect(textToBraille('ラーメン').braille).toBe('⠑⠒⠿⠴');
  });

  it('数字は数符を付け、あ行・ら行が続くときはつなぎ符を入れる', () => {
    expect(textToBraille('12').braille).toBe('⠼⠁⠃');
    expect(textToBraille('3.5').braille).toBe('⠼⠉⠂⠑');
    expect(textToBraille('1あ').braille).toBe('⠼⠁⠤⠁');
    expect(textToBraille('1か').braille).toBe('⠼⠁⠡');
  });

  it('全角数字も数字として扱う', () => {
    expect(textToBraille('１２').braille).toBe('⠼⠁⠃');
  });

  it('改行は保持し、変換できない文字は報告する', () => {
    const r = textToBraille('猫\nねこABC猫');
    expect(r.braille).toBe('猫\n⠏⠪ABC猫');
    expect(r.unsupported).toEqual(['猫', 'A', 'B', 'C']);
  });

  it('数符だけで数字が続かない点字は変換できない文字として残す', () => {
    expect(brailleToText('⠼あ')).toEqual({ text: '⠼あ', unsupported: ['⠼'] });
  });

  it('空文字は空を返す', () => {
    expect(textToBraille('')).toEqual({ braille: '', unsupported: [] });
  });

  it('CRLF・CRの改行をそのまま保持する', () => {
    expect(textToBraille('あ\r\nい').braille).toBe('⠁\r\n⠃');
    expect(textToBraille('あ\rい').braille).toBe('⠁\r⠃');
  });

  it('サロゲートペアの絵文字は1文字として残し、一度だけ報告する', () => {
    const r = textToBraille('😀あ😀');
    expect(r.braille).toBe('😀⠁😀');
    expect(r.unsupported).toEqual(['😀']);
  });

  it('全角英字は半角に正規化されてから未対応として報告する', () => {
    const r = textToBraille('ＡＢＣ');
    expect(r.braille).toBe('ABC');
    expect(r.unsupported).toEqual(['A', 'B', 'C']);
  });

  it('全角スペースは点字の空白セルになる', () => {
    expect(textToBraille('あ　い').braille).toBe('⠁⠀⠃');
  });

  it('全角・半角の記号を同じ点字に変換する', () => {
    expect(textToBraille('？').braille).toBe('⠢');
    expect(textToBraille('?').braille).toBe('⠢');
    expect(textToBraille('！').braille).toBe('⠖');
    expect(textToBraille('!').braille).toBe('⠖');
  });

  it('半角長音記号と小さいっを変換する', () => {
    expect(textToBraille('ｰ').braille).toBe('⠒');
    expect(textToBraille('っ').braille).toBe('⠂');
    expect(textToBraille('ッ').braille).toBe('⠂');
  });

  it('小書きのゃ・ぁは単独では変換できず報告する', () => {
    expect(textToBraille('ゃ')).toEqual({ braille: 'ゃ', unsupported: ['ゃ'] });
    expect(textToBraille('ぁ')).toEqual({ braille: 'ぁ', unsupported: ['ぁ'] });
  });

  it('小書きのカタカナは変換できない文字として元の字形のまま残す（既知の不具合）', () => {
    // 現状は toHiragana を先に適用するため「ァ」が「ぁ」に置き換わって出力される。
    // 仕様（変換できない文字はそのまま残す）を満たすまで失敗し続けるので it.fails で記録している。
    expect(textToBraille('ァ').braille).toBe('ァ');
  });

  it('数字の間に小数点の後ろが数字でない「.」は変換できない記号として残す', () => {
    expect(textToBraille('3.')).toEqual({
      braille: '⠼⠉.',
      unsupported: ['.'],
    });
  });

  it('連続する小数点は数字に挟まれたものだけ点字の小数点にする', () => {
    expect(textToBraille('1.2.3').braille).toBe('⠼⠁⠂⠃⠂⠉');
  });

  it('数字が空白で区切られると数符を付け直す', () => {
    expect(textToBraille('12 34').braille).toBe('⠼⠁⠃⠀⠼⠉⠙');
  });

  it('0と9の点字を正しく割り当てる', () => {
    expect(textToBraille('0').braille).toBe('⠼⠚');
    expect(textToBraille('9').braille).toBe('⠼⠊');
  });

  it('数字の直後のら行はつなぎ符を入れ、数字の後ろでないら行は入れない', () => {
    expect(textToBraille('1ら').braille).toBe('⠼⠁⠤⠑');
    expect(textToBraille('あ1').braille).toBe('⠁⠼⠁');
  });

  it('長い入力でも全文字を変換する', () => {
    const src = 'さくら'.repeat(50000);
    const r = textToBraille(src);
    expect(r.braille).toBe('⠱⠩⠑'.repeat(50000));
    expect(r.unsupported).toEqual([]);
  });
});

describe('brailleToText', () => {
  it('かなに戻す', () => {
    expect(brailleToText('⠱⠩⠑').text).toBe('さくら');
  });

  it('濁音・半濁音・拗音・促音・長音を戻す', () => {
    expect(brailleToText('⠐⠡⠂⠪⠉').text).toBe('がっこう');
    expect(brailleToText('⠈⠡⠘⠪⠨⠭').text).toBe('きゃぎょぴゅ');
    expect(brailleToText('⠑⠒⠿⠴').text).toBe('らーめん');
    expect(brailleToText('⠐⠉').text).toBe('ゔ');
    expect(brailleToText('⠠⠥').text).toBe('ぱ');
  });

  it('数符以降の数字とつなぎ符を戻す', () => {
    expect(brailleToText('⠼⠁⠃').text).toBe('12');
    expect(brailleToText('⠼⠉⠂⠑').text).toBe('3.5');
    expect(brailleToText('⠼⠁⠤⠁').text).toBe('1あ');
    expect(brailleToText('⠼⠁⠤⠑').text).toBe('1ら');
    expect(brailleToText('⠼⠚').text).toBe('0');
    expect(brailleToText('⠼⠊').text).toBe('9');
  });

  it('かぎ括弧は開閉を交互に戻す', () => {
    expect(brailleToText('⠤⠁⠤').text).toBe('「あ」');
    expect(brailleToText('⠤⠁⠤⠁⠤').text).toBe('「あ」あ「');
  });

  it('点字以外の文字と解釈できないセルはそのまま残す', () => {
    const r = brailleToText('⠁a\n⠿⡀');
    expect(r.text).toBe('あa\nめ⡀');
    expect(r.unsupported).toEqual(['⡀']);
  });

  it('空文字は空を返す', () => {
    expect(brailleToText('')).toEqual({ text: '', unsupported: [] });
  });

  it('前置符の後に対応するかながない場合は前置符を未対応として残す', () => {
    expect(brailleToText('⠐')).toEqual({ text: '⠐', unsupported: ['⠐'] });
    expect(brailleToText('⠈⠁')).toEqual({ text: '⠈あ', unsupported: ['⠈'] });
  });

  it('点字空白は半角スペースに戻り、改行（LF・CRLF）は保持する', () => {
    expect(brailleToText('⠁⠀⠃').text).toBe('あ い');
    expect(brailleToText('⠁\n⠃').text).toBe('あ\nい');
    expect(brailleToText('⠁\r\n⠃').text).toBe('あ\r\nい');
  });

  it('点字以外のサロゲートペア文字はそのまま残す', () => {
    expect(brailleToText('😀⠁').text).toBe('😀あ');
  });

  it('往復変換で元のかなに戻る', () => {
    const src = 'にほんごのてんじ、ぎゃくへんかん！';
    expect(brailleToText(textToBraille(src).braille).text).toBe(src);
  });

  it('数字と記号を含む文章も往復変換で戻る', () => {
    const src = '2026ねん。がっこう「あ」';
    expect(brailleToText(textToBraille(src).braille).text).toBe(src);
  });

  it('ゑは感嘆符と同じ点字のため、往復変換では「！」に戻る（仕様）', () => {
    expect(textToBraille('ゑ').braille).toBe('⠖');
    expect(brailleToText('⠖').text).toBe('！');
  });

  it('長い点字を往復変換しても元に戻る', () => {
    const src = 'にほんご'.repeat(50000);
    expect(brailleToText(textToBraille(src).braille).text).toBe(src);
  });
});

describe('brailleDots', () => {
  it('点の番号を返す', () => {
    expect(brailleDots('⠡')).toEqual([1, 6]);
    expect(brailleDots('⠿')).toEqual([1, 2, 3, 4, 5, 6]);
    expect(brailleDots('⡀')).toEqual([7]);
    expect(brailleDots('あ')).toEqual([]);
  });

  it('空文字と空白セルでは点を返さない', () => {
    expect(brailleDots('')).toEqual([]);
    expect(brailleDots('⠀')).toEqual([]);
  });
});
