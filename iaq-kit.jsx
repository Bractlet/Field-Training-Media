// Shared palette, motion helpers and illustrated meters for the IAQ tutorial.
const C = {
  navy: '#001d23', teal: '#006058', dteal: '#003e42', mint: '#00c8b5', mint3: '#33d3c4',
  paper: '#f9f7f7', white: '#ffffff', border: '#eaeaea', ink: '#434343', g5: '#6c6c6c', g3: '#9e9e9e',
  yellow: '#ffc700', red: '#d94b4b', redWash: '#ffedf1', clear: '#eafffd', fog: '#efefef',
  formYellow: '#f2d21a', formTeal: '#00897b', formOrange: '#e57f55', formCyan: '#6ddfd3', formPurple: '#8452d1', formBlue: '#1e3fa3',
};
const F = { brand: "'Gilroy', system-ui, sans-serif", data: "'Roboto', system-ui, sans-serif" };

// The only three motion curves in the piece.
const MOTION = {
  enter: (t, a, d = 0.6) => Easing.easeOutCubic(clamp((t - a) / d, 0, 1)),
  draw: (t, a, d = 0.8) => Easing.easeInOutCubic(clamp((t - a) / d, 0, 1)),
  pop: (t, a, d = 0.5) => Easing.easeOutBack(clamp((t - a) / d, 0, 1)),
};
// Visible window with fade in/out, returns 0..1
const win = (t, a, b, f = 0.4) => Math.min(MOTION.enter(t, a, f), 1 - MOTION.enter(t, b - f, f));
const lerp = (a, b, k) => a + (b - a) * k;
// sequential keyframes: [[time, value], ...] eased with MOTION.draw
const kf = (T, v0, keys, d = 0.7) => keys.reduce((v, [t, v2]) => lerp(v, v2, MOTION.draw(T, t, d)), v0);

function Ripple({ k }) {
  if (!(k > 0 && k < 1)) return null;
  return <div style={{ position: 'absolute', left: '50%', top: '50%', width: 90, height: 90, marginLeft: -45, marginTop: -45,
    borderRadius: '50%', border: `4px solid ${C.mint}`, transform: `scale(${0.3 + k * 1.1})`, opacity: 1 - k, pointerEvents: 'none' }} />;
}

function MeterBtn({ label, w = 74, h = 40, bg, color, active, k, radius = 10, fs = 15 }) {
  return (
    <div style={{ position: 'relative', width: w, height: h, borderRadius: radius, background: bg, color,
      display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', lineHeight: 1,
      font: `700 ${fs}px ${F.data}`, boxShadow: active ? `0 0 0 4px ${C.mint}` : '0 2px 0 rgba(0,0,0,.35)',
      transform: active && k < 0.4 ? 'translateY(2px)' : 'none' }}>
      {label}<Ripple k={k} />
    </div>
  );
}

