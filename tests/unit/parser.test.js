const { test } = require('node:test');
const assert = require('node:assert');
const { parseLockfile, collectAllPackages } = require('../../dist/parser/parse-lockfile');

test('parseLockfile - basic lockfile structure', () => {
  const lockfileContent = JSON.stringify({
    lockfileVersion: 2,
    packages: {
      '': {
        name: 'test-package',
        version: '1.0.0',
      },
      'node_modules/example': {
        version: '1.2.3',
        resolved: 'https://registry.npmjs.org/example/-/example-1.2.3.tgz',
        integrity: 'sha512-abc123',
      },
    },
    dependencies: {
      example: {
        version: '1.2.3',
      },
    },
  });

  const result = parseLockfile(lockfileContent);
  
  assert.strictEqual(result.lockfileVersion, 2);
  assert.ok(result.packages);
  assert.ok(result.dependencies);
  assert.strictEqual(result.dependencies.example.version, '1.2.3');
});

test('collectAllPackages - extracts package information', () => {
  const parsed = {
    lockfileVersion: 2,
    packages: {
      'node_modules/example': {
        version: '1.2.3',
        license: 'MIT',
        scripts: {
          postinstall: 'echo "installed"',
        },
        time: {
          '1.2.3': '2023-01-01T00:00:00.000Z',
        },
      },
    },
    dependencies: {
      example: {
        version: '1.2.3',
      },
    },
  };

  const packages = collectAllPackages(parsed);
  
  assert.strictEqual(packages.size, 1);
  const pkg = packages.get('example@1.2.3');
  assert.ok(pkg);
  assert.strictEqual(pkg.name, 'example');
  assert.strictEqual(pkg.version, '1.2.3');
  assert.strictEqual(pkg.license, 'MIT');
  assert.ok(pkg.scripts);
  assert.strictEqual(pkg.isDirect, true);
});

test('collectAllPackages - handles scoped packages', () => {
  const parsed = {
    lockfileVersion: 2,
    packages: {
      'node_modules/@scope/package': {
        version: '2.0.0',
      },
    },
    dependencies: {
      '@scope/package': {
        version: '2.0.0',
      },
    },
  };

  const packages = collectAllPackages(parsed);
  const pkg = packages.get('@scope/package@2.0.0');
  
  assert.ok(pkg);
  assert.strictEqual(pkg.name, '@scope/package');
});

