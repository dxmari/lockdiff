import { LockfileDiff } from '../diff/compute-diff';
import { RiskAnalysis } from '../analyzer/analyze-risks';
import { LockfileReport } from './report-types';

export function createReport(diff: LockfileDiff, risks: RiskAnalysis): LockfileReport {
  const { dependencyDiff } = diff;
  const { scriptChanges, licenseChanges, unmaintainedPackages } = risks;

  const hasChanges =
    dependencyDiff.added.length > 0 ||
    dependencyDiff.removed.length > 0 ||
    scriptChanges.length > 0 ||
    licenseChanges.length > 0;

  const reviewRecommended =
    scriptChanges.length > 0 ||
    licenseChanges.length > 0 ||
    dependencyDiff.addedDirect.length > 0;

  return {
    dependencySummary: {
      added: dependencyDiff.added.length,
      removed: dependencyDiff.removed.length,
      addedDirect: dependencyDiff.addedDirect.length,
      addedTransitive: dependencyDiff.addedTransitive.length,
      removedDirect: dependencyDiff.removedDirect.length,
      removedTransitive: dependencyDiff.removedTransitive.length,
    },
    scriptChanges,
    licenseChanges,
    unmaintainedPackages,
    hasChanges,
    reviewRecommended,
  };
}

