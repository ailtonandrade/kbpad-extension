let state = null;
let waiting = null;

const MOUSE_NAMES = { Mouse0: 'Mouse esquerdo', Mouse1: 'Mouse meio', Mouse2: 'Mouse direito', Mouse3: 'Mouse voltar', Mouse4: 'Mouse avançar' };
const label = (code) => (!code ? '— nenhum —' : MOUSE_NAMES[code] || code.replace(/^Key|^Digit/, ''));
const cfg = () => state.presets[state.active];

function save() {
  chrome.storage.sync.set({ presets: state.presets, active: state.active, toggleKey: state.toggleKey }, () => {
    const s = document.getElementById('status');
    s.textContent = chrome.runtime.lastError ? 'Erro: ' + chrome.runtime.lastError.message : 'Salvo';
    setTimeout(() => (s.textContent = ''), 1500);
  });
}

function getBinding(target) {
  return target === '__toggle' ? state.toggleKey : cfg().bindings[target];
}

function setBinding(target, code) {
  if (target === '__toggle') {
    if (code) state.toggleKey = code;
    return;
  }
  const b = cfg().bindings;
  for (const k of Object.keys(b)) if (code && b[k] === code) b[k] = '';
  b[target] = code;
}

function render() {
  const sel = document.getElementById('preset');
  sel.innerHTML = '';
  for (const name of Object.keys(state.presets)) sel.add(new Option(name, name, false, name === state.active));
  sel.onchange = () => { state.active = sel.value; save(); render(); };
  document.getElementById('delete').disabled = Object.keys(state.presets).length <= 1;
  document.getElementById('reset').textContent =
    KBPAD_BUILTIN[state.active] ? `Restaurar "${state.active}" de fábrica` : 'Restaurar padrão';

  const tbody = document.getElementById('bindings');
  tbody.innerHTML = '';
  for (const [key, name] of KBPAD_TARGETS) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${name}</td><td><button class="bind" data-target="${key}"></button></td>`;
    tbody.appendChild(tr);
  }
  document.querySelectorAll('button.bind').forEach((btn) => {
    btn.textContent = label(getBinding(btn.dataset.target));
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
    el.value = cfg()[id];
    document.getElementById(id + '-v').textContent = cfg()[id];
    el.oninput = () => {
      cfg()[id] = Number(el.value);
      document.getElementById(id + '-v').textContent = el.value;
      save();
    };
  }
  const inv = document.getElementById('invertY');
  inv.checked = cfg().invertY;
  inv.onchange = () => { cfg().invertY = inv.checked; save(); };
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

document.getElementById('new').onclick = () => {
  const name = prompt('Nome do novo preset (copia o atual):', state.active + ' (meu)');
  if (!name || state.presets[name]) return;
  state.presets[name] = structuredClone(cfg());
  state.active = name;
  save();
  render();
};

document.getElementById('rename').onclick = () => {
  const name = prompt('Novo nome:', state.active);
  if (!name || name === state.active || state.presets[name]) return;
  state.presets[name] = cfg();
  delete state.presets[state.active];
  state.active = name;
  save();
  render();
};

document.getElementById('delete').onclick = () => {
  if (!confirm(`Excluir o preset "${state.active}"?`)) return;
  delete state.presets[state.active];
  state.active = Object.keys(state.presets)[0];
  save();
  render();
};

document.getElementById('reset').onclick = () => {
  state.presets[state.active] = structuredClone(KBPAD_BUILTIN[state.active] || KBPAD_BUILTIN['Padrão']);
  save();
  render();
};

kbpadLoad().then((s) => {
  state = s;
  render();
});
