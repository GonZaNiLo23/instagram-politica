import React from 'react';
import {C, F} from '../tema';
import {Simbolo} from '../componentes/Marca';

const M = 72;
const AN = 1080 - 2 * M; // 936

type Regla = {desde?: number; hasta?: number; color?: 'turquesa'; marcas?: number[]; oscuras?: number[]; extension?: boolean; hitos?: number[]};
type Slide = {tipo: string; dia?: string; antetitulo?: string; titular: string; texto: string; fuente?: string; nota?: string; pastilla?: {t: string; gris?: boolean}; regla?: Regla};

/* ---------- iconos planos ---------- */
const trazo = {stroke: C.tinta, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

const Documento: React.FC<{w?: number}> = ({w = 170}) => (
  <svg width={w} height={w * 1.25} viewBox="0 0 170 212">
    <rect x="10" y="8" width="150" height="196" rx="10" fill="#fff" {...trazo} />
    {[40, 62, 84].map((y) => <line key={y} x1="32" x2="138" y1={y} y2={y} stroke={C.piedra} strokeWidth="6" strokeLinecap="round" />)}
    <circle cx="95" cy="148" r="40" fill={C.mostaza} {...trazo} />
    <text x="95" y="160" textAnchor="middle" fontFamily={F.titular} fontSize="34" fill={C.tinta}>BOE</text>
  </svg>
);
const Urna: React.FC<{w?: number}> = ({w = 170}) => (
  <svg width={w} height={w} viewBox="0 0 170 170">
    <rect x="68" y="14" width="46" height="62" rx="4" fill="#fff" {...trazo} transform="rotate(-8 90 45)" />
    <rect x="25" y="52" width="120" height="104" rx="8" fill={C.turquesa} {...trazo} />
    <rect x="52" y="62" width="66" height="10" rx="5" fill={C.tinta} />
  </svg>
);
const Calendario: React.FC<{w?: number}> = ({w = 190}) => (
  <svg width={w} height={w} viewBox="0 0 190 190">
    <rect x="12" y="24" width="166" height="154" rx="12" fill="#fff" {...trazo} />
    <rect x="12" y="24" width="166" height="40" rx="12" fill={C.tinta} />
    <line x1="52" x2="52" y1="10" y2="38" {...trazo} />
    <line x1="138" x2="138" y1="10" y2="38" {...trazo} />
    {[0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={30 + c * 36} y={78 + r * 32} width="22" height="18" rx="3" fill={C.piedra} opacity=".5" />))}
    <circle cx="102" cy="142" r="22" fill="none" stroke={C.mostaza} strokeWidth="8" />
  </svg>
);
const Reunion: React.FC = () => (
  <svg width="170" height="130" viewBox="0 0 170 130">
    <rect x="10" y="60" width="150" height="22" rx="8" fill={C.piedra} {...trazo} />
    {[35, 85, 135].map((x) => <g key={x}><circle cx={x} cy="28" r="14" fill={C.tinta} /><rect x={x - 16} y="44" width="32" height="14" rx="6" fill={C.tinta} /><line x1={x} x2={x} y1="82" y2="116" {...trazo} /></g>)}
  </svg>
);
const Lista: React.FC = () => (
  <svg width="170" height="130" viewBox="0 0 170 130">
    <rect x="30" y="8" width="90" height="112" rx="8" fill="#fff" {...trazo} />
    {[34, 54, 74, 94].map((y) => <line key={y} x1="46" x2="104" y1={y} y2={y} stroke={C.piedra} strokeWidth="6" strokeLinecap="round" />)}
    <circle cx="116" cy="76" r="20" fill="none" {...trazo} />
    <line x1="130" x2="150" y1="92" y2="114" {...trazo} strokeWidth={9} />
  </svg>
);
const Buzon: React.FC = () => (
  <svg width="110" height="110" viewBox="0 0 120 130">
    <rect x="12" y="20" width="96" height="76" rx="14" fill={C.mostaza} {...trazo} />
    <rect x="30" y="44" width="60" height="9" rx="4" fill={C.tinta} />
    <line x1="60" x2="60" y1="96" y2="124" {...trazo} />
  </svg>
);
const Bombo: React.FC = () => (
  <svg width="150" height="132" viewBox="0 0 170 150">
    <circle cx="85" cy="68" r="58" fill="#fff" {...trazo} />
    {[[60, 50], [100, 42], [78, 78], [110, 84], [52, 88], [88, 56]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="10" fill={i === 4 ? C.mostaza : C.piedra} stroke={C.tinta} strokeWidth="3" />)}
    <rect x="55" y="126" width="60" height="16" rx="5" fill={C.tinta} />
  </svg>
);
const Sobre: React.FC = () => (
  <svg width="150" height="110" viewBox="0 0 150 110">
    <rect x="8" y="12" width="134" height="88" rx="10" fill={C.mostaza} {...trazo} />
    <polyline points="10,16 75,64 140,16" fill="none" {...trazo} />
  </svg>
);
const Silueta: React.FC<{c?: string}> = ({c = C.tinta}) => (
  <svg width="64" height="100" viewBox="0 0 64 100"><circle cx="32" cy="22" r="16" fill={c} /><rect x="6" y="44" width="52" height="52" rx="22" fill={c} /></svg>
);
const Megafono: React.FC = () => (
  <svg width="130" height="100" viewBox="0 0 130 100">
    <polygon points="14,38 56,38 108,10 108,90 56,62 14,62" fill={C.mostaza} {...trazo} />
    <rect x="28" y="62" width="20" height="26" rx="4" fill={C.piedra} {...trazo} />
  </svg>
);
const Luna: React.FC = () => (
  <svg width="64" height="64" viewBox="0 0 64 64"><path d="M44 8 A26 26 0 1 0 56 44 A22 22 0 1 1 44 8Z" fill={C.mostaza} {...trazo} strokeWidth={3} /></svg>
);
const BarrasTachadas: React.FC = () => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    {[[8, 36, 12], [26, 18, 30], [44, 28, 20]].map(([x, y, h], i) => <rect key={i} x={x} y={y} width="12" height={h + 10} fill={C.piedra} />)}
    <line x1="4" y1="60" x2="60" y2="6" stroke={C.tinta} strokeWidth="6" strokeLinecap="round" />
  </svg>
);
const Maleta: React.FC = () => (
  <svg width="64" height="64" viewBox="0 0 64 64"><rect x="8" y="20" width="48" height="36" rx="6" fill={C.mostaza} {...trazo} strokeWidth={4} /><path d="M24 20 V12 H40 V20" fill="none" {...trazo} strokeWidth={4} /></svg>
);
const Edificio: React.FC = () => (
  <svg width="64" height="64" viewBox="0 0 64 64"><rect x="8" y="26" width="48" height="30" fill="#fff" {...trazo} strokeWidth={4} /><polygon points="4,26 32,8 60,26" fill={C.piedra} {...trazo} strokeWidth={4} /><line x1="22" x2="22" y1="32" y2="52" {...trazo} strokeWidth={4} /><line x1="42" x2="42" y1="32" y2="52" {...trazo} strokeWidth={4} /></svg>
);
const Tic: React.FC<{s?: number}> = ({s = 44}) => (
  <svg width={s} height={s} viewBox="0 0 48 48" style={{flex: 'none'}}><circle cx="24" cy="24" r="22" fill={C.piedra} /><polyline points="13,25 21,33 36,15" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Cronometro: React.FC<{s?: number}> = ({s = 200}) => (
  <svg width={s} height={s} viewBox="0 0 200 200">
    <rect x="82" y="6" width="36" height="22" rx="6" fill={C.mostaza} />
    <rect x="148" y="30" width="26" height="14" rx="5" fill={C.mostaza} transform="rotate(40 160 37)" />
    <circle cx="100" cy="112" r="76" fill={C.mostaza} stroke={C.crema} strokeWidth="8" />
    <circle cx="100" cy="112" r="58" fill={C.tinta} />
    <text x="100" y="124" textAnchor="middle" fontFamily={F.cifra} fontWeight={700} fontSize="30" fill={C.mostaza}>6-OCT</text>
  </svg>
);
const Hemiciclo: React.FC = () => {
  const filas = 7, total = 350;
  const radios = Array.from({length: filas}, (_, i) => 60 + i * 24);
  const suma = radios.reduce((a, b) => a + b, 0);
  const cuentas = radios.map((r) => Math.round((r / suma) * total));
  cuentas[filas - 1] += total - cuentas.reduce((a, b) => a + b, 0);
  return (
    <svg width="300" height="170" viewBox="-190 -200 380 210">
      {radios.flatMap((r, i) => Array.from({length: cuentas[i]}, (_, k) => {
        const a = Math.PI - (Math.PI * k) / (cuentas[i] - 1);
        return <circle key={`${i}-${k}`} cx={r * 1.2 * Math.cos(a)} cy={-r * 1.2 * Math.sin(a)} r="2.6" fill={C.tinta} />;
      }))}
    </svg>
  );
};

/* ---------- piezas comunes ---------- */
const Pastilla: React.FC<{t: string; gris?: boolean}> = ({t, gris}) => (
  <div style={{alignSelf: 'flex-start', background: gris ? C.piedra : C.turquesa, color: '#fff', fontFamily: F.texto, fontWeight: 700, fontSize: 36, padding: '6px 26px', borderRadius: 40, letterSpacing: 0.5}}>
    {gris ? '' : 'TÚ · '}{t}
  </div>
);

const REGLA_Y = 1118;
const ReglaMarcas: React.FC<{r: Regla; fondo?: string}> = ({r, fondo}) => {
  const ancho = r.extension ? 720 : AN;
  const paso = ancho / 54;
  const col = r.color === 'turquesa' ? C.turquesa : C.mostaza;
  const eje = fondo === C.mostaza ? '#8a5f00' : C.piedra;
  const marcas = Array.from({length: 55}, (_, d) => {
    let color = eje, alto = 22;
    if (r.desde !== undefined && r.hasta !== undefined && d >= r.desde && d <= r.hasta) { color = col; alto = 34; }
    if (r.marcas?.includes(d)) { color = C.mostaza; alto = 48; }
    if (r.oscuras?.includes(d)) { color = C.tinta; alto = 34; }
    if (r.hitos?.includes(d)) { color = C.tinta; alto = 52; }
    return <rect key={d} x={d * paso - 3} y={60 - alto} width={6} height={alto} rx={3} fill={color} />;
  });
  const lab = {fontFamily: F.texto, fontWeight: 700, fontSize: 28, fill: C.tinta} as const;
  return (
    <svg style={{position: 'absolute', left: M, top: REGLA_Y}} width={AN} height={90} viewBox={`0 0 ${AN} 90`}>
      {marcas}
      <text x={0} y={88} {...lab} textAnchor="start">6-oct</text>
      <text x={ancho} y={88} {...lab} textAnchor="end">29-nov</text>
      {r.extension && <g><line x1={ancho + 14} x2={AN} y1={54} y2={54} stroke={C.mostaza} strokeWidth={6} strokeDasharray="2 12" strokeLinecap="round" /><text x={AN} y={88} {...lab} textAnchor="end">diciembre</text></g>}
    </svg>
  );
};

const Cabecera: React.FC<{i: number; total: number; dia?: string; oscuro?: boolean}> = ({i, total, dia, oscuro}) => (
  <>
    <div style={{position: 'absolute', left: M, top: 50}}>
      <Simbolo tam={56} sobre={oscuro ? 'oscuro' : 'claro'} />
    </div>
    <div style={{position: 'absolute', right: M, top: 52, display: 'flex', alignItems: 'center', gap: 18}}>
      {dia && <div style={{background: C.tinta, color: C.mostaza, fontFamily: F.cifra, fontWeight: 700, fontSize: 44, padding: '2px 18px', borderRadius: 10}}>{dia}</div>}
      <div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 28, color: oscuro ? C.crema : C.tinta, opacity: 0.75}}>{i + 1}/{total}</div>
    </div>
  </>
);

