let cfg = KBPAD_DEFAULTS;
let waiting = null;

const MOUSE_NAMES = { Mouse0: 'Mouse esquerdo', Mouse1: 'Mouse meio', Mouse2: 'Mouse direito', Mouse3: 'Mouse voltar', Mouse4: 'Mouse avançar' };
const label = (code) => (!code ? '— nenhum —' : MOUSE_NAMES[code] || code.replace(/^Key|^Digit/, ''));

function save() {
  chrome.storage.sync.set({ config: cfg }, () => {
    const s = document.getElementById('status');
    s.textContent = 'Salvo';
    setTimeout(() => (s.textContent = ''), 1200);
  });
}

function getBinding(target) {
  return target === '__toggle' ? cfg.toggleKey : cfg.bindings[target];
}

function setBinding(target, code) {
  if (target === '__toggle') {
    if (code) cfg.toggleKey = code;
    return;
  }
  for (const k of Object.keys(cfg.bindings)) if (code && cfg.bindings[k] === code) cfg.bindings[k] = '';
  cfg.bindings[target] = code;
}

function render() {
  const tbody = document.getElementById('bindings');
  tbody.innerHTML = '';
  for (const [key, name] of KBPAD_TARGETS) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${name}</td><td><button class="bind" data-target="${key}"></button></td>`;
    tbody.appendChild(tr);
  }
  document.querySelectorAll('button.bind').forEach((btn) => {
    btn.textContent = label(getBinding(btn.dataset.target));
    btn.classList.remove('waiting');
    btn.onclick = (e) => {
      e.stopPropagation();
      if (waiting) return;
      waiting = btn.dataset.target;
      btn.textContent = 'Aperte uma tecla…';
      btn.classList.add('waiting');
    };
  });
  for (const id of ['sensitivity', 'deadzone', 'smoothing']) {
    const el = document.getElementById(id);
    el.value = cfg[id];
    document.getElementById(id + '-v').textContent = cfg[id];
    el.oninput = () => {
      cfg[id] = Number(el.value);
      document.getElementById(id + '-v').textContent = el.value;
      save();
    };
  }
  const inv = document.getElementById('invertY');
  inv.checked = cfg.invertY;
  inv.onchange = () => { cfg.invertY = inv.checked; save(); };
}

function finish(code) {
  if (code !== undefined) {
    setBinding(waiting, code);
    save();
  }
  waiting = null;
  render();
}

window.addEventListener('keydown', (e) => {
  if (!waiting) return;
  e.preventDefault();
  if (e.code === 'Escape') finish();
  else if (e.code === 'Backspace') finish('');
  else finish(e.code);
}, true);

window.addEventListener('mousedown', (e) => {
  if (!waiting) return;
  e.preventDefault();
  finish('Mouse' + e.button);
}, true);

window.addEventListener('contextmenu', (e) => { if (waiting) e.preventDefault(); });

document.getElementById('reset').onclick = () => {
  cfg = structuredClone(KBPAD_DEFAULTS);
  save();
  render();
};

chrome.storage.sync.get('config', ({ config }) => {
  cfg = kbpadMerge(config);
  render();
});
