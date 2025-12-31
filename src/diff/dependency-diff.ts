import { PackageInfo } from '../parser/lockfile-types';

export interface DependencyDiff {
  added: PackageInfo[];
  removed: PackageInfo[];
  addedDirect: PackageInfo[];
  addedTransitive: PackageInfo[];
  removedDirect: PackageInfo[];
  removedTransitive: PackageInfo[];
}

export function computeDependencyDiff(
  before: Map<string, PackageInfo>,
  after: Map<string, PackageInfo>
): DependencyDiff {
  const beforeKeys = new Set(before.keys());
  const afterKeys = new Set(after.keys());

  const added: PackageInfo[] = [];
  const removed: PackageInfo[] = [];

  for (const [key, info] of after.entries()) {
    if (!beforeKeys.has(key)) {
      added.push(info);
    }
  }

  for (const [key, info] of before.entries()) {
    if (!afterKeys.has(key)) {
      removed.push(info);
    }
  }

  const addedDirect = added.filter((pkg) => pkg.isDirect);
  const addedTransitive = added.filter((pkg) => !pkg.isDirect);
  const removedDirect = removed.filter((pkg) => pkg.isDirect);
  const removedTransitive = removed.filter((pkg) => !pkg.isDirect);

  return {
    added: added.sort((a, b) => a.name.localeCompare(b.name)),
    removed: removed.sort((a, b) => a.name.localeCompare(b.name)),
    addedDirect: addedDirect.sort((a, b) => a.name.localeCompare(b.name)),
    addedTransitive: addedTransitive.sort((a, b) => a.name.localeCompare(b.name)),
    removedDirect: removedDirect.sort((a, b) => a.name.localeCompare(b.name)),
    removedTransitive: removedTransitive.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

