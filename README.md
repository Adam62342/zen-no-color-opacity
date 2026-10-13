# Unblock Opacity Slider

A tiny [Sine](https://github.com/CosmoCreeper/Sine) mod for [Zen Browser](https://zen-browser.app) that keeps the **workspace theme opacity slider usable even when no color is selected**.

## The problem

In Zen's theme picker (the gradient/color panel), the opacity slider is hidden until you add an accent color. Internally, when no color is selected Zen sets `invalidate-controls="true"` on the theme panel, and its stylesheet then hides the slider:

```css
#PanelUI-zen-gradient-generator[invalidate-controls="true"] {
  #PanelUI-zen-gradient-generator-opacity { display: none !important; }
}
```

The slider is **not** actually disabled in Zen's JavaScript — its input handler has no "needs a color" guard — so simply un-hiding it makes it fully functional again.

## The fix

```css
#PanelUI-zen-gradient-generator[invalidate-controls="true"]
  #PanelUI-zen-gradient-generator-opacity {
  display: revert !important;
}
```

That's the entire mod (`chrome.css`). `display: revert` restores the slider exactly as it renders in its normal, color-selected state.

## Install (via Sine, from GitHub)

1. Create a GitHub repo named `zen-unblock-opacity-slider` and push these files to the `main` branch:
   - `theme.json`
   - `chrome.css`
   - `README.md`
2. In **`theme.json`**, replace every `YOUR_GITHUB_USERNAME` with your actual GitHub username (3 spots: `homepage`, `style`, `readme`, plus `author` if you like).
3. In Zen, open **Settings → Sine**. In the field labelled *"add your own locally from a GitHub repo"*, paste your repo link:
   ```
   https://github.com/YOUR_GITHUB_USERNAME/zen-unblock-opacity-slider
   ```
4. Sine installs it. Restart Zen if the slider doesn't appear immediately.

Because Sine pulls straight from your repo, pushing a new commit (and bumping `version` in `theme.json`) is all it takes to update.

## Notes

- This targets Zen's current (non-legacy) gradient panel, which is where the hiding happens.
- It hooks onto Zen's internal ids (`PanelUI-zen-gradient-generator`, `invalidate-controls`). Those are stable today; a future Zen rename would need a one-line patch here.

## License

MIT
