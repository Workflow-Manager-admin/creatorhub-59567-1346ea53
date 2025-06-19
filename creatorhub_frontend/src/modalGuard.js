//
// PUBLIC_INTERFACE
/**
 * ModalGuard utility for CreatorHub: detects and removes persistent modal artifacts/dimming,
 * ensures no persistent backdrop, filter, blur, or opacity < 1 is left after modal close.
 *
 * Usage: import { initModalGuard } from './modalGuard'; initModalGuard();
 */

function hasBlurOrBackdropFilter(style) {
  if (!style) return false;
  const filter = style.filter || "";
  const backdrop = style.backdropFilter || "";
  const blurRgx = /(blur|backdrop-filter)/i;
  return (
    (filter && blurRgx.test(filter) && filter !== "none") ||
    (backdrop && blurRgx.test(backdrop) && backdrop !== "none")
  );
}

function getRealOpacity(style) {
  if (!style) return 1;
  const val = style.opacity;
  if (val === "" || val == null) return 1;
  const num = Number(val);
  return isNaN(num) ? 1 : num;
}

function removeOffendingStyles(el) {
  if (!el || !el.style) return;
  if (el.style.backdropFilter) el.style.backdropFilter = "none";
  if (el.style.filter && /blur/i.test(el.style.filter)) el.style.filter = "none";
  if (el.style.opacity && Number(el.style.opacity) < 1) el.style.opacity = "1";
}

function logAndClean(el, details, reason) {
  // Log with stack for context, show element and offending style
  // eslint-disable-next-line no-console
  console.warn(
    `[ModalGuard] ✨ Removed persistent modal/dimming effect on element:`,
    el,
    { reason, details, style: el.style && el.style.cssText }
  );
  removeOffendingStyles(el);
}

function hasModalInDOM() {
  // Only consider modal "open" if a .ch-modal-backdrop with .active exists and is visible in DOM
  const backdrop = document.querySelector('.ch-modal-backdrop.active');
  if (backdrop && backdrop.offsetParent !== null) return true;
  // Also treat .ch-modal-top-level as modal, if present (for extension)
  return false;
}

function cleanBodyModalClassesIfNoModal() {
  if (!hasModalInDOM()) {
    ["ch-modal-blur", "ch-modal-dim"].forEach(cls => {
      if (document.body.classList.contains(cls)) {
        document.body.classList.remove(cls);
        // eslint-disable-next-line no-console
        console.warn(`[ModalGuard] Removed lingering modal class from <body>: ${cls}`);
      }
    });
  }
}

function removeStrayBackdropsIfNoModal() {
  if (!hasModalInDOM()) {
    // Remove .ch-modal-backdrop that are not .active (or are orphaned/invisible)
    document.querySelectorAll('.ch-modal-backdrop').forEach(node => {
      if (!node.classList.contains('active')) {
        // not modal, remove directly
        node.parentNode && node.parentNode.removeChild(node);
        // eslint-disable-next-line no-console
        console.warn("[ModalGuard] Removed stray .ch-modal-backdrop from DOM:", node);
      } else if (node.offsetParent == null) { // Node is detached
        node.parentNode && node.parentNode.removeChild(node);
        console.warn("[ModalGuard] Removed hidden .ch-modal-backdrop from DOM:", node);
      }
    });
  }
}

function scanAndCleanTargets() {
  // Targets: body, .app-shell, .ch-modal-backdrop, descendants
  const rootEls = [
    document.body,
    document.querySelector('.app-shell'),
    ...Array.from(document.querySelectorAll('.ch-modal-backdrop'))
  ].filter(Boolean);

  rootEls.forEach(el => {
    // Direct style check
    const style = el.style || window.getComputedStyle(el);
    // Backdrop/blur/opacity persistence on root target
    if (hasBlurOrBackdropFilter(style) || getRealOpacity(style) < 1) {
      logAndClean(el, style, "root element");
    }

    // Scan descendants for accidental filter/opacity/blur leftovers
    Array.from(el.querySelectorAll('*')).forEach(child => {
      const styleC = child.style || window.getComputedStyle(child);
      if (hasBlurOrBackdropFilter(styleC) || getRealOpacity(styleC) < 1) {
        logAndClean(child, styleC, "descendant");
      }
    });
  });

  // Special: forcibly clean persistent classes on main targets
  cleanBodyModalClassesIfNoModal();
  // Remove orphaned .ch-modal-backdrop if not currently modal
  removeStrayBackdropsIfNoModal();
}

/**
 * PUBLIC_INTERFACE
 * Initializes the modal artifact guard. Safe to call multiple times, installs a single MutationObserver.
 */
export function initModalGuard() {
  if (window.__modalGuardActive) return; // Prevent double install
  window.__modalGuardActive = true;

  scanAndCleanTargets();

  // Install DOM observer to monitor style/class/child nodes
  const observer = new MutationObserver((mutations) => {
    // On any DOM mutation, re-scan relevant elements
    let mustRescan = false;
    for (const m of mutations) {
      // If someone adds or changes a .ch-modal-backdrop, style, or classes, rescan
      if (
        m.type === "childList" ||
        m.type === "attributes" ||
        (m.target && (
            m.target.classList?.contains('ch-modal-backdrop') ||
            m.target === document.body ||
            m.target.classList?.contains('app-shell')
          ))
      ) {
        mustRescan = true;
        break;
      }
    }
    if (mustRescan) scanAndCleanTargets();
  });

  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'backdrop-filter', 'opacity', 'filter']
  });

  // Run a periodic sweep as backup (for missed events, iframe reentrancy, custom events)
  window.__modalGuardInterval = setInterval(scanAndCleanTargets, 1100);

  // Immediate cleanup on window blur/focus or history change (catch modal-close when app loses focus)
  window.addEventListener("focus", scanAndCleanTargets);
  window.addEventListener("blur", scanAndCleanTargets);
  window.addEventListener("popstate", scanAndCleanTargets);
  window.addEventListener("hashchange", scanAndCleanTargets);
}

// If wanted, auto-install (uncomment for developer debugging)
// if (typeof window !== "undefined" && document?.body) initModalGuard();
