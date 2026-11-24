// Phone mockups rebuilt from the live Airtable list + field data form (390px viewport).
const PW = 420, PH = 880, Z = PW / 390;
const FA = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const FI = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const AT = { bar: '#A26810', bg: '#F9FAFB', instr: '#DB043B', inc: '#D44501', done: '#068A0E', noteBg: '#FFF6DD', noteFg: '#AF6003', panel: '#F7F8FC', ink: '#1f2328', g: '#616b72' };
const FM = { band: '#011E22', ink: '#011D23', blue: '#1E40AF', red: '#991C1B', teal: '#008A7E', err: '#F87171', help: '#808D91', line: '#e3e5e7' };
const TYPES = { out: ['Outdoor/Control', '#FFBA07', '#1f1f1f'], ten: ['Tenant Area', '#FFB68E', '#1f1f1f'], com: ['Common Area', '#3BCAFF', '#1f1f1f'], gar: ['Parking Garage', '#7B38EE', '#fff'] };
const LOCS = [['0', 'Entrance', 'out'], ['1', 'office', 'ten'], ['1', 'Hallway', 'com'], ['1', 'Corridor', 'com'], ['1', 'break room', 'ten'], ['4', 'conference room', 'ten'], ['4', 'elevator lobby', 'com'], ['4', 'fitness room', 'com'],
  ['8', 'office space', 'ten'], ['8', 'hallway', 'com'], ['8', 'bathroom', 'com'], ['8', 'stairwell', 'com'], ['12', 'corridor', 'com'], ['12', 'hallway', 'com'], ['12', 'waiting room', 'ten'], ['12', 'office space', 'ten'], ['P-1', 'parking garage', 'gar']];

function Phone({ sp = 0, screens = [], x = 0, y = 0, scale = 1, opacity = 1, flash = 0, cam = 0, camView = null }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: PW + 28, height: PH + 28, transform: `scale(${scale})`, transformOrigin: 'center', opacity,
      borderRadius: 56, background: '#0d1416', padding: 14, boxShadow: '0 30px 80px rgba(0,29,35,.30), inset 0 0 0 2px #2b3538' }}>
      <div style={{ position: 'relative', width: PW, height: PH, borderRadius: 44, overflow: 'hidden', background: C.white }}>
        {screens.map((s, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, transform: `translateX(${(i - sp) * PW}px)`, visibility: Math.abs(i - sp) < 1 ? 'visible' : 'hidden' }}>{s}</div>
        ))}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 40, background: '#000', color: '#fff', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 26px', font: `600 15px ${F.data}`, zIndex: 5 }}>
          <span>9:24</span><span style={{ width: 90, height: 22, borderRadius: 11, background: '#1b1f23' }} /><span>●●● ▮</span>
        </div>
        {cam > 0 && <div style={{ position: 'absolute', inset: 0, zIndex: 4, background: '#0a0a0a', opacity: cam, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '70px 0 34px' }}>
          <span style={{ font: `600 15px ${F.data}`, color: '#ffd60a', letterSpacing: 2 }}>PHOTO</span>
          <div style={{ position: 'relative', width: 380, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ transform: 'scale(2.1)' }}>{camView}</div>
            {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy], i) => <span key={i} style={{ position: 'absolute', [cx ? 'right' : 'left']: 0, [cy ? 'bottom' : 'top']: 0, width: 34, height: 34,
              [cx ? 'borderRight' : 'borderLeft']: '3px solid #ffd60a', [cy ? 'borderBottom' : 'borderTop']: '3px solid #ffd60a' }} />)}
          </div>
          <span style={{ width: 74, height: 74, borderRadius: '50%', border: '4px solid #fff', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ width: 58, height: 58, borderRadius: '50%', background: '#fff' }} /></span>
        </div>}
        <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: flash, zIndex: 6, pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

const ring = (on) => on ? { boxShadow: `0 0 0 4px ${C.mint}, 0 0 24px rgba(0,200,181,.45)` } : {};

