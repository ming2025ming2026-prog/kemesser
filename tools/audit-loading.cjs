// Focused cold-cache network test. No third-party requests or form submissions.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const cp = require('node:child_process');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const baseline = process.argv.includes('--baseline');
const cache = new Map();
if (baseline) {
  for (const file of cp.execFileSync('git', ['ls-tree', '-r', '--name-only', '4a446e4'], {encoding:'utf8'}).trim().split('\n').filter(f => /\.(html|css|js)$/.test(f) && !/^(source|site-public)\//.test(f))) {
    cache.set(file, cp.execFileSync('git', ['show', `4a446e4:${file}`], {maxBuffer:10e6}));
  }
}
const server = http.createServer((req,res) => {
  const name = decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1) || 'index.html';
  const file = path.resolve(root,name);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) return res.writeHead(404).end();
  const data = cache.get(name);
  const size = data ? data.length : fs.statSync(file).size;
  const match = req.headers.range?.match(/bytes=(\d+)-(\d*)/);
  const start = match ? +match[1] : 0, end = match?.[2] ? Math.min(+match[2],size-1) : size-1;
  const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.mp4':'video/mp4'};
  res.writeHead(match ? 206 : 200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store','Accept-Ranges':'bytes','Content-Length':end-start+1,...(match?{'Content-Range':`bytes ${start}-${end}/${size}`}:{})});
  if(data) return res.end(data.subarray(start,end+1));
  const stream=fs.createReadStream(file,{start,end});stream.pipe(res);res.on('close',()=>stream.destroy());
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const origin=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({channel:'chrome',headless:true});
  const report={baseline,conditions:{bytesPerSecond:200000,latencyMs:150,cpuSlowdown:1,viewport:'390x844',coldCache:true},runs:[]};
  try {
    for(let i=0;i<2;i++) {
      const context=await browser.newContext({viewport:{width:390,height:844}});
      await context.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
      await context.addInitScript(()=>{
        window.mediaStats={waiting:0,firstFrame:null};
        document.addEventListener('DOMContentLoaded',()=>{const v=document.querySelector('video');if(!v)return;
          v.addEventListener('waiting',()=>{if(v.currentTime>0.1)window.mediaStats.waiting++;});
          v.requestVideoFrameCallback(()=>window.mediaStats.firstFrame=performance.now());
        });
      });
      const page=await context.newPage();const cdp=await context.newCDPSession(page);
      await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
      await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:200000});
      await page.goto(origin,{waitUntil:'domcontentloaded'});await page.waitForTimeout(15000);
      const video=await page.evaluate(()=>{const v=document.querySelector('video');return {...window.mediaStats,time:v.currentTime,width:v.videoWidth,height:v.videoHeight,quality:v.getVideoPlaybackQuality(),source:v.currentSrc};});
      report.runs.push({i,video});console.log(JSON.stringify({i,video}));await context.close();
    }
  } finally {await browser.close();server.close();}
  fs.mkdirSync(path.join(root,'.vite/loading'),{recursive:true});
  fs.writeFileSync(path.join(root,`.vite/loading/${baseline?'baseline':'current'}.json`),JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
