const { test } = require('node:test');
const assert = require('node:assert');
const { computeDependencyDiff } = require('../../dist/diff/dependency-diff');

function createPackageInfo(name, version, isDirect = false) {
  return {
    name,
    version,
    isDirect,
    license: 'MIT',
  };
}

test('computeDependencyDiff - detects added dependencies', () => {
  const before = new Map([
    ['pkg1@1.0.0', createPackageInfo('pkg1', '1.0.0', true)],
  ]);
  
  const after = new Map([
    ['pkg1@1.0.0', createPackageInfo('pkg1', '1.0.0', true)],
    ['pkg2@2.0.0', createPackageInfo('pkg2', '2.0.0', true)],
    ['pkg3@3.0.0', createPackageInfo('pkg3', '3.0.0', false)],
  ]);

  const diff = computeDependencyDiff(before, after);
  
  assert.strictEqual(diff.added.length, 2);
  assert.strictEqual(diff.addedDirect.length, 1);
  assert.strictEqual(diff.addedTransitive.length, 1);
  assert.strictEqual(diff.removed.length, 0);
});

test('computeDependencyDiff - detects removed dependencies', () => {
  const before = new Map([
    ['pkg1@1.0.0', createPackageInfo('pkg1', '1.0.0', true)],
    ['pkg2@2.0.0', createPackageInfo('pkg2', '2.0.0', false)],
  ]);
  
  const after = new Map([
    ['pkg1@1.0.0', createPackageInfo('pkg1', '1.0.0', true)],
  ]);

  const diff = computeDependencyDiff(before, after);
  
  assert.strictEqual(diff.removed.length, 1);
  assert.strictEqual(diff.removedTransitive.length, 1);
  assert.strictEqual(diff.added.length, 0);
});

test('computeDependencyDiff - handles both additions and removals', () => {
  const before = new Map([
    ['old@1.0.0', createPackageInfo('old', '1.0.0', true)],
  ]);
  
  const after = new Map([
    ['new@2.0.0', createPackageInfo('new', '2.0.0', true)],
  ]);

  const diff = computeDependencyDiff(before, after);
  
  assert.strictEqual(diff.added.length, 1);
  assert.strictEqual(diff.removed.length, 1);
  assert.strictEqual(diff.added[0].name, 'new');
  assert.strictEqual(diff.removed[0].name, 'old');
});

