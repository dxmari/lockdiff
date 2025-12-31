import { ParsedLockfile } from '../parser/lockfile-types';
import { collectAllPackages } from '../parser/parse-lockfile';
import { ScriptChange, detectNewScripts } from './detect-scripts';
import { LicenseChange, detectLicenseChanges } from './detect-licenses';
import { UnmaintainedPackage, detectUnmaintainedPackages } from './detect-unmaintained';

export type { ScriptChange } from './detect-scripts';
export type { LicenseChange } from './detect-licenses';
export type { UnmaintainedPackage } from './detect-unmaintained';

export interface RiskAnalysis {
  scriptChanges: ScriptChange[];
  licenseChanges: LicenseChange[];
  unmaintainedPackages: UnmaintainedPackage[];
}

export function analyzeRisks(before: ParsedLockfile, after: ParsedLockfile): RiskAnalysis {
  const beforePackages = collectAllPackages(before);
  const afterPackages = collectAllPackages(after);

  const scriptChanges = detectNewScripts(beforePackages, afterPackages);
  const licenseChanges = detectLicenseChanges(beforePackages, afterPackages);
  const unmaintainedPackages = detectUnmaintainedPackages(afterPackages);

  return {
    scriptChanges,
    licenseChanges,
    unmaintainedPackages,
  };
}

