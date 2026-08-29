# Contributing

Thanks for wanting to help. This file covers the two things that are easy to get
wrong here — which file to edit, and what a color has to clear before it can
ship — plus the release procedure.

## Setup

```bash
git clone https://github.com/kpab/vscode-neon-pink-theme.git
cd vscode-neon-pink-theme
npm install
npm test
```

`npm install` pulls in `sharp`, which is only needed to regenerate the icon. The
theme itself has no runtime dependencies and none of the checks below need
anything else.

Press `F5` in VS Code to launch an Extension Development Host with the theme
loaded, then pick it from `Preferences: Color Theme`.

## Know which theme files are hand-maintained

`themes/neon-pink-dark-color-theme.json` is the hand-maintained modern base.
Soft and Dimmed are generated from it:

```bash
npm run build     # regenerates both variants from the base theme
```

Editing a variant directly works right up until someone runs `npm run build`,
which overwrites it. `npm test` runs `build-themes.js --check` first and fails if
a generated file differs from what the base theme would produce, so a color
change that skips the rebuild cannot be committed unnoticed.

`themes/neon-pink-dark-classic-color-theme.json` is different: it is the
corrected 0.0.1 snapshot and is never generated. Its SHA-256 is pinned in
`scripts/theme-config.js`, next to the number of contrast failures it is known
to have. Change it only deliberately, review the visual effect, and update both
in the same commit. The same check also
asserts that every theme in `package.json` is classified exactly once as the
base, a generated variant, or a frozen snapshot.

How the variants are derived — desaturation at constant luminance, then a
background lift paid back as foreground gain — is documented at the top of
`scripts/build-themes.js`.

## What a color has to clear

```bash
npm test
```

Three checks, in order:

| Check | What it catches |
|---|---|
| `validate-themes.js` | Malformed color values, keys VS Code does not register, a key written twice, a bad `tokenColors` entry |
| `build-themes.js --check` | A stale generated variant, changed frozen snapshot, or unclassified registered theme |
| `check-contrast.js` | Any modern-theme foreground below WCAG AA or left unset; Classic is audited against a pinned failure count |

The contrast check is the one that usually decides a modern-theme color. It
measures every `tokenColors` and `semanticTokenColors` foreground against all
editor surfaces it can land on — including the current-line highlight,
selection, diff and merge backgrounds — because a color that passes on pure
black can still fail inside a selection. Alpha is composited before measuring:
`#FF66CAA3` is 64% opacity, and what reaches the eye is much darker than the
swatch suggests. Classic is measured too. Six of its pairs sit below AA and are printed on every
run without failing the build; `scripts/theme-config.js` declares that six, and
the run fails if the measurement disagrees — the snapshot is hash-pinned, so
that can only happen when this checker changes, which is when the number is
worth looking at again. Use `node scripts/check-contrast.js --verbose` for its
individual results. The keys Classic never sets are counted separately, not as
failures: VS Code fills them from its own defaults. On the modern themes, where
every checked key is set, an unset one is a regression and still blocks.

There is very little headroom. The darkest token in the theme, the `#FF2DBE`
accent, sits at 4.6:1 inside a selection against a 4.5:1 floor. A change that
darkens anything is likely to run into it.

Two rules on top of the measurements:

- **Stay on the pink ramp.** The exception is five hues — coral, amber, cyan,
  mint and violet — allowed only where the color carries information rather than
  style: a diagnostic, a diff, a Git status. See Design Philosophy in the README.
- **Nothing with alpha in a foreground position.** The three colors that failed
  the first contrast audit were the three that carried alpha.

## Coverage

```bash
npm run validate -- --coverage
```

Lists the color keys VS Code registers that the theme does not set, grouped by
prefix. An unset key is not an error — it is a Dark+ default showing through,
which is sometimes fine and sometimes the bug you are looking for. Areas left
uncolored on purpose are listed in `IGNORED_GROUPS` in
`scripts/validate-themes.js`, each with a reason; add to it rather than leaving a
group unexplained.