const tamTitular = (t: string) => (t.length <= 24 ? 92 : t.length <= 42 ? 76 : 64);

/* ---------- esquemas ---------- */
const Hito: React.FC<{f: string; t: string; hecho?: boolean; mostaza?: boolean}> = ({f, t, hecho, mostaza}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
    <div style={{width: 18, height: 18, borderRadius: 9, background: hecho ? C.piedra : mostaza ? C.mostaza : C.tinta, flex: 'none'}} />
    <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 38, color: C.tinta, flex: 1, lineHeight: 1.15}}>
      {f && <span style={{fontFamily: F.cifra, background: hecho ? '#ddd7cb' : C.mostaza, padding: '0 8px', borderRadius: 8, marginRight: 10}}>{f}</span>}{t}
    </div>
    {hecho && <Tic />}
  </div>
);

const Paso: React.FC<{t: string; s: string; mostaza?: boolean}> = ({t, s, mostaza}) => (
  <div style={{flex: 1, background: mostaza ? C.mostaza : '#fff', border: `4px solid ${C.tinta}`, borderRadius: 18, padding: '14px 4px', textAlign: 'center'}}>
    <div style={{fontFamily: F.titular, fontSize: 40, color: C.tinta}}>{t}</div>
    <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 40, color: C.tinta, marginTop: 4}}>{s}</div>
  </div>
);

