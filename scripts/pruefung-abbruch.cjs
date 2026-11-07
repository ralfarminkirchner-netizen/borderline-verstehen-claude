// Prüft die drei Ausgänge eines abgebrochenen Speichervorgangs (gespeichert / nicht gespeichert / Wirkung unklar).
// Vorher einen isolierten Dienst starten: PORT=4397 WERKSTATT_DIR=$PWD/.cache/ternaer-daten node server.mjs
// Dann: node scripts/pruefung-abbruch.cjs  (nie mit private-data)
const { chromium } = require('/Volumes/ThunderBolt4_2TB/MeineApps/faska-varianten/node_modules/playwright');
const fs=require('fs'); const DATEI='/Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-claude-20261103/.cache/ternaer-daten/werkstatt.json';
const notizen=()=>{try{return JSON.parse(fs.readFileSync(DATEI,'utf8')).notizen.map(n=>n.text)}catch{return []}};
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const p=await b.newPage({viewport:{width:1280,height:800}}); const fehler=[];p.on('pageerror',e=>fehler.push(String(e)));
await p.goto('http://127.0.0.1:4397/');await p.waitForTimeout(2500);
const aendere=(t)=>p.evaluate(async(t)=>{const m=await import('/fl/werk.mjs');m.aendereWerk(d=>d.notizen.push({id:t,ortId:'x',text:t}));},t);
const stand=()=>p.evaluate(()=>window.fugenland.werk.stand);
const anzeige=()=>p.locator('#speicher-stand').innerText();
const erg=[];
// 0: normaler Fall
await aendere('normal'); await p.waitForTimeout(1500); erg.push(['0 normal', await stand(), notizen()]);
// A: Dienst schreibt, Antwort reißt ab
await p.route('**/api/werkstatt', async (route)=>{ if(route.request().method()==='PUT'){ await route.fetch(); return route.abort('connectionreset'); } return route.continue(); });
await aendere('A-geschrieben'); await p.waitForTimeout(2000); erg.push(['A schreibt, Antwort weg', await stand(), notizen()]); await p.unroute('**/api/werkstatt');
// B: Anfrage kommt nie an
await p.route('**/api/werkstatt', (route)=> route.request().method()==='PUT' ? route.abort('connectionreset') : route.continue());
await aendere('B-nie-angekommen'); await p.waitForTimeout(2000); erg.push(['B nie angekommen', await stand(), notizen()]); await p.unroute('**/api/werkstatt');
// C: alles weg, dann Erholung
await p.route('**/api/werkstatt', async (route)=>{ if(route.request().method()==='PUT'){ await route.fetch(); return route.abort('connectionreset'); } return route.abort('connectionreset'); });
await aendere('C-geschrieben'); await p.waitForTimeout(2000); erg.push(['C Dienst stumm', await stand(), notizen(), await anzeige()]);
await p.screenshot({path:'ternaer-unklar.png', clip:{x:700,y:0,width:580,height:60}});
await p.unroute('**/api/werkstatt');
await aendere('C-danach'); await p.waitForTimeout(2500); erg.push(['C nach Erholung', await stand(), notizen()]);
for(const e of erg) console.log(JSON.stringify(e)); console.log('fehler',fehler);
await b.close();})();
