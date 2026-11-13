const KBPAD_I18N = {
  pt: {
    langName: 'Português (Brasil)',
    title: 'KB Pad: teclado e mouse como controle',
    intro: 'Na página do jogo, aperte a tecla de ligar e clique na tela para capturar o mouse; ele vira o analógico direito. Para mapear, clique num botão e aperte a tecla ou o botão do mouse. Esc cancela, Backspace limpa.',
    language: 'Idioma',
    presetSection: 'Preset do jogo',
    newPreset: 'Novo (cópia)',
    rename: 'Renomear',
    delete: 'Excluir',
    quickSwitchTo: 'Troca rápida para',
    presetHint: 'O preset selecionado é o que vale no jogo. Com o KB Pad ligado, a tecla de troca rápida alterna entre ele e o preset de troca (ex.: a pé ↔ veículos). Ao trocar o preset principal aqui, recarregue (F5) a aba do jogo para ele valer; a troca rápida funciona na hora.',
    general: 'Geral',
    toggle: 'Liga/desliga',
    quickSwitchKey: 'Troca rápida de preset',
    sensitivity: 'Sensibilidade do mouse',
    deadzone: 'Saída mínima (vence a zona morta do jogo)',
    smoothing: 'Suavização',
    invertY: 'Inverter eixo Y',
    mapping: 'Mapeamento',
    none: '— nenhum —',
    pressKey: 'Aperte uma tecla…',
    saved: 'Salvo',
    error: 'Erro: ',
    resetDefault: 'Restaurar padrão',
    resetBuiltin: 'Restaurar "{name}" de fábrica',
    newPrompt: 'Nome do novo preset (copia o atual):',
    mineSuffix: ' (meu)',
    renamePrompt: 'Novo nome:',
    deleteConfirm: 'Excluir o preset "{name}"?',
    hudOn: '🎮 KB Pad LIGADO — {name} — clique na tela para capturar o mouse ({key} desliga)',
    hudOff: 'KB Pad desligado ({key} liga)',
    hudNoAlt: '"{name}" não tem preset de troca rápida',
    targets: {
      Back: 'Back / View', Start: 'Start / Menu',
      L3: 'L3 (clique analógico esq.)', R3: 'R3 (clique analógico dir.)',
      Up: 'D-pad cima', Down: 'D-pad baixo', Left: 'D-pad esquerda', Right: 'D-pad direita',
      Home: 'Home / Guide',
      LSUp: 'Analógico esq. cima', LSDown: 'Analógico esq. baixo',
      LSLeft: 'Analógico esq. esquerda', LSRight: 'Analógico esq. direita'
    },
    keys: {
      Mouse0: 'Mouse esquerdo', Mouse1: 'Mouse meio', Mouse2: 'Mouse direito', Mouse3: 'Mouse voltar', Mouse4: 'Mouse avançar',
      Space: 'Espaço', ShiftLeft: 'Shift esq.', ShiftRight: 'Shift dir.', ControlLeft: 'Ctrl esq.', ControlRight: 'Ctrl dir.',
      AltLeft: 'Alt esq.', AltRight: 'Alt dir.'
    },
    presets: {}
  },
  en: {
    langName: 'English',
    title: 'KB Pad: keyboard and mouse as a controller',
    intro: 'On the game page, press the toggle key and click the screen to capture the mouse; it becomes the right stick. To map, click a button and press the key or mouse button. Esc cancels, Backspace clears.',
    language: 'Language',
    presetSection: 'Game preset',
    newPreset: 'New (copy)',
    rename: 'Rename',
    delete: 'Delete',
    quickSwitchTo: 'Quick switch to',
    presetHint: 'The selected preset is the one used in game. With KB Pad on, the quick switch key toggles between it and its switch preset (e.g. on foot ↔ vehicles). After changing the main preset here, reload (F5) the game tab for it to apply; quick switching works instantly.',
    general: 'General',
    toggle: 'On/off',
    quickSwitchKey: 'Quick preset switch',
    sensitivity: 'Mouse sensitivity',
    deadzone: 'Minimum output (beats the game deadzone)',
    smoothing: 'Smoothing',
    invertY: 'Invert Y axis',
    mapping: 'Mapping',
    none: '— none —',
    pressKey: 'Press a key…',
    saved: 'Saved',
    error: 'Error: ',
    resetDefault: 'Restore default',
    resetBuiltin: 'Restore built-in "{name}"',
    newPrompt: 'New preset name (copies the current one):',
    mineSuffix: ' (mine)',
    renamePrompt: 'New name:',
    deleteConfirm: 'Delete preset "{name}"?',
    hudOn: '🎮 KB Pad ON — {name} — click the screen to capture the mouse ({key} turns off)',
    hudOff: 'KB Pad off ({key} turns on)',
    hudNoAlt: '"{name}" has no quick switch preset',
    targets: {
      Back: 'Back / View', Start: 'Start / Menu',
      L3: 'L3 (left stick click)', R3: 'R3 (right stick click)',
      Up: 'D-pad up', Down: 'D-pad down', Left: 'D-pad left', Right: 'D-pad right',
      Home: 'Home / Guide',
      LSUp: 'Left stick up', LSDown: 'Left stick down',
      LSLeft: 'Left stick left', LSRight: 'Left stick right'
    },
    keys: {
      Mouse0: 'Left mouse', Mouse1: 'Middle mouse', Mouse2: 'Right mouse', Mouse3: 'Mouse back', Mouse4: 'Mouse forward',
      Space: 'Space', ShiftLeft: 'Left Shift', ShiftRight: 'Right Shift', ControlLeft: 'Left Ctrl', ControlRight: 'Right Ctrl',
      AltLeft: 'Left Alt', AltRight: 'Right Alt'
    },
    // Os nomes internos dos presets de fábrica são em português; aqui só muda o que aparece.
    presets: { 'Padrão': 'Default', 'GTA V (veículos)': 'GTA V (vehicles)', 'Meu (antigo)': 'Mine (old)' }
  }
};

const KBPAD_COMMON_KEYS = { ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', Backquote: "'", Quote: '~' };

function kbpadDefaultLang() {
  return (navigator.language || '').toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

function kbpadT(lang, key, vars = {}) {
  const dict = KBPAD_I18N[lang] || KBPAD_I18N.en;
  return String(dict[key] ?? KBPAD_I18N.pt[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
}

function kbpadPresetLabel(lang, name) {
  return (KBPAD_I18N[lang] || KBPAD_I18N.en).presets[name] || name;
}
