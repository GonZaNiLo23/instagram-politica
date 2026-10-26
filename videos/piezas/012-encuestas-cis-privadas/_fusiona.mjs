import fs from 'node:fs';
const T = JSON.parse(fs.readFileSync('tiempos-fonetico.json','utf8'));
const out = [];
for (let i=0;i<T.palabras.length;i++){
  const w=T.palabras[i]; const base=w.t.replace(/[.,:;¿?¡!]/g,''); const sig=w.t.slice(base.length);
  const pre=w.t.match(/^[¿¡]/)?.[0]||''; 
  const core=w.t.replace(/^[¿¡]/,'').replace(/[.,:;?!]+$/,''); const post=w.t.match(/[.,:;?!]+$/)?.[0]||'';
  if(core==='pe' && T.palabras[i+1] && T.palabras[i+1].t.replace(/[.,:;?!]+$/,'')==='pe'){
    const n=T.palabras[i+1]; const post2=n.t.match(/[.,:;?!]+$/)?.[0]||'';
    out.push({t:'PP'+post2,inicio:w.inicio,fin:n.fin}); i++; continue;}
  if(core==='pe-soe') {out.push({...w,t:pre+'PSOE'+post});continue;}
  if(core==='Cis') {out.push({...w,t:pre+'CIS'+post});continue;}
  out.push(w);
}
T.palabras=out; fs.writeFileSync('tiempos.json',JSON.stringify(T));
console.log(out.length);
out.forEach((w,i)=>process.stdout.write(i+':'+w.t+'@'+w.inicio.toFixed(1)+' '));
