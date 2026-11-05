// Ausschließlich Entwurfsrasterung mit eigenem externem Chrome-Profil.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {pathToFileURL} = require('node:url');
const base = __dirname;
const root = path.resolve(base, '../..');
const guard = path.join(root, 'scripts/external-storage.mjs');
const cache = '/Volumes/ThunderBolt4_2TB/Development/Caches/codex-lebende-welt-chrome';
const tmp = '/Volumes/ThunderBolt4_2TB/Development/Tmp';
for (const p of [base, cache, tmp]) execFileSync('node', [guard,p]);
fs.mkdirSync(cache,{recursive:true});
const modulePath = process.env.CODEX_WELT_PLAYWRIGHT || '/Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-claude-20261103/node_modules/playwright-core';
const {chromium} = require(modulePath);
(async()=>{
  const context = await chromium.launchPersistentContext(cache,{
    executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless:true, viewport:{width:1800,height:1160}, deviceScaleFactor:1,
    env:{...process.env,TMPDIR:tmp}, args:['--no-first-run','--no-default-browser-check','--disable-gpu']
  });
  const page = context.pages()[0];
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const results=[];
  try {
  for (const file of fs.readdirSync(path.join(base,'bilder')).filter(x=>/^0\d.*\.svg$/.test(x)).reverse()) {
    const narrow=file.includes('schmal');
    await page.setViewportSize(narrow?{width:430,height:1340}:{width:1800,height:1160});
    await page.goto(pathToFileURL(path.join(base,'bilder',file)).href);
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForFunction(()=>Array.from(document.images).every(img=>img.complete));
    const target=path.join(base,'bilder',file.replace('.svg','.png'));
    await page.screenshot({path:target,fullPage:false});
    console.log('gerastert:',file);
    results.push({file,viewport:page.viewportSize(),bytes:fs.statSync(target).size});
  }
  for (const viewport of [{width:1440,height:1000},{width:430,height:900}]) {
    await page.setViewportSize(viewport);
    await page.goto(pathToFileURL(path.join(base,'index.html')).href);
    await page.evaluate(async()=>{
      await document.fonts.ready;
      await Promise.all(Array.from(document.images).map(img=>{img.loading='eager';return img.decode();}));
    });
    const layout=await page.evaluate(()=>({
      images:document.images.length,
      loaded:Array.from(document.images).every(img=>img.complete&&img.naturalWidth>0),
      horizontalOverflow:document.documentElement.scrollWidth>innerWidth,
      links:Array.from(document.querySelectorAll('a[href]')).filter(a=>!a.hash).map(a=>a.getAttribute('href'))
    }));
    if(!layout.loaded||layout.images!==6||layout.horizontalOverflow) throw new Error('Bildfolge unvollständig oder überbreit: '+JSON.stringify(layout));
    for(const href of layout.links) if(!fs.existsSync(path.resolve(base,href))) throw new Error('Fehlender lokaler Verweis: '+href);
    const name=viewport.width===430?'pruefung-bildfolge-schmal.png':'pruefung-bildfolge-desktop.png';
    await page.screenshot({path:path.join(base,'bilder',name),fullPage:false});
    results.push({gallery:'index.html',viewport,layout});
  }
  if(process.env.CODEX_WELT_REFERENCE_URL){
    await page.setViewportSize({width:1440,height:1000});
    await page.goto(process.env.CODEX_WELT_REFERENCE_URL,{waitUntil:'networkidle'});
    await page.waitForTimeout(1800);
    await page.screenshot({path:path.join(base,'bilder','referenz-original-04-chrome.png'),fullPage:false});
    results.push({reference:process.env.CODEX_WELT_REFERENCE_URL,title:await page.title()});
  }
  } finally { await context.close(); }
  fs.writeFileSync(path.join(base,'RENDERPRUEFUNG.json'),JSON.stringify({kind:'statische Design-Leinwände, keine App-Abnahme',browser:'Google Chrome',results,errors},null,2)+'\n');
  console.log(JSON.stringify({checks:results.length,errors,results},null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
