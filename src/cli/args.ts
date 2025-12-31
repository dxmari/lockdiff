export interface CliArgs {
  ci: boolean;
  json: boolean;
  before?: string;
  after?: string;
}

export function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    ci: false,
    json: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--ci') {
      result.ci = true;
    } else if (arg === '--json') {
      result.json = true;
    } else if (arg === '--before' && i + 1 < args.length) {
      result.before = args[i + 1];
      i++;
    } else if (arg === '--after' && i + 1 < args.length) {
      result.after = args[i + 1];
      i++;
    }
  }

  return result;
}

