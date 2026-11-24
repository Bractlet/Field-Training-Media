// IAQ tutorial — the composition. All choreography keyed to T and CUES.
const ORDER = ['Intro', 'Purpose', 'Unbox', 'Kit', 'Flow', 'OpenForm', 'Outdoor', 'CO2Setup', 'LightSetup', 'Spaces', 'VConfig', 'VCapture', 'VRecord', 'Horizontal', 'AirSetup', 'AirRecord', 'Submit', 'Outro', 'Return'];

const IxCtx = React.createContext(null);
function useCue() {
  const { T: hostT, CUES, authoredTotal } = useComposition();
  const ix = React.useContext(IxCtx);
  const T = ix ? ix.T : hostT;
  const at = (s, o = 0) => CUES[s] + o;
  const end = (s) => { const i = ORDER.indexOf(s); return i < ORDER.length - 1 ? CUES[ORDER[i + 1]] : authoredTotal; };
  return { T, CUES, at, end };
}
window.useCue = useCue;
const typ = (T, a, b, s) => T < a ? '' : s.slice(0, Math.ceil(clamp((T - a) / (b - a), 0, 1) * s.length));
const hlr = (T, a, b) => T >= a && T < b;
const pressAt = (T, list) => { for (let i = list.length - 1; i >= 0; i--) { const [t, id] = list[i]; if (T >= t && T < t + 0.7) return { press: id, pressK: (T - t) / 0.7 }; } return { press: null, pressK: 0 }; };

function TopBar() {
  const { T, at } = useCue();
  const op = MOTION.enter(T, at('Unbox', -0.4), 0.6);
  let cur = -1; PHASES.forEach(([, s], i) => { if (T >= at(s)) cur = i; });
  return (
    <div style={{ position: 'absolute', left: 120, right: 120, top: 48, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: op }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <span style={{ font: `700 30px ${F.brand}`, color: C.teal }}>Backpack</span>
        <span style={{ font: `500 24px ${F.brand}`, color: C.g5 }}>IAQ Field Data Collection</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {PHASES.map(([label], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {i > 0 && <div style={{ width: 24, height: 2, background: i <= cur ? C.teal : C.border }} />}
            <div style={{ padding: '8px 16px', borderRadius: 999, font: `600 20px ${F.brand}`,
              background: i === cur ? C.navy : i < cur ? C.clear : C.white, color: i === cur ? C.white : i < cur ? C.teal : C.g3,
              border: `1.5px solid ${i === cur ? C.navy : i < cur ? '#bfe9e4' : C.border}` }}>{i < cur ? '✓ ' : ''}{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoopRow({ times, big = false }) {
  const { T } = useCue();
  let act = -1; times.forEach((t, i) => { if (T >= t) act = i; });
  const fs = big ? 30 : 24;
  return (
    <div style={{ display: 'flex', flexDirection: big ? 'column' : 'row', alignItems: big ? 'stretch' : 'center', gap: big ? 14 : 10, flexWrap: 'wrap' }}>
      {LOOP_STEPS.map((s, i) => {
        const on = i === act, done = i < act;
        const k = on ? MOTION.pop(T, times[i], 0.45) : 1;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: big ? '16px 22px' : '10px 16px', borderRadius: 10,
            background: on ? C.navy : done ? C.clear : C.white, color: on ? C.white : done ? C.teal : C.g3, border: `1.5px solid ${on ? C.navy : done ? '#bfe9e4' : C.border}`,
            transform: `scale(${on ? 0.92 + 0.08 * k : 1})`, transformOrigin: 'left center', font: `600 ${fs}px ${F.brand}` }}>
            <span style={{ width: fs * 1.3, height: fs * 1.3, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              background: on ? C.mint : done ? C.teal : C.fog, color: on ? C.navy : done ? C.white : C.g5, font: `700 ${fs * 0.7}px ${F.data}` }}>{done ? '✓' : i + 1}</span>
            {s}
          </div>
        );
      })}
    </div>
  );
}

function LeftBlocks() {
  const { T, at, end } = useCue();
  return BLOCKS.map((bk, bi) => {
    const a = at(bk.s), b = end(bk.s);
    const op = win(T, a, b, 0.45);
    if (op <= 0) return null;
    const dy = (1 - MOTION.enter(T, a, 0.6)) * 30;
    const shown = (bk.b || []).filter(([o]) => T >= a + o);
    return (
      <div key={bi} style={{ position: 'absolute', left: 120, top: 170, width: 720, opacity: op, transform: `translateY(${dy}px)`, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ font: `600 24px ${F.brand}`, letterSpacing: 2, textTransform: 'uppercase', color: C.teal }}>{bk.eb}</div>
        <div style={{ font: `700 60px/1.08 ${F.brand}`, color: C.navy, letterSpacing: -1, textWrap: 'pretty' }}>{bk.title}</div>
        <div style={{ height: 14 }} />
        {bk.loop && <LoopRow times={bk.loop.map(o => a + o)} big />}
        {(bk.b || []).map(([o, txt], i) => {
          const k = MOTION.enter(T, a + o, 0.5);
          if (k <= 0) return null;
          const cur = i === shown.length - 1;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: k, transform: `translateX(${(1 - k) * -24}px)`, font: `500 34px ${F.brand}`, color: cur ? C.navy : C.g5 }}>
              <span style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: cur ? C.mint : C.clear, color: cur ? C.navy : C.teal, font: `700 20px ${F.data}` }}>{cur ? i + 1 : '✓'}</span>
              {txt}
            </div>
          );
        })}
      </div>
    );
  });
}

