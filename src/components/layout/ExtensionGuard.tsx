/**
 * Some browser extensions (e.g. ones that add `bis_skin_checked` / `bis_register`) tag every element
 * before React hydrates, which React reports as a hydration mismatch. This inline script runs first
 * and strips those attributes as they appear, then stops watching once the page has settled.
 */
const script = `(() => {
  const attrs = ["bis_skin_checked", "bis_register"];
  const clean = (el) => {
    if (el.nodeType !== 1) return;
    for (const a of attrs) el.removeAttribute(a);
    for (const a of Array.from(el.attributes)) if (a.name.startsWith("__processed_")) el.removeAttribute(a.name);
  };
  const sweep = () => document.querySelectorAll("[bis_skin_checked],[bis_register]").forEach(clean);
  const obs = new MutationObserver((ms) => {
    for (const m of ms) {
      if (m.type === "attributes") clean(m.target);
      else m.addedNodes.forEach((n) => { clean(n); n.querySelectorAll && n.querySelectorAll("[bis_skin_checked]").forEach(clean); });
    }
  });
  obs.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: attrs });
  document.addEventListener("DOMContentLoaded", () => { clean(document.body); sweep(); });
  window.addEventListener("load", () => setTimeout(() => { sweep(); obs.disconnect(); }, 3000));
})();`;

export function ExtensionGuard() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
