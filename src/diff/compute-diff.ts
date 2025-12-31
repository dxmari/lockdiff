import { ParsedLockfile } from '../parser/lockfile-types';
import { collectAllPackages } from '../parser/parse-lockfile';
import { DependencyDiff, computeDependencyDiff } from './dependency-diff';
import { VersionChange, computeVersionDiff } from './version-diff';

export interface LockfileDiff {
  dependencyDiff: DependencyDiff;
  versionChanges: VersionChange[];
}

export function computeDiff(before: ParsedLockfile, after: ParsedLockfile): LockfileDiff {
  const beforePackages = collectAllPackages(before);
  const afterPackages = collectAllPackages(after);

  const dependencyDiff = computeDependencyDiff(beforePackages, afterPackages);
  const versionChanges = computeVersionDiff(beforePackages, afterPackages);

  return {
    dependencyDiff,
    versionChanges,
  };
}