function Cards() {
  const { T, at } = useCue();
  const st = {
    tip: { label: 'Tip', bg: C.clear, fg: C.teal, icon: 'i' },
    mistake: { label: 'Common mistake', bg: C.redWash, fg: '#b3302f', icon: '✕' },
    quote: { label: 'If someone asks', bg: '#fdeee7', fg: '#b4532c', icon: '“' },
    loop: { label: 'Record it', bg: C.clear, fg: C.teal, icon: '↻' },
  };
  return CARDS.map((c, i) => {
    const a = at(c.s, c.at), b = at(c.s, c.to);
    const op = win(T, a, b, 0.35);
    if (op <= 0) return null;
    const k = MOTION.pop(T, a, 0.5), s = st[c.kind];
    return (
      <div key={i} style={{ position: 'absolute', left: 120, top: 710, width: 720, opacity: op, transform: `scale(${0.9 + 0.1 * k})`, transformOrigin: 'left top',
        background: C.white, borderRadius: 14, border: `1.5px solid ${C.border}`, boxShadow: '0 10px 30px rgba(0,29,35,.10)', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 34, height: 34, borderRadius: '50%', background: s.fg, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `700 20px ${F.data}` }}>{s.icon}</span>
          <span style={{ padding: '4px 12px', borderRadius: 6, background: s.bg, color: s.fg, font: `700 22px ${F.brand}`, letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</span>
        </div>
        {c.kind === 'loop' ? <LoopRow times={c.loop.map(o => at(c.s, o))} /> :
          <div style={{ font: `${c.kind === 'quote' ? 'italic 500' : '500'} 30px/1.3 ${F.brand}`, color: C.navy, textWrap: 'pretty' }}>{c.text}</div>}
      </div>
    );
  });
}

function Intro() {
  const { T, at } = useCue();
  const bgOp = 1 - MOTION.enter(T, at('Purpose', -0.6), 0.7);
  if (bgOp <= 0) return null;
  const k = MOTION.enter(T, 0.2, 0.9), k2 = MOTION.enter(T, 0.8, 0.9);
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.navy, opacity: bgOp }}>
      <div style={{ position: 'absolute', left: 120, top: 330, width: 820, display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div style={{ font: `600 26px ${F.brand}`, letterSpacing: 3, textTransform: 'uppercase', color: C.mint, opacity: k }}>Backpack · Field Tech Training</div>
        <div style={{ font: `700 104px/1.0 ${F.brand}`, color: C.white, letterSpacing: -2, opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>IAQ Field Data Collection</div>
        <div style={{ font: `400 36px/1.35 ${F.brand}`, color: '#bcd3d3', opacity: k2, transform: `translateY(${(1 - k2) * 20}px)` }}>Setting up the kit, taking readings, and filling out the form.</div>
      </div>
    </div>
  );
}

function KitPhotos() {
  const { T, at } = useCue();
  const m = MOTION.draw(T, at('Kit', -0.6), 1.1);
  const op = Math.max(MOTION.enter(T, 0.6, 0.8) * (1 - MOTION.enter(T, at('Purpose', -0.6), 0.6)), MOTION.enter(T, at('Kit', -0.8), 0.6)) * (1 - MOTION.enter(T, at('Flow', 0), 0.6));
  if (op <= 0) return null;
  const zoom = 1.04 + 0.1 * clamp(T / at('Flow'), 0, 1);
  const card = (src, pos, a, b, label, sub, lk) => {
    const x = lerp(a.x, b.x, m), y = lerp(a.y, b.y, m), w = lerp(a.w, b.w, m), h = lerp(a.h, b.h, m), r = lerp(a.r, 0, m);
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: w, transform: `rotate(${r}deg)`, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: w, height: h, borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,.30)', background: '#6b5640' }}>
          <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${zoom})` }} />
        </div>
        <div style={{ opacity: MOTION.enter(T, at('Kit', lk), 0.5), display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ font: `700 30px ${F.brand}`, color: C.navy }}>{label}</div>
          <div style={{ font: `500 24px ${F.brand}`, color: C.g5 }}>{sub}</div>
        </div>
      </div>
    );
  };
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op }}>
      {card('assets/co2-meter.jpg', '82% 40%', { x: 1050, y: 150, w: 360, h: 520, r: -5 }, { x: 900, y: 170, w: 420, h: 600 }, 'AZ 7755', 'CO2 · Temp · Humidity', 2.3)}
      {card('assets/light-meter.jpg', '12% 45%', { x: 1400, y: 300, w: 360, h: 520, r: 5 }, { x: 1380, y: 170, w: 420, h: 600 }, 'MT-912', 'Light meter', 6.1)}
    </div>
  );
}

function FlowGraphic() {
  const { T, at, end } = useCue();
  const op = win(T, at('Flow', 0.3), end('Flow'), 0.45);
  if (op <= 0) return null;
  const steps = [['Configure', 'Set modes and units'], ['Capture', 'Freeze it with HOLD'], ['Record', 'Photo + typed value']];
  return (
    <div style={{ position: 'absolute', left: 920, top: 230, width: 880, opacity: op, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 20 }}>
        {steps.map(([h, s], i) => {
          const k = MOTION.pop(T, at('Flow', [2.2, 3.0, 3.6][i]), 0.5);
          return (
            <div key={i} style={{ background: i === 2 ? C.navy : C.white, color: i === 2 ? C.white : C.navy, borderRadius: 16, padding: '28px 24px', border: `1.5px solid ${i === 2 ? C.navy : C.border}`,
              boxShadow: '0 10px 30px rgba(0,29,35,.10)', opacity: clamp(k, 0, 1), transform: `scale(${0.85 + 0.15 * k})`, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ font: `900 56px ${F.data}`, color: C.mint }}>{i + 1}</div>
              <div style={{ font: `700 36px ${F.brand}` }}>{h}</div>
              <div style={{ font: `500 24px/1.3 ${F.brand}`, color: i === 2 ? '#bcd3d3' : C.g5 }}>{s}</div>
            </div>
          );
        })}
      </div>
      <div style={{ opacity: MOTION.enter(T, at('Flow', 4.84), 0.6), display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ font: `600 24px ${F.brand}`, letterSpacing: 2, textTransform: 'uppercase', color: C.teal }}>Every reading, every time</div>
        <LoopRow times={[5.6, 6.5, 7.5, 8.2].map(o => at('Flow', o))} />
      </div>
    </div>
  );
}

function Arrow({ label, dir = 'up', op }) {
  return <div style={{ display: 'flex', flexDirection: dir === 'up' ? 'column' : 'row', alignItems: 'center', gap: 8, opacity: op, color: C.teal, font: `700 26px ${F.brand}` }}>
    {dir === 'up' ? <><span>{label}</span><span style={{ fontSize: 44, lineHeight: 1 }}>↑</span></> : <><span style={{ fontSize: 44, lineHeight: 1 }}>→</span><span>{label}</span></>}
  </div>;
}

// Room cross-section (looking along your arm): where the sensor bulb points
function LightAim() {
  const { T, at } = useCue();
  const vOp = win(T, at('VCapture', 0), at('VCapture', 16.4), 0.5), hOp = win(T, at('Horizontal', 0), at('Horizontal', 9.6), 0.5);
  const op = Math.max(vOp, hOp);
  if (op <= 0) return null;
  const hz = T >= at('Horizontal', -1);
  const W = 450, H = 470, FX = 150, my = 300;
  const mx = hz ? 300 : lerp(300, FX, MOTION.draw(T, at('VCapture', 11.4), 0.9) - MOTION.draw(T, at('VCapture', 13.8), 1.1));
  const roll = hz ? -90 * MOTION.draw(T, at('Horizontal', 2.6), 1.2) : 0;
  const coneK = hz ? 1 : MOTION.enter(T, at('VCapture', 8.4), 0.6);
  const bad = hz ? 0 : win(T, at('VCapture', 12.3), at('VCapture', 13.9), 0.3);
  const good = hz ? 0 : MOTION.enter(T, at('VCapture', 14.8), 0.4);
  const center = hz ? 0 : win(T, at('VCapture', 3.9), at('VCapture', 11.2), 0.4);
  const across = hz ? MOTION.enter(T, at('Horizontal', 5.2), 0.5) : 0;
  const cc = bad > 0.5 ? '217,75,75' : '0,200,181';
  const dy = (1 - MOTION.enter(T, at(hz ? 'Horizontal' : 'VCapture', 0), 0.6)) * 30;
  const tag = (bg, txt, pos, o) => <div style={{ position: 'absolute', ...pos, opacity: o, background: bg, color: C.white, borderRadius: 999, padding: '6px 16px', font: `700 22px ${F.brand}`, whiteSpace: 'nowrap' }}>{txt}</div>;
  const lab = (txt, pos) => <span style={{ position: 'absolute', ...pos, font: `600 15px ${F.brand}`, letterSpacing: 2, color: C.g5 }}>{txt}</span>;
  return (
    <div style={{ position: 'absolute', left: 890, top: 170, width: W, opacity: op, transform: `translateY(${dy}px)`, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ position: 'relative', width: W, height: H, borderRadius: 16, overflow: 'hidden', background: C.white, border: `1.5px solid ${C.border}`, boxShadow: '0 10px 30px rgba(0,29,35,.10)' }}>
        <div style={{ position: 'absolute', left: mx + 4, top: my + 12, width: 38, height: 260, background: C.navy, borderRadius: 19, transform: 'rotate(-28deg)', transformOrigin: 'top center' }} />
        <div style={{ position: 'absolute', left: mx, top: my, width: 0, height: 0, transform: `rotate(${roll}deg)` }}>
          <div style={{ position: 'absolute', left: -160, top: -440, width: 320, height: 400, opacity: coneK, clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
            background: `linear-gradient(to top, rgba(${cc},.55), rgba(${cc},.06))` }} />
          <div style={{ position: 'absolute', left: -28, top: -40, width: 56, height: 28, borderRadius: '28px 28px 0 0', background: 'radial-gradient(circle at 40% 80%, #ffffff, #e4e4e4 60%, #bdbdbd)', boxShadow: '0 0 0 2px #151515' }} />
          <div style={{ position: 'absolute', left: -38, top: -14, width: 76, height: 34, boxSizing: 'border-box', borderRadius: 10, background: '#f5c400', border: '5px solid #151515' }} />
          <div style={{ position: 'absolute', left: -46, top: 14, width: 92, height: 30, borderRadius: 15, background: '#d6a985' }} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 44, background: C.fog, borderBottom: '2px solid #d8d8d8' }} />
        <div style={{ position: 'absolute', left: FX - 90, top: 68, width: 180, height: 130, background: 'radial-gradient(ellipse at top, rgba(255,205,60,.55), rgba(255,205,60,0) 70%)' }} />
        <div style={{ position: 'absolute', left: FX - 2, top: 44, width: 4, height: 18, background: '#555' }} />
        <div style={{ position: 'absolute', left: FX - 50, top: 60, width: 100, height: 12, borderRadius: 3, background: '#3a3a3a' }} />
        <div style={{ position: 'absolute', left: 0, top: 46, bottom: 36, width: 22, background: '#e6e6e6' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 36, background: C.fog, borderTop: '2px solid #d8d8d8' }} />
        {lab('CEILING', { right: 16, top: 13 })}{lab('FLOOR', { right: 16, bottom: 9 })}
        {tag(C.red, '\u2715 Aimed at a light', { left: FX + 40, top: 84 }, bad)}
        {tag(C.teal, '\u2713 Bare ceiling', { left: 226, top: 64 }, good)}
        {tag(C.teal, '\u2713 Near the center of the room', { left: 70, top: 380 }, center)}
        {tag(C.teal, '\u2190 Looking across the space', { left: 40, top: 186 }, across)}
      </div>
      <div style={{ font: `700 34px ${F.brand}`, color: C.navy }}>{hz ? 'Bulb faces horizontally' : 'Bulb faces the ceiling'}</div>
      <div style={{ position: 'relative', width: W, height: 190, borderRadius: 14, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,29,35,.10)' }}>
        <img src={hz ? 'assets/form/lm-horizontal-hand.png' : 'assets/form/lm-vertical-hand.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <span style={{ position: 'absolute', left: 12, top: 12, background: 'rgba(0,29,35,.88)', color: C.white, borderRadius: 6, padding: '4px 10px', font: `600 17px ${F.brand}` }}>From the form</span>
      </div>
    </div>
  );
}

function Meters() {
  const { T, at } = useCue();
  // CO2 meter
  const co2Op = Math.max(win(T, at('Outdoor', 4.2), at('LightSetup', 1.6)), win(T, at('AirSetup', -0.2), at('Submit', 0.6)));
  const drop = T < at('LightSetup') ? MOTION.enter(T, at('Outdoor', 5), 0.8) : 1;
  const tripodOp = T < at('LightSetup') ? MOTION.enter(T, at('Outdoor', 4.2), 0.5) : 1;
  const countdown = T >= at('Outdoor', 7.5) && T < at('Outdoor', 12) ? Math.max(0, 10 - Math.floor((T - at('Outdoor', 7.5)) * 2.25)) : null;
  const jit = (base, amp, rate = 2) => Math.round(base + amp * Math.sin(Math.floor(T * rate) * 2.3));
  const indoor = T >= at('AirSetup', -1);
  const airHold = hlr(T, at('AirRecord', 2), at('AirRecord', 14.4));
  const co2Val = indoor ? (airHold || T >= at('AirRecord', 14.4) ? 815 : Math.round(lerp(962, 815, MOTION.draw(T, at('AirSetup', 5.5), 3.5))) + (T < at('AirSetup', 9) ? jit(0, 6) : 0))
    : Math.round(lerp(586, 421, MOTION.draw(T, at('CO2Setup', 9.4), 3))) + (T < at('CO2Setup', 11.9) ? jit(0, 5) : 0);
  const co2 = {
    on: T >= at('Outdoor', 7.3), countdown,
    hold: T < at('CO2Setup', 3.8) || airHold,
    co2: String(co2Val), temp: indoor ? '72.1' : '58.1', rh: indoor ? '63.2' : '41.0',
    ...pressAt(T, [[at('Outdoor', 7), 'set'], [at('CO2Setup', 3.6), 'hold'], [at('CO2Setup', 7.9), 'mode'], [at('AirRecord', 1.8), 'hold'], [at('AirRecord', 14.2), 'hold']]),
  };
  const ring5 = win(T, at('AirSetup', 3), at('AirRecord', 1), 0.5);
  const stable = indoor ? win(T, at('AirSetup', 9.2), at('AirRecord', 1.5)) : win(T, at('CO2Setup', 12.0), at('LightSetup', 1));
  // Light meter
  const aimOp = Math.max(win(T, at('VCapture', 0), at('VCapture', 16.4), 0.5), win(T, at('Horizontal', 0), at('Horizontal', 9.6), 0.5));
  const lightOp = Math.max(win(T, at('LightSetup', 0.8), at('Spaces', 0.5)), win(T, at('VConfig', -0.3), at('AirSetup', 0.3))) * (1 - aimOp);
  const lsIn = (1 - MOTION.enter(T, at('LightSetup', 0.8), 0.7)) * 120;
  const hz = T >= at('Horizontal', 0);
  const hold = hlr(T, at('VCapture', 17), at('VRecord', 11)) || hlr(T, at('Horizontal', 10.2), at('Horizontal', 17.2));
  const unit = T < at('LightSetup', 5) ? 'Lux' : 'Fc';
  const live = unit === 'Lux' ? String(248 + jit(0, 3)) : hz ? (hold || T >= at('Horizontal', 17.2) ? '22.4' : '22.' + Math.abs(jit(4, 1, 3))) : T < at('VCapture') ? '23.0' : (hold || T >= at('VRecord', 11) && T < at('Horizontal') ? '16.9' : '16.' + Math.abs(jit(8, 1, 3)));
  const lm = {
    capOn: T < at('LightSetup', 2), on: T >= at('LightSetup', 3), unit, value: live, hold,
    minmax: hlr(T, at('LightSetup', 3), at('LightSetup', 7.6)), tempMark: hlr(T, at('LightSetup', 10.6), at('LightSetup', 13.8)),
    ...pressAt(T, [[at('LightSetup', 2.8), 'power'], [at('LightSetup', 4.8), 'fc'], [at('LightSetup', 7.2), 'minmax'], [at('VCapture', 16.8), 'hold'], [at('VRecord', 10.8), 'hold'], [at('Horizontal', 10.0), 'hold'], [at('Horizontal', 17.0), 'hold']]),
  };
  return (
    <>
      <div style={{ position: 'absolute', left: 920, top: 200, width: 260, height: 860, opacity: co2Op, transform: 'scale(0.8)', transformOrigin: 'top center' }}>
        <div style={{ position: 'absolute', left: -150, top: 790, width: 560, height: 130, borderRadius: '50%', border: `4px dashed ${C.teal}`, opacity: ring5,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <span style={{ background: C.teal, color: C.white, font: `700 30px ${F.brand}`, padding: '4px 16px', borderRadius: 999, marginBottom: -24 }}>5 ft clear</span></div>
        <div style={{ position: 'absolute', left: 0, top: 580, opacity: tripodOp }}><Tripod h={290} /></div>
        <div style={{ position: 'absolute', left: 5, top: 0, transform: `translateY(${(1 - drop) * -260}px)`, opacity: clamp(drop * 2, 0, 1) }}><CO2Meter {...co2} /></div>
        <div style={{ position: 'absolute', left: 290, top: 250, opacity: stable, background: C.teal, color: C.white, borderRadius: 999, padding: '8px 18px', font: `700 30px ${F.brand}`, whiteSpace: 'nowrap' }}>✓ Stable</div>
      </div>
      <div style={{ position: 'absolute', left: 935, top: 300, width: 230, height: 560, opacity: lightOp, transform: `translateY(${lsIn}px)` }}>
        <LightMeter {...lm} />
      </div>
      <LightAim />
    </>
  );
}

function PhoneLayer() {
  const { T, at } = useCue();
  const y0 = kf(T, 1150, [[at('OpenForm', -0.4), 80], [at('Return', -0.6), 1150]], 0.9);
  const x0 = kf(T, 1250, [[at('Outdoor', 0.2), 1360], [at('Spaces', -0.2), 1250], [at('VConfig', -0.2), 1360], [at('Submit', 0), 1250]]);
  const sp = kf(T, 0, [[at('OpenForm', 11), 1], [at('OpenForm', 13.2), 2], [at('Spaces', 0), 3], [at('Spaces', 3.0), 4], [at('Spaces', 9.0), 5], [at('Spaces', 12.1), 6], [at('Spaces', 15.5), 7], [at('Spaces', 18.9), 8], [at('Spaces', 20.0), 9],
    [at('VConfig', -0.4), 10], [at('Horizontal', -0.4), 11], [at('AirSetup', -0.4), 12], [at('Submit', 5.2), 13]]);
  const pk = (t) => clamp((T - t) / 0.7, 0, 1);
  // photo steps: phone lifts over the meter display, shoots, returns, then uploads
  const SH = [[at('VRecord', 2.3), 'L', 146], [at('Horizontal', 12.4), 'L', 146], [at('AirRecord', 6.0), 'C', -42]];
  let camK = 0, shot = SH[0];
  SH.forEach(s => { const v = MOTION.draw(T, s[0] + 0.05, 0.6) - MOTION.draw(T, s[0] + 1.3, 0.6); if (v > camK) { camK = v; shot = s; } });
  const x = lerp(x0, 826, camK), y = lerp(y0, shot[2], camK), scale = lerp(0.92, 0.55, camK);
  const upl = (t) => T < t ? -1 : T < t + 1.9 ? 0 : clamp((T - t - 1.9) / 1.0, 0.01, 1);
  const hz = T >= at('Horizontal', -1);
  const lightDisp = <LightDisplay hold value={hz ? '22.4' : '16.9'} />;
  const co2Disp = <CO2Display hold co2="815" temp="72.1" rh="63.2" />;
  const h = (s, a, b) => hlr(T, at(s, a), at(s, b));
  const fl = SH.map(s => s[0] + 0.9).reduce((m, t) => T >= t && T < t + 0.5 ? Math.max(m, 1 - (T - t) / 0.5) : m, 0) * 0.9;
  const steps = h('Outdoor', 0.5, 3.5) ? [1] : h('Outdoor', 3.5, 8) ? [2, 3] : h('Outdoor', 8, 11.5) ? [4] : h('CO2Setup', 0, 9.38) ? [5] : h('CO2Setup', 9.38, 16) ? [6] : h('LightSetup', 0, 4) ? [7, 8] : h('LightSetup', 4, 12) ? [9] : [];
  const G = 'office - Floor 1';
  const airFocus = h('AirRecord', 8.7, 9.8) ? 'co2' : h('AirRecord', 10.0, 11.6) ? 'temp' : h('AirRecord', 11.8, 13.6) ? 'rh' : null;
  const screens = [
    <ListScreen T={T} hl={h('OpenForm', 9.6, 11) ? '0-Entrance' : null} tapK={pk(at('OpenForm', 10.4))} />,
    <DetailScreen T={T} l={LOCS[0]} hl={h('OpenForm', 11.6, 13.2)} tapK={pk(at('OpenForm', 12.5))} />,
    <SetupScreen T={T} kind="out" loc="Entrance - Floor 0" keys={[[at('Outdoor', 1.5), 's1'], [at('Outdoor', 3.5), 's3'], [at('CO2Setup', 0), 's5'], [at('LightSetup', 0), 's7']]}
      hl={{ header: h('OpenForm', 14, 19), steps }} />,
    <ListScreen T={T} done={['0-Entrance']} keys={[[at('Spaces', 0.4), 'complete']]} hl={h('Spaces', 0.8, 2.8) ? '0-Entrance' : null} />,
    <SetupScreen T={T} kind="ten" loc="office space - Floor 12" hl={{ banner: h('Spaces', 3.3, 6.6), quote: h('Spaces', 6.6, 9) }} />,
    <SetupScreen T={T} kind="com" loc="Hallway - Floor 1" hl={{ banner: h('Spaces', 9.1, 12.1) }} />,
    <SetupScreen T={T} kind="gar" loc="parking garage - Floor P-1" hl={{ banner: h('Spaces', 12.2, 15.5) }} />,
    <ListScreen T={T} done={['0-Entrance']} hl={h('Spaces', 18.1, 18.9) ? '1-office' : null} tapK={pk(at('Spaces', 18.4))} />,
    <DetailScreen T={T} l={LOCS[1]} hl={h('Spaces', 19.0, 19.9)} tapK={pk(at('Spaces', 19.4))} />,
    <SetupScreen T={T} kind="ten" loc={G} nextK={pk(at('Spaces', 21.0))} hl={{ next: h('Spaces', 20.1, 21.6) }} />,
    <LightScreen T={T} loc={G} keys={[[at('VConfig', 5.5), 'cfg'], [at('VCapture', 0), 'step2'], [at('VCapture', 16.4), 'holdpress'], [at('VRecord', 0), 'step3'], [at('VRecord', 5.8), 'num'], [at('VRecord', 13.2), 'next']]}
      radioK={MOTION.pop(T, at('VConfig', 2.4), 0.4)} up={upl(at('VRecord', 2.3))} thumbEl={lightDisp} typed={typ(T, at('VRecord', 7.6), at('VRecord', 9), '16.9')} numFocus={h('VRecord', 7.2, 10.5)} nextK={pk(at('VRecord', 14.8))}
      hl={{ radio: h('VConfig', 0.5, 3.3), config: h('VConfig', 6.5, 14), capture: h('VCapture', 0.5, 16.4), hold: h('VCapture', 16.4, 18.5), photo: h('VRecord', 0.5, 2.4),
        num: h('VRecord', 6.8, 10.5), holdoff: h('VRecord', 10.8, 12.5), next: h('VRecord', 13.6, 15.4) }} />,
    <LightScreen T={T} horizontal loc={G} keys={[[at('Horizontal', 1.5), 'step2'], [at('Horizontal', 9.6), 'holdpress'], [at('Horizontal', 11), 'step3'], [at('Horizontal', 14), 'num'], [at('Horizontal', 18.6), 'next']]}
      up={upl(at('Horizontal', 12.4))} thumbEl={lightDisp} typed={typ(T, at('Horizontal', 15.3), at('Horizontal', 16.1), '22.4')} numFocus={h('Horizontal', 15.2, 16.6)} nextK={pk(at('Horizontal', 19.4))}
      hl={{ capture: h('Horizontal', 2, 9.6), hold: h('Horizontal', 9.6, 11), photo: h('Horizontal', 11.2, 12.5), num: h('Horizontal', 14.4, 16.6), holdoff: h('Horizontal', 16.6, 18), next: h('Horizontal', 18.4, 20) }} />,
    <AirScreen T={T} keys={[[at('AirSetup', 2.6), 'stab'], [at('AirRecord', 0), 'step2'], [at('AirRecord', 4.6), 'step3'], [at('AirRecord', 7.8), 'co2'], [at('AirRecord', 11.4), 'rh'], [at('Submit', 0.3), 'submit']]}
      up={upl(at('AirRecord', 6.0))} thumbEl={co2Disp} co2={typ(T, at('AirRecord', 8.9), at('AirRecord', 9.6), '815')} temp={typ(T, at('AirRecord', 10.2), at('AirRecord', 11.2), '72.1')} rh={typ(T, at('AirRecord', 12.0), at('AirRecord', 13.0), '63.2')}
      focus={airFocus} submitK={pk(at('Submit', 4.4))}
      hl={{ config: h('AirSetup', 0.5, 2.8), stab: h('AirSetup', 3, 12), capture: h('AirRecord', 0.5, 5.2), photo: h('AirRecord', 5.2, 6.1), co2: h('AirRecord', 8.2, 9.8), temp: h('AirRecord', 10, 11.6), rh: h('AirRecord', 11.8, 13.6), submit: h('Submit', 3.4, 5) }} />,
    <ListScreen T={T} done={['0-Entrance', '1-office']} keys={[[at('Submit', 5.6), 'complete']]} hl={h('Submit', 6.6, 9.4) || h('Outro', 0.4, 4) ? '1-office' : null} />,
  ];
  return <Phone x={x} y={y} scale={scale} sp={sp} screens={screens} flash={fl} cam={clamp((camK - 0.25) / 0.45, 0, 1)} camView={shot[1] === 'L' ? lightDisp : co2Disp} />;
}

// Interactive mode: pause at each section's end, and on tap steps until the matching phone field is tapped
const ACTS = [['OpenForm', 10.4, 'card'], ['OpenForm', 12.5, 'collect'], ['Spaces', 18.4, 'card', 'Tap the tenant location'], ['Spaces', 21.0, 'next'], ['VConfig', 2.4, 'radio'], ['VRecord', 2.3, 'photo'], ['VRecord', 7.2, 'num'], ['VRecord', 14.8, 'next'],
  ['Horizontal', 12.4, 'photo'], ['Horizontal', 15.2, 'num'], ['Horizontal', 19.4, 'next'], ['AirRecord', 6.0, 'photo'], ['AirRecord', 8.8, 'co2'], ['AirRecord', 10.05, 'temp'], ['AirRecord', 11.85, 'rh'], ['Submit', 4.4, 'submit']];
const ACT_HINT = { card: 'Tap the first location', collect: 'Tap Collect IAQ Measurements', next: 'Tap Next', radio: 'Select \u201cOverhead lights are turned on\u201d', photo: 'Tap the attachment field',
  num: 'Tap the light reading field', co2: 'Tap the CO2 field', temp: 'Tap the temperature field', rh: 'Tap the humidity field', submit: 'Tap Submit' };
const STOPS = [['Spaces', 3.25], ['Spaces', 9.0], ['Spaces', 12.1], ['Spaces', 15.45]];
const NO_END = ['Spaces', 'VRecord', 'Horizontal', 'Return'];

// Section -> clip number in assets/audio (also keys IAQ_PAUSES / IAQ_AUDIO). Purpose has no clip until the new narration arrives.
const AUDIO_KEY = { Intro: '01', Purpose: '02', Unbox: '03', Kit: '04', Flow: '05', OpenForm: '06', Outdoor: '07', CO2Setup: '08', LightSetup: '09', Spaces: '10', VConfig: '11', VCapture: '12', VRecord: '13', Horizontal: '14', AirSetup: '15', AirRecord: '16', Submit: '17', Outro: '18', Return: '19' };
// Plays the section's narration clip in sync with the authored clock T.
// At a tap gate the clip finishes its current sentence, then waits; after the tap it stays quiet until the visuals catch up.
function Narration({ T, run, hold, free, enabled, seek = 0 }) {
  const secs = React.useMemo(() => { let a = 0; return JSON.parse(window.OM_SCENES).map((s, i) => { const nat = s.nat > 0 ? s.nat : s.dur, r = { a, nat, dur: s.dur, n: AUDIO_KEY[s.name] || '' }; a += nat; return r; }); }, []);
  const els = React.useRef(null), heard = React.useRef({});
  if (!els.current) els.current = secs.map((s) => { const el = s.n ? new Audio('assets/audio/' + s.n + '.wav') : new Audio(); el.preload = 'auto'; return el; });
  React.useEffect(() => () => els.current.forEach(el => el.pause()), []);
  React.useEffect(() => { heard.current = {}; els.current.forEach(el => el.pause()); }, [seek]);
  const sync = React.useMemo(() => JSON.parse(window.OM_SCENES).map((s) => {
    const g = (window.IAQ_GROUPS || {})[AUDIO_KEY[s.name]] || [], caps = (window.CAPS || []).filter(c => c[0] === s.name);
    return g.map((x, i) => ({ o: caps[i] ? caps[i][1] : 0, a0: x[0], a1: x[1] }));
  }), []);
  const idx = secs.findIndex(s => T >= s.a && T < s.a + s.nat);
  // each sentence group starts at its caption's offset; silence (NaN) between groups
  const posOf = (j, t) => {
    const u = t - secs[j].a, L = sync[j];
    let g = null; for (const x of L) if (x.o <= u + 0.001) g = x;
    if (!g) return NaN;
    const pos = Math.max(0, g.a0 - 0.15) + (u - g.o) * secs[j].dur / secs[j].nat;
    return pos > g.a1 + 0.12 ? NaN : pos;
  };
  React.useEffect(() => {
    const A = els.current;
    A.forEach((el, j) => {
      if (j !== idx) { if (!el.paused) el.pause(); if (heard.current[j] != null && Math.abs(j - idx) > 0) delete heard.current[j]; return; }
      if (!enabled) { if (!el.paused) el.pause(); return; }
      if (hold || free) return; // handled by the gate effect / let the clip run out
      const pos = posOf(j, T), len = (window.IAQ_AUDIO || {})[secs[j].n] || el.duration || 0;
      if (!(pos >= 0) || pos >= len || !run) { if (!el.paused) el.pause(); return; }
      const h = heard.current[j];
      if (h != null) { if (pos < h) { if (!el.paused) el.pause(); return; } delete heard.current[j]; }
      if (el.paused || Math.abs(el.currentTime - pos) > 0.35) { if (Math.abs(el.currentTime - pos) > 0.12) el.currentTime = pos; }
      if (el.paused && secs[j].n) el.play().catch(() => {});
    });
  }, [T, run, hold, free, enabled]);
  React.useEffect(() => {
    if (!hold || !enabled || idx < 0) return;
    const el = els.current[idx];
    if (el.paused) return;
    const stop = ((window.IAQ_PAUSES || {})[secs[idx].n] || []).find(m => m > el.currentTime + 0.05) ?? Infinity;
    heard.current[idx] = stop;
    let raf; const tick = () => { if (el.currentTime >= stop) { el.pause(); return; } raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hold, enabled, idx]);
  return null;
}

function GateUI({ wait, go, restart, back, canBack }) {
  const btn = (label, onClick, primary) => <button onClick={onClick} style={{ border: 0, cursor: 'pointer', borderRadius: 999, font: `700 ${primary ? 28 : 22}px ${F.brand}`, padding: primary ? '16px 34px' : '12px 22px',
    background: primary ? C.navy : C.white, color: primary ? C.white : C.navy, boxShadow: primary ? `0 0 0 4px ${C.mint}, 0 10px 30px rgba(0,29,35,.25)` : `0 0 0 1.5px ${C.border}, 0 6px 18px rgba(0,29,35,.12)` }}>{label}</button>;
  const start = wait && wait.n === 'start';
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none' }}>
      {wait && wait.act && <TapCallout act={wait.act} text={wait.hint || ACT_HINT[wait.act]} />}
      <div style={{ position: 'absolute', right: 120, bottom: 40, display: 'flex', alignItems: 'center', gap: 14, pointerEvents: 'auto' }}>
        {!start && canBack && btn('\u2190 Back', back)}
        {!start && btn('\u21ba Restart', restart)}
        {wait && !wait.act && wait.n !== 'end' && btn(start ? 'Start \u2192' : 'Continue \u2192', go, true)}
      </div>
    </div>
  );
}

// Own clock for interactive mode: plays each section, then waits for Continue or the matching phone tap
function InteractivePiece(props) {
  const { CUES, authoredTotal } = useComposition();
  const gates = React.useMemo(() => {
    const endOf = (n) => { const i = ORDER.indexOf(n); return i < ORDER.length - 1 ? CUES[ORDER[i + 1]] : authoredTotal; };
    const g = ACTS.map(([n, o, act, hint]) => ({ t: CUES[n] + o, act, hint }));
    STOPS.forEach(([n, o]) => g.push({ t: CUES[n] + o, act: null, n: 'stop', pause: true }));
    ORDER.forEach(n => { if (!NO_END.includes(n)) g.push({ t: endOf(n) - 1, act: null, n }); });
    return g.filter(x => isFinite(x.t)).sort((a, b) => a.t - b.t);
  }, [CUES, authoredTotal]);
  const SECS = React.useMemo(() => { let a = 0; return JSON.parse(window.OM_SCENES).map(s => { const nat = s.nat > 0 ? s.nat : s.dur, r = { a, nat, dur: s.dur }; a += nat; return r; }); }, []);
  const KEY = 'iaq-tutorial-ix-t';
  const [st, setSt] = React.useState(() => {
    const saved = parseFloat(localStorage.getItem(KEY));
    const g = gates.find(x => Math.abs(x.t - saved) < 0.01);
    return g ? { t: g.t, wait: g } : { t: 1.8, wait: { t: 1.8, act: null, n: 'start' } };
  });
  React.useEffect(() => {
    if (st.wait) return;
    let raf, last = null;
    const step = (ts) => {
      const dt = last == null ? 0 : Math.min((ts - last) / 1000, 0.1); last = ts;
      setSt(s => {
        if (s.wait) return s;
        const sec = SECS.find(x => s.t >= x.a && s.t < x.a + x.nat) || { nat: 1, dur: 1 };
        const next = s.t + dt * sec.nat / sec.dur;
        const g = gates.find(x => s.t < x.t && next >= x.t);
        if (g) { localStorage.setItem(KEY, String(g.t)); return { t: g.t, wait: g }; }
        if (next >= authoredTotal) { localStorage.removeItem(KEY); return { t: authoredTotal, wait: { n: 'end' } }; }
        return { t: next, wait: null };
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [st.wait, gates]);
  const [seek, setSeek] = React.useState(0);
  const go = () => setSt(s => ({ t: s.t, wait: null }));
  const restart = () => { localStorage.removeItem(KEY); setSeek(k => k + 1); setSt({ t: 0, wait: null }); };
  const back = () => {
    const starts = ORDER.map(n => CUES[n]).filter(isFinite).sort((a, b) => b - a);
    setSeek(k => k + 1);
    setSt(s => ({ t: starts.find(a => a < s.t - 1.5) ?? 0, wait: null }));
  };
  React.useEffect(() => {
    if (!st.wait || !st.wait.act) return;
    const on = (e) => { const el = e.target.closest && e.target.closest('[data-act]'); if (el && el.dataset.act === st.wait.act) { e.stopPropagation(); go(); } };
    document.addEventListener('click', on, true);
    return () => document.removeEventListener('click', on, true);
  }, [st.wait]);
  return (
    <IxCtx.Provider value={{ T: st.t }}>
      <Narration T={st.t} run={!st.wait} free={!!(st.wait && !st.wait.act && !st.wait.pause)} hold={!!(st.wait && (st.wait.act || st.wait.pause))} enabled={props.narration} seek={seek} />
      <Piece {...props} />
      <GateUI wait={st.wait} go={go} restart={restart} back={back} canBack={st.t > 3} />
    </IxCtx.Provider>
  );
}

function Caps({ items, style }) {
  const { T } = useCue();
  let cur = null;
  items.forEach((c, i) => { const until = c.until ?? (items[i + 1] ? items[i + 1].at : Infinity); if (T >= c.at && T < until) cur = c; });
  if (!cur) return null;
  return <div style={{ position: 'absolute', pointerEvents: 'none', ...style, opacity: MOTION.enter(T, cur.at, 0.3) }}>{cur.text}</div>;
}

function Outro() {
  const { T, at, authoredTotal } = { ...useCue(), authoredTotal: useComposition().authoredTotal };
  const op = MOTION.enter(T, authoredTotal - 2.6, 0.7);
  if (op <= 0) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.navy, opacity: op, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
      <div style={{ font: `700 30px ${F.brand}`, color: C.mint, letterSpacing: 3, textTransform: 'uppercase' }}>Configure · Capture · Record</div>
      <div style={{ font: `700 88px ${F.brand}`, color: C.white, letterSpacing: -2 }}>You’re ready to collect.</div>
      <div style={{ font: `500 28px ${F.brand}`, color: '#bcd3d3' }}>Having issues? Your return shipping instructions list a phone number for a Backpack representative.</div>
      <div style={{ font: `700 32px ${F.brand}`, color: '#7fb0ab', marginTop: 12 }}>Backpack</div>
    </div>
  );
}

function VideoNarration({ enabled }) {
  const { T, playing } = useComposition();
  return <Narration T={T} run={playing} hold={false} enabled={enabled} />;
}

// Photo backdrop: outdoors for the Outdoor/Control setup, office for the interior measurements
function SceneBg() {
  const { T, at, end } = useCue();
  const out = win(T, at('Outdoor', 0), end('LightSetup'), 0.8);
  const pur = win(T, at('Purpose', -0.6), end('Purpose'), 0.8);
  const ind = win(T, at('VConfig', 0), end('Submit'), 0.8);
  if (out <= 0 && ind <= 0 && pur <= 0) return null;
  const img = (src, o, z) => o > 0 && <div style={{ position: 'absolute', inset: 0, opacity: o }}>
    <img src={src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})` }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(247,248,246,.94) 0%, rgba(247,248,246,.86) 45%, rgba(247,248,246,.55) 100%)' }} />
  </div>;
  return <div style={{ position: 'absolute', inset: 0 }}>
    {img('assets/bg/outdoor.jpg', out, 1.04 + 0.04 * clamp((T - at('Outdoor')) / (end('LightSetup') - at('Outdoor')), 0, 1))}
    {img('assets/bg/office.jpg', ind, 1.04 + 0.04 * clamp((T - at('VConfig')) / (end('Submit') - at('VConfig')), 0, 1))}
    {img('assets/bg/office.jpg', pur, 1.04 + 0.04 * clamp((T - at('Purpose')) / (end('Purpose') - at('Purpose')), 0, 1))}
  </div>;
}

