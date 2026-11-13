// Ponte: o script MAIN não acessa chrome.storage, então a config chega por postMessage.
let kbpadCfg = KBPAD_DEFAULTS;

function sendConfig() {
  window.postMessage({ __kbpad: 'config', cfg: kbpadCfg }, '*');
}

async function refresh() {
  const { presets, active, toggleKey } = await kbpadLoad();
  kbpadCfg = { ...kbpadMerge(presets[active]), toggleKey };
  sendConfig();
}

refresh();
chrome.storage.onChanged.addListener(refresh);

window.addEventListener('message', (e) => {
  if (e.source !== window || !e.data) return;
  if (e.data.__kbpad === 'ready') sendConfig();
  if (e.data.__kbpad === 'state') {
    chrome.runtime.sendMessage({ type: 'kbpad-state', enabled: e.data.enabled }).catch(() => {});
  }
});
