import { LockfileReport } from '../report/report-types';
import { generateSummary } from '../report/generate-summary';
import { generateJson } from '../report/generate-json';
import { formatForCI } from '../report/format-ci';

export function outputReport(report: LockfileReport, args: { ci: boolean; json: boolean }): void {
  if (args.json) {
    console.log(generateJson(report));
  } else if (args.ci) {
    console.log(formatForCI(report));
  } else {
    console.log(generateSummary(report, true));
  }
}

