const path=require('node:path');
const { chromium } = require('/Volumes/ThunderBolt4_2TB/MeineApps/faska-varianten/node_modules/playwright');
const {INIT}=require('./helfer.cjs');
(async()=>{
 const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
 const ctx=await b.newContext({viewport:{width:1440,height:900}});await ctx.addInitScript(INIT);
 const p=await ctx.newPage();const f=[];p.on('console',m=>{if(['error','warning'].includes(m.type()))f.push(m.text())});p.on('pageerror',e=>f.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,'../../index.html'));await p.waitForTimeout(2000);
 // falscher Arm: Hover auf sichtbarem Arm Delay Aversion→Zeitblindheit
 const pt=await p.evaluate(()=>{const S=window.__schloss;const a=S.ortPunkt('Delay Aversion'),z=S.ortPunkt('Zeitblindheit');const L=Math.hypot(z.x-a.x,z.y-a.y),t=Math.min(0.2,(L*0.12+20)/L);return {x:a.x+(z.x-a.x)*t,y:a.y+(z.y-a.y)*t};});
 await p.mouse.move(pt.x,pt.y);await p.waitForTimeout(500);
 await p.screenshot({path:path.join(__dirname,'Z1-hover-sichtbarer-arm-falsche-fuge.png')});
 await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(900);
 console.log('Z1 geklickt auf Arm Delay Aversion→Zeitblindheit, betreten:',await p.locator('.verbsatz').innerText());
 await p.screenshot({path:path.join(__dirname,'Z1b-falsche-fuge-betreten.png')});
 await p.keyboard.press('Escape');await p.waitForTimeout(800);
 // leerer Raum zwischen Körpern: Klick sollte Wahl lösen
 // Ton an, Einrasten
 await p.click('.ecke-wort:has-text("aus")');
 const pa=await p.evaluate(()=>window.__schloss.ortPunkt('Aufgabenstarre'));await p.mouse.click(pa.x,pa.y);await p.waitForTimeout(800);
 await p.click('.paar-knopf:has-text("Wartemodus")');await p.waitForTimeout(800);
 for(const r of ['beleg','grenze']){await p.click('.riegel-'+r);const a=p.locator('.versuch .stein-knopf:has-text("auflegen")');if(await a.count())await a.click();}
 await p.click('.riegel-kontext');await p.fill('.versuch .eigen-feld','bei Stress');await p.press('.versuch .eigen-feld','Enter');await p.waitForTimeout(800);
 await p.locator('.versuch .stein-knopf:has-text("abnehmen")').click();await p.waitForTimeout(800);
 console.log('Z2 Ton', await p.evaluate(()=>({audio:window.__spuren.audio,z:window.__schloss.zustand().paare[1]})), 'fehler',f);
 // Escape im Eingabefeld verwirft Text
 await p.fill('.versuch .eigen-feld','halb getippte Bedingung');await p.screenshot({path:path.join(__dirname,'Z3a-vor-escape.png')});
 await p.press('.versuch .eigen-feld','Escape');await p.waitForTimeout(800);
 await p.click('.paar-knopf:has-text("Wartemodus")');await p.waitForTimeout(800);await p.click('.riegel-kontext');
 console.log('Z3 nach Escape+Rückkehr Feldinhalt:', JSON.stringify(await p.inputValue('.versuch .eigen-feld')));
 // Grenze wegschieben-Zyklus Meldung
 await p.click('.riegel-grenze');const ab=p.locator('.versuch .stein-knopf:has-text("abnehmen")');if(await ab.count())await ab.click();
 for(let k=0;k<3;k++)await p.locator('.versuch .stein-knopf:has-text("wegschieben")').click();
 await p.screenshot({path:path.join(__dirname,'Z4-wegschieben-zyklus.png')});
 console.log('Z4', (await p.locator('.versuch').innerText()).replace(/\n+/g,' | '));
 console.log('storage', await p.evaluate(()=>[localStorage.length,sessionStorage.length,location.href.split('/').pop()]),'spuren',await p.evaluate(()=>window.__spuren));
 // reduziert: lebendig-Knopf
 await b.close();})();
