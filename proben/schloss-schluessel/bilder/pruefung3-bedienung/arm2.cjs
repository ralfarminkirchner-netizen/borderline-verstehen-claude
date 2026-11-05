const path=require('node:path');
const { chromium } = require('/Volumes/ThunderBolt4_2TB/MeineApps/faska-varianten/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 for (const [w,h] of [[1440,900],[1280,800],[390,844]]){
 const p=await b.newPage({viewport:{width:w,height:h}});
 await p.goto('file://'+path.resolve(__dirname,'../../index.html'));await p.waitForTimeout(2500);
 const r=await p.evaluate(()=>{const S=window.__schloss,D=window.SCHLOSS_DATEN;const out=[];let ok=0,n=0;
  for(const i of D.feld.paare.filter(i=>D.paare[i].fugen.length)){const P=D.paare[i];
   for(const f of P.fugen){const von=f.vomSchloss?P.A:P.B, zu=f.vomSchloss?P.B:P.A;
    const a=S.ortPunkt(von.titel), z=S.ortPunkt(zu.titel); if(!a||!z) continue;
    const L=Math.hypot(z.x-a.x,z.y-a.y); const t=Math.min(0.2, (L*0.12+20)/L);
    const x=a.x+(z.x-a.x)*t,y=a.y+(z.y-a.y)*t; const el=document.elementFromPoint(x,y); n++;
    const lab=el?(el.getAttribute('aria-label')||el.getAttribute('class')||el.tagName):'';
    if(lab.includes(P.A.titel)&&lab.includes(P.B.titel)) ok++; else out.push(`${von.titel}→${zu.titel}: trifft „${String(lab).slice(0,70)}“`);}}
  return {ok,n,falsch:out};});
 console.log(w, JSON.stringify(r,null,1));
 await p.close();}
 await b.close();})();