// keys: [[time, anchorName | px], ...] — anchors are [data-a] elements inside children
function Scroller({ T = 0, keys = [], children, top = 40, bg = '#fff' }) {
  const ref = React.useRef(null);
  const [m, setM] = React.useState({ a: {}, h: 0 });
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const measure = () => {
      const a = {};
      el.querySelectorAll('[data-a]').forEach(n => { let y = 0, p = n; while (p && p !== el) { y += p.offsetTop; p = p.offsetParent; } a[n.dataset.a] = y; });
      setM(o => (o.h === el.offsetHeight && JSON.stringify(o.a) === JSON.stringify(a)) ? o : { a, h: el.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const max = Math.max(0, m.h * Z - (PH - top));
  const res = keys.map(([t, v]) => [t, clamp(typeof v === 'number' ? v : (m.a[v] ?? 0) * Z - 120, 0, max)]);
  const scroll = kf(T, 0, res, 0.9);
  return <div style={{ position: 'absolute', left: 0, right: 0, top, bottom: 0, overflow: 'hidden', background: bg }}>
    <div ref={ref} style={{ position: 'relative', width: 390, transform: `translateY(${-scroll}px) scale(${Z})`, transformOrigin: 'left top' }}>{children}</div></div>;
}

/* ---------- Airtable interface: list + location detail ---------- */
function ATBar() {
  return <div style={{ height: 52, background: AT.bar, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', color: '#fff' }}>
    <span style={{ font: `700 19px ${FA}`, letterSpacing: -0.3 }}>Airtable</span>
    <span style={{ display: 'flex', gap: 12, alignItems: 'center', font: `400 12.5px ${FA}` }}>Don't submit passwords.<span style={{ fontSize: 13.5 }}>More ⌄</span></span>
  </div>;
}
const ATPill = ({ bg, color = '#fff', children, fs = 12.5 }) => <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, background: bg, color, font: `400 ${fs}px ${FA}` }}>{children}</span>;
const TypeTag = ({ t, fs }) => <ATPill bg={TYPES[t][1]} color={TYPES[t][2]} fs={fs}>{TYPES[t][0]}</ATPill>;

function LocCard({ l, done, hl, tapK }) {
  const [floor, name, type] = l;
  return (
    <div data-a={`${floor}-${name}`} data-act={hl ? 'card' : undefined} style={{ position: 'relative', border: '1px solid #d6d8da', borderRadius: 13, padding: '18px 16px 14px', display: 'flex', flexDirection: 'column', gap: 10, background: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,.08)', ...ring(hl) }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ font: `500 13px ${FA}`, color: AT.g }}>Floor Number:<span style={{ fontWeight: 400, marginLeft: 8 }}>{floor}</span></span>
        <ATPill bg={done ? AT.done : AT.inc}>{done ? 'Complete' : 'Incomplete'}</ATPill>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: `400 13px ${FA}`, color: '#3f474d' }}><span style={{ color: AT.g, fontSize: 12 }}>◎</span>{name}</div>
      <div><TypeTag t={type} /></div>
      {type === 'out' && <div style={{ background: AT.noteBg, color: AT.noteFg, borderRadius: 6, padding: '9px 14px', font: `600 11.5px/1.4 ${FA}`, textAlign: 'center' }}>Complete the Outdoor/Control measurements before moving to the interior spaces.</div>}
      <div style={{ textAlign: 'right', font: `600 13px ${FA}`, color: '#3f474d', marginTop: 14 }}><span style={{ color: AT.g, fontWeight: 400, marginRight: 8 }}>▦</span>2Tall</div>
      <Ripple k={tapK} />
    </div>
  );
}

function ListScreen({ T, keys, done = [], hl = null, tapK = 0 }) {
  const key = (l) => `${l[0]}-${l[1]}`;
  const inc = LOCS.filter(l => !done.includes(key(l))), comp = done.map(k => LOCS.find(l => key(l) === k));
  const grp = (label, list, isDone) => <>
    <div data-a={isDone ? 'complete' : 'incomplete'} style={{ font: `600 12px ${FA}`, color: '#2d3338', padding: '4px 2px 0' }}>{label}</div>
    {list.map(l => <LocCard key={key(l)} l={l} done={isDone} hl={hl === key(l)} tapK={hl === key(l) ? tapK : 0} />)}
  </>;
  return (
    <Scroller T={T} keys={keys} bg={AT.bg}>
      <ATBar />
      <div style={{ background: '#fff', padding: '14px 18px 12px', borderBottom: '1px solid #e6e8ea' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', font: `600 16px ${FA}`, color: AT.ink }}>IAQ Measurements List<span style={{ letterSpacing: 1 }}>···</span></div>
        <div style={{ font: `400 11.5px ${FA}`, color: AT.g, marginTop: 14 }}>17 measurement locations</div>
        <div style={{ font: `500 12px ${FA}`, color: AT.instr, marginTop: 8 }}>Click on the locations below to begin collecting measurement data.</div>
      </div>
      <div style={{ padding: '16px 14px 40px', display: 'flex', flexDirection: 'column', gap: 14, background: AT.bg }}>
        {grp('Incomplete', inc, false)}
        {comp.length > 0 && grp('Complete', comp, true)}
      </div>
    </Scroller>
  );
}

function DetailScreen({ T, l, locked = false, hl = false, tapK = 0 }) {
  const [floor, name, type] = l;
  const lab = (t, v) => <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ font: `600 13px ${FA}`, color: AT.ink }}>{t}</span>{v}</div>;
  const hr = <div style={{ height: 1, background: '#eef0f2' }} />;
  return (
    <Scroller T={T}>
      <ATBar />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', font: `400 18px ${FA}`, color: '#333' }}>
        <span style={{ display: 'flex', gap: 22 }}><span style={{ color: '#aaa' }}>︿</span><span>﹀</span></span><span style={{ display: 'flex', gap: 22 }}><span>⧉</span><span>✕</span></span>
      </div>
      <div style={{ padding: '10px 24px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ font: `700 30px ${FA}`, color: AT.ink, letterSpacing: -0.5 }}>{name}</div>
        {hr}
        {lab('Floor Number', <span style={{ font: `700 21px ${FA}`, color: AT.ink }}>{floor}</span>)}
        {lab('Area Type', <div><TypeTag t={type} fs={13.5} /></div>)}
        {lab('Status', <div><ATPill bg={AT.inc} fs={13.5}>Incomplete</ATPill></div>)}
        {lab('Building', <div><span style={{ background: '#e9edf8', padding: '3px 6px', borderRadius: 3, font: `400 13.5px ${FA}`, color: AT.ink }}>2Tall</span></div>)}
        {hr}
      </div>
      {locked ? <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ font: `700 18px/1.5 ${FA}`, color: AT.ink }}>***Complete Outdoor/Control Measurements First***</div>
        <div style={{ font: `400 13.5px/1.55 ${FA}`, color: '#3f474d' }}>You first need to submit the Outdoor/Control measurement before you can begin collecting measurements from the interior spaces. The Outdoor/Control measurement should be the first location listed on this List. After submitting this data, you can begin collecting measurements for the other locations.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 50, font: `600 13px/1.4 ${FA}`, color: AT.ink }}><span style={{ width: 120 }}>Outdoor/Control Measurement</span><ATPill bg={AT.inc} fs={13.5}>Incomplete</ATPill></div>
      </div> :
        <div style={{ margin: '16px 8px', background: AT.panel, borderRadius: 6, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ font: `400 13.5px/1.5 ${FA}`, color: '#2d3338' }}>When you are ready to begin, click the green button and follow the instructions in the data collection form.</div>
          <div data-act="collect" style={{ position: 'relative', alignSelf: 'flex-start', background: AT.done, color: '#fff', borderRadius: 4, padding: '7px 10px', font: `500 12.5px ${FA}`, boxShadow: '0 1px 2px rgba(0,0,0,.2)', ...ring(hl) }}>
            Collect IAQ Measurements<Ripple k={tapK} /></div>
        </div>}
    </Scroller>
  );
}

