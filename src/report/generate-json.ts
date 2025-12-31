import { LockfileReport } from './report-types';

export function generateJson(report: LockfileReport): string {
  return JSON.stringify(report, null, 2);
}

