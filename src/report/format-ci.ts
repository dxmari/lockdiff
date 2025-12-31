import { generateSummary } from './generate-summary';
import { LockfileReport } from './report-types';

export function formatForCI(report: LockfileReport): string {
  return generateSummary(report, false);
}

