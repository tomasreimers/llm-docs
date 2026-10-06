# Editors

Adversarial review for the book, GAN-style. Each markdown file in this folder is an
**editor**: a self-contained persona-plus-checklist that gets run against one chapter
at a time by a subagent with **no parent-thread context**. The editor criticizes; the
writer revises; the loop repeats until the editor is satisfied. The cold context is
the point — an editor that has watched the chapter being written can no longer read
it the way a reader will.

## The loop

For each (chapter, editor) pair:

1. Spawn a subagent with **no conversation history**. Its entire prompt is:

   ```
   You are the editor described in the file below. Review the chapter that follows
   it according to that file's instructions, and respond in exactly the output
   format the file specifies.

   --- EDITOR SPEC ---
   <contents of editors/<editor>.md>

   --- CHAPTER (rendered prose; ignore imports/JSX unless the spec says otherwise) ---
   <contents of content/<chapter>.mdx>
   ```

2. The subagent returns a verdict and findings (format below).
3. The writer (main agent) applies fixes for findings it accepts, **weighing each
   against the house style** (see Arbitration), and ships the revision.
4. Re-run the same editor on the revised chapter. Repeat until `SATISFIED`,
   to a maximum of **3 rounds** per editor per chapter. If still unsatisfied after
   3 rounds, stop and surface the remaining findings to the author — don't loop
   forever chasing an adversary's tail.

Run editors independently (one editor per subagent, never combined); their findings
compose at the writer, not in the critic.

## Output contract

Every editor must respond in exactly this format, so the loop can be driven
mechanically:

```
VERDICT: SATISFIED | NOT SATISFIED

FINDINGS (severity-ordered, max 10):
1. [HIGH] "exact quote from the chapter" (section name) — what is wrong — suggested fix
2. [MEDIUM] ...
3. [LOW] ...
```

- **HIGH** — a reader is genuinely misled, lost, or repelled; must fix.
- **MEDIUM** — noticeably weakens the chapter; fix unless it conflicts with house style.
- **LOW** — polish; batch or skip.
- `SATISFIED` means: zero HIGH findings and at most two MEDIUM findings remain.
- Quotes must be exact substrings of the chapter so the writer can locate them.
- No preamble, no summary paragraph, no compliments. Findings only.

## Arbitration

Editors advise; they do not rule. The house voice (see the style conventions in the
repo and the author's past decisions) wins ties:

- This book deliberately uses em-dashes, worked numbers, direct address, and short
  punchy closers. Editors flag **density and formula**, not existence.
- An editor's suggested fix is a starting point; the writer may fix the underlying
  problem a different way.
- If two editors give conflicting advice (e.g., Completeness wants expansion where
  Slop wants cuts), the writer resolves in favor of the reader: explain better,
  not merely longer.
- Never let an editor remove technical content, verified numbers, or author-requested
  passages to satisfy a style preference. Flag the conflict to the author instead.

## Adding an editor

One file per editor, lowercase name (`slop.md`, `completeness.md`, ...). Each file
must contain: (1) a one-paragraph persona, (2) the specific checklist it reviews
against — with measurable thresholds wherever possible, so verdicts are reproducible —
(3) explicit non-goals (what it must NOT flag), and (4) the output contract above.
