import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('cjs import', () => {
  it('should be importable via require', async () => {
    // act
    const module = await import('../../index.cjs');

    // assert
    assert.ok(module);
    assert.strictEqual(typeof module.createSocket, 'function');
    assert.strictEqual(typeof module.createChecksum, 'function');
    assert.strictEqual(typeof module.writeChecksum, 'function');
    assert.ok(module.AddressFamily);
    assert.ok(module.Protocol);
    assert.ok(module.SocketLevel);
    assert.ok(module.SocketOption);
  });

  it('should have same exports as esm', async () => {
    // arrange
    const esm = await import('../../index.mjs');
    const cjs = await import('../../index.cjs');
    const keysToIgnore = ['default', 'module.exports'];

    // act
    const esmKeys = Object.keys(esm).filter((k) => !keysToIgnore.includes(k)).sort();
    const cjsKeys = Object.keys(cjs).filter((k) => !keysToIgnore.includes(k)).sort();

    // assert
    assert.deepStrictEqual(cjsKeys, esmKeys);
  });
});
