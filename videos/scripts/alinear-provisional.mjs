// Uso: node scripts/alinear-provisional.mjs NNN-slug [--vel=1.1]
// Alinea tiempos de palabra de la voz PROVISIONAL a las pausas reales entre frases (silencedetect),
// acelera el audio (atempo) y restaura en subtítulos las grafías de voz.txt -> guion (Limósh -> Limoges).
import fs from 'node:fs'; import path from 'node:path'; import {spawnSync} from 'node:child_process';
const id = process.argv[2]; const vel = parseFloat((process.argv.find(a=>a.startsWith('--vel='))||'--vel=1.1').split('=')[1]);
const dir = path.resolve('piezas', id); const mp3 = path.join(dir,'voz.mp3'); const orig = path.join(dir,'voz-sin-acelerar.mp3');
if (!fs.existsSync(orig)) fs.copyFileSync(mp3, orig);
const t = JSON.parse(fs.readFileSync(path.join(dir,'tiempos.json'),'utf8'));
const r = spawnSync('ffmpeg',['-hide_banner','-i',orig,'-af','silencedetect=noise=-35dB:d=0.65','-f','null','-'],{encoding:'utf8'}).stderr;
const st=[...r.matchAll(/silence_start: ([\d.]+)/g)].map(m=>+m[1]); const en=[...r.matchAll(/silence_end: ([\d.]+)/g)].map(m=>+m[1]);
const dur=t.duracion; const seg=[]; let ini=0.1;
st.forEach((s,i)=>{ seg.push([ini,s]); ini=en[i]??dur; });
const ws=t.palabras; const frases=[]; let cur=[];
ws.forEach(w=>{cur.push(w); if(/[.?!]$/.test(w.t)){frases.push(cur);cur=[];}}); if(cur.length)frases.push(cur);
if(frases.length!==seg.length) console.warn(`AVISO: ${frases.length} frases y ${seg.length} segmentos`);
const peso=w=>w.t.length+2+(/[,;:]$/.test(w.t)?3:0);
frases.forEach((f,i)=>{const [a,b]=seg[Math.min(i,seg.length-1)]; const s=f.reduce((x,w)=>x+peso(w),0); let c=a;
  f.forEach(w=>{const d=(peso(w)/s)*(b-a); w.inicio=+(c/vel).toFixed(3); w.fin=+((c+d)/vel).toFixed(3); c+=d; w.t=w.t.replace('Limósh','Limoges');});});
spawnSync('ffmpeg',['-y','-loglevel','error','-i',orig,'-filter:a',`atempo=${vel}`,'-c:a','libmp3lame','-b:a','128k',mp3]);
const d2=+spawnSync('ffprobe',['-v','error','-show_entries','format=duration','-of','csv=p=0',mp3],{encoding:'utf8'}).stdout;
t.duracion=d2; t.velocidad=vel; fs.writeFileSync(path.join(dir,'tiempos.json'),JSON.stringify(t,null,2));
console.log('frases:',frases.map(f=>`${f[0].inicio}-${f.at(-1).fin}`).join(' | '),'\nduración voz',d2.toFixed(2));
