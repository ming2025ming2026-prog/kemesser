const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const version = '20260716-11';
const pages = fs.readdirSync(path.join(root, 'en')).filter(file => file.endsWith('.html'));

for (const file of pages) {
  const fullPath = path.join(root, file);
  let html = fs.readFileSync(fullPath, 'utf8');
  html = html.replace(/styles\.css\?v=[^"']+/g, `styles.css?v=${version}`)
    .replace(/app\.js\?v=[^"']+/g, `app.js?v=${version}`)
    .replace(/site-data\.js\?v=[^"']+/g, `site-data.js?v=${version}`);
  if (!html.includes('favicon-48.png')) {
    const icons = `\n    <link rel="icon" type="image/png" sizes="48x48" href="assets/brand/favicon-48.png" />\n    <link rel="icon" type="image/png" sizes="192x192" href="assets/brand/favicon-192.png" />\n    <link rel="apple-touch-icon" sizes="192x192" href="assets/brand/favicon-192.png" />`;
    html = html.replace(/(<meta name="viewport"[^>]*>)/, `$1${icons}`);
  }
  if (!html.includes('rel="canonical"')) {
    const canonical = `https://www.kemesser.com/${file}`;
    const english = `https://www.kemesser.com/en/${file}`;
    const links = `\n    <link rel="canonical" href="${canonical}" />\n    <link rel="alternate" hreflang="zh-CN" href="${canonical}" />\n    <link rel="alternate" hreflang="en" href="${english}" />\n    <link rel="alternate" hreflang="x-default" href="${canonical}" />`;
    html = html.replace(/(<meta name="viewport"[^>]*>)/, `$1${links}`);
  }
  fs.writeFileSync(fullPath, html, 'utf8');
}

const redirects = {
  'bk_25523084.html': 'contact.html',
  'bk_25539801.html': 'about.html',
  'pro_25541021_0_0_4.html': 'index.html#series',
  'doc_25542276_0_0_1.html': 'downloads.html',
  'doc_25542276_5351896_0_1.html': 'downloads.html',
  'doc_25542276_6248471_0_1.html': 'downloads.html'
};

function redirectHtml(target) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="https://www.kemesser.com/${target}"><title>页面已更新 | 科默斯科技</title><script>location.replace(${JSON.stringify(target)});</script></head><body><p>页面已更新，正在前往<a href="${target}">新页面</a>。</p></body></html>`;
}

for (const [file, target] of Object.entries(redirects)) {
  fs.writeFileSync(path.join(root, file), redirectHtml(target), 'utf8');
}

const productDir = path.join(root, 'products');
fs.mkdirSync(productDir, { recursive: true });
fs.writeFileSync(path.join(productDir, '25541021_7252248_7252264_1.html'), redirectHtml('../product-coolhome.html'), 'utf8');

const sitemapPages = pages.filter(file => file !== '404.html');
const urlEntries = sitemapPages.flatMap(file => [
  `  <url><loc>https://www.kemesser.com/${file}</loc><xhtml:link rel="alternate" hreflang="zh-CN" href="https://www.kemesser.com/${file}"/><xhtml:link rel="alternate" hreflang="en" href="https://www.kemesser.com/en/${file}"/></url>`,
  `  <url><loc>https://www.kemesser.com/en/${file}</loc><xhtml:link rel="alternate" hreflang="zh-CN" href="https://www.kemesser.com/${file}"/><xhtml:link rel="alternate" hreflang="en" href="https://www.kemesser.com/en/${file}"/></url>`
]);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlEntries.join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(root, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://www.kemesser.com/sitemap.xml\n', 'utf8');

console.log(`Updated SEO metadata for ${pages.length} Chinese pages and generated compatibility files.`);
