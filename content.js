// Ponte: o script MAIN não acessa chrome.storage, então a config chega por postMessage.
let kbpadCfg = KBPAD_DEFAULTS;
let kbpadState = null;
// Troca rápida vale só nesta aba e não altera o preset salvo.
let current = null;

function sendConfig() {
  window.postMessage({ __kbpad: 'config', cfg: kbpadCfg }, '*');
}

function build(announce) {
  const { presets, toggleKey, switchKey } = kbpadState;
  const p = presets[current];
  const alt = p.alt && presets[p.alt] ? p.alt : '';
  kbpadCfg = { ...kbpadMerge(p), toggleKey, switchKey, presetName: current, altName: alt, announce: !!announce };
  sendConfig();
}

async function refresh() {
  kbpadState = await kbpadLoad();
  const { presets, active } = kbpadState;
  const keep = current && presets[current] && (current === active || presets[active].alt === current);
  if (!keep) current = active;
  build(false);
}

refresh();
chrome.storage.onChanged.addListener(refresh);

window.addEventListener('message', (e) => {
  if (e.source !== window || !e.data) return;
  if (e.data.__kbpad === 'ready') sendConfig();
  if (e.data.__kbpad === 'switch' && kbpadCfg.altName) {
    current = kbpadCfg.altName;
    build(true);
  }
  if (e.data.__kbpad === 'state') {
    chrome.runtime.sendMessage({ type: 'kbpad-state', enabled: e.data.enabled }).catch(() => {});
  }
});
