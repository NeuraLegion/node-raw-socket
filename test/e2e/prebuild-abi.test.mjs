import { describe, it } from 'node:test';
import assert from 'node:assert';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import nodeGypBuild from 'node-gyp-build';
import { createSocket } from '../../index.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = dirname(dirname(__dirname));

describe('native addon', () => {
  it('should resolve a binding for the running Node ABI', () => {
    // A missing or mislabeled prebuild for the current NODE_MODULE_VERSION
    // makes node-gyp-build fall through to a source build, which fails on
    // machines without a toolchain. Resolving a path here proves a usable
    // binding exists for this ABI (prebuild or local build fallback).
    const bindingPath = nodeGypBuild.path(packageRoot);

    assert.ok(bindingPath, 'node-gyp-build resolved no binding for this ABI');
    assert.match(bindingPath, /\.node$/);
  });

  it('should load and expose the native API on the running Node ABI', () => {
    // createSocket is provided by the native addon; it is only a function if
    // the binding for this ABI actually loaded.
    assert.strictEqual(typeof createSocket, 'function');
  });
});
