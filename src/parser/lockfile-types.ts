export interface LockfilePackage {
  version: string;
  resolved?: string;
  integrity?: string;
  dev?: boolean;
  optional?: boolean;
  requires?: Record<string, string>;
  dependencies?: Record<string, LockfilePackage>;
  devDependencies?: Record<string, LockfilePackage>;
  optionalDependencies?: Record<string, LockfilePackage>;
}

export interface LockfileMetadata {
  name?: string;
  version?: string;
  license?: string | { type: string; url?: string };
  scripts?: Record<string, string>;
  time?: Record<string, string>;
}

export interface ParsedLockfile {
  lockfileVersion: number;
  packages: Record<string, LockfilePackage & LockfileMetadata>;
  dependencies: Record<string, LockfilePackage>;
}

export interface PackageInfo {
  name: string;
  version: string;
  license?: string;
  scripts?: Record<string, string>;
  publishDate?: string;
  isDirect: boolean;
}

