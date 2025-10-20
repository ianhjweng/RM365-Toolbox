// js/modules/enrollment/index.js
export async function init(path) {
  if (path === '/enrollment' || path === '/enrollment/management') {
    const mod = await import('./management.js');
    await mod.init();
    return;
  }
  if (path === '/enrollment/card') {
    const mod = await import('./card.js');
    await mod.init();
    return;
  }
  if (path === '/enrollment/fingerprint') {
    const mod = await import('./fingerprint.js');
    await mod.init();
    return;
  }
  // default: do nothing for unknown subpaths
}
