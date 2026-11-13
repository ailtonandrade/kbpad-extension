const KBPAD_TARGETS = [
  ['A', 'A'], ['B', 'B'], ['X', 'X'], ['Y', 'Y'],
  ['LB', 'LB'], ['RB', 'RB'], ['LT', 'LT'], ['RT', 'RT'],
  ['Back', 'Back / View'], ['Start', 'Start / Menu'],
  ['L3', 'L3 (clique analógico esq.)'], ['R3', 'R3 (clique analógico dir.)'],
  ['Up', 'D-pad cima'], ['Down', 'D-pad baixo'], ['Left', 'D-pad esquerda'], ['Right', 'D-pad direita'],
  ['Home', 'Home / Guide'],
  ['LSUp', 'Analógico esq. cima'], ['LSDown', 'Analógico esq. baixo'],
  ['LSLeft', 'Analógico esq. esquerda'], ['LSRight', 'Analógico esq. direita']
];

const KBPAD_DEFAULTS = {
  toggleKey: 'F8',
  sensitivity: 12,
  deadzone: 18,
  smoothing: 40,
  invertY: false,
  bindings: {
    A: 'Space', B: 'KeyC', X: 'KeyR', Y: 'Digit1',
    LB: 'KeyQ', RB: 'KeyE', LT: 'Mouse2', RT: 'Mouse0',
    Back: 'Tab', Start: 'Enter',
    L3: 'ShiftLeft', R3: 'KeyV',
    Up: 'ArrowUp', Down: 'ArrowDown', Left: 'ArrowLeft', Right: 'ArrowRight',
    Home: 'KeyH',
    LSUp: 'KeyW', LSDown: 'KeyS', LSLeft: 'KeyA', LSRight: 'KeyD'
  }
};

function kbpadMerge(stored) {
  return {
    ...KBPAD_DEFAULTS,
    ...stored,
    bindings: { ...KBPAD_DEFAULTS.bindings, ...(stored && stored.bindings) }
  };
}

const kbpadPreset = (bindings, extra = {}) => ({ ...kbpadMerge({ ...extra, bindings }), toggleKey: undefined });

// Mapeamentos seguem os atalhos padrão de PC de cada jogo, traduzidos para o botão equivalente no controle.
const KBPAD_BUILTIN = {
  'Padrão': kbpadPreset({}),
  'GTA V': kbpadPreset({
    A: 'ShiftLeft', X: 'Space', B: 'KeyR', Y: 'KeyF',
    LB: 'Tab', RB: 'KeyQ', LT: 'Mouse2', RT: 'Mouse0',
    L3: 'ControlLeft', R3: 'KeyC', Back: 'KeyV', Start: 'Enter',
    Up: 'ArrowUp', Down: 'ArrowDown', Left: 'ArrowLeft', Right: 'ArrowRight', Home: 'KeyH'
  }, { alt: 'GTA V (veículos)' }),
  'GTA V (veículos)': kbpadPreset({
    RT: 'KeyW', LT: 'KeyS', LSUp: '', LSDown: '', LSLeft: 'KeyA', LSRight: 'KeyD',
    RB: 'Space', LB: 'Mouse2', Y: 'KeyF', L3: 'KeyE', R3: 'KeyC', Back: 'KeyV',
    A: 'ShiftLeft', X: 'KeyX', B: 'KeyR', Start: 'Enter',
    Up: 'ArrowUp', Down: 'ArrowDown', Left: 'ArrowLeft', Right: 'ArrowRight', Home: 'KeyH'
  }, { alt: 'GTA V' }),
  'Forza Horizon': kbpadPreset({
    RT: 'KeyW', LT: 'KeyS', LSUp: '', LSDown: '', LSLeft: 'KeyA', LSRight: 'KeyD',
    A: 'Space', Y: 'KeyR', B: 'KeyE', X: 'KeyQ',
    RB: 'KeyC', LB: 'ShiftLeft', L3: 'KeyH', R3: 'KeyX',
    Back: 'Tab', Start: 'Enter',
    Up: 'ArrowUp', Down: 'ArrowDown', Left: 'ArrowLeft', Right: 'ArrowRight', Home: ''
  }, { sensitivity: 8, smoothing: 60 }),
  'Skyrim': kbpadPreset({
    A: 'KeyE', B: 'Tab', X: 'KeyR', Y: 'Space',
    LB: 'ShiftLeft', RB: 'KeyZ', LT: 'Mouse2', RT: 'Mouse0',
    L3: 'ControlLeft', R3: 'KeyF', Back: 'KeyT', Start: 'Enter',
    Up: 'KeyQ', Down: 'ArrowDown', Left: 'ArrowLeft', Right: 'ArrowRight', Home: 'KeyH'
  }),
  'EA FC / FIFA': kbpadPreset({
    A: 'KeyK', B: 'KeyL', X: 'KeyJ', Y: 'KeyI',
    LB: 'KeyQ', RB: 'KeyE', LT: 'Space', RT: 'ShiftLeft',
    L3: 'KeyC', R3: 'KeyV', Back: 'Tab', Start: 'Enter',
    Up: 'ArrowUp', Down: 'ArrowDown', Left: 'ArrowLeft', Right: 'ArrowRight', Home: 'KeyH'
  }),
  'Crimson Desert': kbpadPreset({
    A: 'Space', B: 'ShiftLeft', X: 'KeyF', Y: 'KeyR',
    LB: 'KeyQ', RB: 'Mouse0', LT: 'Mouse2', RT: 'KeyE',
    L3: 'ControlLeft', R3: 'KeyC', Back: 'Tab', Start: 'Enter',
    Up: 'Digit1', Down: 'Digit2', Left: 'Digit3', Right: 'Digit4', Home: 'KeyH'
  })
};

const KBPAD_BUILTIN_VERSION = 2;

async function kbpadLoad() {
  const s = await chrome.storage.sync.get(['presets', 'active', 'toggleKey', 'switchKey', 'builtinVersion', 'config']);
  const presets = s.presets || structuredClone(KBPAD_BUILTIN);
  if (s.config && !s.presets) presets['Meu (antigo)'] = kbpadMerge(s.config);
  if (s.presets && (s.builtinVersion || 1) < 2) {
    presets['GTA V (veículos)'] ??= structuredClone(KBPAD_BUILTIN['GTA V (veículos)']);
    if (presets['GTA V'] && !presets['GTA V'].alt) presets['GTA V'].alt = 'GTA V (veículos)';
  }
  const active = presets[s.active] ? s.active : 'Padrão';
  return {
    presets,
    active,
    toggleKey: s.toggleKey || (s.config && s.config.toggleKey) || KBPAD_DEFAULTS.toggleKey,
    switchKey: s.switchKey || 'F9'
  };
}
