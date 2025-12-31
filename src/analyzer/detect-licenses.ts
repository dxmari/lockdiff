import { PackageInfo } from '../parser/lockfile-types';

export interface LicenseChange {
  packageName: string;
  beforeLicense?: string;
  afterLicense?: string;
  isDirect: boolean;
}

export function detectLicenseChanges(
  before: Map<string, PackageInfo>,
  after: Map<string, PackageInfo>
): LicenseChange[] {
  const changes: LicenseChange[] = [];

  for (const [key, afterInfo] of after.entries()) {
    const beforeInfo = before.get(key);
    
    if (beforeInfo && beforeInfo.license !== afterInfo.license) {
      changes.push({
        packageName: afterInfo.name,
        beforeLicense: beforeInfo.license,
        afterLicense: afterInfo.license,
        isDirect: afterInfo.isDirect,
      });
    }
  }

  return changes.sort((a, b) => a.packageName.localeCompare(b.packageName));
}

