import { LockfileReport } from './report-types';

export function generateSummary(report: LockfileReport, useEmojis: boolean): string {
  const lines: string[] = [];

  if (useEmojis) {
    lines.push('📦 Dependency Change Summary');
  } else {
    lines.push('Dependency Change Summary');
  }
  lines.push('');

  const { dependencySummary, scriptChanges, licenseChanges, unmaintainedPackages } = report;

  if (dependencySummary.added > 0) {
    const direct = dependencySummary.addedDirect;
    const transitive = dependencySummary.addedTransitive;
    lines.push(`• +${dependencySummary.added} new dependencies (${direct} direct, ${transitive} transitive)`);
  }

  if (dependencySummary.removed > 0) {
    lines.push(`• −${dependencySummary.removed} dependencies removed`);
  }

  if (scriptChanges.length > 0) {
    const emoji = useEmojis ? '⚠️ ' : '';
    lines.push(`${emoji}${scriptChanges.length} packages added lifecycle scripts`);
  }

  if (licenseChanges.length > 0) {
    const emoji = useEmojis ? '⚠️ ' : '';
    const change = licenseChanges[0];
    const before = change.beforeLicense || 'unknown';
    const after = change.afterLicense || 'unknown';
    lines.push(`${emoji}${licenseChanges.length} license changed (${before} → ${after})`);
  }

  if (unmaintainedPackages.length > 0) {
    const emoji = useEmojis ? 'ℹ️ ' : '';
    lines.push(`${emoji}${unmaintainedPackages.length} packages unmaintained (>2 years)`);
  }

  if (!report.hasChanges) {
    lines.push('No changes detected');
  } else if (report.reviewRecommended) {
    lines.push('');
    lines.push('Review recommended');
  }

  return lines.join('\n');
}

