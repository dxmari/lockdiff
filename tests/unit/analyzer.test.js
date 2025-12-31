const { test } = require('node:test');
const assert = require('node:assert');
const { detectNewScripts } = require('../../dist/analyzer/detect-scripts');
const { detectLicenseChanges } = require('../../dist/analyzer/detect-licenses');
const { detectUnmaintainedPackages } = require('../../dist/analyzer/detect-unmaintained');

function createPackageInfo(name, version, options = {}) {
  return {
    name,
    version,
    isDirect: options.isDirect ?? false,
    license: options.license ?? 'MIT',
    scripts: options.scripts,
    publishDate: options.publishDate,
  };
}

test('detectNewScripts - finds new lifecycle scripts', () => {
  const before = new Map([
    ['pkg1@1.0.0', createPackageInfo('pkg1', '1.0.0', {
      scripts: { test: 'jest' },
    })],
  ]);
  
  const after = new Map([
    ['pkg1@1.0.0', createPackageInfo('pkg1', '1.0.0', {
      scripts: {
        test: 'jest',
        postinstall: 'node setup.js',
        preinstall: 'echo "preparing"',
      },
    })],
  ]);

  const changes = detectNewScripts(before, after);
  
  assert.strictEqual(changes.length, 1);
  assert.strictEqual(changes[0].packageName, 'pkg1');
  assert.ok(changes[0].scripts.postinstall);
  assert.ok(changes[0].scripts.preinstall);
  assert.strictEqual(Object.keys(changes[0].scripts).length, 2);
});

test('detectLicenseChanges - detects license modifications', () => {
  const before = new Map([
    ['pkg1@1.0.0', createPackageInfo('pkg1', '1.0.0', {
      license: 'MIT',
    })],
  ]);
  
  const after = new Map([
    ['pkg1@1.0.0', createPackageInfo('pkg1', '1.0.0', {
      license: 'GPL-3.0',
    })],
  ]);

  const changes = detectLicenseChanges(before, after);
  
  assert.strictEqual(changes.length, 1);
  assert.strictEqual(changes[0].beforeLicense, 'MIT');
  assert.strictEqual(changes[0].afterLicense, 'GPL-3.0');
});

test('detectUnmaintainedPackages - flags old packages', () => {
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 3);
  
  const packages = new Map([
    ['old@1.0.0', createPackageInfo('old', '1.0.0', {
      publishDate: twoYearsAgo.toISOString(),
    })],
    ['recent@2.0.0', createPackageInfo('recent', '2.0.0', {
      publishDate: new Date().toISOString(),
    })],
  ]);

  const unmaintained = detectUnmaintainedPackages(packages);
  
  assert.strictEqual(unmaintained.length, 1);
  assert.strictEqual(unmaintained[0].packageName, 'old');
  assert.ok(unmaintained[0].yearsSincePublish >= 2);
});

