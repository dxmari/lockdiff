import { readFileSync } from 'fs';
import { execSync } from 'child_process';

export function readFileFromGit(revision: string, path: string): string | null {
  try {
    const output = execSync(`git show ${revision}:${path}`, { encoding: 'utf-8', stdio: 'pipe' });
    return output;
  } catch {
    return null;
  }
}

export function isGitRepository(): boolean {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function readFileFromFilesystem(path: string): string {
  return readFileSync(path, 'utf-8');
}

