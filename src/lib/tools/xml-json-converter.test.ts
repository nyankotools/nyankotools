import { describe, it, expect } from 'vitest';
import { xmlToJson, jsonToXml } from './xml-json-converter';

describe('xmlToJson', () => {
  it('要素・属性・配列を変換する', () => {
    const r = xmlToJson(
      '<?xml version="1.0"?><users><user id="1">Taro</user><user id="2">Hana</user></users>',
      { indent: 0 },
    );
    expect(r).toEqual({
      success: true,
      output:
        '{"users":{"user":[{"#text":"Taro","@_id":"1"},{"#text":"Hana","@_id":"2"}]}}',
    });
  });

  it('既定では値を文字列のまま保つ（先頭ゼロを落とさない）', () => {
    const r = xmlToJson('<a><zip>0012</zip><n>5</n></a>', { indent: 0 });
    expect(r).toEqual({
      success: true,
      output: '{"a":{"zip":"0012","n":"5"}}',
    });
  });

  it('parseValues で数値・真偽値に変換する', () => {
    const r = xmlToJson('<a><n>5</n><b>true</b></a>', {
      indent: 0,
      parseValues: true,
    });
    expect(r).toEqual({ success: true, output: '{"a":{"n":5,"b":true}}' });
  });

  it('parseValues でも先頭0・16進・指数表記は文字列のまま', () => {
    const r = xmlToJson('<a><z>007</z><h>0x10</h><e>1e3</e></a>', {
      indent: 0,
      parseValues: true,
    });
    expect(r).toEqual({
      success: true,
      output: '{"a":{"z":"007","h":"0x10","e":"1e3"}}',
    });
  });

  it('不正なXMLはエラーにする', () => {
    expect(xmlToJson('<a><b></a>').success).toBe(false);
    expect(xmlToJson('<a>').success).toBe(false);
  });
});

describe('jsonToXml', () => {
  it('単一ルートをそのまま変換する', () => {
    const r = jsonToXml('{"a":{"b":"x"}}', { indent: 2 });
    expect(r).toEqual({ success: true, output: '<a>\n  <b>x</b>\n</a>' });
  });

  it('複数キーは <root> で包む', () => {
    const r = jsonToXml('{"a":"1","b":"2"}', { indent: 0 });
    expect(r).toEqual({
      success: true,
      output: '<root><a>1</a><b>2</b></root>',
    });
  });

  it('単一キーの値が配列なら <root> で包む', () => {
    const r = jsonToXml('{"a":[1,2]}', { indent: 0 });
    expect(r).toEqual({
      success: true,
      output: '<root><a>1</a><a>2</a></root>',
    });
  });

  it('トップレベルが配列なら <root> 内の <item> の繰り返しにする', () => {
    const r = jsonToXml('[1,2]', { indent: 0 });
    expect(r).toEqual({
      success: true,
      output: '<root><item>1</item><item>2</item></root>',
    });
  });

  it('属性とテキストを復元できる', () => {
    const r = jsonToXml('{"u":{"#text":"Taro","@_id":"1"}}', { indent: 0 });
    expect(r).toEqual({ success: true, output: '<u id="1">Taro</u>' });
  });

  it('特殊文字をエスケープする', () => {
    const r = jsonToXml('{"a":"x < y & z"}', { indent: 0 });
    expect(r.success && r.output).toBe('<a>x &lt; y &amp; z</a>');
  });

  it('不正なJSONや値がプリミティブの場合はエラー', () => {
    expect(jsonToXml('{bad').success).toBe(false);
    expect(jsonToXml('42').success).toBe(false);
    expect(jsonToXml('null').success).toBe(false);
  });
});
