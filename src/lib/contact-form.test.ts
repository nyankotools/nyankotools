import { describe, expect, it } from 'vitest';
import { buildMailtoLink, CONTACT_EMAIL, formatMailBody } from './contact-form';

const labels = { categoryLabel: '種別', nameLabel: 'お名前' };

describe('formatMailBody', () => {
  it('名前が入力されている場合は本文に含める', () => {
    const body = formatMailBody(
      { category: '不具合の報告', name: 'にゃんこ太郎', message: 'テスト' },
      labels,
    );
    expect(body).toBe('種別: 不具合の報告\nお名前: にゃんこ太郎\n\nテスト');
  });

  it('名前が空の場合は本文に含めない', () => {
    const body = formatMailBody(
      { category: 'ご要望', name: '  ', message: 'テスト内容' },
      labels,
    );
    expect(body).toBe('種別: ご要望\n\nテスト内容');
  });

  it('本文の前後の空白を除去する', () => {
    const body = formatMailBody(
      { category: 'その他', name: '', message: '  改行を含む\n本文  ' },
      labels,
    );
    expect(body).toBe('種別: その他\n\n改行を含む\n本文');
  });

  it('本文が空文字列の場合でも種別行のみの本文になる', () => {
    const body = formatMailBody(
      { category: 'その他', name: '', message: '' },
      labels,
    );
    expect(body).toBe('種別: その他\n\n');
  });

  it('お名前・本文が空白のみの場合はどちらもトリムされて空扱いになる', () => {
    const body = formatMailBody(
      { category: 'その他', name: '　\t ', message: '\n  \n' },
      labels,
    );
    expect(body).toBe('種別: その他\n\n');
  });

  it('絵文字・サロゲートペアを含む本文を破損させずに保持する', () => {
    const body = formatMailBody(
      {
        category: 'その他',
        name: '猫🐱太郎',
        message: '不具合です🐛\n直してください🙏',
      },
      labels,
    );
    expect(body).toBe(
      '種別: その他\nお名前: 猫🐱太郎\n\n不具合です🐛\n直してください🙏',
    );
  });

  it('全角文字（種別・お名前・本文）をそのまま保持する', () => {
    const body = formatMailBody(
      {
        category: 'その他',
        name: 'ｶﾞｷﾞｸﾞｹﾞｺﾞ　全角スペース',
        message: '全角！？（）を含む本文',
      },
      labels,
    );
    expect(body).toBe(
      '種別: その他\nお名前: ｶﾞｷﾞｸﾞｹﾞｺﾞ　全角スペース\n\n全角！？（）を含む本文',
    );
  });

  it('非常に長い本文でも改変せずに保持する', () => {
    const longMessage = 'あ'.repeat(10000);
    const body = formatMailBody(
      { category: 'その他', name: '', message: longMessage },
      labels,
    );
    expect(body).toBe(`種別: その他\n\n${longMessage}`);
  });
});

describe('buildMailtoLink', () => {
  it('宛先・件名・本文を含む mailto リンクを生成する', () => {
    const url = buildMailtoLink(
      { category: '不具合の報告', name: '', message: 'ボタンが動きません' },
      labels,
      '【にゃんこツールお問い合わせ】',
    );
    expect(url).toBe(
      'mailto:nyankotools@gmail.com?subject=' +
        encodeURIComponent('【にゃんこツールお問い合わせ】不具合の報告') +
        '&body=' +
        encodeURIComponent('種別: 不具合の報告\r\n\r\nボタンが動きません'),
    );
  });

  it('本文の改行は mailto リンク内で CRLF になる（RFC 6068）', () => {
    const url = buildMailtoLink(
      { category: 'その他', name: '', message: '1行目\n2行目' },
      labels,
      'prefix: ',
    );
    expect(decodeURIComponent(url.split('body=')[1])).toBe(
      '種別: その他\r\n\r\n1行目\r\n2行目',
    );
  });

  it('特殊記号を含む本文を正しくエンコードする', () => {
    const url = buildMailtoLink(
      { category: 'その他', name: '', message: 'A&B=C?テスト' },
      labels,
      'prefix: ',
    );
    expect(url).not.toContain('A&B=C?テスト');
    expect(decodeURIComponent(url.split('body=')[1])).toContain('A&B=C?テスト');
  });

  it('宛先には常に CONTACT_EMAIL 定数を使う', () => {
    const url = buildMailtoLink(
      { category: 'その他', name: '', message: 'テスト' },
      labels,
      'prefix: ',
    );
    expect(url.startsWith(`mailto:${CONTACT_EMAIL}?`)).toBe(true);
  });

  it('本文に既にCRLF/CR単体の改行コードが混在していても二重CRにならず正しくCRLFに揃う', () => {
    const url = buildMailtoLink(
      { category: 'その他', name: '', message: '1行目\r\n2行目\r3行目' },
      labels,
      'prefix: ',
    );
    const decodedBody = decodeURIComponent(url.split('body=')[1]);
    expect(decodedBody).toBe('種別: その他\r\n\r\n1行目\r\n2行目\r\n3行目');
  });

  it('非常に長い本文でも件名・本文を正しくエンコードする', () => {
    const longMessage = 'テスト本文'.repeat(2000);
    const url = buildMailtoLink(
      { category: 'その他', name: '', message: longMessage },
      labels,
      'prefix: ',
    );
    expect(decodeURIComponent(url.split('body=')[1])).toBe(
      `種別: その他\r\n\r\n${longMessage}`,
    );
  });
});
