const path=require('node:path');
const { chromium } = require('/Volumes/ThunderBolt4_2TB/MeineApps/faska-varianten/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const p=await b.newPage({viewport:{width:1440,height:900}});
 const f=[];p.on('console',m=>f.push(m.type()+': '+m.text()));p.on('pageerror',e=>f.push('pe '+e.message));
 await p.goto('file://'+path.resolve(__dirname,'../../index.html'));await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>{const S=window.__schloss;const D=window.SCHLOSS_DATEN;
  const out={};for(const s of ['lesart','beleg','grenze','wort','kontext'])out[s]=S.fehltNur(s).map(i=>D.paare[i].A.titel+' | '+D.paare[i].B.titel);
  out.feld=D.feld.paare.filter(i=>D.paare[i].fugen.length).map(i=>({i,t:D.paare[i].A.titel+' | '+D.paare[i].B.titel,z:S.zaehne(i)}));
  out.orte=D.feld.orte.map(k=>D.orte[k].titel);return out;});
 console.log(JSON.stringify(r,null,1));console.log(f);await b.close();})();
