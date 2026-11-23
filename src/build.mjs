import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applications, groups, guides, products } from './catalog.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const staticRoot = resolve(root, 'public');
const dist = resolve(root, 'dist');
const symbols = await readFile(new URL('symbols.svg', import.meta.url), 'utf8');
const brand = process.env.SITE_NAME?.trim() || 'Lichengda';
const companyName = 'Xiamen Lichengda Precision Manufacturing Co., Ltd.';
const chineseCompanyName = '厦门利诚达精密制造有限公司';
const email = process.env.RFQ_EMAIL?.trim() || 'stella@lichengdaheating.com';
const whatsAppNumber = '+86 18606007249';
const origin = process.env.SITE_URL?.trim() ? new URL(process.env.SITE_URL).origin : '';
if (!/^[\w.!#$%&'*+/=?^_\x60{|}~-]+@[\w.-]+\.[a-z]{2,}$/i.test(email)) throw new Error('Set RFQ_EMAIL to a valid email address.');
if (origin && !/^https?:\/\//.test(origin)) throw new Error('Set SITE_URL to an HTTP(S) origin.');
const inquiryEmail = `mailto:${encodeURIComponent(email).replace('%40', '@')}?subject=${encodeURIComponent('Industrial Heating Product Inquiry')}`;
const whatsApp = `https://wa.me/${whatsAppNumber.replace(/\D/g, '')}`;

const lookup = new Map(products.map(product => [product.id, product]));
const guideLookup = new Map(guides.map(guide => [guide.slug, guide]));
const productsTrail = [['Products', '/products/']];
const heatingTrail = [...productsTrail, ['Heating Elements', '/heating-elements/']];
const applicationsTrail = [['Applications', '/applications/']];
const resourcesTrail = [['Resources', '/resources/']];
const quoteTrail = [['Request a Quote', '/request-a-quote/']];
const paths = [];
const nav = [
  ['/', 'Home', navPath => navPath === '/'],
  ['/products/', 'Products', navPath => /^\/(products|heating-elements|thermocouples|temperature-sensors)\//.test(navPath)],
  ['/applications/', 'Applications', navPath => navPath === '/applications/'],
  ['/resources/', 'Resources', navPath => navPath.startsWith('/resources/')],
];

const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const btn = (text, href, style = 'primary', iconName = 'arrow') => `<a class="button button-${style}" href="${escape(href)}">${escape(text)}${iconName ? icon(iconName) : ''}</a>`;
const sectionHead = (label, title, copy = '') => `<div class="section-heading"><div><p class="eyebrow">${escape(label)}</p><h2>${escape(title)}</h2></div>${copy ? `<p>${escape(copy)}</p>` : ''}</div>`;
const quoteLink = (id = '') => `/request-a-quote/${id ? '?product=' + encodeURIComponent(id) : ''}`;
const photo = product => product.image && existsSync(resolve(staticRoot, 'assets', product.image + '.webp'));
const coolPhotos = new Set(['immersion-heaters', 'finned-tubular-heaters', 'mineral-insulated', 'high-temperature', 'coil-heaters', 'rtd']);
const photoTone = product => coolPhotos.has(product.image) ? ' cool-photo' : '';

function brandMark() {
  return `<a class="brand" href="/" aria-label="${escape(brand)} home"><img src="/assets/mark.svg" width="38" height="38" alt=""><span>${escape(brand.toUpperCase())}<small>INDUSTRIAL HEATING</small></span></a>`;
}

function salesContacts() {
  return `<address class="sales-contacts">
    <a href="${escape(inquiryEmail)}" aria-label="Email sales at ${escape(email)}">${escape(email)}</a>
    <a href="${whatsApp}">WhatsApp ${escape(whatsAppNumber)} ${icon('external')}</a>
  </address>`;
}

function searchMetadata({ path, title, description, trail, type, article, image }) {
  if (!origin) return '';

  const url = origin + path;
  const organizationId = origin + '/#organization';
  const websiteId = origin + '/#website';
  const graph = [{
    '@type': type,
    '@id': url + '#webpage',
    url,
    name: title,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': websiteId },
    ...(trail.length ? { breadcrumb: { '@id': url + '#breadcrumb' } } : {}),
  }];

  if (path === '/') {
    graph.push({
      '@type': 'Organization',
      '@id': organizationId,
      name: brand,
      legalName: chineseCompanyName,
      url,
      email,
    }, {
      '@type': 'WebSite',
      '@id': websiteId,
      url,
      name: brand,
      inLanguage: 'en',
      publisher: { '@id': organizationId },
    });
  }
  if (trail.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': url + '#breadcrumb',
      itemListElement: [['Home', '/'], ...trail].map(([name, href], index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name,
        item: origin + (href || path),
      })),
    });
  }
  if (article) {
    graph.push({
      '@type': 'Article',
      '@id': url + '#article',
      headline: title,
      description,
      inLanguage: 'en',
      mainEntityOfPage: { '@id': url + '#webpage' },
      publisher: { '@id': organizationId },
    });
  }
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
    .replaceAll('<', '\\u003c');
  return `<link rel="canonical" href="${escape(url)}">
<meta property="og:type" content="${article ? 'article' : 'website'}">
<meta property="og:site_name" content="${escape(brand)}">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${escape(url)}">
<meta property="og:image" content="${escape(origin + image)}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${json}</script>`;
}

function layout({ path, title, description, body, trail, type, article, image }) {
  const navigation = nav.map(([href, name, active]) => `<a href="${href}"${active(path) ? ' aria-current="page"' : ''}>${name}</a>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${escape(description)}">
<meta name="theme-color" content="#131a20">
<title>${escape(title)} | ${escape(brand)}</title>
<link rel="icon" href="/assets/mark.svg" type="image/svg+xml">
<link rel="stylesheet" href="/styles.css">
${searchMetadata({ path, title, description, trail, type, article, image })}
${path === '/' ? '<link rel="preload" as="image" href="/assets/industrial-heating.webp">' : ''}
<script type="module" src="/site.js"></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${symbols}
<header class="site-header">
  <div class="container header-inner">
    ${brandMark()}
    <button class="icon-button menu-toggle" type="button" aria-expanded="false" aria-controls="header-nav" aria-label="Open menu">${icon('menu')}</button>
    <nav class="site-nav" id="header-nav" aria-label="Main navigation">${navigation}</nav>
    <div class="header-actions"><a class="icon-button search-link" href="/products/?search=1" aria-label="Search products">${icon('search')}</a>${btn('Request a Quote', quoteLink(), 'primary', 'external')}</div>
  </div>
</header>
<main id="main">${body}</main>
<footer class="site-footer">
  <div class="container footer-grid">
    <div>${brandMark()}<p>${escape(companyName)}<br><span lang="zh-CN">${escape(chineseCompanyName)}</span></p></div>
    <nav aria-label="Product families"><strong>Products</strong><a href="/thermocouples/">Industrial Thermocouples</a><a href="/heating-elements/tubular-heaters/">Tubular Heaters</a><a href="/heating-elements/">Heating Elements</a></nav>
    <nav aria-label="Footer navigation"><strong>Explore</strong><a href="/applications/">Applications</a><a href="/resources/">Selection Guides</a><a href="/request-a-quote/">Request a Quote</a></nav>
    <div class="footer-contact"><strong>Contact Sales</strong>${salesContacts()}</div>
  </div>
  <div class="container footer-bottom"><small>© ${new Date().getUTCFullYear()} ${escape(brand)}</small><small>Made to specification</small></div>
</footer>
</body>
</html>`;
}

async function page(path, title, description, body, {
  trail = [], type = 'WebPage', article = false, image = '/assets/industrial-heating.webp',
} = {}) {
  paths.push(path);
  const destination = resolve(dist, '.' + path, 'index.html');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, layout({ path, title, description, body, trail, type, article, image }));
}

function crumb(items) {
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${items.map(([name, href], index) => `<li>${index === items.length - 1 ? `<span aria-current="page">${escape(name)}</span>` : `<a href="${escape(href)}">${escape(name)}</a>`}</li>`).join('')}</ol></nav>`;
}

function pageIntro(kicker, title, copy, trail) {
  return `<section class="page-intro"><div class="container">${crumb(trail)}<p class="eyebrow">${escape(kicker)}</p><h1>${escape(title)}</h1><p class="intro-copy">${escape(copy)}</p></div></section>`;
}

function card(product) {
  const visual = photo(product) ? `<div class="card-image${photoTone(product)}"><img src="/assets/${product.image}.webp" width="512" height="512" loading="lazy" alt=""></div>` : '';
  return `<article class="product-card" data-group="${product.group}" data-search="${escape([product.name, product.text, ...product.options, product.use].join(' '))}">
    <a href="${product.path}" class="card-link">
      ${visual}
      <div class="card-body"><p class="card-category">${groups[product.group]}</p><h3>${escape(product.name)}</h3><p>${escape(product.text)}</p><span class="card-action">View product ${icon('arrow')}</span></div>
    </a>
  </article>`;
}

function related(ids) {
  return `<ul class="link-list">${ids.map(id => lookup.get(id)).filter(Boolean).map(product => `<li><a href="${product.path}">${escape(product.name)} ${icon('arrow')}</a></li>`).join('')}</ul>`;
}

function selectionGuides(slugs) {
  return `<ul class="link-list">${slugs.map(slug => {
    const guide = guideLookup.get(slug);
    return `<li><a href="/resources/${guide.slug}/">${escape(guide.name)} ${icon('arrow')}</a></li>`;
  }).join('')}</ul>`;
}

function filters() {
  return `<div class="catalog-tools">
    <div class="filters" role="group" aria-label="Filter product families">
      <button type="button" data-filter="all" aria-pressed="true">${icon('grid')} All Products</button>
      ${Object.entries(groups).map(([id, label]) => `<button type="button" data-filter="${id}" aria-pressed="false">${label}</button>`).join('')}
    </div>
    <label class="catalog-search">${icon('search')}<span class="sr-only">Search products</span><input type="search" id="product-search" placeholder="Search products"></label>
  </div>`;
}

function catalog(items, searchable = false) {
  return `<div ${searchable ? 'data-catalog' : ''}>
    ${searchable ? filters() + '<p class="sr-only" id="result-status" role="status"></p>' : ''}
    <div class="product-grid">${[...items.filter(photo), ...items.filter(item => !photo(item))].map(card).join('')}</div>
    ${searchable ? '<div class="empty-state" hidden><h3>No matching products</h3><p>Try a different keyword or clear the filters.</p><button type="button" class="button button-primary" data-reset>Show all products</button></div>' : ''}
  </div>`;
}

function capabilities() {
  const entries = [['temp', 'Temperature Sensing', 'Thermocouples & RTDs'], ['heat', 'Industrial Heating', 'Tubular & specialty elements'], ['ruler', 'Made to Specification', 'Geometry, material & connections'], ['globe', 'OEM & Export Inquiries', 'For equipment builders & distributors']];
  return `<div class="capabilities"><div class="container capabilities-inner">${entries.map(([id, title, copy]) => `<div class="capability"><span class="capability-icon">${icon(id)}</span><div><strong>${escape(title)}</strong><span>${escape(copy)}</span></div></div>`).join('')}</div></div>`;
}

function callout(title, copy, label = 'Request a Quote', href = quoteLink()) {
  return `<section class="callout"><div class="container callout-inner"><div><h2>${escape(title)}</h2><p>${escape(copy)}</p></div>${btn(label, href, 'primary', 'external')}</div></section>`;
}

function applicationsGrid() {
  return `<div class="application-grid">${applications.map(app => `<article class="application"><span class="tile-icon">${icon(app.icon)}</span><h2>${escape(app.name)}</h2><p>${escape(app.description)}</p>${related(app.ids)}</article>`).join('')}</div>`;
}

const home = `
<section class="hero">
  <div class="container hero-inner">
    <p class="eyebrow hero-eyebrow">Industrial heating &amp; temperature sensing</p>
    <h1>Industrial Heat.<br><span>Built to Spec.</span></h1>
    <p class="hero-copy">Custom <a href="/thermocouples/">industrial thermocouples</a>, <a href="/heating-elements/tubular-heaters/">tubular heaters</a> and heating elements for OEM equipment and process applications.</p>
    <div class="actions">${btn('Explore Products', '#products')}${btn('Request a Quote', quoteLink(), 'outline', '')}</div>
  </div>
</section>
${capabilities()}
<section class="section catalog-section" id="products"><div class="container">
  ${sectionHead('Product catalog', 'Explore Our Products', 'Start with the product family, then specify the dimensions, materials and electrical requirements for your equipment.')}
  ${catalog(products.filter(p => p.featured))}
  <div class="catalog-footer">${btn('View All Products', '/products/', 'secondary')}</div>
</div></section>
<section class="section"><div class="container">
  ${sectionHead('Applications', 'Find Parts by Application', 'Choose a starting point based on the process or equipment you are designing or sourcing for.')}
  ${applicationsGrid()}
</div></section>
${callout('Have a drawing or a part to replace?', 'Share the operating conditions, required dimensions and order quantity so the configuration can be reviewed.')}
`;

await rm(dist, { recursive: true, force: true });
await cp(staticRoot, dist, { recursive: true });
await page('/', 'Custom Thermocouples & Industrial Heating Elements', 'Source custom industrial thermocouples, tubular heaters and heating elements for OEM equipment. Browse configurations and prepare a quote by drawing.', home);

await page('/products/', 'Industrial Product Catalog', 'Browse custom industrial thermocouples, RTDs, tubular heaters, immersion heaters and specialty heating elements.', `
${pageIntro('Product catalog', 'Industrial Product Catalog', 'Browse made-to-spec industrial temperature sensors and heating elements.', productsTrail)}
<section class="section catalog-section catalog-page"><div class="container">${catalog(products, true)}</div></section>
${callout('Need a custom configuration?', 'Share your application, dimensions and requirements to prepare a quote request.')}
`, { trail: productsTrail, type: 'CollectionPage' });

await page('/heating-elements/', 'Custom Industrial Heating Elements', 'Browse custom industrial heating elements including tubular, immersion, cartridge, band and specialty heaters.', `
${pageIntro('Industrial heating', 'Industrial Heating Elements', 'Compare custom tubular, immersion, cartridge, band and flexible heaters by the medium, required output and installation geometry.', heatingTrail)}
<section class="section catalog-section catalog-page"><div class="container">${catalog(products.filter(p => p.group !== 'sensing'))}</div></section>
${callout('Specify a custom heating element', 'Include voltage, wattage, operating conditions and a drawing or dimensions.')}
`, { trail: heatingTrail, type: 'CollectionPage' });

for (const product of products) {
  const parent = lookup.get(product.parent);
  const trail = [...(product.group === 'sensing' ? productsTrail : heatingTrail)];
  if (parent) trail.push([parent.name, parent.path]);
  trail.push([product.name]);
  const children = products.filter(item => item.parent === product.id);
  const alternatives = products.filter(item => item.group === product.group && item.id !== product.id && item.parent !== product.id).slice(0, 3);
  const image = photo(product) ? `/assets/${product.image}.webp` : undefined;
  const imageAlt = product.imageAlt || `${product.name} configuration illustration`;
  const questions = product.questions || [];
  const guidesForProduct = product.guides || [];
  await page(product.path, product.title || `Custom ${product.name}`, product.description || product.text, `
<section class="detail-hero"><div class="container">
  ${crumb(trail)}
  <div class="detail-grid${photo(product) ? '' : ' text-only'}"><div>
    <p class="eyebrow">${groups[product.group]}</p>
    <h1>${escape(product.name)}</h1><p class="intro-copy">${escape(product.intro)}</p>
    <div class="actions">${btn('Request a Quote', quoteLink(product.id), 'primary', 'external')}${btn('View Specifications', '#specifications', 'secondary', '')}</div>
  </div>${image ? `<figure class="detail-image${photoTone(product)}"><img src="${image}" alt="${escape(imageAlt)}" width="512" height="512"><figcaption>Illustrative configuration</figcaption></figure>` : ''}</div>
</div></section>
<section class="section detail-section" id="specifications"><div class="container">
  ${sectionHead('Configuration', 'Specify Your Requirements', 'The final construction depends on your drawing and operating conditions.')}
  <div class="spec-grid">
    <article class="spec-card"><h3>Configuration Options</h3><ul>${product.options.map(item => `<li>${escape(item)}</li>`).join('')}</ul></article>
    <article class="spec-card"><h3>Include in Your RFQ</h3><ul>${product.specs.map(item => `<li>${escape(item)}</li>`).join('')}</ul></article>
  </div>
  <section class="use-case"><h2>Typical Applications</h2><p>${escape(product.use)}</p></section>
  ${questions.length || guidesForProduct.length ? `<div class="detail-support">
    ${questions.length ? `<section class="use-case"><h2>Ordering Questions</h2><dl class="ordering-questions">${questions.map(([question, answer]) =>
      `<dt>${escape(question)}</dt><dd>${escape(answer)}</dd>`).join('')}</dl></section>` : ''}
    ${guidesForProduct.length ? `<section class="use-case"><h2>Selection Guides</h2>${selectionGuides(guidesForProduct)}</section>` : ''}
  </div>` : ''}
</div></section>
<section class="section related-section"><div class="container">
  ${sectionHead('Product catalog', children.length ? 'Configuration Families' : 'Related Products')}
  ${catalog(children.length ? children : alternatives)}
</div></section>
${callout('Request this configuration', 'Include your technical requirements, target quantity and any supporting drawings.', 'Request a Quote', quoteLink(product.id))}
`, { trail, type: 'ItemPage', image });
}

await page('/applications/', 'Industrial Heating & Sensing Applications', 'Find heating and sensing products for plastics, process air, liquid heating and packaging tooling.', `
${pageIntro('Industries', 'Industrial Applications', 'Find a suitable starting point for specifying heating and sensing components in your equipment.', applicationsTrail)}
<section class="section"><div class="container">${applicationsGrid()}</div></section>
${callout('Working on an OEM project?', 'Share the equipment and operating conditions to start your custom inquiry.')}
`, { trail: applicationsTrail, type: 'CollectionPage' });

await page('/resources/', 'Industrial Heating & Sensing Selection Guides', 'Compare thermocouples and RTDs, choose a heating element, and learn how to calculate surface watt density for a custom heater.', `
${pageIntro('Resources', 'Selection Guides', 'Compare temperature sensors, choose a heater family and calculate surface watt density for your equipment.', resourcesTrail)}
<section class="section"><div class="container resource-grid">${guides.map(guide => `<article class="resource-card"><a href="/resources/${guide.slug}/"><p class="eyebrow">Selection guide</p><h2>${escape(guide.name)}</h2><p>${escape(guide.description)}</p><span class="card-action">Read the guide ${icon('arrow')}</span></a></article>`).join('')}</div></section>
`, { trail: resourcesTrail, type: 'CollectionPage' });
for (const guide of guides) {
  const trail = [...resourcesTrail, [guide.name]];
  await page(`/resources/${guide.slug}/`, guide.name, guide.description, `
${pageIntro('Selection guide', guide.name, guide.description, trail)}
<section class="section"><div class="container guide-grid"><article class="prose">${guide.sections.map(([title, copy]) => `<section><h2>${escape(title)}</h2><p>${escape(copy)}</p></section>`).join('')}</article><aside class="spec-card"><h2>Related Products</h2>${related(guide.related)}</aside></div></section>
${callout('Have a specification to review?', 'Share your equipment, operating conditions and dimensions in a custom RFQ.')}
`, { trail, article: true });
}

const productOptions = Object.entries(groups).map(([id, label]) => `<optgroup label="${label}">${products.filter(p => p.group === id).map(p => `<option value="${p.id}" data-specs="${escape(p.specs.join(' · '))}">${escape(p.name)}</option>`).join('')}</optgroup>`).join('');

await page('/request-a-quote/', 'Request a Custom Quote', 'Prepare a custom quote request for industrial thermocouples and heating elements with requirements and drawings.', `
${pageIntro('Made to specification', 'Request a Quote', 'Tell us what you need to heat or measure. Include your drawing or dimensions so the configuration can be reviewed.', quoteTrail)}
<section class="section"><div class="container quote-grid">
  <form class="quote-form" method="post" data-email="${escape(email)}">
    <h2>Project Details</h2>
    <p class="form-hint">Fields marked * are required.</p><noscript><p>Enable JavaScript to download an RFQ.</p></noscript>
    <div class="form-grid">
      <label class="full">Product family *<select name="product" id="quote-product" required><option value="">Select a product family</option>${productOptions}<option value="other">Other custom product</option></select></label>
      <label>Your name *<input name="name" autocomplete="name" required maxlength="120"></label>
      <label>Work email *<input name="email" type="email" autocomplete="email" required maxlength="160"></label>
      <label>Company<input name="company" autocomplete="organization" maxlength="160"></label>
      <label>Destination country<input name="country" autocomplete="country-name" maxlength="100"></label>
      <label>Quantity<input type="number" name="quantity" min="1" max="100000000" placeholder="e.g. 100"></label>
      <label>Application<input name="application" maxlength="200" placeholder="e.g. Packaging sealing jaw"></label>
      <div class="full"><label>Technical requirements *<textarea name="requirements" rows="5" required maxlength="6000" aria-describedby="spec-hint"></textarea></label><p class="form-hint" id="spec-hint">Include dimensions, operating conditions and any required materials.</p></div>
      <div class="full"><label>Drawings or photos<input type="file" name="drawings" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.dxf,.dwg,.step,.stp" aria-describedby="file-hint"></label><p class="form-hint" id="file-hint">PDF, images or CAD files. Up to 10 MB combined.</p></div>
    </div>
    <div class="form-actions"><button class="button button-primary" type="submit" disabled>Download RFQ ${icon('arrow')}</button><p class="form-hint" id="quote-feedback" role="status" aria-live="polite"></p></div>
  </form>
  <aside class="spec-card quote-aside"><h2>What to Include</h2><h3>Thermocouples</h3><p>Sensor type, working temperature, probe dimensions, sheath, junction and termination.</p><h3>Heating elements</h3><p>Voltage, wattage, heating medium, installation geometry and mounting.</p><div class="quote-contact"><h3>Contact Sales</h3><p>Download your RFQ, review it, and send the draft by email. You can also contact us directly.</p>${salesContacts()}</div></aside>
</div></section>
`, { trail: quoteTrail, type: 'ContactPage' });

const robots = 'User-agent: *\nAllow: /\n' + (origin ? `Sitemap: ${origin}/sitemap.xml\n` : '');
await writeFile(resolve(dist, 'robots.txt'), robots);
if (origin) {
  const urlset = paths.map(path => `<url><loc>${escape(origin + path)}</loc></url>`).join('\n');
  await writeFile(resolve(dist, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urlset + '\n</urlset>\n');

  const featured = products.filter(product => product.featured);
  const sections = [
    ['Main product pages', [
      ...featured,
      { name: 'Industrial Heating Elements', path: '/heating-elements/', text: 'Browse heating elements by product family and installation requirements.' },
    ]],
    ['Engineering guides', guides.map(guide => ({
      name: guide.name, path: `/resources/${guide.slug}/`, text: guide.description,
    }))],
    ['Applications and inquiries', [
      { name: 'Industrial Applications', path: '/applications/', text: 'Heating and sensing applications for plastics, process air, liquids and packaging.' },
      { name: 'Request a Quote', path: '/request-a-quote/', text: 'Prepare an inquiry with a drawing, dimensions, operating conditions and quantity.' },
    ]],
    ['Optional', [
      { name: 'Home', path: '/', text: 'Overview of the company and its heating and temperature sensing products.' },
      { name: 'Industrial Product Catalog', path: '/products/', text: 'Search the complete product catalog.' },
      { name: 'Selection Guides', path: '/resources/', text: 'Browse all guides.' },
      ...products.filter(product => !product.featured),
    ]],
  ];
  const lists = sections.map(([heading, links]) => [
    `## ${heading}`,
    '',
    ...links.map(({ name, path, text }) => `- [${name}](${origin}${path}): ${text}`),
  ].join('\n'));
  const llms = [
    `# ${brand} Industrial Heating`,
    '> Custom industrial thermocouples, tubular heaters and heating elements for OEM equipment and process applications.',
    `${companyName} (${chineseCompanyName}) supplies made-to-spec heating and sensing products. The product pages describe configuration options and information to include in an RFQ. Final specifications depend on the drawing and operating conditions. Product images are illustrative.`,
    ...lists,
  ].join('\n\n');
  await writeFile(resolve(dist, 'llms.txt'), llms + '\n');
}
console.log(`Built ${paths.length} static pages in dist/`);
