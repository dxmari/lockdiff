import { ParsedLockfile, PackageInfo, LockfilePackage, LockfileMetadata } from './lockfile-types';

export function parseLockfile(content: string): ParsedLockfile {
  const lockfile = JSON.parse(content) as {
    lockfileVersion?: number;
    packages?: Record<string, LockfilePackage & LockfileMetadata>;
    dependencies?: Record<string, LockfilePackage>;
  };

  const lockfileVersion = lockfile.lockfileVersion ?? 1;
  const packages = lockfile.packages ?? {};
  const dependencies = lockfile.dependencies ?? {};

  return {
    lockfileVersion,
    packages,
    dependencies,
  };
}

export function extractPackageInfo(
  packagePath: string,
  packageData: LockfilePackage & LockfileMetadata,
  directDependencies: Set<string>
): PackageInfo {
  const packageName = extractPackageNameFromPath(packagePath);
  const isDirect = directDependencies.has(packageName);

  let license: string | undefined;
  if (typeof packageData.license === 'string') {
    license = packageData.license;
  } else if (packageData.license && typeof packageData.license === 'object') {
    license = packageData.license.type;
  }

  const publishDate = packageData.time?.[packageData.version];

  return {
    name: packageName,
    version: packageData.version,
    license,
    scripts: packageData.scripts,
    publishDate,
    isDirect,
  };
}

function extractPackageNameFromPath(path: string): string {
  if (path === '') {
    return '';
  }

  const parts = path.split('node_modules/');
  const lastPart = parts[parts.length - 1];
  
  if (lastPart.startsWith('@')) {
    const scopedParts = lastPart.split('/');
    return scopedParts.length >= 2 ? `${scopedParts[0]}/${scopedParts[1]}` : lastPart;
  }

  return lastPart.split('/')[0];
}

export function collectAllPackages(parsed: ParsedLockfile): Map<string, PackageInfo> {
  const packages = new Map<string, PackageInfo>();
  const directDeps = new Set(Object.keys(parsed.dependencies));

  for (const [path, packageData] of Object.entries(parsed.packages)) {
    const packageName = extractPackageNameFromPath(path);
    if (packageName && packageData.version) {
      const info = extractPackageInfo(path, packageData, directDeps);
      const key = `${info.name}@${info.version}`;
      
      if (!packages.has(key) || info.isDirect) {
        packages.set(key, info);
      }
    }
  }

  return packages;
}