// MT-912 light meter. press: 'power'|'hold'|'minmax'|'fc'; pressK: 0..1 ripple progress
function LightMeter({ on = true, hold = false, value = '23.0', unit = 'Fc', minmax = false, capOn = false, press = null, pressK = 0, scale = 1, glow = 0, tempMark = false }) {
  const btn = (id, label) => <MeterBtn label={label} bg="#1b1b1b" color={id === 'power' ? '#e8d23a' : '#f2f2f2'} active={press === id} k={press === id ? pressK : 0} />;
  return (
    <div style={{ width: 230, height: 560, position: 'relative', transform: `scale(${scale})`, transformOrigin: 'center' }}>
      <div style={{ position: 'absolute', left: 30, top: 0, width: 170, height: 170, borderRadius: '50%', background: '#151515',
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,29,35,.25)' }}>
        <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 92, height: 92, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #ffffff, #dcdcdc 60%, #bdbdbd)',
            boxShadow: glow ? `0 0 ${40 * glow}px ${16 * glow}px rgba(255,236,150,${0.7 * glow})` : 'none' }} />
        </div>
        <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', background: '#111', opacity: capOn ? 1 : 0,
          boxShadow: 'inset 0 6px 14px rgba(255,255,255,.12)' }} />
      </div>
      <div style={{ position: 'absolute', left: 92, top: 160, width: 46, height: 50, background: '#151515' }} />
      <div style={{ position: 'absolute', left: 0, top: 200, width: 230, height: 360, borderRadius: 46, background: '#151515', boxShadow: '0 16px 40px rgba(0,29,35,.28)' }}>
        <div style={{ position: 'absolute', left: 16, top: 18, right: 16, bottom: 18, borderRadius: 32, background: '#f5c400', padding: '20px 22px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <LightDisplay on={on} hold={hold} value={value} unit={unit} minmax={minmax} tempMark={tempMark} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 18px' }}>
            {btn('power', '⏻')}{btn('hold', 'HOLD')}{btn('minmax', 'MIN MAX')}{btn('fc', 'FC LUX')}
          </div>
          <div style={{ font: `700 15px ${F.data}`, color: '#1b1b1b', textAlign: 'center', lineHeight: 1.15 }}>MT-912<br />LIGHT METER</div>
        </div>
      </div>
    </div>
  );
}

// AZ 7755 CO2 / Temp / RH meter
function CO2Meter({ on = true, hold = false, co2 = '815', temp = '72.7', rh = '63.2', mode = 'AIR', unit = 'F', countdown = null, press = null, pressK = 0, scale = 1 }) {
  const btn = (id, label) => <MeterBtn label={label} w={84} h={40} radius={20} bg="#6f7378" color="#fff" fs={14} active={press === id} k={press === id ? pressK : 0} />;
  const lcd = '#1d2a22';
  return (
    <div style={{ width: 250, height: 600, position: 'relative', transform: `scale(${scale})`, transformOrigin: 'center' }}>
      <div style={{ position: 'absolute', left: 103, top: 0, width: 44, height: 100, borderRadius: '10px 10px 0 0', background: '#3d4246',
        display: 'flex', gap: 6, justifyContent: 'center', paddingTop: 14 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 70, background: '#24282b', borderRadius: 2 }} />)}
      </div>
      <div style={{ position: 'absolute', left: 0, top: 96, width: 250, height: 504, borderRadius: '28px 28px 40px 40px', background: '#f7a51c',
        boxShadow: '0 16px 40px rgba(0,29,35,.25)', padding: '22px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: '100%', borderRadius: 8, background: '#6f7378', color: '#fff', textAlign: 'right', padding: '6px 12px', font: `italic 700 18px ${F.data}`, lineHeight: 1.15 }}>AZ 7755<br />Temp. RH. CO₂</div>
        <CO2Display w="100%" on={on} hold={hold} co2={co2} temp={temp} rh={rh} mode={mode} unit={unit} countdown={countdown} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 22px', marginTop: 8 }}>
          {btn('set', '⏻ SET')}{btn('mode', 'MODE')}{btn('cal', 'CAL Esc')}{btn('dp', 'DP/WBT')}{btn('hold', 'HOLD')}{btn('mx', 'MX/AV')}
        </div>
      </div>
    </div>
  );
}