const Esquema: React.FC<{s: Slide}> = ({s}) => {
  const col = {display: 'flex', flexDirection: 'column' as const};
  switch (s.tipo) {
    case 's2':
      return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{...col, alignItems: 'center', gap: 6}}><Documento w={150} /><div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 36}}>RD 806/2026</div></div>
          <svg width="250" height="60" viewBox="0 0 260 60"><line x1="6" x2="240" y1="30" y2="30" stroke={C.mostaza} strokeWidth="10" strokeLinecap="round" /><polyline points="212,6 244,30 212,54" fill="none" stroke={C.mostaza} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div style={{...col, alignItems: 'center'}}><Calendario w={170} /><div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 36}}>29-NOV</div></div>
        </div>
      );
    case 's3':
      return (
        <div style={{...col, gap: 22}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 22}}><Reunion /><div style={{flex: 1}}><Hito f="9-oct" t="se constituyen las juntas" hecho /></div></div>
          <div style={{display: 'flex', alignItems: 'center', gap: 22}}><Lista /><div style={{flex: 1}}><Hito f="12–19 oct" t="consulta y reclamaciones del censo" hecho /></div></div>
        </div>
      );
    case 's4':
      return (
        <div style={{display: 'flex', gap: 22, alignItems: 'center'}}>
          <div style={{...col, alignItems: 'center', gap: 4, width: 170}}>
            <div style={{display: 'flex', gap: 4}}>{[0, 1, 2].map((k) => <svg key={k} width="46" height="62" viewBox="0 0 52 70"><rect x="3" y="3" width="46" height="64" rx="5" fill="#fff" {...trazo} strokeWidth={3} />{[22, 36, 50].map((y) => <line key={y} x1="12" x2="40" y1={y} y2={y} stroke={C.piedra} strokeWidth="5" strokeLinecap="round" />)}</svg>)}</div>
            <Buzon />
            <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 26, textAlign: 'center', lineHeight: 1.1}}>Junta Electoral Provincial</div>
          </div>
          <div style={{...col, gap: 12, flex: 1}}>
            <Hito f="21–26 oct" t="se presentaron" hecho />
            <Hito f="28 oct" t="el BOE publicó las presentadas" hecho />
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}><div style={{flex: 1}}><Hito f="2 nov" t="proclamación" mostaza /></div>
              <div style={{border: `5px solid ${C.turquesa}`, color: C.turquesa, fontFamily: F.titular, fontSize: 24, padding: '2px 8px', transform: 'rotate(-6deg)', borderRadius: 8}}>PROCLAMADA</div></div>
            <Hito f="3 nov" t="el BOE publica las proclamadas" mostaza />
          </div>
        </div>
      );
    case 's5':
      return (
        <div style={{...col, gap: 18}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <Paso t="Sorteo" s="25–29" mostaza />
            <span style={{fontFamily: F.titular, fontSize: 40, margin: '0 -4px'}}>→</span>
            <Paso t="Notificación" s="3 días" />
            <span style={{fontFamily: F.titular, fontSize: 40, margin: '0 -4px'}}>→</span>
            <Paso t="Alegaciones" s="7 días" />
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px'}}>
            <Bombo /><Sobre />
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 6}}><Silueta /><Silueta c={C.piedra} /><Silueta c={C.piedra} /></div>
          </div>
        </div>
      );
    case 's6': {
      const cuadro = (t: string, v: string) => (
        <div style={{flex: 1, background: '#fff', border: `4px solid ${C.tinta}`, borderRadius: 16, padding: '8px 6px', textAlign: 'center'}}>
          <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 40, lineHeight: 1.1}}>{t}</div>
          <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 38, color: C.tinta, background: C.mostaza, borderRadius: 8, marginTop: 4}}>{v}</div>
        </div>
      );
      return (
        <div style={{...col, gap: 10}}>
          <div style={{display: 'flex', gap: 10}}>{cuadro('Pedirlo hasta', '19-nov')}{cuadro('Te llega', '9–22 nov')}{cuadro('Enviarlo hasta', '25-nov')}</div>
          <div style={{display: 'flex', gap: 14, alignItems: 'center', background: '#E9E3D6', borderRadius: 14, padding: '6px 14px'}}>
            <Maleta /><div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 40, lineHeight: 1.1}}>Fuera temporalmente: solicítalo hasta el <b>31-oct</b></div>
          </div>
          <div style={{display: 'flex', gap: 14, alignItems: 'center', background: '#E9E3D6', borderRadius: 14, padding: '6px 14px'}}>
            <Edificio /><div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 40, lineHeight: 1.15}}>Si vives fuera (CERA, censo de residentes ausentes): por correo al consulado hasta el <b>24-nov</b> o en su urna, <b>21–26 nov</b></div>
          </div>
        </div>
      );
    }
    case 's7':
      return (
        <div style={{...col, gap: 18}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <div style={{transform:'scale(0.7)',transformOrigin:'left center',width:91,flex:'none'}}><Megafono /></div>
            <div style={{display: 'flex', gap: 2, flex: 1}}>{Array.from({length: 15}, (_, k) => <div key={k} style={{flex: 1, height: 100, background: C.mostaza, border: `3px solid ${C.tinta}`, borderRadius: 6, fontFamily: F.cifra, fontWeight: 700, fontSize: 38, color: C.tinta, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{13 + k}</div>)}</div>
          </div>
          <div style={{display: 'flex', gap: 14}}>
            <div style={{flex: 1, background: '#E9E3D6', borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12}}><BarrasTachadas /><div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 40, lineHeight: 1.1}}>24–28 nov · sin encuestas</div></div>
            <div style={{flex: 1, background: '#E9E3D6', borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12}}><Luna /><div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 40, lineHeight: 1.1}}>28 nov · reflexión</div></div>
          </div>
        </div>
      );
    case 's8':
      return (
        <div style={{display: 'flex', gap: 24, alignItems: 'center'}}>
          <div style={{...col, gap: 14, flex: 1}}>
            <Hito f="29 nov" t="votación" mostaza />
            <Hito f="4–7 dic" t="escrutinio general" mostaza />
            <Hito f="" t="proclamación de electos" mostaza />
            <Hito f="23 dic" t="nuevas Cortes" mostaza />
          </div>
          <div style={{...col, alignItems: 'center', gap: 2}}>
            <Hemiciclo />
            <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 40}}>23-DIC</div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

