let state = null;
let waiting = null;

const t = (key, vars) => kbpadT(state.lang, key, vars);
const dict = () => KBPAD_I18N[state.lang] || KBPAD_I18N.en;
const presetLabel = (name) => kbpadPresetLabel(state.lang, name);
const label = (code) =>
  !code ? t('none') : dict().keys[code] || KBPAD_COMMON_KEYS[code] || code.replace(/^Key|^Digit|^Numpad/, '');
const cfg = () => state.presets[state.active];

function save() {
  chrome.storage.sync.set({ presets: state.presets, active: state.active, toggleKey: state.toggleKey, switchKey: state.switchKey, lang: state.lang, builtinVersion: KBPAD_BUILTIN_VERSION }, () => {
    const s = document.getElementById('status');
    s.textContent = chrome.runtime.lastError ? t('error') + chrome.runtime.lastError.message : t('saved');
    setTimeout(() => (s.textContent = ''), 1500);
  });
}

function getBinding(target) {
  if (target === '__toggle') return state.toggleKey;
  if (target === '__switch') return state.switchKey;
  return cfg().bindings[target];
}

function setBinding(target, code) {
  if (target === '__toggle' || target === '__switch') {
    if (code) state[target === '__toggle' ? 'toggleKey' : 'switchKey'] = code;
    return;
  }
  const b = cfg().bindings;
  for (const k of Object.keys(b)) if (code && b[k] === code) b[k] = '';
  b[target] = code;
}

function render() {
  document.documentElement.lang = state.lang === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  const lang = document.getElementById('lang');
  lang.innerHTML = '';
  for (const code of Object.keys(KBPAD_I18N)) lang.add(new Option(KBPAD_I18N[code].langName, code, false, code === state.lang));
  lang.onchange = () => { state.lang = lang.value; save(); render(); };

  const sel = document.getElementById('preset');
  sel.innerHTML = '';
  for (const name of Object.keys(state.presets)) sel.add(new Option(presetLabel(name), name, false, name === state.active));
  sel.onchange = () => { state.active = sel.value; save(); render(); };
  const alt = document.getElementById('alt');
  alt.innerHTML = '';
  alt.add(new Option(t('none'), ''));
  for (const name of Object.keys(state.presets)) {
    if (name !== state.active) alt.add(new Option(presetLabel(name), name, false, name === cfg().alt));
  }
  alt.onchange = () => { cfg().alt = alt.value; save(); };
  document.getElementById('delete').disabled = Object.keys(state.presets).length <= 1;
  document.getElementById('reset').textContent =
    KBPAD_BUILTIN[state.active] ? t('resetBuiltin', { name: presetLabel(state.active) }) : t('resetDefault');

  const list = document.getElementById('bindings');
  list.innerHTML = '';
  for (const [key, name] of KBPAD_TARGETS) {
    const div = document.createElement('div');
    div.className = 'pair';
    div.innerHTML = `<span>${dict().targets[key] || name}</span><button class="bind" data-target="${key}"></button>`;
    list.appendChild(div);
  }
  document.querySelectorAll('button.bind').forEach((btn) => {
    btn.textContent = label(getBinding(btn.dataset.target));
    btn.onclick = (e) => {
      e.stopPropagation();
      if (waiting) return;
      waiting = btn.dataset.target;
      btn.textContent = t('pressKey');
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
  const name = prompt(t('newPrompt'), presetLabel(state.active) + t('mineSuffix'));
  if (!name || state.presets[name]) return;
  state.presets[name] = structuredClone(cfg());
  state.active = name;
  save();
  render();
};

document.getElementById('rename').onclick = () => {
  const name = prompt(t('renamePrompt'), presetLabel(state.active));
  if (!name || name === state.active || state.presets[name]) return;
  state.presets[name] = cfg();
  delete state.presets[state.active];
  for (const p of Object.values(state.presets)) if (p.alt === state.active) p.alt = name;
  state.active = name;
  save();
  render();
};

document.getElementById('delete').onclick = () => {
  if (!confirm(t('deleteConfirm', { name: presetLabel(state.active) }))) return;
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
