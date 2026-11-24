// Purpose intro graphic, unbox + return-kit animations, tap callout. Uses window.useCue from iaq-piece.jsx at render time.
const HL = '#FF8A00';
const CB = { side: '#c8955a', flap: '#d8ab70', edge: '#a8773f', inner: '#8f6334' };

const MEAS = [['CO2', 'ppm', 'How well the space is ventilated', 8.9], ['Temperature', '\u00b0F', 'Thermal comfort', 11.9], ['Humidity', '%RH', 'Thermal comfort', 13.3], ['Light', 'Fc', 'Lighting levels', 14.6]];
const PLOCS = [['Outdoor/Control', 34.4, true], ['Tenant spaces', 28.9], ['Common areas', 29.8], ['Parking garages', 30.7]];

function PurposeGraphic() {
  const { T, at, end } = window.useCue();
  const op = win(T, at('Purpose', 0.3), end('Purpose'), 0.5);
  if (op <= 0) return null;
  const co2Hl = T >= at('Purpose', 22.4) && T < at('Purpose', 27);
  return (
    <div style={{ position: 'absolute', left: 920, top: 190, width: 880, opacity: op, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 20 }}>
        {MEAS.map(([name, unit, sub, o], i) => {
          const k = MOTION.pop(T, at('Purpose', o), 0.5);
          const hl = i === 0 && co2Hl;
          return (
            <div key={i} style={{ background: C.white, borderRadius: 16, padding: '24px 28px', border: `1.5px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 8,
              boxShadow: hl ? `0 0 0 4px ${C.mint}, 0 10px 30px rgba(0,29,35,.12)` : '0 10px 30px rgba(0,29,35,.10)', opacity: clamp(k, 0, 1), transform: `scale(${0.88 + 0.12 * k})` }}>
              <div style={{ font: `900 60px/1 ${F.data}`, color: C.teal }}>{unit}</div>
              <div style={{ font: `700 34px ${F.brand}`, color: C.navy, marginTop: 6 }}>{name}</div>
              <div style={{ font: `500 23px/1.3 ${F.brand}`, color: C.g5 }}>{sub}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, opacity: MOTION.enter(T, at('Purpose', 28.6), 0.5) }}>
        <div style={{ font: `600 24px ${F.brand}`, letterSpacing: 2, textTransform: 'uppercase', color: C.teal }}>Where you’ll measure</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {PLOCS.map(([l, o, first], i) => {
            const k = MOTION.pop(T, at('Purpose', o), 0.45);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 999, font: `600 24px ${F.brand}`, opacity: clamp(k, 0, 1), transform: `scale(${0.85 + 0.15 * k})`,
                background: first ? C.navy : C.white, color: first ? C.white : C.navy, border: `1.5px solid ${first ? C.navy : C.border}`, boxShadow: '0 6px 18px rgba(0,29,35,.10)' }}>
                {first && <span style={{ background: C.mint, color: C.navy, borderRadius: 999, padding: '2px 10px', font: `700 18px ${F.data}` }}>1st</span>}{l}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Top-down cardboard box. tb/sd: 0 closed .. 1 open (top+bottom flaps / side flaps)
function CardBox({ W, H, tb = 0, sd = 0, tape = 0, ring = false, children, onFlap, bodyOp = 1 }) {
  const P = 'perspective(1600px) ';
  const flap = (pos, origin, tf, kids) => <div style={{ position: 'absolute', ...pos, transformOrigin: origin, transform: P + tf, opacity: bodyOp, background: CB.flap, border: `2px solid ${CB.edge}`, boxSizing: 'border-box', borderRadius: 3 }}>{kids}</div>;
  return (
    <div style={{ position: 'relative', width: W, height: H }}>
      <div style={{ position: 'absolute', inset: 0, opacity: bodyOp, background: CB.side, borderRadius: 4, boxShadow: ring ? `0 0 0 5px ${C.mint}, 0 24px 50px rgba(0,29,35,.25)` : '0 24px 50px rgba(0,29,35,.25)' }} />
      <div style={{ position: 'absolute', inset: 12, opacity: bodyOp, background: CB.inner, borderRadius: 2, boxShadow: 'inset 0 12px 26px rgba(0,0,0,.4)' }} />
      <div style={{ position: 'absolute', inset: 12 }}>{children}</div>
      {flap({ left: 0, top: 0, width: W / 2, height: H }, 'left center', `rotateY(${-172 * sd}deg)`)}
      {flap({ right: 0, top: 0, width: W / 2, height: H }, 'right center', `rotateY(${172 * sd}deg)`)}
      {flap({ left: 0, top: 0, width: W, height: H / 2 }, 'center top', `rotateX(${172 * tb}deg)`, tb < 0.3 ? onFlap : null)}
      {flap({ left: 0, bottom: 0, width: W, height: H / 2 }, 'center bottom', `rotateX(${-172 * tb}deg)`)}
      {tape > 0 && <div style={{ position: 'absolute', left: -10, top: H / 2 - 18, width: (W + 20) * tape, height: 36, background: 'rgba(236,220,178,.92)', boxShadow: '0 1px 0 rgba(0,0,0,.12)' }} />}
    </div>
  );
}

// Top-down black carrying case. open: 0 closed .. 1 lid flipped up. m1/m2: meters dropped in
function KitCase({ w, h, open = 0, m1 = 1, m2 = 1 }) {
  const shell = { position: 'absolute', inset: 0, borderRadius: 64, background: '#141414', boxShadow: '0 10px 26px rgba(0,0,0,.45)' };
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      <div style={shell}>
        <div style={{ position: 'absolute', inset: 16, borderRadius: 50, background: '#2d2d2d' }} />
        <div style={{ position: 'absolute', left: 46, top: 40, width: w - 92, height: 82, borderRadius: 34, background: '#f7a51c', opacity: clamp(m1 * 2, 0, 1), transform: `scale(${lerp(1.3, 1, m1)})`,
          boxShadow: '0 6px 14px rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 90, height: 46, borderRadius: 6, background: '#c9d4c2', border: '4px solid #6f7378' }} /></div>
        <div style={{ position: 'absolute', left: 70, top: h - 128, width: w - 140, height: 70, borderRadius: 16, background: '#1d1d1d', border: '3px solid #f5c400', opacity: clamp(m2 * 2, 0, 1),
          transform: `scale(${lerp(1.3, 1, m2)})`, boxShadow: '0 6px 14px rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', paddingLeft: 14, boxSizing: 'border-box' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #fff, #cfcfcf)' }} /></div>
      </div>
      <div style={{ ...shell, background: 'radial-gradient(ellipse at 35% 30%, #343434, #121212 72%)', transformOrigin: 'center top', transform: `perspective(1600px) rotateX(${180 * open}deg)` }}>
        <div style={{ position: 'absolute', inset: 14, borderRadius: 52, border: '2px dashed #4d4d4d' }} />
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 130, height: 28, transform: 'translate(-50%,-50%)', borderRadius: 14, background: '#262626', boxShadow: 'inset 0 2px 4px rgba(0,0,0,.6)' }} />
      </div>
    </div>
  );
}

const Sheet = ({ ring }) => (
  <div style={{ width: 210, height: 262, background: '#fffdf8', borderRadius: 4, padding: '18px 18px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 10,
    boxShadow: ring ? `0 0 0 4px ${C.mint}, 0 10px 24px rgba(0,0,0,.35)` : '0 10px 24px rgba(0,0,0,.35)' }}>
    <div style={{ font: `700 17px/1.2 ${F.brand}`, color: C.navy }}>Return Shipping Instructions</div>
    {[1, 0.9, 1, 0.75, 0.95, 0.85, 0.6].map((w, i) => <div key={i} style={{ height: 7, width: `${w * 100}%`, borderRadius: 4, background: '#d9d6cf' }} />)}
  </div>
);
const ShipLabel = ({ ring, title = 'RETURN LABEL', w = 172, h = 112 }) => (
  <div style={{ width: w, height: h, background: C.white, borderRadius: 4, padding: '10px 12px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 6,
    boxShadow: ring ? `0 0 0 4px ${C.mint}, 0 8px 20px rgba(0,0,0,.3)` : '0 8px 20px rgba(0,0,0,.3)' }}>
    <div style={{ font: `700 14px ${F.data}`, color: C.navy, letterSpacing: 1 }}>{title}</div>
    <div style={{ flex: 1, background: 'repeating-linear-gradient(90deg, #111 0 3px, transparent 3px 6px, #111 6px 7px, transparent 7px 10px)' }} />
  </div>
);

const BW = 440, BH = 320;
function UnboxScene() {
  const { T, at, end } = window.useCue();
  const op = win(T, at('Unbox', 0.2), end('Unbox'), 0.5);
  if (op <= 0) return null;
  const k = MOTION.enter(T, at('Unbox', 0.2), 0.7);
  const tb = MOTION.draw(T, at('Unbox', 0.9), 0.8), sd = MOTION.draw(T, at('Unbox', 1.5), 0.8);
  const ins = MOTION.enter(T, at('Unbox', 1.8), 0.5);
  const h = (a, b) => T >= at('Unbox', a) && T < at('Unbox', b); // ring windows below follow the narration
  return (
    <div style={{ position: 'absolute', left: 1140, top: 380, opacity: op, transform: `translateY(${(1 - k) * 40}px)` }}>
      <CardBox W={BW} H={BH} tb={tb} sd={sd} ring={h(0.5, 2) || T >= at('Unbox', 7.5)} onFlap={<div style={{ position: 'absolute', left: BW / 2 - 80, top: 34 }}><ShipLabel title="SHIP TO" w={160} h={100} /></div>}>
        <div style={{ position: 'absolute', left: 8, top: 8 }}><KitCase w={BW - 40} h={BH - 40} /></div>
        <div style={{ position: 'absolute', left: 34, top: 8, transform: `rotate(-4deg) translateY(${(1 - ins) * -12}px)`, opacity: ins }}><Sheet ring={h(3.3, 5.3) || T >= at('Unbox', 7.5)} /></div>
        <div style={{ position: 'absolute', left: 218, top: 96, transform: 'rotate(6deg)', opacity: ins }}><ShipLabel ring={h(5.3, 7.4) || T >= at('Unbox', 7.5)} /></div>
      </CardBox>
    </div>
  );
}

function ReturnScene() {
  const { T, at, end } = window.useCue();
  const op = win(T, at('Return', 0.2), end('Return'), 0.5);
  if (op <= 0) return null;
  const o = (x) => at('Return', x);
  const k = MOTION.enter(T, o(0.2), 0.7);
  const open = 1 - MOTION.draw(T, o(2.8), 1.0);
  const m1 = MOTION.enter(T, o(0.9), 0.6), m2 = MOTION.enter(T, o(1.7), 0.6);
  const boxOp = MOTION.enter(T, o(4.4), 0.5), caseS = lerp(1.08, 1, MOTION.draw(T, o(4.6), 0.8));
  const sd = 1 - MOTION.draw(T, o(5.6), 0.6), tb = 1 - MOTION.draw(T, o(6.1), 0.6), tape = MOTION.draw(T, o(6.8), 0.6);
  const lk = MOTION.draw(T, o(7.8), 0.9), lRing = T >= o(8.8) && T < o(10.4);
  const storeK = MOTION.enter(T, o(10.6), 0.6);
  const mv = MOTION.draw(T, o(11.8), 1.4), inDoor = MOTION.enter(T, o(13.2), 0.4), rc = MOTION.pop(T, o(13.8), 0.5);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: op, pointerEvents: 'none' }}>
      {storeK < 1 && <div style={{ position: 'absolute', left: 1140, top: 380 + 30 * (1 - boxOp), opacity: 1 - storeK, transform: `translateY(${(1 - k) * 40}px) scale(${1 - 0.15 * storeK})` }}>
        <CardBox W={BW} H={BH} tb={tb} sd={sd} tape={tape} bodyOp={boxOp} onFlap={<div style={{ position: 'absolute', left: BW / 2 - 80, top: 34 }}><ShipLabel title="SHIP TO" w={160} h={100} /></div>}>
          <div style={{ position: 'absolute', left: 8, top: 8, transform: `scale(${caseS})` }}><KitCase w={BW - 40} h={BH - 40} open={open} m1={m1} m2={m2} /></div>
        </CardBox>
        {lk > 0 && <div style={{ position: 'absolute', left: lerp(BW + 260, BW / 2 - 86, lk), top: lerp(-60, 30, lk), transform: `rotate(${lerp(14, -2, lk)}deg)`, opacity: clamp(lk * 3, 0, 1) }}>
          <ShipLabel ring={lRing} w={172} h={112} /></div>}
      </div>}
      {storeK > 0 && <div style={{ position: 'absolute', left: 930, top: 200, width: 860, height: 600, opacity: storeK, transform: `translateY(${(1 - storeK) * 30}px)` }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 860, height: 540, borderRadius: 14, background: '#ece6dc', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,29,35,.20)' }}>
          <div style={{ height: 96, background: '#4b2e1a', display: 'flex', alignItems: 'center', justifyContent: 'center', font: `700 48px ${F.brand}`, color: C.white, letterSpacing: 1 }}>UPS Store</div>
          <div style={{ height: 30, background: 'repeating-linear-gradient(90deg, #4b2e1a 0 40px, #6e4c31 40px 80px)', borderRadius: '0 0 14px 14px' }} />
          {[60, 600].map((x, i) => <div key={i} style={{ position: 'absolute', left: x, top: 170, width: 200, height: 220, borderRadius: 6, border: '8px solid #3d3d3d', background: 'linear-gradient(160deg, #d7e5e8, #a9c3cb)', boxSizing: 'border-box' }} />)}
          <div style={{ position: 'absolute', left: 320, top: 156, width: 220, height: 334, border: '10px solid #3d3d3d', borderBottom: 0, background: 'linear-gradient(160deg, #cfdfe3, #93b0b9)', boxSizing: 'border-box' }}>
            <div style={{ position: 'absolute', right: 16, top: 150, width: 10, height: 60, borderRadius: 5, background: '#3d3d3d' }} /></div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 50, background: '#cfc8bd' }} />
        </div>
        <div style={{ position: 'absolute', left: lerp(-120, 370, mv), top: 380, width: 120, height: 92, background: CB.side, borderRadius: 4, border: `2px solid ${CB.edge}`, opacity: 1 - inDoor,
          transform: `scale(${1 - 0.3 * inDoor})`, boxShadow: '0 10px 20px rgba(0,0,0,.25)' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 14, height: 12, background: 'rgba(236,220,178,.95)' }} />
          <div style={{ position: 'absolute', left: 30, top: 38, width: 58, height: 38, background: C.white, borderRadius: 2 }} />
        </div>
        {rc > 0 && <div style={{ position: 'absolute', left: 640, top: 250, width: 230, padding: '20px 22px', boxSizing: 'border-box', background: C.white, borderRadius: 8, boxShadow: '0 16px 40px rgba(0,29,35,.25)',
          display: 'flex', flexDirection: 'column', gap: 10, opacity: clamp(rc, 0, 1), transform: `rotate(4deg) scale(${0.85 + 0.15 * rc})` }}>
          <div style={{ font: `700 26px ${F.brand}`, color: C.navy }}>Receipt</div>
          {[1, 0.8, 0.9].map((w, i) => <div key={i} style={{ height: 7, width: `${w * 100}%`, borderRadius: 4, background: '#dedbd4' }} />)}
          <div style={{ font: `700 22px ${F.brand}`, color: C.teal, marginTop: 4 }}>{'\u2713'} Dropped off</div>
        </div>}
      </div>}
    </div>
  );
}

// Orange callout pointing at the phone field the viewer needs to tap
function TapCallout({ act, text }) {
  const ref = React.useRef(null);
  const [pos, setPos] = React.useState(null);
  React.useEffect(() => {
    const find = () => {
      const root = ref.current && ref.current.parentElement;
      if (!root) return;
      const rr = root.getBoundingClientRect(), s = rr.width / 1920;
      let best = null;
      for (const el of document.querySelectorAll(`[data-act="${act}"]`)) {
        const r = el.getBoundingClientRect();
        if (r.width < 2) continue;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const hit = document.elementFromPoint(cx, cy);
        if (hit && (hit === el || el.contains(hit))) { best = r; break; }
        if (!best && cx > rr.left && cx < rr.right && cy > rr.top && cy < rr.bottom) best = r;
      }
      if (!best) return;
      const n = { x: (best.left - rr.left) / s, y: (best.top - rr.top + best.height / 2) / s };
      setPos(p => p && Math.abs(p.x - n.x) < 1 && Math.abs(p.y - n.y) < 1 ? p : n);
    };
    find();
    const id = setInterval(find, 200);
    return () => clearInterval(id);
  }, [act]);
  return (
    <>
      <style>{`@keyframes iaqFlash{0%,100%{box-shadow:0 0 0 4px ${HL},0 0 0 0 rgba(255,138,0,0)}50%{box-shadow:0 0 0 8px ${HL},0 0 34px 10px rgba(255,138,0,.8)}}
@keyframes iaqPulse{0%{box-shadow:0 0 0 4px ${HL},0 0 0 0 rgba(255,138,0,.75)}100%{box-shadow:0 0 0 4px ${HL},0 0 0 24px rgba(255,138,0,0)}}
@keyframes iaqNudge{0%,100%{transform:translate(0,-50%)}50%{transform:translate(-12px,-50%)}}
[data-act="${act}"]{animation:iaqFlash .4s ease-in-out 3,iaqPulse 1.3s ease-out 1.2s infinite!important;cursor:pointer}`}</style>
      <div ref={ref} style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0 }} />
      {pos && <div style={{ position: 'absolute', right: 1920 - pos.x + 34, top: pos.y, transform: 'translate(0,-50%)', animation: 'iaqNudge 1.2s ease-in-out infinite', pointerEvents: 'none',
        display: 'flex', alignItems: 'center', gap: 12, maxWidth: 360, background: C.white, color: C.navy, border: `3px solid ${HL}`, borderRadius: 12, padding: '14px 20px',
        font: `700 26px/1.25 ${F.brand}`, boxShadow: '0 12px 30px rgba(0,29,35,.25)', textWrap: 'pretty' }}>
        {text}
        <div style={{ position: 'absolute', right: -17, top: '50%', marginTop: -13, width: 0, height: 0, borderLeft: `14px solid ${HL}`, borderTop: '13px solid transparent', borderBottom: '13px solid transparent' }} />
      </div>}
    </>
  );
}

Object.assign(window, { PurposeGraphic, UnboxScene, ReturnScene, TapCallout, HL });
