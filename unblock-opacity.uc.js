// Unblock Opacity Slider — Zen (Sine) userChrome script
// Makes the opacity slider control background transparency with no color
// selected, and self-applies on startup (no toggle needed).

(function () {
  "use strict";

  const FLAG = "__unblockOpacityPatched";

  function patchProto() {
    const picker = window.gZenThemePicker;
    if (!picker) return null;
    const proto = Object.getPrototypeOf(picker);
    if (!proto || typeof proto.getGradient !== "function") return null;
    if (!proto[FLAG]) {
      const originalGetGradient = proto.getGradient;
      proto.getGradient = function (colors, forToolbar = false) {
        if (!colors || colors.length === 0) {
          try {
            const base = this.getToolbarModifiedBaseRaw().slice(0, 3);
            let alpha =
              typeof this.currentOpacity === "number" ? this.currentOpacity : 1;
            alpha = Math.max(0, Math.min(1, alpha));
            return `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${alpha})`;
          } catch (e) {
            return originalGetGradient.call(this, colors, forToolbar);
          }
        }
        return originalGetGradient.call(this, colors, forToolbar);
      };
      proto[FLAG] = true;
    }
    return picker;
  }

  async function reapply() {
    const picker = patchProto();
    if (!picker) return false;
    try {
      const ws = await window.gZenWorkspaces?.getActiveWorkspace?.();
      if (!ws) return false;
      picker.invalidateGradientCache?.(ws.uuid);
      await picker.onWorkspaceChange?.(ws, false);
      return true;
    } catch (e) {
      return false;
    }
  }

  let tries = 0;
  (function loop() {
    reapply().then((ok) => {
      if (ok) {
        setTimeout(reapply, 1500);
        return;
      }
      if (++tries <= 150) setTimeout(loop, 200);
    });
  })();
})();
