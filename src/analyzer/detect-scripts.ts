import { PackageInfo } from '../parser/lockfile-types';

export interface ScriptChange {
  packageName: string;
  scripts: Record<string, string>;
  isDirect: boolean;
}

const LIFECYCLE_SCRIPTS = [
  'preinstall',
  'install',
  'postinstall',
  'prepublish',
  'prepublishOnly',
  'prepack',
  'postpack',
  'preprepare',
  'prepare',
  'postprepare',
];

export function detectNewScripts(
  before: Map<string, PackageInfo>,
  after: Map<string, PackageInfo>
): ScriptChange[] {
  const changes: ScriptChange[] = [];

  for (const [key, afterInfo] of after.entries()) {
    const beforeInfo = before.get(key);
    const newScripts: Record<string, string> = {};

    if (afterInfo.scripts) {
      for (const [scriptName, scriptContent] of Object.entries(afterInfo.scripts)) {
        if (LIFECYCLE_SCRIPTS.includes(scriptName)) {
          const hadScript = beforeInfo?.scripts?.[scriptName];
          if (!hadScript) {
            newScripts[scriptName] = scriptContent;
          }
        }
      }
    }

    if (Object.keys(newScripts).length > 0) {
      changes.push({
        packageName: afterInfo.name,
        scripts: newScripts,
        isDirect: afterInfo.isDirect,
      });
    }
  }

  return changes.sort((a, b) => a.packageName.localeCompare(b.packageName));
}

