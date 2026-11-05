const { chromium } = require('/Volumes/ThunderBolt4_2TB/MeineApps/faska-varianten/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
for (const [w,h] of [[1440,900],[1280,800],[390,844]]){
const p=await b.newPage({viewport:{width:w,height:h}});const f=[];p.on('pageerror',e=>f.push(String(e)));
await p.goto('file:///Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-claude-20261103/proben/schloss-schluessel/index.html');await p.waitForTimeout(2500);
const titel=await p.evaluate(()=>{const D=window.SCHLOSS_DATEN;return [...new Set(D.feld.paare.flatMap(i=>[D.paare[i].A.titel,D.paare[i].B.titel]))];});
let schlecht=[], armSchilder=0, orte=0;
const zaehle=async(wo)=>p.evaluate(()=>{const ts=[...document.querySelectorAll('.schrift text')].map(t=>({t:t.textContent,r:t.getBoundingClientRect(),arm:t.classList.contains('arm-text')}));let n=[];for(let i=0;i<ts.length;i++)for(let j=i+1;j<ts.length;j++){const a=ts[i].r,c=ts[j].r;const ov=Math.max(0,Math.min(a.right,c.right)-Math.max(a.left,c.left))*Math.max(0,Math.min(a.bottom,c.bottom)-Math.max(a.top,c.top));if(ov>6)n.push(`${ts[i].t.slice(0,30)} / ${ts[j].t.slice(0,30)} (${Math.round(ov)})`);}return {n,arm:ts.filter(x=>x.arm).length};});
let r=await zaehle(); if(r.n.length) schlecht.push(['Überblick',r.n]);
for(const t of titel){
  await p.evaluate(()=>{const z=document.querySelector('.spalte-zurueck');z&&z.click();});await p.waitForTimeout(250);
  const pt=await p.evaluate((t)=>window.__schloss.ortPunkt(t),t); if(!pt) continue;
  if(pt.x<0||pt.y<0||pt.x>w||pt.y>h) continue;
  await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(w<700?1400:1200);
  const z=await p.evaluate(()=>window.__schloss.zustand().wahl); if(!z||z.art!=='ort') continue;
  orte++; r=await zaehle(); armSchilder+=r.arm; if(r.n.length) schlecht.push([t,r.n]);
  if(t==='Zeitblindheit'&&w===1440) await p.screenshot({path:'ort-zeitblindheit-neu.png'});
}
console.log(w,'Orte geprüft',orte,'Armschilder gesamt',armSchilder,'Überlappungen',JSON.stringify(schlecht,null,0).slice(0,1500),f);
await p.close();}
await b.close();})();
