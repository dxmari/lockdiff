# Lockdiff

> **Human‑readable, risk‑aware diffs for ****package-lock.json**** in pull requests**\
> Turn unreadable lockfile changes into clear, actionable insights for reviewers.

---

## Why Lockdiff?

`package-lock.json` files change constantly — and almost no one reviews them properly.

As a result:

- Risky dependencies slip in unnoticed
- New install scripts appear silently
- License changes go unreviewed
- Reviewers approve PRs on **blind trust**

**Lockdiff exists to fix that.**

It translates lockfile noise into **clear, human‑readable intelligence** directly inside your PRs.

---

## What Lockdiff Does

Lockdiff analyzes changes between two versions of `package-lock.json` and produces a **concise summary** answering the questions reviewers actually care about.

Example PR summary:

```
📦 Dependency Change Summary

• +14 new dependencies (2 direct, 12 transitive)
• −3 dependencies removed
• ⚠️ 2 packages added lifecycle scripts
• ⚠️ 1 license changed (MIT → GPL‑3.0)
• ℹ️ 2 packages unmaintained (>2 years)

Review recommended
```

---

## Core Features

- 🔍 Detects added & removed dependencies
- 🧾 Highlights lifecycle script changes
- 📜 Detects license changes
- 🧓 Flags unmaintained packages (heuristic)
- 🧠 Deterministic, side‑effect‑free analysis
- 🤖 CI & PR‑first by design

---

## Installation

No installation required.

```bash
npx lockdiff
```

---

## Usage

### Local Usage (Optional)

```bash
npx lockdiff
```

Outputs a summary to stdout.

---

### CI / Pull Request Usage (Primary)

Lockdiff is designed to run in CI and post results directly to pull requests.

```yaml
- name: Lockdiff
  run: npx lockdiff --ci
```

---

## Operating Modes

| Mode     | Behavior                | Exit Code |
| -------- | ----------------------- | --------- |
| Default  | Report only             | `0`       |
| `--ci`   | CI‑friendly output      | `0`       |
| `--json` | Machine‑readable output | `0`       |

> Lockdiff **never blocks builds in v1**. It informs — it does not enforce.

---

## How It Works

```text
Detect lockfile change
        ↓
Parse before & after
        ↓
Compute dependency diff
        ↓
Analyze risk signals
        ↓
Generate summary
```

---

## Signals Analyzed (v1 Scope)

- Added dependencies (direct & transitive)
- Removed dependencies
- New lifecycle scripts
- License changes
- "Unmaintained" heuristic (publish age)

> No vulnerability scanning. No network calls by default.

---

## Design Principles

- **Explain changes, don’t overwhelm**
- **Deterministic output**
- **Zero side effects**
- **CI‑first ergonomics**
- **Readable > exhaustive**

---

## Comparison

| Tool       | Focus               | Lockdiff Advantage     |
| ---------- | ------------------- | ---------------------- |
| npm audit  | Vulnerabilities     | Change awareness       |
| Dependabot | Automation          | Human‑readable context |
| Lockdiff   | Review intelligence | Risk‑aware diffs       |

---

## Intended Audience

- Engineers reviewing PRs
- Tech leads responsible for dependency hygiene
- Security‑aware teams that want **visibility before enforcement**

---

## Non‑Goals (v1)

- Blocking PRs
- Fixing vulnerabilities
- Supporting yarn / pnpm
- Enterprise dashboards

---

## Contributing

Contributions are welcome.

1. Fork the repo
2. Create a feature branch
3. Add tests
4. Submit a PR

---

## Roadmap (Post‑v1)

- GitHub PR comments
- Optional enforcement mode
- pnpm / yarn support
- Scriptinel integration

---

## Final Note

> Lockfiles are reviewed by habit, not understanding.

Lockdiff restores **clarity, intent, and confidence** to dependency reviews.

