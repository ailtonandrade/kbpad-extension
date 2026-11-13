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
