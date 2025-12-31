#!/usr/bin/env node

import { existsSync } from 'fs';
import { parseArgs } from './args';
import { outputReport } from './output';
import { parseLockfile } from '../parser/parse-lockfile';
import { computeDiff } from '../diff/compute-diff';
import { analyzeRisks } from '../analyzer/analyze-risks';
import { createReport } from '../report/create-report';
import { isGitRepository, readFileFromGit, readFileFromFilesystem } from '../utils/git';

function getBeforeLockfile(args: { before?: string }): { content: string | null; source: string } {
  if (args.before) {
    if (existsSync(args.before)) {
      return { content: readFileFromFilesystem(args.before), source: args.before };
    }
    if (isGitRepository()) {
      const content = readFileFromGit(args.before, 'package-lock.json');
      if (content) {
        return { content, source: `git:${args.before}` };
      }
    }
    return { content: null, source: args.before };
  }

  if (isGitRepository()) {
    const content = readFileFromGit('HEAD', 'package-lock.json');
    if (content) {
      return { content, source: 'git:HEAD' };
    }
  }

  return { content: null, source: 'git:HEAD or --before' };
}

function getAfterLockfile(args: { after?: string }): { content: string | null; source: string } {
  if (args.after) {
    if (existsSync(args.after)) {
      return { content: readFileFromFilesystem(args.after), source: args.after };
    }
    return { content: null, source: args.after };
  }

  if (existsSync('package-lock.json')) {
    return { content: readFileFromFilesystem('package-lock.json'), source: 'package-lock.json' };
  }

  return { content: null, source: 'package-lock.json' };
}

function main(): void {
  const args = parseArgs();

  try {
    const beforeResult = getBeforeLockfile(args);
    const afterResult = getAfterLockfile(args);

    if (!beforeResult.content || !afterResult.content) {
      if (!beforeResult.content && !afterResult.content) {
        console.error('Error: Could not find package-lock.json files to compare');
        console.error('');
        console.error('Usage options:');
        console.error('  1. Run in a git repository with package-lock.json');
        console.error('  2. Use --before and --after flags to specify files');
        console.error('  3. Ensure package-lock.json exists in current directory');
      } else if (!beforeResult.content) {
        console.error(`Error: Could not find "before" package-lock.json`);
        console.error(`  Looked for: ${beforeResult.source}`);
        console.error('');
        console.error('Suggestions:');
        if (isGitRepository()) {
          console.error('  - Ensure HEAD contains package-lock.json');
          console.error('  - Use --before <file-path> to specify a file');
          console.error('  - Use --before <git-ref>:package-lock.json for git references');
        } else {
          console.error('  - Use --before <file-path> to specify a file');
          console.error('  - Run in a git repository to compare with HEAD');
        }
      } else {
        console.error(`Error: Could not find "after" package-lock.json`);
        console.error(`  Looked for: ${afterResult.source}`);
        console.error('');
        console.error('Suggestions:');
        console.error('  - Ensure package-lock.json exists in current directory');
        console.error('  - Use --after <file-path> to specify a file');
      }
      process.exit(0);
    }

    const before = parseLockfile(beforeResult.content);
    const after = parseLockfile(afterResult.content);

    const diff = computeDiff(before, after);
    const risks = analyzeRisks(before, after);
    const report = createReport(diff, risks);

    outputReport(report, args);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Error: Unknown error occurred');
    }
  }

  process.exit(0);
}

main();

