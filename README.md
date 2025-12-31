# Lockwatch

> **Human‑readable, risk‑aware diffs for package-lock.json in pull requests**  
> Turn unreadable lockfile changes into clear, actionable insights for reviewers.

## Installation

No installation required.

```bash
npx lockwatch
```

## Usage

### Local Usage

```bash
npx lockwatch
```

Outputs a summary to stdout.

### CI / Pull Request Usage

```bash
npx lockwatch --ci
```

### JSON Output

```bash
npx lockwatch --json
```

### Custom File Paths

```bash
npx lockwatch --before path/to/before/package-lock.json --after path/to/after/package-lock.json
```

## Features

- Detects added & removed dependencies (direct & transitive)
- Highlights lifecycle script changes
- Detects license changes
- Flags unmaintained packages (heuristic)
- Deterministic, side‑effect‑free analysis
- CI & PR‑first by design

## Operating Modes

| Mode     | Behavior                | Exit Code |
| -------- | ----------------------- | --------- |
| Default  | Report only             | `0`       |
| `--ci`   | CI‑friendly output      | `0`       |
| `--json` | Machine‑readable output | `0`       |

> Lockwatch **never blocks builds in v1**. It informs — it does not enforce.

For more details, see [docs/lockdiff_readme.md](docs/lockdiff_readme.md).
