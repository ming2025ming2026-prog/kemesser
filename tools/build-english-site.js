const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'en');
fs.mkdirSync(out, { recursive: true });

const version = '20260716-9';
const nav = [
  ['index.html', 'Home'], ['about.html', 'About Us'], ['thawing.html', 'Thawing'],
  ['cryo.html', 'Cryopreservation'], ['cold-operation.html', 'Cold Operation'],
  ['downloads.html', 'Downloads'], ['contact.html', 'Contact Us']
];

function header(current, light = true) {
  return `<header class="site-header${light ? ' light' : ''}" data-header>
    <a class="brand" href="index.html"><img decoding="async" src="../assets/brand/kemesser-logo.png" alt="Kemesser Technology" /></a>
    <nav class="main-nav">${nav.map(([href, label]) => `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>
    <a class="nav-cta" href="inquiry.html">Sales Inquiry</a>
    <button class="menu-button" type="button" data-menu-button aria-label="Open menu"><span></span><span></span></button>
  </header>`;
}

function page(file, title, description, body, options = {}) {
  const canonical = `https://www.kemesser.com/en/${file}`;
  const chinese = `https://www.kemesser.com/${file}`;
  const scripts = options.data
    ? `<script src="../site-data.js?v=${version}"></script><script src="../app.js?v=${version}"></script>`
    : `<script src="../app.js?v=${version}"></script>`;
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Kemesser Technology</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="zh-CN" href="${chinese}" />
  <link rel="alternate" hreflang="en" href="${canonical}" />
  <link rel="alternate" hreflang="x-default" href="${chinese}" />
  <link rel="stylesheet" href="../styles.css?v=${version}" />
</head>
<body>
${header(options.current || file, options.light !== false)}
<main>${body}</main>
<footer class="site-footer"></footer>
${scripts}
</body>
</html>`;
  fs.writeFileSync(path.join(out, file), html, 'utf8');
}

function cards(items, narrow = '') {
  return `<section class="section product-list${narrow ? ` ${narrow}` : ''}">${items.map((item, index) => `
    <a class="product-tile reveal" href="${item.url}">
      <img loading="${index < 3 ? 'eager' : 'lazy'}"${index === 0 ? ' fetchpriority="high"' : ''} decoding="async" src="../${item.image}" alt="${item.name}" />
      <span>${item.kicker}</span><h2>${item.name}</h2><p>${item.copy}</p>
    </a>`).join('')}</section>`;
}

function pageHero(eyebrow, title, copy = '') {
  return `<section class="page-hero product-list-hero"><p class="eyebrow reveal">${eyebrow}</p><h1 class="reveal">${title}</h1>${copy ? `<p class="reveal">${copy}</p>` : ''}</section>`;
}

function featureSection(title, items, eyebrow = 'FUNCTIONS') {
  return `<section class="section function-section"><div class="function-heading reveal"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2></div><div class="function-grid">${items.map((item, i) => `<article class="function-card reveal"><span>${String(i + 1).padStart(2, '0')}</span><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join('')}</div></section>`;
}

const descriptions = {
  access2: ['Two-level User Access', 'Separate administrator and operator roles support secure, straightforward device management and focused routine operation.'],
  access3: ['Three-level User Access', 'Administrator, supervisor and operator roles provide clear authorization boundaries for standardized laboratory management.'],
  passwordCycle: ['Password Expiration Policy', 'Configurable password validity periods strengthen account security and support laboratory compliance.'],
  ice: ['Adjustable Residual Ice', 'Residual ice parameters can be adjusted to sample volume and cryoprotectant type, supporting controlled and reproducible thawing.'],
  ozone: ['Ozone Sterilization', 'One-touch ozone sterilization helps maintain a clean operating environment and reduce contamination risk.'],
  profiles: ['Run Profiles', 'Save reusable temperature, protection and residual-ice settings for consistent workflows across sample types.'],
  print: ['Bluetooth Printing', 'Connect to a compatible Bluetooth printer to produce key thawing records at the point of use.'],
  password: ['Password Management', 'Centralized password controls support secure access, account governance and compliant operation.'],
  pc: ['Direct PC Connection', 'Transfer experimental data directly to a computer for analysis, archiving and traceability.'],
  sd: ['SD Card Data Storage', 'Automatically record and retain process data on an SD card for secure backup and later review.'],
  tempProtect: ['Temperature Protection', 'Configurable protection limits help prevent operation outside the permitted sample temperature range.'],
  batch: ['Sample Batch ID', 'Assign identifiers to individual samples or positions for fast recognition and end-to-end traceability.'],
  dust: ['Dust Cover', 'A dedicated cover protects the thawing ports, reduces cleaning frequency and supports routine maintenance.'],
  waterless: ['Water-free Thawing', 'Automated dry thawing avoids direct water contact, reducing contamination risk and simplifying operation.'],
  screen: ['Color Touchscreen', 'A clear color touchscreen provides intuitive control and real-time process status.'],
  calibration: ['Temperature Calibration', 'Guided calibration supports stable temperature performance and repeatable experimental results.'],
  ports: ['Customizable Thawing Ports', 'Port specifications can be customized for cryovials, syringes and other sample containers.'],
  alarm: ['Real-time Alerts', 'Process monitoring and alerts help operators respond promptly to abnormal conditions.'],
  efficient: ['Energy-efficient Operation', 'Independent operation and optimized thermal control improve throughput while reducing unnecessary energy use.']
};

const thawlineFeatures = ['access2','ice','ozone','pc','sd','tempProtect','batch','dust','waterless','screen','calibration','ports'].map(k => descriptions[k]);
const proFeatures = ['access3','passwordCycle','ice','ozone','profiles','print','password','pc','sd','tempProtect','batch','dust','waterless','screen','calibration','ports'].map(k => descriptions[k]);
const thawhomeTubeFeatures = [descriptions.waterless,
  ['Four Independent Channels', 'Four independently controlled ports can thaw different samples simultaneously, improving throughput and operational flexibility.'],
  ['Independent Channel Display', 'Each channel displays its own status in real time for clear, direct process observation.'], descriptions.alarm, descriptions.efficient];
const thawhomeBagFeatures = [descriptions.waterless,
  ['Telescopic Heated Lid', 'An adaptive heated lid follows bags of different capacities to support uniform thermal contact.'], descriptions.alarm, descriptions.efficient];
const mobiFeatures = [descriptions.ozone, descriptions.ice,
  ['Portable Charging', 'USB Type-C charging supports flexible use across mobile and temporary laboratory settings.'], descriptions.sd,
  ['Compact and Portable', 'A compact body is easy to carry and operate in space-limited or mobile scenarios.'], descriptions.waterless,
  descriptions.screen, descriptions.tempProtect,
  ['Data Export', 'Recorded process data can be exported for archiving, analysis and traceability.'], descriptions.calibration, descriptions.alarm];
const wakerFeatures = [descriptions.access3, descriptions.passwordCycle, descriptions.profiles, descriptions.ice, descriptions.print, descriptions.ozone,
  ['Dual Export Options', 'Two data export methods support flexible transfer, record retention and downstream analysis.'],
  ['Emergency Stop', 'A dedicated emergency-stop function allows immediate interruption when required.'],
  ['Uniform Thawing', 'Coordinated sensing and heating support even temperature distribution throughout the thawing process.'],
  ['Intelligent Capacity Adaptation', 'The system adapts operating parameters to different bag capacities for consistent performance.'],
  ['Dynamic Multi-probe Sensing and Adaptive Heated Lid', 'Multiple probes track the sample dynamically while the heated lid maintains responsive contact.'],
  ['Live Heating Curve', 'Real-time temperature-rise data makes process progress visible and easier to review.'],
  descriptions.calibration, descriptions.tempProtect, descriptions.batch];

const productMeta = {
  'product-thawline.html': {name:'ThawLINE Cell Thawing System', eyebrow:'TUBE THAWING', image:'assets/transparent/thawing/tube/thawline.png', copy:'A tube-format cell thawing platform focused on precision, efficiency, traceability, access control and temperature management for standardized laboratory workflows.', features:thawlineFeatures, current:'thawing.html'},
  'product-thawline-pro.html': {name:'ThawLINE Pro Cell Thawing System', eyebrow:'TUBE THAWING', image:'assets/transparent/thawing/tube/thawline-pro.png', copy:'An advanced tube-format thawing platform with expanded access control, run profiles, printing and data management for highly regulated workflows.', features:proFeatures, current:'thawing.html'},
  'product-thawhome.html': {name:'ThawHome Tube Cell Thawing System', eyebrow:'TUBE THAWING', image:'assets/transparent/thawing/tube/thawhome.png', copy:'A four-channel water-free thawing system designed for independent operation, clear status display and efficient tube-format workflows.', features:thawhomeTubeFeatures, current:'thawing.html'},
  'product-mobithaw.html': {name:'MobiThaw Portable Cell Thawing System', eyebrow:'TUBE THAWING', image:'assets/transparent/thawing/tube/mobithaw.png', copy:'A compact, rechargeable water-free thawing platform that brings temperature control, data storage and sterilization to mobile workflows.', features:mobiFeatures, current:'thawing.html'},
  'product-thawwaker.html': {name:'ThawWaker Cell Thawing System', eyebrow:'BAG THAWING', image:'assets/transparent/thawing/bag/thawwaker.png', copy:'A bag-format thawing platform combining dynamic multi-probe sensing, adaptive heated-lid contact and comprehensive process management.', features:wakerFeatures, current:'thawing.html'},
  'product-thawhome-bag.html': {name:'ThawHome Bag Cell Thawing System', eyebrow:'BAG THAWING', image:'assets/transparent/thawing/bag/thawhome-bag.png', copy:'A water-free bag thawing system with an adaptive heated lid, live alerts and efficient thermal control.', features:thawhomeBagFeatures, current:'thawing.html'}
};

for (const [file, p] of Object.entries(productMeta)) {
  const body = `<section class="product-showcase clean-product"><div class="showcase-copy reveal"><p class="eyebrow">${p.eyebrow}</p><h1>${p.name}</h1><p>${p.copy}</p><a class="btn btn-primary" href="inquiry.html">Request Product Information</a></div><div class="clean-visual reveal"><img loading="eager" fetchpriority="high" decoding="async" src="../${p.image}" alt="${p.name}" /></div></section>${featureSection('Feature Configuration', p.features)}`;
  page(file, p.name, p.copy, body, {current:p.current});
}

const coldProducts = {
  'product-coolhome.html': {name:'CoolHome Ice-free Workstation', image:'coolhome.png', copy:'Designed for sample cooling, low-temperature handling and standardized workflows without wet ice, helping reduce contamination risk across multiple temperature ranges.', features:[
    ['Ice-free Contamination Control','Samples avoid direct contact with wet ice, reducing water, label damage, displacement and contamination risks.'],
    ['Consistent Cooling Rate','Each tube receives consistent cooling conditions for more uniform temperature control and standardized procedures.'],
    ['Upright Organized Samples','Tubes remain upright with visible labels for easier identification, handling and workflow organization.'],
    ['Reusable Design','Reusable cooling cores eliminate continuous wet-ice consumption and reduce routine cleanup.'],
    ['Extended Temperature Control','Cooling cores provide sustained temperature control for processing, temporary storage and bench-to-bench transfer.'],
    ['Modular Compatibility','Compatible BlockHome modules support multiple tube types, plates and sample containers.']],
    specs:[['CoolHome-X','0–4°C','Up to 14 hours'],['CoolHome-X1','-20–0°C','Up to 14 hours'],['CoolHome-X2','-22–-18°C','Up to 6 hours'],['CoolHome-XD','-78°C','Up to 4 hours']], note:'Dimensions for all models: L200 × W160 × H160 mm'},
  'product-holderhome.html': {name:'HolderHome Ice-free Freezing Container', image:'holderhome.png', copy:'An ice-free low-temperature container for organized sample holding, temporary storage and transfer during laboratory operations.', features:[
    ['Ice-free Contamination Control','Dry operation reduces contact with melting ice, water and associated contamination risks.'],
    ['Consistent Cooling Conditions','A stable thermal environment helps samples remain within the required low-temperature range.'],
    ['Upright Organized Samples','Samples remain upright and clearly indexed for efficient access and identification.'],
    ['Transfer Protection','The enclosed structure supports protected movement between work areas.'],
    ['Reusable Design','Durable components support repeated laboratory use and reduce consumable waste.'],
    ['Flexible Module Compatibility','Interchangeable modules accommodate different tube formats and sample layouts.']],
    specs:[['HolderHome-X','0–4°C','Temperature retention up to 12 hours'],['HolderHome-X1','-20–0°C','Temperature retention up to 12 hours'],['HolderHome-X2','-22–-18°C','Temperature retention up to 5 hours'],['HolderHome-XD','-78°C','Temperature retention up to 4 hours']], note:'Dimensions for all models: L276 × W210 × H200 mm; weight: 2240 g excluding the BlockHome module.'},
  'product-blockhome.html': {name:'BlockHome Tube Module', image:'blockhome.png', copy:'A modular tube holder designed to organize, stabilize and thermally manage different sample formats during low-temperature operations.', features:[
    ['Temperature Uniformity','Optimized hole layouts support even thermal contact across sample positions.'],
    ['Upright Samples','Tubes stay upright to reduce tipping, leakage and handling errors.'],
    ['Clear Indexing','Structured positions make samples easier to identify, track and retrieve.'],
    ['Dry and Safe','Dry handling reduces water contamination and label damage associated with wet ice.'],
    ['Temperature Reading','Compatible configurations support convenient temperature observation during operation.'],
    ['Reusable Multi-format Design','Multiple reusable module formats accommodate common laboratory tubes and containers.']],
    specs:[['PCR Module','120 × 0.2 mL','For 96-well PCR plates, 8-tube strips and individual tubes'],['Mixed Module','96 × 0.2 mL + 18 × 0.5 mL','For PCR tubes and 0.5 mL centrifuge tubes'],['Microplate Module','384 wells','For 384-well plates'],['Mixed Module','15 × 1.5 mL + 72 × 0.2 mL','For 1.5 mL and 0.2 mL centrifuge tubes'],['Centrifuge Tube Module','30 × 1.5 mL','For 1.5 mL centrifuge tubes'],['Cryovial Module','35 × 2 mL','For 2.0 mL cryovials']], note:''},
  'product-transhome.html': {name:'TransHome Dry Ice Transport Container', image:'transhome.png', copy:'A reusable dry-ice transport system for stable, organized and power-free movement of temperature-sensitive samples.', features:[
    ['Dry-ice Isolation','An internal separation structure keeps samples organized while supporting dry-ice cooling.'],
    ['Portable Power-free Design','No external power is required, supporting flexible transport and temporary storage.'],
    ['Extended Temperature Control','The insulated structure supports sustained low-temperature conditions during transfer.'],
    ['Efficient Space Use','A compact internal layout balances sample capacity with dry-ice volume.'],
    ['Refillable Dry Ice','Dry ice can be replenished as needed for longer transport workflows.'],
    ['Flexible Multi-purpose Use','Suitable for sample transfer, temporary holding and laboratory logistics.']],
    specs:[['External Dimensions','L530 × W360 × H365 mm','Designed for low-temperature transport and mobile use'],['Internal Dimensions','L330 × W160 × H295 mm','Independent usable sample compartment'],['Capacity and Weight','15 L dry ice','Product weight: 4 kg excluding dry ice']], note:''},
  'product-icehome.html': {name:'IceHome Ice Pan and Bucket', image:'icehome.png', copy:'Durable reusable ice pans and buckets for organized laboratory cooling, sample handling and daily low-temperature operation.', features:[
    ['Non-toxic and Odorless','Laboratory-oriented materials support clean and dependable routine use.'],
    ['Durable Construction','A robust body is designed for repeated handling and long-term service.'],
    ['Slip- and Leak-resistant','Stable shapes and contained designs help reduce spills during operation.'],
    ['High Capacity and Reusable','Multiple sizes support different workloads and can be reused across daily procedures.']],
    specs:[['IceHome-1L','Ice Pan','L190 × W160 × H80 mm; 220 mm including handle; weight 180 g'],['IceHome-4L','Ice Pan','L320 × W240 × H130 mm; 370 mm including handles; pan 570 g, lid 230 g'],['IceHome-4L','Ice Bucket','Φ250 × H180 mm; 290 mm including handle; bucket 560 g, lid 170 g']], note:''}
};

for (const [file, p] of Object.entries(coldProducts)) {
  const specs = `<section class="section cold-spec-section"><div class="cold-spec-heading reveal"><p class="eyebrow">SPECIFICATIONS</p><h2>Models and Specifications</h2></div><div class="cold-spec-grid">${p.specs.map(s => `<article class="cold-spec-card reveal"><span>${s[0]}</span><strong>${s[1]}</strong><p>${s[2]}</p></article>`).join('')}</div>${p.note ? `<p class="cold-spec-note reveal">${p.note}</p>` : ''}</section>`;
  const body = `<section class="product-detail"><div class="detail-copy reveal"><p class="eyebrow">COLD OPERATION SERIES</p><h1>${p.name}</h1><p>${p.copy}</p><a class="btn btn-primary" href="inquiry.html">Request Product Information</a></div><img loading="eager" fetchpriority="high" decoding="async" class="detail-image cold-operation-detail-image reveal" src="../assets/transparent/cold-operation/${p.image}" alt="${p.name}" /></section>${featureSection('Product Features', p.features, 'PRODUCT FEATURES')}${specs}`;
  page(file, p.name, p.copy, body, {current:'cold-operation.html'});
}

const cellFeatures = [
  ['No Auxiliary Additives','No auxiliary liquid is required, supporting an energy-efficient, environmentally considerate workflow.'],
  ['Lower Long-term Cost','A reusable design supports long-term operation after a single purchase.'],
  ['High Repeatability','Consistent cooling rates across positions support repeatable and uniform freezing results.'],
  ['Easy Handling','Simple manual operation makes routine loading, transfer and retrieval straightforward.'],
  ['Clean Insulated Design','The solid insulated body requires no pre-cooling and can be handled safely after storage at -80°C.'],
  ['Easy Lid Opening','The lid remains straightforward to open during routine low-temperature workflows.'],
  ['Rack-level Transfer','Samples can be transferred together rather than removed one by one.']
];
const modelNames = ['12','125','30','305','60'];
const cellBody = `<section class="product-showcase clean-product"><div class="showcase-copy reveal"><p class="eyebrow">CRYOPRESERVATION SERIES</p><h1>CellHome Controlled-rate Freezing Container</h1><p>Designed for controlled cooling and standardized sample management across multiple tube formats and capacities.</p><a class="btn btn-primary" href="inquiry.html">Request Product Information</a></div><div class="clean-visual reveal"><img loading="eager" decoding="async" src="../assets/transparent/cryo/transparent/cellhome-family.png" alt="CellHome product family" /></div></section>${featureSection('Stable Cryopreservation Workflow', cellFeatures)}<section class="section model-section"><div class="model-heading reveal"><p class="eyebrow">MODELS</p><h2>CellHome Models</h2><p>Choose the model that matches the required tube format and sample capacity.</p></div><div class="model-grid">${modelNames.map(m => `<article class="model-card reveal"><img loading="lazy" decoding="async" src="../assets/transparent/cryo/transparent/cellhome-${m}.png" alt="CellHome-${m}" /><h3>CellHome-${m}</h3></article>`).join('')}</div></section>`;
page('product-cellhome.html','CellHome Controlled-rate Freezing Container','Controlled-rate freezing containers for standardized cell cryopreservation workflows.',cellBody,{current:'cryo.html'});

const tubeItems = [
  ['ThawLINE','Tube Cell Thawing System','Precision, traceability, access management and temperature control.','product-thawline.html','assets/transparent/thawing/tube/thawline.png'],
  ['ThawLINE Pro','Advanced Tube Cell Thawing System','Expanded process governance for demanding laboratory workflows.','product-thawline-pro.html','assets/transparent/thawing/tube/thawline-pro.png'],
  ['ThawHome','Tube Cell Thawing System','Four independently controlled water-free thawing channels.','product-thawhome.html','assets/transparent/thawing/tube/thawhome.png'],
  ['MobiThaw','Portable Cell Thawing System','Compact, rechargeable and traceable mobile thawing.','product-mobithaw.html','assets/transparent/thawing/tube/mobithaw.png']
].map(x=>({name:x[0],kicker:x[1],copy:x[2],url:x[3],image:x[4]}));
const bagItems = [
  {name:'ThawWaker',kicker:'Bag Cell Thawing System',copy:'Dynamic sensing, adaptive heated-lid contact and precise process control.',url:'product-thawwaker.html',image:'assets/transparent/thawing/bag/thawwaker.png'},
  {name:'ThawHome',kicker:'Bag Cell Thawing System',copy:'Stable water-free thawing for bag-format samples.',url:'product-thawhome-bag.html',image:'assets/transparent/thawing/bag/thawhome-bag.png'}
];

page('thawing.html','Cell Thawing Systems','Tube-format and bag-format water-free cell thawing systems.',`${pageHero('THAWING SERIES','Cell Thawing Systems','Select a tube-format or bag-format solution for your workflow.')}<section class="section thawing-type-grid"><a class="thawing-type-card reveal" href="thawing-tube.html"><img loading="lazy" decoding="async" src="../assets/transparent/home/thawing-series.png" alt="Tube cell thawing systems" /><span>TUBE THAWING</span><h2>Tube Cell Thawing Systems</h2><p>ThawLINE, ThawLINE Pro, ThawHome and MobiThaw.</p></a><a class="thawing-type-card reveal" href="thawing-bag.html"><img loading="lazy" decoding="async" src="../assets/transparent/thawing/bag/thawwaker.png" alt="Bag cell thawing systems" /><span>BAG THAWING</span><h2>Bag Cell Thawing Systems</h2><p>ThawWaker and ThawHome.</p></a></section>`,{current:'thawing.html'});
page('thawing-tube.html','Tube Cell Thawing Systems','Tube-format cell thawing systems for standardized and mobile workflows.',pageHero('TUBE THAWING','Tube Cell Thawing Systems','Solutions for standard, advanced and mobile tube-format thawing.')+cards(tubeItems),{current:'thawing.html'});
page('thawing-bag.html','Bag Cell Thawing Systems','Bag-format cell thawing systems with dynamic sensing and temperature management.',pageHero('BAG THAWING','Bag Cell Thawing Systems','Solutions for controlled thawing of bag-format frozen samples.')+cards(bagItems,'narrow-two'),{current:'thawing.html'});

page('cryo.html','Cryopreservation Series','CellHome controlled-rate freezing products for standardized cell cryopreservation.',pageHero('CRYOPRESERVATION SERIES','Cryopreservation Series','Controlled-rate freezing products for stable, consistent cell cryopreservation.')+cards([{name:'CellHome',kicker:'Controlled-rate Freezing Container',copy:'Consistent cooling rates, multiple formats and repeatable freezing performance.',url:'product-cellhome.html',image:'assets/transparent/cryo/transparent/cellhome-family.png'}],'narrow'),{current:'cryo.html'});

const coldList = [
  ['CoolHome','Ice-free Workstation','Ice-free sample handling and temperature control.','product-coolhome.html','coolhome.png'],
  ['HolderHome','Ice-free Freezing Container','Organized low-temperature sample holding and transfer.','product-holderhome.html','holderhome.png'],
  ['BlockHome','Tube Module','Modular positioning for multiple tube formats.','product-blockhome.html','blockhome.png'],
  ['TransHome','Dry Ice Transport Container','Power-free low-temperature transport and transfer.','product-transhome.html','transhome.png'],
  ['IceHome','Ice Pan and Bucket','Reusable laboratory cooling and sample handling.','product-icehome.html','icehome.png']
].map(x=>({name:x[0],kicker:x[1],copy:x[2],url:x[3],image:`assets/transparent/cold-operation/${x[4]}`}));
page('cold-operation.html','Cold Operation Series','Ice-free workstations, cold holders, tube modules, dry ice transport and ice containers.',pageHero('COLD OPERATION SERIES','Cold Operation','Products for ice-free handling, sample organization, low-temperature transfer and daily laboratory cooling.')+cards(coldList,'cold-operation-list'),{current:'cold-operation.html'});

const homeBody = `<section class="video-hero"><video class="hero-video" autoplay muted loop playsinline webkit-playsinline preload="auto" poster="../assets/fast/ppt/lab-hero.jpg" data-hero-video><source src="../assets/video/kemesser-thawing-intro.mp4" type="video/mp4" /></video><div class="hero-shade"></div><div class="hero-copy reveal"><p class="eyebrow">KEMESSER TECHNOLOGY</p><h1>Cell Low-temperature Workflow Solutions</h1><p>Reliable solutions for cell cryopreservation, thawing and cold operation workflows in research and life science.</p><div class="hero-actions"><a class="btn btn-primary" href="thawing.html">Explore Thawing Systems</a><a class="btn btn-ghost" href="about.html">About Kemesser</a></div></div></section><section class="section intro-split" id="series"><div class="intro-copy reveal"><h2>Three Product Series for Critical Cell Laboratory Workflows.</h2><p>From thawing and cryopreservation to cold operation, Kemesser covers the critical stages of laboratory low-temperature workflows.</p></div></section><section class="series-grid">${[
  ['thawing.html','assets/transparent/home/thawing-series.png','01 / THAWING','Thawing','ThawLINE, ThawLINE Pro, ThawWaker, ThawHome, MobiThaw'],
  ['cryo.html','assets/transparent/home/cryo-series.png','02 / CRYOPRESERVATION','Cryopreservation','CellHome controlled-rate freezing containers'],
  ['cold-operation.html','assets/transparent/home/cold-operation-series.png','03 / COLD OPERATION','Cold Operation','CoolHome, HolderHome, BlockHome, TransHome, IceHome']
].map(x=>`<a class="series-card reveal" href="${x[0]}"><img loading="lazy" decoding="async" src="../${x[1]}" alt="${x[3]}" /><span>${x[2]}</span><h3>${x[3]}</h3><p>${x[4]}</p></a>`).join('')}</section>`;
page('index.html','Cell Cryopreservation and Thawing Solutions','Kemesser develops cell thawing, controlled-rate freezing and cold-operation solutions for research, biobanking and life science laboratories.',homeBody,{current:'index.html',light:false});

const aboutBody = `<section class="section about-profile"><div class="profile-mark reveal"><img src="../assets/brand/kemesser-logo.png" alt="Kemesser Technology" /></div><div class="profile-copy reveal"><p>Hangzhou Kemesser Technology Co., Ltd. is a specialized company dedicated to the research, development, production and sales of cell thawing, cryopreservation and low-temperature operation products.</p><p>The company has established three major product systems: cell thawing, controlled-rate freezing and cold operation. The portfolio includes ThawLINE, ThawLINE Pro, ThawHome, MobiThaw and ThawWaker cell thawing systems; CellHome-12, CellHome-125, CellHome-30, CellHome-305 and CellHome-60 controlled-rate freezing containers; as well as the CoolHome ice-free workstation, HolderHome ice-free freezing container, BlockHome tube modules, TransHome dry ice transport container and IceHome ice pans and buckets.</p><p>These products are widely used by universities, research institutes, hospitals, biopharmaceutical companies, cell therapy facilities, biobanks and life science laboratories, providing safer, more efficient and more stable solutions for cell cryopreservation and thawing.</p></div></section><section class="section belief-section"><div class="belief-heading reveal"><p class="eyebrow">OUR PRINCIPLES</p><h2>Quality is the Foundation of Kemesser.</h2></div><div class="belief-grid"><article class="belief-card reveal"><span>01</span><h3>Quality First</h3><p>Without quality, there is no market; without quality, there is no benefit; and without benefit, there is no development. Product quality is the foundation on which a company earns its place in the market and secures its future. The quality of a product determines its life and can ultimately shape the future of the enterprise.</p></article><article class="belief-card reveal"><span>02</span><h3>Efficient R&amp;D Team</h3><p>As technology advances and competition intensifies, new-product development becomes increasingly important. Building a high-performing R&amp;D team strengthens our research capabilities and enables us to create more valuable, dependable results for modern laboratories.</p></article><article class="belief-card reveal"><span>03</span><h3>Service Supports Sustainable Growth</h3><p>Every product and service is evaluated through the customer experience. Kemesser pursues the healthy development of the entire production and service chain, with professional support serving as an essential and independent point of contact for every customer.</p></article></div></section>`;
page('about.html','About Us','Learn about Hangzhou Kemesser Technology and its cell cryopreservation, thawing and cold-operation products.',aboutBody,{current:'about.html',light:false});

const downloadsBody = `<section class="page-hero"><p class="eyebrow reveal">DOWNLOADS</p><h1 class="reveal">Download Center</h1></section><section class="section utility-panel"><div class="filter-bar reveal"><select data-manual-filter="series"><option value="">All Series</option><option value="复苏系列">Thawing</option><option value="冻存系列">Cryopreservation</option></select><select data-manual-filter="language"><option value="">All Languages</option><option value="中文">Chinese</option><option value="English">English</option></select><input type="search" data-manual-search placeholder="Search by product or type" /></div><div class="table-card reveal"><table class="download-table" data-manual-table><thead><tr><th>Product</th><th>Series</th><th>Product Type</th><th>Language</th><th>Version</th><th>Updated</th><th>Size</th><th>Download</th></tr></thead><tbody></tbody></table></div><div class="empty-state" data-manual-empty hidden>No matching manual was found. Please try another keyword or contact Kemesser.</div></section>`;
page('downloads.html','Download Center','Download Kemesser product manuals and operating documents.',downloadsBody,{current:'downloads.html',data:true});

const inquiryBody = `<section class="page-hero"><p class="eyebrow reveal">INQUIRY</p><h1 class="reveal">Sales Inquiry</h1><p class="reveal">Tell us about the product, application and purchasing plan. Our team will contact you shortly.</p></section><section class="section form-section"><form class="kemesser-form reveal" data-kemesser-form data-form-type="inquiry"><div class="form-grid"><label>Name *<input name="Name" required /></label><label>Company *<input name="Company" required /></label><label>Phone *<input name="Phone" required /></label><label>Email<input type="email" name="Email" /></label><label>Country / Region<input name="Country / Region" /></label><label>Product *<select name="Product" required data-product-options></select></label><label>Application<input name="Application" /></label><label>Purchasing Plan<input name="Purchasing Plan" /></label></div><label>Message<textarea name="Message"></textarea></label><label class="privacy-check"><input type="checkbox" required /> I agree that Kemesser may process my contact information to respond to this inquiry.</label><button class="btn btn-primary" type="submit">Submit Inquiry</button><p class="form-message" data-form-message></p></form></section>`;
page('inquiry.html','Sales Inquiry','Contact Kemesser for product selection, quotation and sales support.',inquiryBody,{current:'inquiry.html',data:true});

const supportBody = `<section class="page-hero"><p class="eyebrow reveal">AFTER-SALES SERVICE</p><h1 class="reveal">After-sales Service</h1><p class="reveal">Submit the device and issue details so our technical support team can assist you.</p></section><section class="section form-section"><form class="kemesser-form reveal" data-kemesser-form data-form-type="support"><div class="form-grid"><label>Name *<input name="Name" required /></label><label>Company *<input name="Company" required /></label><label>Phone *<input name="Phone" required /></label><label>Email<input type="email" name="Email" /></label><label>Product *<select name="Product" required data-product-options></select></label><label>Serial Number<input name="Serial Number" /></label></div><label>Issue Description *<textarea name="Issue Description" required></textarea></label><label class="privacy-check"><input type="checkbox" required /> I agree that Kemesser may process my contact information to provide technical support.</label><button class="btn btn-primary" type="submit">Submit Service Request</button><p class="form-message" data-form-message></p></form></section>`;
page('support.html','After-sales Service','Submit a Kemesser product service and technical support request.',supportBody,{current:'support.html',data:true});

const mapSrc = 'https://api.map.baidu.com/place/search?query=%E6%A1%83%E8%8A%B1%E6%B9%96%E6%85%A7%E6%98%9F%E4%B8%AD%E5%BF%83&region=%E6%9D%AD%E5%B7%9E%E5%B8%82&output=html&src=kemesser.website';
const contactBody = `<section class="page-hero"><p class="eyebrow reveal">CONTACT</p><h1 class="reveal">Contact Us</h1><p class="reveal">Contact the Kemesser sales and technical support teams.</p></section><section class="section contact-layout"><div class="contact-info reveal"><h2>Hangzhou Kemesser Technology Co., Ltd.</h2><p><strong>Domestic Sales:</strong> 15067580026</p><p><strong>Domestic &amp; International Sales:</strong> 15868179726</p><p><strong>Tel:</strong> +86 571 87156759 / 87156259</p><p><strong>Technical Support:</strong> 15384056062</p><p><strong>Fax:</strong> +86 571 87156701</p><p><strong>Email:</strong> andy@kemesser.com / rain@kemesser.com / demi@kemesser.com (export)</p><p><strong>Address:</strong> Rooms 610 &amp; 611, Building 1, Huixing Center, Taohuahu, Dinglan Subdistrict, Shangcheng District, Hangzhou, Zhejiang, China</p></div><div class="map-card map-embed reveal"><iframe class="map-frame" title="Kemesser office map" src="${mapSrc}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></section>`;
page('contact.html','Contact Us','Contact Hangzhou Kemesser Technology sales and technical support.',contactBody,{current:'contact.html'});

const compareBody = `<section class="page-hero"><p class="eyebrow reveal">PRODUCT COMPARISON</p><h1 class="reveal">Compare Products</h1><p class="reveal">Review product types, applications and principal capabilities.</p></section><section class="section utility-panel"><div class="filter-bar reveal"><input type="search" data-compare-search placeholder="Search products" /></div><div class="table-card reveal"><table class="download-table" data-compare-table><thead><tr><th>Product</th><th>Type</th><th>Application</th><th>Features</th><th>Manual</th></tr></thead><tbody></tbody></table></div></section>`;
page('compare.html','Product Comparison','Compare Kemesser thawing, cryopreservation and cold-operation products.',compareBody,{current:'compare.html',data:true});

console.log(`Generated ${fs.readdirSync(out).filter(file => file.endsWith('.html')).length} English pages in ${out}`);
