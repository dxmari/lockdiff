import { PackageInfo } from '../parser/lockfile-types';

export interface UnmaintainedPackage {
  packageName: string;
  version: string;
  lastPublishDate: string;
  yearsSincePublish: number;
  isDirect: boolean;
}

const UNMAINTAINED_THRESHOLD_YEARS = 2;
const MILLISECONDS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

export function detectUnmaintainedPackages(
  packages: Map<string, PackageInfo>
): UnmaintainedPackage[] {
  const unmaintained: UnmaintainedPackage[] = [];
  const now = Date.now();

  for (const info of packages.values()) {
    if (info.publishDate) {
      const publishDate = new Date(info.publishDate).getTime();
      const yearsSincePublish = (now - publishDate) / MILLISECONDS_PER_YEAR;

      if (yearsSincePublish > UNMAINTAINED_THRESHOLD_YEARS) {
        unmaintained.push({
          packageName: info.name,
          version: info.version,
          lastPublishDate: info.publishDate,
          yearsSincePublish: Math.round(yearsSincePublish * 10) / 10,
          isDirect: info.isDirect,
        });
      }
    }
  }

  return unmaintained.sort((a, b) => a.packageName.localeCompare(b.packageName));
}