/* ---------- diapositivas especiales ---------- */
const Fuente: React.FC<{t?: string; color?: string}> = ({t, color = C.tinta}) => (
  <div style={{position: 'absolute', left: M, right: M, top: 1214, fontFamily: F.texto, fontWeight: 600, fontSize: 28, color, opacity: 0.85, whiteSpace: 'nowrap', overflow: 'hidden'}}>{t}</div>
);

const Portada: React.FC<{s: Slide; i: number; total: number}> = ({s, i, total}) => (
  <div style={{position: 'absolute', inset: 0, background: C.crema}}>
    <Cabecera i={i} total={total} />
    <div style={{position: 'absolute', left: M, right: M, top: 150}}>
      <div style={{fontFamily: F.texto, fontWeight: 700, fontSize: 44, color: C.tinta, lineHeight: 1.15, marginBottom: 18}}>{s.antetitulo}</div>
      <div style={{fontFamily: F.titular, fontSize: 88, lineHeight: 1.0, color: C.tinta, whiteSpace: 'pre-line'}}>{s.titular}</div>
    </div>
    <div style={{position: 'absolute', left: M, right: M, top: 520, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <Documento w={140} />
      <div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 340, color: C.mostaza, lineHeight: 1, WebkitTextStroke: `4px ${C.tinta}`}}>54</div>
      <Urna w={140} />
    </div>
    <div style={{position: 'absolute', left: M, right: M, top: 880, fontFamily: F.texto, fontWeight: 600, fontSize: 44, color: C.tinta, lineHeight: 1.25}}>{s.texto}</div>
    <div style={{position: 'absolute', right: M, top: 1030, fontFamily: F.texto, fontWeight: 700, fontSize: 44, color: C.tinta}}>Desliza →</div>
    <ReglaMarcas r={s.regla!} />
    <Fuente t={s.fuente} />
  </div>
);