The known-key list itself is generated from a local VS Code install and
committed:

```bash
npm run extract-color-keys
```

Re-run it after a VS Code upgrade. It records the version it came from, so a
stale list is visible rather than silent.

## The icon

`icon.png` is generated from `icon.svg`:

```bash
npm run icon
npm run icon -- --size 256
```

Edit the SVG, never the PNG — the PNG is what the Marketplace shows, and it is
overwritten on the next run. The SVG is rendered at 3x and scaled down, because
the design is mostly thin strokes and rasterizing those at 128px aliases them
into an uneven gray.

The Marketplace requires a PNG of at least 128x128, which is also the SVG's
viewBox, so anything larger is upscaling a design drawn for that size. The two
`<animate>` elements in the SVG are ignored by rasterizers: the PNG is the first
frame, with the main circle at full opacity and the center dot at `r=8`.

## The banner

`images/banner.png` and `images/social-preview.png` are generated from
`scripts/generate-banner.js`:

```bash
npm run banner
```

Both come out of one 1280-wide composition — the README hero at 400px tall, the
GitHub social preview at 640px with the same artwork centered — so a change is
made once and lands in both. Every color in it is read from
`themes/neon-pink-dark-color-theme.json`, so the banner follows the palette
instead of drifting away from it; a token color change shows up on the next run.

The PNGs are committed. The text is rendered with whatever font the rasterizer
resolves, so generating them at install time would produce a different picture
on a machine without Helvetica.

Uploading the social preview is manual: GitHub has no API for it. Repository
Settings → General → Social preview → Upload an image, with
`images/social-preview.png`.

## The palette strip

`images/palette.png` — the picture above the color table in both READMEs — comes
from `scripts/generate-palette.js`:

```bash
npm run palette
```

It reads the ten colors the table lists straight out of the base theme and
measures each ratio itself, with the same WCAG 2.1 luminance
`scripts/check-contrast.js` uses. Nothing in it is typed by hand, so a palette
change is one command away from being visible — but it is not part of `npm
test`, which checks themes rather than documentation. Regenerate it in the same
commit that moves a color, and update the ratio in the table to match.

## Pull requests

1. Branch from `main`.
2. Edit the base theme; run `npm run build`.
3. Run `npm test`.
4. Add an entry under `## [Unreleased]` in `CHANGELOG.md`. Say what changed and
   why — for a contrast fix, the before and after ratios.
5. Keep `README.md` and `README.ja.md` in sync if either changes.
6. Open the PR against `main`. CI runs the same checks plus a packaging step.

One issue per branch, one branch per PR. It keeps the changelog readable.

## Releasing

Maintainers only. Pushing a `v*` tag is the whole release.

1. Move the `## [Unreleased]` entries into a new `## [x.y.z] - YYYY-MM-DD`
   section and add the link definition at the bottom of the file. The GitHub
   Release body is generated from this section, so it is what people read.
2. `npm version x.y.z --no-git-tag-version` — updates `package.json` and
   `package-lock.json` together.
3. Commit, open a PR, merge it.
4. Tag the merge commit on `main` and push the tag:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

5. `.github/workflows/release.yml` then validates, packages, publishes to the
   Marketplace and Open VSX, and creates the GitHub Release with the VSIX
   attached. It refuses to run if the tag and `package.json` disagree, or if the
   version has no CHANGELOG section.
6. Close the milestone.

The two publish steps need repository secrets and are skipped when they are not
set, with a warning in the run summary:

| Secret | For |
|---|---|
| `VSCE_PAT` | Azure DevOps PAT for the `kpab` publisher — the Visual Studio Marketplace |
| `OVSX_PAT` | Open VSX access token — VSCodium, Cursor and other forks |

To publish a version whose tag already exists — after adding a missing secret,
for instance — run the Release workflow manually from the Actions tab and give
it the tag.
