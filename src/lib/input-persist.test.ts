import { describe, expect, it } from 'vitest';
import { storageKey } from './input-persist';

describe('storageKey', () => {
  it('ツールslugと欄idからキーを作り、ロケールを含まない', () => {
    expect(storageKey('base64', 'base64-input')).toBe(
      'nyanko:input:base64:base64-input',
    );
  });
});
