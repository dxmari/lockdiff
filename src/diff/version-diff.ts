import { PackageInfo } from '../parser/lockfile-types';

export interface VersionChange {
  packageName: string;
  beforeVersion: string;
  afterVersion: string;
  isDirect: boolean;
}

export function computeVersionDiff(
  before: Map<string, PackageInfo>,
  after: Map<string, PackageInfo>
): VersionChange[] {
  const changes: VersionChange[] = [];
  const beforeByName = new Map<string, PackageInfo>();

  for (const info of before.values()) {
    const existing = beforeByName.get(info.name);
    if (!existing || info.isDirect) {
      beforeByName.set(info.name, info);
    }
  }

  for (const afterInfo of after.values()) {
    const beforeInfo = beforeByName.get(afterInfo.name);
    
    if (beforeInfo && beforeInfo.version !== afterInfo.version) {
      changes.push({
        packageName: afterInfo.name,
        beforeVersion: beforeInfo.version,
        afterVersion: afterInfo.version,
        isDirect: afterInfo.isDirect,
      });
    }
  }

  return changes.sort((a, b) => a.packageName.localeCompare(b.packageName));
}