/* ---------- Field data form ---------- */
function FormTop({ step, back }) {
  const labels = ['Initial Setup', 'Lighting Measurements', 'Air Quality Measurements'];
  const dot = (i) => {
    const done = i < step, cur = i === step;
    return <div key={'d' + i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 24, height: 24, borderRadius: '50%', boxSizing: 'border-box', border: `2px solid ${done || cur ? FM.teal : '#b8bcbd'}`, background: done ? '#498C86' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', font: `700 12px ${FI}` }}>
        {done ? '✓' : cur ? <span style={{ width: 10, height: 10, borderRadius: '50%', background: FM.teal }} /> : null}</div>
      {cur && <span style={{ font: `400 12px/1.25 ${FI}`, color: FM.teal, maxWidth: 74 }}>{labels[i]}</span>}
    </div>;
  };
  return <div style={{ background: FM.band, height: back ? 52 : 76, display: 'flex', alignItems: 'center', justifyContent: back ? 'flex-start' : 'center', gap: 6, padding: back ? '0 8px' : 0 }}>
    {back && <span style={{ width: 32, height: 30, borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: `500 16px ${FI}`, color: FM.ink }}>←</span>}
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#838E90', borderRadius: 5, padding: '5px 8px' }}>
      {[0, 1, 2].map(i => <React.Fragment key={i}>{i > 0 && <div style={{ width: 22, height: 1.5, background: '#5d6668' }} />}{dot(i)}</React.Fragment>)}
    </div>
  </div>;
}
function FormHead({ loc, locColor, hl, step, back }) {
  return <div>
    <FormTop step={step} back={back} />
    <div style={{ padding: back ? '16px 20px 0' : '30px 30px 0', display: 'flex', flexDirection: 'column', gap: back ? 14 : 34, background: '#fff', borderRadius: hl ? 8 : 0, ...ring(hl) }}>
      <div style={{ font: `400 ${back ? 21 : 22}px ${FI}`, color: FM.ink, whiteSpace: 'nowrap' }}>IAQ Field Data Form - 2Tall</div>
      {loc && <div style={{ textAlign: 'center', font: `400 ${back ? 12.5 : 15}px ${FI}`, color: locColor, paddingBottom: back ? 4 : 0 }}>{loc}</div>}
    </div>
  </div>;
}
const Banner = ({ bg, color, children, fw = 400, hl }) => <div style={{ background: bg, color, borderRadius: 8, padding: '9px 16px', font: `${fw} 15.5px ${FI}`, ...ring(hl) }}>{children}</div>;
const StepHead = ({ children, a }) => <div data-a={a} style={{ textAlign: 'center', font: `400 19.5px/1.3 ${FI}`, color: FM.blue, marginTop: 4 }}>{children}</div>;
const Bul = ({ children, hl, a, fw = 400 }) => <div data-a={a} style={{ display: 'flex', gap: 8, font: `${fw} 15px/1.35 ${FI}`, color: FM.blue, padding: '0 6px 0 22px', borderRadius: 6, ...ring(hl) }}><span>•</span><span>{children}</span></div>;
const Req = () => <div style={{ font: `400 14px ${FI}`, color: FM.help, paddingLeft: 10, marginTop: -6 }}>*</div>;
const Img = ({ src, w, h }) => <img src={src} style={{ display: 'block', alignSelf: 'center', width: w, height: h, objectFit: 'cover' }} />;
const HR = () => <div style={{ height: 1, background: FM.line }} />;
const NextBtn = ({ label = 'Next →', k = 0, hl, a = 'next' }) => <div data-a={a} data-act={a} style={{ position: 'relative', background: FM.teal, color: '#fff', borderRadius: 6, padding: '9px 0', textAlign: 'center', font: `600 17.5px ${FI}`, ...ring(hl) }}>{label}<Ripple k={k} /></div>;
const Folder = () => <span style={{ position: 'relative', width: 20, height: 15, background: '#6b7280', borderRadius: '2px 2px 3px 3px', display: 'block' }}>
  <span style={{ position: 'absolute', left: 0, top: -3, width: 9, height: 4, background: '#6b7280', borderRadius: '2px 2px 0 0' }} /></span>;

// up: <0 empty · 0 focused · (0,1) uploading · >=1 complete
function Dropzone({ up = -1, hl, thumb, thumbScale = 1.2, T = 0 }) {
  const active = up >= 0, done = up >= 1;
  return <div data-a="photo" data-act="photo" style={{ position: 'relative', borderRadius: 9, padding: 2, border: `1.5px solid ${active ? FM.teal : 'transparent'}`, ...ring(hl) }}>
    <div style={{ border: '1.5px dashed #d4d6d8', borderRadius: 6, padding: '12px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <Folder />
      <span style={{ font: `400 14px ${FI}`, color: '#6b7280' }}>Drag &amp; drop a file or <u>browse</u></span>
      {up > 0 && <div style={{ position: 'relative', width: '100%', height: 170, borderRadius: 7, overflow: 'hidden', background: '#222', marginTop: 6 }}>
        {typeof thumb === 'string' ? <img src={thumb} style={{ position: 'absolute', left: '19%', width: '62%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#3a3f44' }}><div style={{ transform: `scale(${thumbScale})` }}>{thumb}</div></div>}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 64, background: done ? 'linear-gradient(#3d9a5a, rgba(61,154,90,0))' : 'linear-gradient(rgba(0,0,0,.85), rgba(0,0,0,0))' }} />
        <div style={{ position: 'absolute', left: 8, right: 8, top: 8, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', color: '#fff', font: `600 11.5px ${FI}` }}>
          <span>meter-photo.jpg</span>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>{done ? 'Upload complete' : `Uploading ${Math.round(up * 100)}%`}<span style={{ font: `400 9.5px ${FI}`, opacity: 0.75 }}>{done ? 'tap to undo' : 'tap to cancel'}</span></span>
          {done ? <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>✕</span>
            : <span style={{ width: 16, height: 16, margin: 3, borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent', transform: `rotate(${T * 400}deg)` }} />}
        </div>
      </div>}
    </div>
  </div>;
}
function Field({ ph, val = '', focus, hl, a, act }) {
  return <div data-a={a} data-act={act || a} style={{ border: `1.2px solid ${focus ? FM.teal : '#dfe1e3'}`, borderRadius: 5, padding: '9px 12px', font: `400 14.5px ${FI}`, color: val ? '#4b5563' : '#b9bec2', background: '#fff', ...ring(hl) }}>
    {val || ph}{focus && <span style={{ display: 'inline-block', width: 1.5, height: 16, background: '#333', marginLeft: 1, verticalAlign: 'middle' }} />}</div>;
}
const Notes = ({ title }) => <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
  <div style={{ font: `400 15.5px/1.35 ${FI}`, color: FM.ink }}>Notes and Observations - {title}</div>
  <div style={{ border: '1.2px solid #dfe1e3', borderRadius: 5, height: 74, padding: '8px 12px', font: `400 14.5px ${FI}`, color: '#c4c8cb' }}>(Optional)</div></div>;
const Body = ({ children, pad = '14px 20px 22px', gap = 12 }) => <div style={{ padding: pad, display: 'flex', flexDirection: 'column', gap, background: '#fff' }}>{children}</div>;
const Foot = () => <div style={{ height: 30, background: FM.band }} />;

const SETUP_OUT = [
  ['Find a suitable outdoor location. Select a location near the main entrance of the building. ', '(If it\u2019s currently raining/snowing outside, select a location that is under cover to ensure the IAQ testing kit components remain completely dry.)'],
  ['Open the kit and begin by removing the tripod.'],
  ['Remove the larger yellow CO2 monitor device from the kit and affix it to the top of the tripod. ', '(You can leave the CO2 monitor mounted in the tripod for the remainder of the IAQ assignment.)'],
  ['Power on the CO2 monitor. You should see a 10-second countdown displayed on the control screen.'],
  ['Wait until the countdown has completed, then confirm the CO2 monitor settings are properly configured.'],
  ['Step a few feet away from the tripod and let the CO2 monitor\u2019s sensors adjust to the outdoors. ', '(Wait at least 10 minutes or until the CO2 reading has fully stabilized before recording the air measurements.)'],
  ['Remove the black and yellow light meter from the kit.'],
  ['Remove the dust cap from the light sensor and power the device on.'],
  ['Confirm the light meter settings are properly configured.'],
  ['Hit the Next button to begin collecting measurements.'],
];
const SETUP_BANNER = {
  out: ['Outdoor/Control Measurement Instructions', '#D6C806', '#615505', 400],
  ten: ['Tenant Space Guidelines', '#EC5306', '#fff', 500],
  com: ['Common Area Guidelines', '#10E3D3', '#16413e', 400],
  gar: ['Parking Garage Guidelines', '#5E0ACB', '#fff', 500],
};
const SETUP_BUL = {
  ten: [['Make sure you have permission from the building contact person and the tenant before entering leased tenant spaces.'], ['Be considerate of the tenants and their working operations.'], ['If a tenant denies entry, please contact your dispatcher.'],
    ['If a tenant asks what you\u2019re doing, please provide the following explanation. ', '\u201cWe are collecting routine air quality and lighting levels for this building\u2019s EnergyStar certification.\u201d', 'quote']],
  com: [['Ensure you are not blocking any doorways or corridors when setting up the measurement equipment.'], ['Ensure overhead lighting is turned on before you begin collecting measurements.'], ['Avoid collecting any measurements near open windows, air vents, or cooking equipment.']],
  gar: [],
};

function SetupScreen({ T, keys, kind = 'out', loc, nextK = 0, hl = {} }) {
  const [bt, bbg, bfg, bfw] = SETUP_BANNER[kind];
  const red = (s) => s && <span style={{ color: FM.red, fontStyle: 'italic' }}>{s}</span>;
  return <Scroller T={T} keys={keys} bg={FM.band}>
    <FormHead step={0} loc={loc} locColor={FM.red} hl={hl.header} />
    <Body pad="18px 30px 16px" gap={14}>
      <Banner bg={bbg} color={bfg} fw={bfw} hl={hl.banner}>{bt}</Banner>
      {kind === 'out' ? <>
        <div style={{ font: `600 19.5px ${FI}`, textAlign: 'center', color: FM.ink, marginTop: 2 }}>Initial Setup</div>
        <ol style={{ margin: '-8px 0 0', paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 2, font: `400 15.5px/1.38 ${FI}`, color: FM.ink }}>
          {SETUP_OUT.map(([a, b], i) => <li key={i} data-a={`s${i + 1}`} style={{ borderRadius: 6, ...ring((hl.steps || []).includes(i + 1)) }}>{a}{red(b)}</li>)}</ol>
      </> : SETUP_BUL[kind].length > 0 && <ul style={{ margin: 0, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 2, font: `400 15.5px/1.38 ${FI}`, color: FM.ink }}>
        {SETUP_BUL[kind].map(([a, b, tag], i) => <li key={i} style={{ borderRadius: 6, ...ring(tag === 'quote' && hl.quote) }}>{a}{red(b)}</li>)}</ul>}
      <div style={{ marginTop: kind === 'gar' ? 34 : 6 }}><NextBtn k={nextK} hl={hl.next} /></div>
    </Body>
  </Scroller>;
}

function Radio({ label, on, k = 1, hl, act }) {
  return <div data-act={act} style={{ display: 'flex', alignItems: 'center', gap: 12, border: `1.3px solid ${on ? FM.teal : '#e1e3e5'}`, borderRadius: 7, padding: '9px 12px', font: `400 14.5px ${FI}`, color: '#4b5563', boxShadow: '0 1px 2px rgba(0,0,0,.04)', ...ring(hl) }}>
    <span style={{ width: 16, height: 16, borderRadius: '50%', border: `1.5px solid ${on ? FM.teal : '#d1d5db'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {on && <span style={{ width: 9, height: 9, borderRadius: '50%', background: FM.teal, transform: `scale(${k})` }} />}</span>{label}</div>;
}

// Vertical (horizontal=false) and horizontal light pages
function LightScreen({ T, keys, horizontal = false, interior = true, loc, radioK = 0, up = -1, thumbEl, typed = '', numFocus = false, nextK = 0, hl = {} }) {
  const dir = horizontal ? 'horizontal' : 'vertical';
  return <Scroller T={T} keys={keys} bg={FM.band}>
    <FormHead step={1} back loc={loc} locColor={horizontal ? FM.ink : FM.blue} />
    <Body>
      <Banner bg={horizontal ? '#E8B705' : '#F2D30B'} color="#3b3300">{horizontal ? 'Horizontal' : 'Vertical'} Light Measurement</Banner>
      <StepHead a="step1">Step 1 - Configuration</StepHead>
      {!horizontal && interior && <>
        <Img src="assets/form/lamp.png" w={78} h={138} />
        <Bul a="radio" fw={500}>Confirm the overhead lights are turned on.</Bul><Req />
        <div style={{ font: `400 13px/1.4 ${FI}`, color: FM.help, marginTop: -6 }}>If overhead lights are off, request to have them turned on before taking light measurements. (If lighting is controlled by a motion sensor, try to locate the sensor and activate it.)</div>
        <Radio label="Overhead lights are turned on" act="radio" on={radioK > 0} k={radioK} hl={hl.radio} />
        <Radio label="Unable to turn on lights" />
      </>}
      {horizontal ? <>
        <Bul a="cfg" hl={hl.config}>Follow the same configuration process from the vertical light measurement.</Bul>
        <Bul>Ensure the light meter reading is still set to "Fc" and the MIN/MAX/HOLD features are all deactivated.</Bul>
      </> : <>
        <Bul a="cfg" hl={hl.config}>Ensure the lighting meter is powered on and the dust cover has been removed to expose the white sensor bulb.</Bul>
        <Bul hl={hl.config}>Ensure the light meter reading is set to "Fc" and the MIN/MAX/HOLD features are deactivated.</Bul>
        <Img src="assets/form/lm-config.png" w={132} h={196} />
      </>}
      <HR />
      <StepHead a="step2">Step 2 - Capture Measurement</StepHead>
      {horizontal ? <>
        <Bul>When you're ready to capture, move to the same location where you collected the vertical light measurement.</Bul>
        <Bul hl={hl.capture}>Hold the lighting meter at arm's length, <b><u>but this time rotate the meter 90 degrees so the white sensor bulb is facing horizontally.</u></b></Bul>
        <Bul hl={hl.capture}>Make sure the sensor is not pointed at a wall with mirrors or exterior-facing windows.</Bul>
        <Img src="assets/form/lm-horizontal-hand.png" w={286} h={225} />
      </> : <>
        <Bul>When you're ready to capture, move to a spot near the middle of the measurement location.</Bul>
        <Bul hl={hl.capture}>Hold the lighting meter at arm's length in front of you with the <u>white sensor bulb facing toward the ceiling</u>.</Bul>
        <Bul hl={hl.capture}>If the sensor is pointing directly at an overhead light, move a few steps so the sensor is pointed at the bare ceiling with no obstructions.</Bul>
        <Img src="assets/form/lm-vertical-hand.png" w={232} h={206} />
      </>}
      <Bul a="holdpress" hl={hl.hold}>Press the HOLD button. This will freeze the lighting value on the meter's display.</Bul>
      <Img src={horizontal ? 'assets/form/lm-hold.png' : 'assets/form/lm-config.png'} w={horizontal ? 142 : 132} h={horizontal ? 224 : 196} />
      <HR />
      <StepHead a="step3">Step 3 - Record The Measurement</StepHead>
      <Bul>With the "HOLD" feature still enabled on the screen, click the attachment field below on this form to launch your smartphone camera.</Bul>
      <Img src="assets/form/lm-hold-display.png" w={178} h={202} />
      <Bul>Take a photo of the light meter display and upload it into the attachment field.</Bul><Req />
      <Dropzone T={T} up={up} hl={hl.photo} thumb={thumbEl || 'assets/form/lm-hold-display.png'} />
      <Bul>Type the light reading on the display screen into the {dir} light measurement field below.</Bul><Req />
      <Field a="num" ph="Enter Light Reading Value" val={typed} focus={numFocus} hl={hl.num} />
      <Bul a="holdoff" hl={hl.holdoff}>Press the HOLD button again to disable the hold feature.</Bul>
      <HR />
      <Notes title={horizontal ? 'Horizontal Lighting' : 'Vertical Lighting'} />
      <NextBtn k={nextK} hl={hl.next} />
    </Body>
    <Foot />
  </Scroller>;
}

function AirScreen({ T, keys, up = -1, thumbEl, co2 = '', temp = '', rh = '', focus = null, submitK = 0, hl = {} }) {
  return <Scroller T={T} keys={keys} bg={FM.band}>
    <FormHead step={2} back />
    <Body>
      <Banner bg="#8DDEF0" color="#137286">CO2 Multi-Meter Measurements</Banner>
      <StepHead a="step1">Step 1 - Configuration</StepHead>
      <Bul hl={hl.config}>Ensure the CO2 multi-meter is powered on and the HOLD feature is deactivated.</Bul>
      <Bul hl={hl.config}>Ensure the temperature readout is set to "AIR" and units are set to Fahrenheit "F".</Bul>
      <Img src="assets/form/co2-air.png" w={330} h={222} />
      <Bul a="stab" hl={hl.stab}>Place the tripod with the multi-meter inside the measurement area for 3-5 minutes or until the CO2 reading has stabilized. Make sure there are no people within five feet of the multi-meter while it's stabilizing.</Bul>
      <Img src="assets/form/co2-tripod.png" w={188} h={224} />
      <HR />
      <StepHead a="step2">Step 2 - Capture Measurements</StepHead>
      <Bul hl={hl.capture}>After the CO2 reading has stabilized, press the HOLD button and ensure "HOLD" is shown on the upper left corner of the display.</Bul>
      <Img src="assets/form/co2-hold.png" w={330} h={224} />
      <HR />
      <StepHead a="step3">Step 3 - Record The Measurements</StepHead>
      <Bul>Click the attachment file below to open your smartphone camera.</Bul>
      <Bul>Take a photo of the CO2 multi-meter display and upload it into the attachment field.</Bul><Req />
      <Dropzone T={T} up={up} hl={hl.photo} thumb={thumbEl || 'assets/form/co2-hold.png'} thumbScale={1.02} />
      <Bul a="co2" fw={500}>Enter CO2 Measurement Value</Bul><Req />
      <Field act="co2" ph="CO2 Value" val={co2} focus={focus === 'co2'} hl={hl.co2} />
      <Bul a="temp" fw={500}>Enter Temperature Measurement Value</Bul><Req />
      <div style={{ font: `400 13px/1.4 ${FI}`, color: FM.help, marginTop: -6 }}>Make sure mode is set to "Air" and temp unit is set to "F"</div>
      <Field act="temp" ph="Temperature Value" val={temp} focus={focus === 'temp'} hl={hl.temp} />
      <Bul a="rh" fw={500}>Enter Humidity Measurement Value</Bul><Req />
      <Field act="rh" ph="Humidity Value" val={rh} focus={focus === 'rh'} hl={hl.rh} />
      <HR />
      <Notes title="Air Measurements" />
      <NextBtn label="Submit" a="submit" k={submitK} hl={hl.submit} />
    </Body>
    <Foot />
  </Scroller>;
}

Object.assign(window, { PW, PH, Phone, ListScreen, DetailScreen, SetupScreen, LightScreen, AirScreen, LOCS });
