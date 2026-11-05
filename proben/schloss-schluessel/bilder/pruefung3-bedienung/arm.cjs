const path=require('node:path');
const { chromium } = require('/Volumes/ThunderBolt4_2TB/MeineApps/faska-varianten/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 for (const [w,h] of [[1440,900],[390,844]]){
 const p=await b.newPage({viewport:{width:w,height:h}});
 await p.goto('file://'+path.resolve(__dirname,'../../index.html'));await p.waitForTimeout(2500);
 const r=await p.evaluate(()=>{const S=window.__schloss,D=window.SCHLOSS_DATEN;const out=[];
  for(const i of D.feld.paare.filter(i=>D.paare[i].fugen.length)){const q=S.armPunkt(i);const el=document.elementFromPoint(q.x,q.y);
   out.push({i,paar:D.paare[i].A.titel+'|'+D.paare[i].B.titel,trifft:el?(el.getAttribute('class')||el.tagName)+' '+(el.getAttribute('aria-label')||'').slice(0,60):null});}
  return out;});
 const falsch=r.filter(x=>!x.trifft||!x.trifft.includes(x.paar.split('|')[1].slice(0,10))&&!x.trifft.includes(x.paar.split('|')[0].slice(0,10)) || !x.trifft.startsWith('arm-treffer'));
 console.log(w, 'arme',r.length,'Mitte trifft nicht den eigenen Arm:',JSON.stringify(falsch,null,0));
 await p.close();}
 await b.close();})();
