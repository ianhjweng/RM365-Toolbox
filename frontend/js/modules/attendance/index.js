// js/modules/attendance/index.js
export async function init(path) {
  if (path === '/attendance' || path === '/attendance/overview') {
    const mod = await import('./overview.js');
    await mod.init();
    return;
  }
  if (path === '/attendance/manual') {
    const mod = await import('./manualClocking.js');
    await mod.init();
    return;
  }
  if (path === '/attendance/automatic') {
    const mod = await import('./automaticClocking.js');
    await mod.init();
    return;
  }
  if (path === '/attendance/logs') {
    const mod = await import('./logs.js');
    await mod.init();
    return;
  }
  // default: do nothing for unknown subpaths
}