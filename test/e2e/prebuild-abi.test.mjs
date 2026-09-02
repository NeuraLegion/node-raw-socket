import { describe, it } from 'node:test';
import assert from 'node:assert';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import nodeGypBuild from 'node-gyp-build';
import { createSocket } from '../../index.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = dirname(dirname(__dirname));
const abi = process.versions.modules;

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

  it('should resolve a PREBUILD whose filename carries the running ABI (PREBUILDS_ONLY)', {
    // Only meaningful against a produced/merged package: node-gyp-build.path()
    // prefers build/Release, so in the source-building test workflow it resolves
    // the freshly compiled binary and would pass even with no prebuild. Gate on
    // PREBUILDS_ONLY so the prebuild gate / release exercises the real artifact:
    // it forces node-gyp-build to skip the source-build fallback and resolve a
    // prebuilds/ file, and we assert that file is labelled for THIS ABI (proves
    // the abi147 target/label is present and correct, not just "some .node").
    skip: process.env.PREBUILDS_ONLY ? false : 'set PREBUILDS_ONLY=1 to verify a produced prebuild'
  }, () => {
    const bindingPath = nodeGypBuild.path(packageRoot);

    assert.match(bindingPath, /[\\/]prebuilds[\\/]/, `expected a prebuild, got ${bindingPath}`);
    assert.match(bindingPath, new RegExp(`\\.abi${abi}\\.`), `prebuild ${bindingPath} is not labelled abi${abi}`);
  });
});
