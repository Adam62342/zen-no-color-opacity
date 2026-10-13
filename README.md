# No-Color Opacity — experimental Sine mod

This package contains `theme.json`, `chrome.css`, and `index.js`.

**Status: untested prototype, not a verified fix.** It attempts to make the theme editor's last/opacity slider adjust `--zen-main-browser-background` when no swatch is selected. It retains the system theme color and changes its transparency instead of replacing it with black. The JS stores a value per detected workspace in browser-chrome localStorage (falling back to a shared `default` key). This does not modify Zen's native theme storage.

## Installation

Sine typically installs mods from a GitHub repository. Upload these three files to a repository and install that repository in Sine, with unofficial JavaScript mods enabled if required. A local ZIP is provided for convenient upload; it is **not** necessarily directly importable in Sine.

## Limitations

- Zen's editor element IDs, wave implementation, and workspace ID may differ by version. The fallback to the last range input may pick the wrong slider.
- The original background color may be an image/gradient or a system material; `color-mix()` cannot preserve those exactly.
- Sine may not execute `index.js` automatically depending on its JS packaging rules; a Sine-compatible JS entrypoint/build may be required.
- The effect is an independent CSS override, **not** a patch to Zen's internal opacity persistence.
- Tested only for JavaScript syntax, not in a running Zen browser.

To disable, remove the mod and restart Zen. If another mod controls `--zen-main-browser-background`, its CSS may conflict.