const Giro: React.FC<{s: Slide; i: number; total: number}> = ({s, i, total}) => {
  const filas = [['0', 'convocatoria'], ['15–20', 'candidaturas'], ['25–29', 'sorteo de mesas'], ['28', 'listas proclamadas, en el BOE'], ['38', 'empieza la campaña'], ['54', 'votación']];
  return (
    <div style={{position: 'absolute', inset: 0, background: C.tinta}}>
      <Cabecera i={i} total={total} oscuro />
      <div style={{position: 'absolute', left: M, right: M, top: 140, fontFamily: F.titular, fontSize: 70, lineHeight: 1.02, color: C.crema}}>{s.titular}</div>
      <div style={{position: 'absolute', left: M, top: 400, width: 700, display: 'flex', flexDirection: 'column', gap: 12}}>
        {filas.map(([d, t]) => (
          <div key={d} style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: F.texto, fontWeight: 600, fontSize: 38, color: C.crema}}>
            <span style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 38, color: C.tinta, background: C.mostaza, borderRadius: 8, padding: '0 10px', minWidth: 130, textAlign: 'center'}}>{d}</span>
            <span>{t}</span>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', right: M - 10, top: 470}}><Cronometro s={250} /></div>
      <div style={{position: 'absolute', left: M, right: M, top: 800, fontFamily: F.texto, fontWeight: 600, fontSize: 42, color: C.crema, lineHeight: 1.28}}>{s.texto}</div>
      <div style={{position: 'absolute', left: M, right: M, top: 1090, fontFamily: F.texto, fontWeight: 600, fontSize: 30, color: C.piedra, lineHeight: 1.2}}>{s.nota}</div>
      <Fuente t={s.fuente} color={C.piedra} />
    </div>
  );
};