function Piece({ showCaptions }) {
  const { T, at } = useCue();
  const caps = CAPS.map(([s, o, text]) => ({ at: at(s, o), text }));
  caps[caps.length - 1].until = at('Return', 20.5);
  return (
    <div data-screen-label={`t=${Math.floor(T)}s`} style={{ position: 'absolute', inset: 0, background: C.paper, overflow: 'hidden', fontFamily: F.brand }}>
      <SceneBg />
      <FlowGraphic />
      <PurposeGraphic />
      <Meters />
      <PhoneLayer />
      <LeftBlocks />
      <Cards />
      <TopBar />
      <Intro />
      <KitPhotos />
      <UnboxScene />
      <ReturnScene />
      <Outro />
      {showCaptions && <Caps items={caps} style={{ left: 120, right: 'auto', maxWidth: 1060, bottom: 40, textAlign: 'left', color: C.white, background: 'rgba(0,29,35,.92)',
        padding: '14px 24px', borderRadius: 10, font: `500 28px/1.35 ${F.brand}`, textShadow: 'none', zIndex: 20 }} />}
    </div>
  );
}

function IAQTutorial() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, showCaptions: true, interactive: true });
  return (
    <>
      <CompositionStage width={1920} height={1080} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={C.paper} hideBar={t.interactive !== false}>
        {t.interactive !== false ? <InteractivePiece showCaptions={t.showCaptions} narration={t.narration !== false} /> : <><VideoNarration enabled={t.narration !== false} /><Piece showCaptions={t.showCaptions} /></>}
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Video" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakToggle label="Interactive (click to continue)" value={t.interactive !== false} onChange={(v) => setTweak('interactive', v)} />
        <TweakToggle label="Narration audio" value={t.narration !== false} onChange={(v) => setTweak('narration', v)} />
        <TweakToggle label="Captions" value={t.showCaptions} onChange={(v) => setTweak('showCaptions', v)} />
      </TweaksPanel>
    </>
  );
}
window.IAQTutorial = IAQTutorial;
