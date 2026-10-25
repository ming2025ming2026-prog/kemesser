const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),checks=[],errors=[];
const server=http.createServer((req,res)=>{
  const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+(name.endsWith('/')?name+'index.html':name));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return res.writeHead(404).end();
  const size=fs.statSync(file).size,m=req.headers.range?.match(/bytes=(\d+)-(\d*)/),start=m?+m[1]:0,end=m?.[2]?Math.min(+m[2],size-1):size-1;
  const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.mp4':'video/mp4'};
  res.writeHead(m?206:200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':end-start+1,...(m?{'Content-Range':`bytes ${start}-${end}/${size}`}:{})});
  const stream=fs.createReadStream(file,{start,end});stream.pipe(res);res.on('close',()=>stream.destroy());
});
const record=(name,details={})=>{checks.push({name,...details});console.log('PASS',name);};
async function fill(page){await page.evaluate(()=>{
  for(const c of document.querySelectorAll('form input')){
    if(['file','hidden'].includes(c.type)||c.name==='_honey'||c.hasAttribute('data-local-copy'))continue;
    if(c.type==='checkbox')c.checked=true;else c.value=c.type==='email'?'test@example.com':'Test data';
  }
  for(const c of document.querySelectorAll('form textarea'))c.value='Test message';
  for(const c of document.querySelectorAll('form select[required]'))if(!c.value)c.selectedIndex=1;
});}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const context=await browser.newContext();await context.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
  for(const file of ['inquiry.html','support.html','en/inquiry.html','en/support.html']){
   const p=await context.newPage();p.on('pageerror',e=>errors.push({file,message:e.message}));p.on('dialog',d=>d.accept());
   await p.goto(origin+'/'+file+'?product=ThawLINE');await p.evaluate(()=>localStorage.clear());
   assert.equal(await p.locator('[data-local-copy]').isChecked(),false);
   let sent=0,payload='';await p.route('https://formsubmit.co/**',r=>{sent++;payload=r.request().postData();return r.fulfill({contentType:'application/json',body:'{"success":true}'});});
   await fill(p);await p.locator('input[required]').first().fill('   ');await p.locator('button[type=submit]').click();assert.equal(sent,0);
   await fill(p);await p.locator('button[type=submit]').click();await p.waitForFunction(()=>document.querySelector('[data-form-message]').dataset.state==='success');
   assert.equal(await p.evaluate(()=>localStorage.getItem('kemesser-submissions')),null);assert.ok(payload.includes('khaleesi@kemesser.com,chens@kemesser.com'));assert.equal(new URL(p.url()).searchParams.has('product'),false);
   record(file+': whitespace blocked, no default local PII, recipients, clean success URL');
   await fill(p);await p.locator('[data-local-copy]').check();await p.locator('button[type=submit]').click();await p.waitForFunction(()=>document.querySelector('[data-form-message]').dataset.state==='success');
   const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('kemesser-submissions')));assert.equal(saved.length,1);assert.ok(saved[0].expiresAt>Date.now());record(file+': explicit local-copy opt-in with expiry');
   if(file.includes('support')){
    const a=p.locator('input[type=file]');await a.setInputFiles({name:'test.exe',mimeType:'application/octet-stream',buffer:Buffer.from('test')});assert.equal(await a.evaluate(e=>e.validity.valid),false);
    await a.setInputFiles({name:'large.pdf',mimeType:'application/pdf',buffer:Buffer.alloc(10000001)});assert.equal(await a.evaluate(e=>e.validity.valid),false);
    await a.setInputFiles({name:'boundary.pdf',mimeType:'application/pdf',buffer:Buffer.alloc(10000000)});assert.equal(await a.evaluate(e=>e.validity.valid),true);
    await a.setInputFiles({name:'valid.PDF',mimeType:'application/pdf',buffer:Buffer.from('test')});assert.equal(await a.evaluate(e=>e.validity.valid),true);record(file+': attachment type, size and uppercase extension');
   }
   await p.close();
  }
  const p=await context.newPage();p.on('pageerror',e=>errors.push({file:'edge',message:e.message}));
  p.on('dialog',d=>d.accept());
  await p.addInitScript(()=>{const original=setTimeout;window.setTimeout=(fn,ms,...args)=>original(fn,ms===30000?60:ms,...args);});
  for(const file of ['inquiry.html','en/inquiry.html']){
   await p.goto(origin+'/'+file);await fill(p);
   await p.route('https://formsubmit.co/**',async r=>{await new Promise(r=>setTimeout(r,180));try{await r.abort();}catch{}});
   await p.locator('button[type=submit]').click();await p.waitForFunction(()=>/超时|timed out/.test(document.querySelector('[data-form-message]').textContent));assert.equal(await p.locator('button[type=submit]').isEnabled(),true);record(file+': timeout preserves data and restores controls (timer accelerated)');
   await p.unroute('https://formsubmit.co/**');
  }
  await p.goto(origin+'/inquiry.html');await fill(p);await context.setOffline(true);await p.locator('button[type=submit]').click();assert.match(await p.locator('[data-form-message]').textContent(),/连接网络/);await context.setOffline(false);record('Offline submission has actionable error');
  await p.goto(origin+'/admin.html');let chatRequests=0;p.on('request',r=>{if(r.url().includes('53kf'))chatRequests++;});
  await p.evaluate(()=>{localStorage.setItem('kemesser-submissions',JSON.stringify([{createdAt:'expired',expiresAt:1,data:{email:'test@example.com'}}]));});await p.reload();await p.waitForTimeout(1600);assert.equal(chatRequests,0);assert.equal(await p.locator('.record-card').count(),0);record('Expired copies purged on access; no chat on local-history page');
  await p.evaluate(()=>{Storage.prototype.getItem=()=>{throw Error('blocked')};Storage.prototype.removeItem=()=>{throw Error('blocked')}});await p.locator('[data-export-records]').click();await p.locator('[data-clear-records]').click();record('Blocked storage export/clear handled without uncaught exception');
  for(const viewport of [{width:844,height:390},{width:640,height:450},{width:768,height:450},{width:320,height:568}]){
   await p.setViewportSize(viewport);await p.goto(origin+'/en/index.html');await p.locator('[data-menu-button]').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('.main-nav a').first().evaluate(e=>e===document.activeElement),true);
   await p.locator('.nav-dropdown-trigger').click();const nav=p.locator('.main-nav');await nav.evaluate(e=>e.scrollTop=e.scrollHeight);const bounds=await nav.boundingBox();assert.ok(bounds.y+bounds.height<=viewport.height);await p.locator('.mobile-language-switch').click();await p.waitForURL('**/index.html');record('Short viewport scrollable keyboard navigation',viewport);
  }
  const noscript=await browser.newContext({javaScriptEnabled:false});await noscript.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
  const n=await noscript.newPage();let nativeRequest;
  await n.route('https://formsubmit.co/**',r=>{nativeRequest={method:r.request().method(),body:decodeURIComponent(r.request().postData()||'')};return r.fulfill({contentType:'text/html',body:'<title>Mocked native POST</title>'});});
  for(const file of ['inquiry.html','support.html','en/inquiry.html','en/support.html']){await n.goto(origin+'/'+file);const form=await n.locator('form').evaluate(f=>({method:f.method,action:f.action,cc:f.querySelector('[name=_cc]').value,options:f.querySelector('[data-product-options]').options.length}));assert.equal(form.method,'post');assert.equal(form.action,'https://formsubmit.co/andy@kemesser.com');assert.ok(form.options>=13);assert.equal(form.cc,'khaleesi@kemesser.com,chens@kemesser.com');await fill(n);await n.locator('button[type=submit]').click();await n.waitForURL('https://formsubmit.co/andy@kemesser.com');assert.equal(nativeRequest.method,'POST');assert.ok(nativeRequest.body.includes('khaleesi@kemesser.com,chens@kemesser.com'));assert.equal(new URL(n.url()).search,'');record(file+': actual intercepted no-JS POST, recipients and no PII in URL');}
  for(const prefix of ['', 'en/']){await n.goto(origin+'/'+prefix+'downloads.html');assert.equal(await n.locator('noscript a[href$=".pdf"]').count(),12);record(prefix+'no-JS direct manual links');await n.goto(origin+'/'+prefix+'compare.html');assert.equal(await n.locator('noscript a').count(),3);record(prefix+'no-JS comparison recovery links');}await n.goto(origin+'/404.html');assert.ok((await n.locator('h1').textContent()).includes('Page Not Found'));record('Bilingual 404 recovery without JavaScript');await noscript.close();
  p.removeAllListeners('dialog');let leaveWarning=false;
  p.on('dialog',d=>{leaveWarning=true;return d.dismiss();});await p.goto(origin+'/inquiry.html');await p.locator('input[required]').first().fill('Draft');await p.locator('.brand').click({noWaitAfter:true});assert.equal(leaveWarning,true);assert.ok(p.url().includes('inquiry.html'));record('Unsaved draft warns before leaving; dismiss preserves page');p.removeAllListeners('dialog');p.on('dialog',d=>d.accept());
  const videoContext=await browser.newContext();await videoContext.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());const v=await videoContext.newPage();let failVideo=true;await v.route('**/*.mp4',r=>failVideo?r.abort():r.continue());await v.goto(origin+'/en/index.html');await v.waitForFunction(()=>/Retry/.test(document.querySelector('.hero-video-toggle').textContent));failVideo=false;await v.locator('.hero-video-toggle').click();await v.waitForFunction(()=>document.querySelector('video').currentTime>0.2);await videoContext.close();record('Failed video has visible retry; retry resumes playback');
  const saver=await browser.newContext();await saver.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());await saver.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,effectiveType:'2g'}}));const sv=await saver.newPage();await sv.goto(origin+'/index.html');await sv.waitForFunction(()=>document.querySelector('video').readyState>=2);const media=await sv.locator('video').evaluate(e=>({source:e.currentSrc,width:e.videoWidth,height:e.videoHeight}));assert.ok(new URL(media.source).pathname.endsWith('kemesser-thawing-intro-lite.mp4'));assert.equal(media.height,480);await saver.close();record('Explicit data saving selects genuinely smaller 480p source',media);
  for(const [old,target] of [['25541021_7252365_7252368_1.html','product-cellhome.html'],['25541021_7252446_7252449_1.html','product-thawhome.html'],['25541021_7252365_0_1.html','cryo.html'],['25541021_7252446_0_1.html','thawing.html']]){await p.goto(origin+'/products/'+old);await p.waitForURL('**/'+target);record('Legacy route '+old);}
  assert.deepEqual(errors,[]);
 }finally{await browser.close();server.close();fs.writeFileSync(path.join(root,'.vite/workflow-review.json'),JSON.stringify({checks,errors},null,2));}
})().catch(e=>{console.error(e);process.exitCode=1;});