const Cierre: React.FC<{s: Slide; i: number; total: number}> = ({s, i, total}) => (
  <div style={{position: 'absolute', inset: 0, background: C.mostaza}}>
    <Cabecera i={i} total={total} />
    <div style={{position: 'absolute', left: M, right: M, top: 150, fontFamily: F.titular, fontSize: 84, lineHeight: 1.02, color: C.tinta}}>{s.titular}</div>
    <div style={{position: 'absolute', left: M, right: M, top: 420, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <Documento w={150} /><div style={{fontFamily: F.cifra, fontWeight: 700, fontSize: 44, color: C.tinta}}>6-OCT → 29-N</div><Urna w={150} />
    </div>
    <div style={{position: 'absolute', left: M, right: M, top: 760, fontFamily: F.texto, fontWeight: 600, fontSize: 44, color: C.tinta, lineHeight: 1.25}}>{s.texto}</div>
    <div style={{position: 'absolute', left: M, top: 1000, background: C.tinta, color: C.crema, fontFamily: F.texto, fontWeight: 700, fontSize: 48, padding: '8px 30px', borderRadius: 50}}>📌 Guárdalo</div>
    <div style={{position: 'absolute', right: M, top: 1012, fontFamily: F.texto, fontWeight: 600, fontSize: 36, color: C.tinta}}>Fuentes en la descripción</div>
    <ReglaMarcas r={s.regla!} fondo={C.mostaza} />
  </div>
);

export const Carrusel: React.FC<{slides: Slide[]; indice: number}> = ({slides, indice}) => {
  const s = slides[indice];
  const total = slides.length;
  if (!s) return null;
  if (s.tipo === 'portada') return <Portada s={s} i={indice} total={total} />;
  if (s.tipo === 's9') return <Giro s={s} i={indice} total={total} />;
  if (s.tipo === 's10') return <Cierre s={s} i={indice} total={total} />;
  return (
    <div style={{position: 'absolute', inset: 0, background: C.crema}}>
      <Cabecera i={indice} total={total} dia={s.dia} />
      <div style={{position: 'absolute', left: M, right: M, top: 140, bottom: 1350 - 1100, display: 'flex', flexDirection: 'column', gap: 20}}>
        <div style={{fontFamily: F.titular, fontSize: tamTitular(s.titular), lineHeight: 1.03, color: C.tinta}}>{s.titular}</div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}><Esquema s={s} /></div>
        {s.pastilla && <Pastilla {...s.pastilla} />}
        <div style={{fontFamily: F.texto, fontWeight: 600, fontSize: 40, color: C.tinta, lineHeight: 1.22}}>{s.texto}</div>
      </div>
      {s.regla && <ReglaMarcas r={s.regla} />}
      <Fuente t={s.fuente} />
    </div>
  );
};