function LightDisplay({ on = true, hold = false, value = '23.0', unit = 'Fc', minmax = false, temp = '71.6', tempMark = false }) {
  return (
          <div style={{ width: 150, height: 118, borderRadius: 12, background: '#0d0d0d', padding: 8 }}>
            <div style={{ width: '100%', height: '100%', borderRadius: 6, background: on ? '#0b1b3a' : '#111', position: 'relative', color: '#bfe8ff',
              opacity: on ? 1 : 0.6 }}>
              {on && <>
                <div style={{ position: 'absolute', left: 6, top: 5, font: `700 13px ${F.data}`, padding: '1px 4px', borderRadius: 3,
                  background: hold ? '#bfe8ff' : 'transparent', color: hold ? '#0b1b3a' : 'transparent' }}>HOLD</div>
                <div style={{ position: 'absolute', right: 6, top: 5, font: `700 13px ${F.data}`, color: minmax ? '#ffd84e' : 'transparent' }}>MAX</div>
                <div style={{ position: 'absolute', left: 58, top: 4, font: `700 13px ${F.data}`, padding: '1px 3px', borderRadius: 3, fontVariantNumeric: 'tabular-nums', ...(tempMark ? { boxShadow: '0 0 0 2.5px #D94B4B', background: 'rgba(217,75,75,.25)' } : {}) }}>{temp}°F</div>
                <div style={{ position: 'absolute', right: 6, top: 30, font: `700 14px ${F.data}`, padding: '0 3px', border: '1.5px solid #bfe8ff', borderRadius: 3 }}>{unit}</div>
                <div style={{ position: 'absolute', left: 8, bottom: 8, font: `900 46px ${F.data}`, letterSpacing: -1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
              </>}
            </div>
          </div>
  );
}
function CO2Display({ w = 210, on = true, hold = false, co2 = '815', temp = '72.1', rh = '63.2', mode = 'AIR', unit = 'F', countdown = null }) {
  const lcd = '#1d2a22';
  return (
        <div style={{ width: w, height: 150, boxSizing: 'border-box', borderRadius: 8, background: on ? '#b9c1b0' : '#9da394', border: '4px solid #e08c0c', position: 'relative', color: lcd, overflow: 'hidden' }}>
          {on && countdown != null && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `900 72px ${F.data}` }}>{countdown}</div>}
          {on && countdown == null && <>
            <div style={{ position: 'absolute', left: 6, top: 5, font: `700 13px ${F.data}`, padding: '1px 4px', border: `1.5px solid ${hold ? lcd : 'transparent'}`, color: hold ? lcd : 'transparent' }}>HOLD</div>
            <div style={{ position: 'absolute', right: 8, top: 4, font: `700 15px ${F.data}` }}>CO₂ppm</div>
            <div style={{ position: 'absolute', right: 10, top: 18, font: `900 64px ${F.data}`, letterSpacing: -2, fontVariantNumeric: 'tabular-nums' }}>{co2}</div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 92, height: 2, background: lcd }} />
            <div style={{ position: 'absolute', left: '52%', top: 92, bottom: 0, width: 2, background: lcd }} />
            <div style={{ position: 'absolute', left: 6, top: 94, font: `700 11px ${F.data}` }}>{mode}</div>
            <div style={{ position: 'absolute', left: 6, bottom: 2, font: `900 30px ${F.data}`, fontVariantNumeric: 'tabular-nums' }}>{temp}<span style={{ fontSize: 16 }}>°{unit}</span></div>
            <div style={{ position: 'absolute', right: 6, bottom: 2, font: `900 30px ${F.data}`, fontVariantNumeric: 'tabular-nums' }}>{rh}<span style={{ fontSize: 16 }}>%</span></div>
          </>}
        </div>
  );
}

function Tripod({ h = 300 }) {
  return (
    <div style={{ position: 'relative', width: 260, height: h }}>
      <div style={{ position: 'absolute', left: 124, top: 0, width: 12, height: h - 30, background: '#2a2f33', borderRadius: 4 }} />
      <div style={{ position: 'absolute', left: 128, top: h - 40, width: 140, height: 8, background: '#2a2f33', borderRadius: 4, transformOrigin: 'left center', transform: 'rotate(22deg)' }} />
      <div style={{ position: 'absolute', left: 132, top: h - 40, width: 140, height: 8, background: '#2a2f33', borderRadius: 4, transformOrigin: 'left center', transform: 'rotate(158deg)' }} />
    </div>
  );
}

Object.assign(window, { C, F, MOTION, win, lerp, kf, Ripple, LightDisplay, CO2Display, LightMeter, CO2Meter, Tripod });
