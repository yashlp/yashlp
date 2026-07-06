# AGENTS.md

## Cursor Cloud specific instructions

### Repository type: documentation-only

As of this writing, this repository contains **only Markdown documentation** — there is
no application source code, package manager manifest, dependency lockfile, test suite,
linter config, build system, or git hooks.

Tracked files:

- `README.md` — product overview and pointer to the spec.
- `PlacePulse_Master_PRD.md` — the master Product Requirements Document (living spec,
  delivered in parts).
- `AGENTS.md` — this file.

Because there is nothing to compile or execute, the following commands do **not** exist
and should not be expected:

- No install step (no `npm install` / `pip install` / etc.) — there are no dependencies.
- No `dev` / `start` server — there is no application to run.
- No `build` — there is nothing to build.
- No `lint` / `test` — there is no code and no test framework configured.

### How to "work with" this repo

- The deliverable here is **prose/spec content**. Editing means editing the Markdown files.
- To preview the docs as a human would read them, render the Markdown to HTML (any
  renderer works) and open it in a browser. This tooling is *not* part of the repo, so if
  you install a renderer for preview, do it ad hoc — do not add it to the startup/update
  script.
- Keep naming conventions from `PlacePulse_Master_PRD.md` §1.10 (e.g. prefer `incident`
  over `complaint`) if/when application code is eventually added.

### If application code is added later

Update this section: document the real install/dev/test/build/run commands and move
dependency installation into the startup update script.
