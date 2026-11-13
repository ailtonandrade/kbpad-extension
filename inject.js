(() => {
  const BUTTONS = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Back', 'Start', 'L3', 'R3', 'Up', 'Down', 'Left', 'Right', 'Home'];
  const PAD_ID = 'Xbox 360 Controller (XInput STANDARD GAMEPAD)';

  let cfg = null;
  let enabled = false;
  let mapped = new Set();
  const down = new Set();
  let mdx = 0, mdy = 0, rx = 0, ry = 0;
  const state = {
    buttons: BUTTONS.map(() => false),
    axes: [0, 0, 0, 0],
    timestamp: performance.now()
  };

  const def = (obj, props) => {
    for (const [k, v] of Object.entries(props)) {
      Object.defineProperty(obj, k, { value: v, enumerable: true });
    }
    return obj;
  };

  // Alguns sites checam instanceof Gamepad; propriedades próprias sombreiam os getters do protótipo.
  function snapshot() {
    const buttons = state.buttons.map((p) =>
      def(Object.create(GamepadButton.prototype), { pressed: p, touched: p, value: p ? 1 : 0 })
    );
    return def(Object.create(Gamepad.prototype), {
      id: PAD_ID,
      index: 0,
      connected: true,
      mapping: 'standard',
      timestamp: state.timestamp,
      axes: Object.freeze(state.axes.slice()),
      buttons: Object.freeze(buttons),
      vibrationActuator: null,
      hapticActuators: []
    });
  }

  const origGetGamepads = Navigator.prototype.getGamepads;
  Object.defineProperty(Navigator.prototype, 'getGamepads', {
    configurable: true,
    writable: true,
    value: function getGamepads() {
      if (!enabled) return origGetGamepads.call(this);
      return [snapshot(), null, null, null];
    }
  });

  function fireGamepadEvent(type) {
    const ev = new Event(type);
    Object.defineProperty(ev, 'gamepad', { value: snapshot() });
    window.dispatchEvent(ev);
  }

  let hud, hudTimer;
  const fmt = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

  function showHud(text) {
    if (!document.body) return;
    if (!hud) {
      hud = document.createElement('div');
      hud.style.cssText =
        'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:2147483647;' +
        'background:rgba(0,0,0,.8);color:#fff;font:600 14px system-ui,sans-serif;' +
        'padding:8px 14px;border-radius:8px;pointer-events:none;transition:opacity .3s';
    }
    (document.fullscreenElement || document.body).appendChild(hud);
    hud.textContent = text;
    hud.style.opacity = '1';
    clearTimeout(hudTimer);
    hudTimer = setTimeout(() => (hud.style.opacity = '0'), 2500);
  }

  function setEnabled(on) {
    if (on === enabled) return;
    enabled = on;
    down.clear();
    mdx = mdy = rx = ry = 0;
    window.postMessage({ __kbpad: 'state', enabled: on }, '*');
    if (on) {
      fireGamepadEvent('gamepadconnected');
      showHud(fmt(cfg.msgs.hudOn, { name: cfg.presetName, key: cfg.toggleKey }));
    } else {
      if (document.pointerLockElement) document.exitPointerLock();
      fireGamepadEvent('gamepaddisconnected');
      showHud(fmt(cfg.msgs.hudOff, { key: cfg.toggleKey }));
    }
  }

  function applyConfig(next) {
    cfg = next;
    if (next.announce && enabled) {
      down.clear();
      showHud(`🔁 ${next.presetName}`);
    }
    mapped = new Set(Object.values(cfg.bindings).filter(Boolean));
  }

  const swallow = (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  window.addEventListener('keydown', (e) => {
    if (!cfg) return;
    if (e.code === cfg.toggleKey) {
      swallow(e);
      if (!e.repeat) setEnabled(!enabled);
      return;
    }
    if (enabled && e.code === cfg.switchKey) {
      swallow(e);
      if (e.repeat) return;
      if (cfg.altName) window.postMessage({ __kbpad: 'switch' }, '*');
      else showHud(fmt(cfg.msgs.hudNoAlt, { name: cfg.presetName }));
      return;
    }
    if (enabled && mapped.has(e.code)) {
      down.add(e.code);
      swallow(e);
    }
  }, true);

  window.addEventListener('keyup', (e) => {
    if (!cfg) return;
    if (e.code === cfg.toggleKey || (enabled && (e.code === cfg.switchKey || mapped.has(e.code)))) {
      down.delete(e.code);
      swallow(e);
    }
  }, true);

  window.addEventListener('mousedown', (e) => {
    if (!enabled) return;
    if (!document.pointerLockElement) {
      const target = document.fullscreenElement || document.documentElement;
      const p = target.requestPointerLock();
      if (p && p.catch) p.catch(() => {});
    }
    const code = 'Mouse' + e.button;
    if (mapped.has(code)) {
      down.add(code);
      swallow(e);
    }
  }, true);

  window.addEventListener('mouseup', (e) => {
    if (!enabled) return;
    const code = 'Mouse' + e.button;
    if (mapped.has(code)) {
      down.delete(code);
      swallow(e);
    }
  }, true);

  window.addEventListener('mousemove', (e) => {
    if (enabled && document.pointerLockElement) {
      mdx += e.movementX;
      mdy += e.movementY;
    }
  }, true);

  window.addEventListener('contextmenu', (e) => { if (enabled) swallow(e); }, true);
  window.addEventListener('blur', () => down.clear());

  const shape = (v) => {
    const m = Math.abs(v);
    if (m < 0.001) return 0;
    return Math.sign(v) * Math.min(1, cfg.deadzone / 100 + m);
  };

  function frame() {
    if (enabled && cfg) {
      const b = cfg.bindings;
      const is = (t) => down.has(b[t]);
      state.buttons = BUTTONS.map(is);

      let lx = (is('LSRight') ? 1 : 0) - (is('LSLeft') ? 1 : 0);
      let ly = (is('LSDown') ? 1 : 0) - (is('LSUp') ? 1 : 0);
      if (lx && ly) { lx *= Math.SQRT1_2; ly *= Math.SQRT1_2; }

      const s = cfg.sensitivity / 100;
      const tx = shape(mdx * s);
      const ty = shape(mdy * s * (cfg.invertY ? -1 : 1));
      mdx = mdy = 0;
      const k = 1 - Math.min(cfg.smoothing, 95) / 100;
      rx += (tx - rx) * k;
      ry += (ty - ry) * k;
      if (Math.abs(rx) < 0.01) rx = 0;
      if (Math.abs(ry) < 0.01) ry = 0;

      state.axes = [lx, ly, rx, ry];
      state.timestamp = performance.now();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  window.addEventListener('message', (e) => {
    if (e.source === window && e.data && e.data.__kbpad === 'config') applyConfig(e.data.cfg);
  });
  window.postMessage({ __kbpad: 'ready' }, '*');
})();
