// Download axe-core 4.10.3 to .vite/axe.min.js before running. Never shipped to visitors.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.vite', process.argv.includes('--baseline') ? 'accessibility-baseline.json' : 'accessibility-current.json');
const pages = [...fs.readFileSync(path.join(root, 'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname.slice(1) || 'index.html').map(f => f.endsWith('/') ? f+'index.html' : f);
pages.push('admin.html', '404.html');
const server = http.createServer((req,res)=>{
  const name = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file = path.resolve(root,'.'+(name.endsWith('/')?name+'index.html':name));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return res.writeHead(404).end();
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4'};
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
  const stream=fs.createReadStream(file);stream.pipe(res);res.on('close',()=>stream.destroy());
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const origin=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({channel:'chrome',headless:true});
  const results=[];
  try{
    const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
    await context.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
    const page=await context.newPage();
    for(const file of pages){
      await page.goto(origin+'/'+file,{waitUntil:'domcontentloaded'});
      await page.waitForTimeout(120);
      await page.addScriptTag({path:path.join(root,'.vite/axe.min.js')});
      const result=await page.evaluate(async()=>{
        const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}});
        const project=v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))});
        return {violations:r.violations.map(project),incomplete:r.incomplete.map(project),passes:r.passes.length};
      });
      results.push({file,...result});fs.writeFileSync(output,JSON.stringify(results,null,2));
      console.log(file,result.violations.map(v=>`${v.id}:${v.nodes.length}`).join(',')||'PASS');
    }
  }finally{await browser.close();server.close();}
  if(results.some(r=>r.violations.length))process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
