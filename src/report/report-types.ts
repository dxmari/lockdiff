import { ScriptChange, LicenseChange, UnmaintainedPackage } from '../analyzer/analyze-risks';

export interface LockfileReport {
  dependencySummary: {
    added: number;
    removed: number;
    addedDirect: number;
    addedTransitive: number;
    removedDirect: number;
    removedTransitive: number;
  };
  scriptChanges: ScriptChange[];
  licenseChanges: LicenseChange[];
  unmaintainedPackages: UnmaintainedPackage[];
  hasChanges: boolean;
  reviewRecommended: boolean;
}

