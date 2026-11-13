// Ponte: o script MAIN não acessa chrome.storage, então a config chega por postMessage.
let kbpadCfg = KBPAD_DEFAULTS;

function sendConfig() {
  window.postMessage({ __kbpad: 'config', cfg: kbpadCfg }, '*');
}

chrome.storage.sync.get('config', ({ config }) => {
  kbpadCfg = kbpadMerge(config);
  sendConfig();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.config) {
    kbpadCfg = kbpadMerge(changes.config.newValue);
    sendConfig();
  }
});

window.addEventListener('message', (e) => {
  if (e.source === window && e.data && e.data.__kbpad === 'ready') sendConfig();
});

window.addEventListener('message', (e) => {
  if (e.source === window && e.data && e.data.__kbpad === 'state') {
    chrome.runtime.sendMessage({ type: 'kbpad-state', enabled: e.data.enabled }).catch(() => {});
  }
});
