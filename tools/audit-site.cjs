// Run with Node.js and Playwright available via NODE_PATH.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.vite', 'audit');
fs.mkdirSync(output, { recursive: true });
const pages = [...fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname.slice(1) || 'index.html')
  .map((file) => file.endsWith('/') ? `${file}index.html` : file);
const report = { pages: [], missing: [], parity: [], largeImages: [], errors: [], interactions: [] };
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, `.${relative.endsWith('/') ? `${relative}index.html` : relative}`);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404).end(); return;
  }
  const size = fs.statSync(file).size;
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.mp4': 'video/mp4', '.svg': 'image/svg+xml' };
  const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
  const range = req.headers.range?.match(/bytes=(\d+)-(\d*)/);
  const start = range ? Number(range[1]) : 0;
  const end = range && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
  res.writeHead(range ? 206 : 200, { ...headers, 'Content-Length': end - start + 1, ...(range ? { 'Content-Range': `bytes ${start}-${end}/${size}` } : {}) });
  if (req.method === 'HEAD') { res.end(); return; }
  const stream = fs.createReadStream(file, { start, end });
  stream.pipe(res);
  res.on('close', () => stream.destroy());
});
async function main() {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext();
    await context.route('**/*', (route) => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const page = await context.newPage();
    page.on('pageerror', (error) => report.errors.push({ url: page.url(), message: error.message }));
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const file of pages) {
        if ([768, 320].includes(width) && !['index.html', 'en/index.html', 'thawing.html', 'en/thawing.html', 'about.html', 'en/about.html', 'product-cellhome.html', 'en/product-cellhome.html', 'contact.html', 'en/contact.html'].includes(file)) continue;
        await page.goto(`${origin}/${file}`, { waitUntil: 'domcontentloaded' });
        await page.evaluate(async () => {
          document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
          document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
          await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
        });
        await page.waitForTimeout(120);
        const data = await page.evaluate(() => {
          const outside = [];
          for (const el of document.querySelectorAll('h1,h2,h3,p,.btn,.footer-button')) {
            if (!el.getClientRects().length || el.closest('.main-nav') && getComputedStyle(el.closest('.main-nav')).display === 'none') continue;
            const parent = el.parentElement.getBoundingClientRect();
            const box = el.getBoundingClientRect();
            if (box.width > parent.width + 3 || el.scrollWidth > el.clientWidth + 3) outside.push({ text: el.textContent.slice(0, 100), class: el.className, width: box.width, parent: parent.width });
          }
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            outside,
            brokenImages: [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.getAttribute('src')),
            images: [...document.querySelectorAll('main img')].map((img) => new URL(img.src).pathname.replace(/^\/en\/\.\.\//, '/')),
            selectedImages: [...document.querySelectorAll('main img')].map((img) => new URL(img.currentSrc || img.src).pathname),
            features: document.querySelectorAll('.function-card').length,
            models: document.querySelectorAll('.model-card,.cold-spec-card').length,
            sections: [...document.querySelectorAll('main > section')].map((el) => el.className),
            links: [...document.querySelectorAll('a[href],link[href],script[src],source,img')].flatMap((el) => [el.getAttribute('href'), el.getAttribute('src'), el.getAttribute('data-src-high'), el.getAttribute('data-src-low'), ...(el.getAttribute('srcset') || '').split(',').map((s) => s.trim().split(/\s+/)[0])]).filter(Boolean),
            hero: document.querySelector('.hero-copy') ? { width: document.querySelector('.hero-copy').getBoundingClientRect().width, h1: document.querySelector('.hero-copy h1').textContent } : null
          };
        });
        for (const href of data.links) {
          if (/^(https?:|mailto:|tel:|#|javascript:|data:)/.test(href)) continue;
          const target = decodeURIComponent(new URL(href, `${origin}/${file}`).pathname).replace(/^\//, '');
          if (target && !fs.existsSync(path.join(root, target))) report.missing.push({ file, href });
        }
        const imageBytes = data.selectedImages.reduce((total, image) => {
          const local = path.join(root, decodeURIComponent(image));
          return total + (fs.existsSync(local) ? fs.statSync(local).size : 0);
        }, 0);
        report.pages.push({ file, width, ...data, imageBytes });
        if (width === 1440) {
          for (const image of data.images) {
            const local = path.join(root, decodeURIComponent(image));
            if (fs.existsSync(local) && fs.statSync(local).size > 500000) report.largeImages.push({ file, image, bytes: fs.statSync(local).size });
          }
        }
        if (['index.html', 'en/index.html', 'thawing.html', 'en/thawing.html', 'product-cellhome.html', 'en/about.html'].includes(file) && [1440, 390].includes(width)) {
          await page.screenshot({ path: path.join(output, `${file.replaceAll('/', '-')}-${width}.png`), fullPage: true });
        }
      }
    }
    for (const zh of report.pages.filter((item) => item.width === 1440 && !item.file.startsWith('en/'))) {
      const en = report.pages.find((item) => item.width === 1440 && item.file === `en/${zh.file}`);
      if (!en) { report.parity.push({ file: zh.file, issue: 'Missing English page' }); continue; }
      for (const field of ['images', 'features', 'models', 'sections']) {
        if (JSON.stringify(zh[field]) !== JSON.stringify(en[field])) report.parity.push({ file: zh.file, field, zh: zh[field], en: en[field] });
      }
    }
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${origin}/en/index.html`);
      await page.waitForFunction(() => document.querySelector('video').currentTime > 0.2);
      const video = await page.locator('video').evaluate((el) => ({ width: el.videoWidth, height: el.videoHeight, source: el.currentSrc, playing: !el.paused, time: el.currentTime }));
      if (!video.source.endsWith('kemesser-thawing-intro.mp4')) throw new Error('Default video quality downgraded');
      await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
      await page.waitForFunction(() => document.querySelector('video').paused);
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForFunction(() => !document.querySelector('video').paused);
      if (width === 390) await page.locator('[data-menu-button]').click();
      await page.locator('.nav-dropdown-trigger').click();
      await page.locator('.nav-dropdown-menu a[href="support.html"]').waitFor({ state: 'visible' });
      await page.keyboard.press('Escape');
      report.interactions.push({ test: 'HD video, viewport pause/resume, navigation menu', width, video });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
    if (!await page.locator('video').evaluate((el) => el.paused)) throw new Error('Reduced-motion video did not pause');
    report.interactions.push({ test: 'Reduced-motion video paused', passed: true });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    for (const lang of ['', 'en/']) {
      for (const file of ['inquiry.html', 'support.html']) {
        await page.goto(`${origin}/${lang}${file}?product=ThawLINE`);
        if (await page.locator('[data-product-options]').inputValue() !== 'ThawLINE') throw new Error('Product selection not carried over');
        await page.evaluate(() => {
          for (const input of document.querySelectorAll('form input')) {
            if (input.type === 'file') continue;
            else if (input.type === 'checkbox') input.checked = true;
            else if (input.type === 'email') input.value = 'test@example.com';
            else if (input.type === 'date') input.value = '2026-10-23';
            else input.value = 'Test inquiry';
          }
          for (const textarea of document.querySelectorAll('textarea')) textarea.value = 'Test message';
          for (const select of document.querySelectorAll('form select[required]')) {
            if (!select.value) select.selectedIndex = 1;
          }
        });
        let success = false;
        let payload = '';
        await page.route('https://formsubmit.co/ajax/andy@kemesser.com', (route) => {
          payload = route.request().postData() || '';
          route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: String(success) }) });
        });
        await page.locator('form button[type="submit"]').click();
        await page.waitForFunction(() => /failed|未成功/.test(document.querySelector('[data-form-message]').textContent));
        success = true;
        await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('Storage unavailable'); }; });
        await page.locator('form button[type="submit"]').click();
        await page.waitForFunction(() => /has been submitted|提交成功|提交成功，/.test(document.querySelector('[data-form-message]').textContent));
        if (!payload.includes('khaleesi@kemesser.com,chens@kemesser.com')) throw new Error('Missing CC recipients');
        report.interactions.push({ test: `${lang}${file}: rejection handling, success without storage, all CCs`, passed: true });
        await page.unroute('https://formsubmit.co/ajax/andy@kemesser.com');
      }
      await page.goto(`${origin}/${lang}downloads.html`);
      await page.locator('[data-manual-search]').fill('ThawLINE');
      if (await page.locator('tbody tr').count() !== 4) throw new Error('Download filter mismatch');
      await page.goto(`${origin}/${lang}compare.html`);
      if (await page.locator('tbody tr').count() !== 12) throw new Error('Missing products in comparison');
      if (lang && /[\u4e00-\u9fff]/.test(await page.locator('tbody').innerText())) throw new Error('Chinese in English comparison');
      report.interactions.push({ test: `${lang}download filters and product comparison`, passed: true });
    }
  } finally {
    await browser.close();
    server.close();
  }
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ rendered: report.pages.length, errors: report.errors, missing: report.missing, parity: report.parity, interactions: report.interactions, layout: report.pages.filter((p) => p.overflow || p.outside.length || p.brokenImages.length).map(({ file, width, overflow, outside, brokenImages }) => ({ file, width, overflow, outside, brokenImages })) }, null, 2));
  if (report.errors.length || report.missing.length || report.parity.length || report.pages.some((p) => p.overflow || p.outside.length || p.brokenImages.length)) process.exitCode = 1;
}
main().catch((error) => {
  console.error(error);
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({ ...report, failure: error.message }, null, 2));
  server.close();
  process.exitCode = 1;
});
