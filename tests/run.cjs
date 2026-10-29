const { buildSync } = require('esbuild')
const { mkdtempSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const { join } = require('node:path')
const { spawnSync } = require('node:child_process')
const directory = mkdtempSync(join(tmpdir(), 'zustand-tests-'))
try {
  const outfile = join(directory, 'stores.test.cjs')
  buildSync({
    entryPoints: ['tests/stores.test.ts'], outfile, bundle: true, platform: 'node', format: 'cjs',
    banner: { js: `const testStorage = new Map(); globalThis.localStorage = {
      getItem: (key) => testStorage.get(key) ?? null,
      setItem: (key, value) => testStorage.set(key, value),
      removeItem: (key) => testStorage.delete(key)
    };` },
  })
  process.exitCode = spawnSync(process.execPath, ['--test', outfile], { stdio: 'inherit' }).status ?? 1
} finally {
  rmSync(directory, { recursive: true })
}
