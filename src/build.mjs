import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applications, groups, guides, products } from './catalog.mjs';
import { glossary } from './glossary.mjs';

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
const resourcesTrail = [['Guides', '/resources/']];
const glossaryTrail = [['Glossary', '/glossary/']];
const aboutTrail = [['About Us', '/about-us/']];
const quoteTrail = [['Request a Quote', '/request-a-quote/']];
const pageDescriptions = new Map();
const nav = [
  ['/', 'Home', navPath => navPath === '/'],
  ['/products/', 'Products', navPath => /^\/(products|heating-elements|thermocouples|temperature-sensors)\//.test(navPath)],
  ['/applications/', 'Applications', navPath => navPath === '/applications/'],
  ['/resources/', 'Guides', navPath => navPath.startsWith('/resources/')],
  ['/glossary/', 'Glossary', navPath => navPath === '/glossary/'],
  ['/about-us/', 'About Us', navPath => navPath === '/about-us/'],
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

function photoFigure({ image, width, height, alt, caption }) {
  return `<figure>
    <img src="/assets/${image}.webp" width="${width}" height="${height}" loading="lazy" decoding="async" alt="${escape(alt)}">
    <figcaption>${escape(caption)}</figcaption>
  </figure>`;
}

function brandMark() {
  return `<a class="brand" href="/" aria-label="${escape(brand)} home"><img src="/assets/mark.svg" width="38" height="38" alt=""><span>${escape(brand.toUpperCase())}<small>INDUSTRIAL HEATING</small></span></a>`;
}

function salesContacts() {
  return `<address class="sales-contacts">
    <a href="${escape(inquiryEmail)}" aria-label="Email sales at ${escape(email)}">${escape(email)}</a>
    <a href="${whatsApp}">WhatsApp ${escape(whatsAppNumber)} ${icon('external')}</a>
  </address>`;
}

function searchMetadata({ path, title, description, trail, type, article, image, items, terms }) {
  if (!origin) return '';

  const url = origin + path;
  const organizationId = origin + '/#organization';
  const websiteId = origin + '/#website';
  const webPage = {
    '@type': type,
    '@id': url + '#webpage',
    url,
    name: title,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': websiteId },
    ...(trail.length ? { breadcrumb: { '@id': url + '#breadcrumb' } } : {}),
    ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: origin + image } } : {}),
  };
  const graph = [webPage];

  if (path === '/') {
    webPage.about = { '@id': organizationId };
    graph.push({
      '@type': 'Organization',
      '@id': organizationId,
      name: brand,
      legalName: chineseCompanyName,
      url,
      email,
      description: 'Made-to-spec industrial thermocouples, RTD sensors and electric heating elements for OEM equipment and process applications.',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email,
        url: origin + '/request-a-quote/',
      },
    }, {
      '@type': 'WebSite',
      '@id': websiteId,
      url,
      name: brand,
      inLanguage: 'en',
      publisher: { '@id': organizationId },
    });
  }
  if (type === 'AboutPage' || type === 'ContactPage') webPage.about = { '@id': organizationId };
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
    webPage.mainEntity = { '@id': url + '#article' };
    graph.push({
      '@type': 'Article',
      '@id': url + '#article',
      headline: title,
      description,
      inLanguage: 'en',
      mainEntityOfPage: { '@id': url + '#webpage' },
      author: { '@id': organizationId },
      publisher: { '@id': organizationId },
    });
  }
  if (items.length) {
    webPage.mainEntity = { '@id': url + '#items' };
    graph.push({
      '@type': 'ItemList',
      '@id': url + '#items',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        name: item.name,
        position: index + 1,
        url: origin + item.path,
      })),
    });
  }
  if (terms.length) {
    const termsId = url + '#terms';
    webPage.mainEntity = { '@id': termsId };
    graph.push({
      '@type': 'DefinedTermSet',
      '@id': termsId,
      name: title,
      hasDefinedTerm: terms.map(term => ({
        '@type': 'DefinedTerm',
        '@id': url + '#' + term.id,
        name: term.name,
        url: url + '#' + term.id,
        description: term.definition,
        inDefinedTermSet: { '@id': termsId },
      })),
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
<meta property="og:image" content="${escape(origin + (image || '/assets/industrial-heating.webp'))}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${json}</script>`;
}

function layout({ path, title, description, body, trail, type, article, image, items, terms }) {
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
${searchMetadata({ path, title, description, trail, type, article, image, items, terms })}
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
    <nav aria-label="Footer navigation"><strong>Explore</strong><a href="/applications/">Applications</a><a href="/resources/">Guides</a><a href="/glossary/">Glossary</a><a href="/about-us/">About Us</a><a href="/request-a-quote/">Request a Quote</a></nav>
    <div class="footer-contact"><strong>Contact Sales</strong>${salesContacts()}</div>
  </div>
  <div class="container footer-bottom"><small>© ${new Date().getUTCFullYear()} ${escape(brand)}</small><small>Made to specification</small></div>
</footer>
</body>
</html>`;
}

async function page(path, title, description, body, {
  trail = [], type = 'WebPage', article = false, image, items = [], terms = [],
} = {}) {
  pageDescriptions.set(path, description);
  const destination = resolve(dist, '.' + path, 'index.html');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, layout({ path, title, description, body, trail, type, article, image, items, terms }));
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

function questionsSection(title, questions) {
  return `<section class="use-case"><h2>${escape(title)}</h2><dl class="ordering-questions">${questions.map(([question, answer]) =>
    `<dt>${escape(question)}</dt><dd>${escape(answer)}</dd>`).join('')}</dl></section>`;
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

function catalogOrder(items) {
  return [...items.filter(photo), ...items.filter(item => !photo(item))];
}

function catalog(items, searchable = false) {
  return `<div ${searchable ? 'data-catalog' : ''}>
    ${searchable ? filters() + '<p class="sr-only" id="result-status" role="status"></p>' : ''}
    <div class="product-grid">${catalogOrder(items).map(card).join('')}</div>
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

function applicationsGrid(heading, withSpecifications = false) {
  return `<div class="application-grid">${applications.map(app => `<article class="application" id="${app.id}">
    <span class="tile-icon">${icon(app.icon)}</span><${heading}>${escape(app.name)}</${heading}><p>${escape(app.description)}</p>
    ${withSpecifications ? `<p><strong>For your RFQ</strong> ${escape(app.specification)}</p>` : ''}
    ${related(app.ids)}
  </article>`).join('')}</div>`;
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
  ${questionsSection('Made-to-Spec Heating and Sensing', [
    ['What products does Lichengda make to specification?', 'The catalog covers industrial thermocouples and RTD assemblies for measuring temperature, plus tubular, immersion, cartridge, band and specialty heaters for transferring heat. Configurations are reviewed against the application and drawing.'],
    ['How do I request an OEM or replacement part?', 'Share the part function, dimensions, operating conditions and quantity. For a heater, provide voltage and power if known. For a sensor, provide its type and instrument input. An existing drawing, part number or label photo can help identify a replacement.'],
  ])}
</div></section>
<section class="section"><div class="container">
  ${sectionHead('Applications', 'Find Parts by Application', 'Choose a starting point based on the process or equipment you are designing or sourcing for.')}
  ${applicationsGrid('h3')}
</div></section>
${callout('Have a drawing or a part to replace?', 'Share the operating conditions, required dimensions and order quantity so the configuration can be reviewed.')}
`;

await rm(dist, { recursive: true, force: true });
await cp(staticRoot, dist, { recursive: true });
await page('/', 'Custom Thermocouples & Industrial Heating Elements', 'Lichengda supplies made-to-spec industrial thermocouples, tubular heaters and heating elements for OEM equipment. Review configurations and request a quote.', home,
  { image: '/assets/industrial-heating.webp' });

await page('/products/', 'Industrial Heater & Temperature Sensor Catalog', 'Find industrial temperature sensors, tubular and immersion heaters, and specialty elements. Compare product options and RFQ requirements.', `
${pageIntro('Product catalog', 'Temperature Sensor & Heater Catalog', 'Search temperature sensors, tubular and immersion heaters, and specialty elements. Open a product family to see configurations, installation details and related selection guides.', productsTrail)}
<section class="section catalog-section catalog-page"><div class="container">
  ${catalog(products, true)}
  ${questionsSection('How to Use the Product Catalog', [
    ['Which product group should I start with?', 'Choose Temperature Sensors for a probe, thermowell or connector. Choose Tubular & Immersion for formed tubular elements and fluid heating assemblies. Choose Specialty Heaters for cartridges, bands, strips, cables and flexible elements.'],
    ['How can I narrow down a product when I only have a drawing?', 'Look for the device function and the mounting interface first. A threaded probe points to a sensor family; a cylindrical bore can indicate a cartridge heater; a heated loop through a tank port suggests an immersion configuration. Include uncertain details in the RFQ.'],
  ])}
</div></section>
${callout('Need a custom configuration?', 'Share your application, dimensions and requirements to prepare a quote request.')}
`, { trail: productsTrail, type: 'CollectionPage', items: catalogOrder(products) });

const heatingProducts = products.filter(product => product.group !== 'sensing');
await page('/heating-elements/', 'Industrial Heating Elements & Custom Electric Heaters', 'Compare custom electric heating elements for air, liquids, tooling and equipment surfaces. Specify the heating medium, installation geometry and power.', `
${pageIntro('Industrial heating', 'Industrial Heating Elements', 'Compare custom electric heating elements by how heat reaches the load. Start with the medium, then review mounting, geometry, operating temperature and electrical supply.', heatingTrail)}
<section class="section catalog-section catalog-page"><div class="container">
  ${catalog(heatingProducts)}
  ${questionsSection('Selecting an Electric Heating Element', [
    ['Which heater families fit different heating methods?', 'For moving air, compare tubular, finned tubular and duct heaters. For water, oil or another compatible liquid, compare immersion and circulation heaters. For a solid tool, consider cartridges, bands, strips or flexible heaters based on contact geometry. For non-contact heating, evaluate infrared elements.'],
    ['What determines whether a custom heating element can be used?', 'Voltage and power are only part of the specification. Confirm the heated length, sheath or insulation, available heat transfer, duty cycle, mounting and termination. Share the minimum and maximum operating conditions when evaluating a design.'],
  ])}
</div></section>
${callout('Specify a custom heating element', 'Include voltage, wattage, operating conditions and a drawing or dimensions.')}
`, { trail: heatingTrail, type: 'CollectionPage', items: catalogOrder(heatingProducts) });

for (const product of products) {
  const parent = lookup.get(product.parent);
  const trail = [...(product.group === 'sensing' ? productsTrail : heatingTrail)];
  if (parent) trail.push([parent.name, parent.path]);
  trail.push([product.name]);
  const children = products.filter(item => item.parent === product.id);
  const relatedProducts = [...new Set([...children, ...product.related.map(id => lookup.get(id))])];
  const image = photo(product) ? `/assets/${product.image}.webp` : undefined;
  const imageAlt = product.imageAlt || `${product.name} configuration illustration`;
  await page(product.path, product.title, product.description, `
<section class="detail-hero"><div class="container">
  ${crumb(trail)}
  <div class="detail-grid${image ? '' : ' text-only'}"><div>
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
  ${product.photographs?.length ? `<section class="product-photos" aria-labelledby="product-photos-heading">
    <h2 id="product-photos-heading">Product Photos</h2>
    <div class="product-photos-grid">${product.photographs.map(photoFigure).join('')}</div>
  </section>` : ''}
  <div class="detail-support">
    ${questionsSection('Ordering Questions', product.questions)}
    <section class="use-case"><h2>Selection Guides</h2>${selectionGuides(product.guides)}</section>
  </div>
</div></section>
<section class="section related-section"><div class="container">
  ${sectionHead('Product catalog', children.length ? 'Configurations & Related Products' : 'Related Products')}
  ${catalog(relatedProducts)}
</div></section>
${callout('Request this configuration', 'Include your technical requirements, target quantity and any supporting drawings.', 'Request a Quote', quoteLink(product.id))}
`, { trail, type: 'ItemPage', image });
}

await page('/applications/', 'Industrial Heating Applications for OEM Equipment', 'Find heating elements and sensors for injection molding, extrusion, industrial ovens, process tanks and packaging equipment. Compare inputs for each RFQ.', `
${pageIntro('Industries', 'Industrial Heating & Sensing Applications', 'Find suitable heating elements and temperature sensors for plastics machinery, process air, liquid heating and packaging. Start with the equipment and heat transfer conditions.', applicationsTrail)}
<section class="section"><div class="container">
  ${applicationsGrid('h2', true)}
  ${questionsSection('When the Equipment Requires Both Heat and Measurement', [
    ['Should the heater and temperature sensor be specified together?', 'For a heated machine or process vessel, identify the heating zone, measurement point and control input before selecting parts. Send a layout showing both locations, intended temperature and duty cycle so the heater and probe can be evaluated in the same equipment.'],
  ])}
</div></section>
${callout('Working on an OEM project?', 'Share the equipment and operating conditions to start your custom inquiry.')}
`, { trail: applicationsTrail, type: 'CollectionPage', items: applications.map(app => ({ name: app.name, path: `/applications/#${app.id}` })) });

const guideGroups = [
  ['Temperature Measurement', guides.filter(guide => guide.group === 'sensing')],
  ['Electric Heating', guides.filter(guide => guide.group === 'heating')],
];
await page('/resources/', 'Thermocouple & Heating Element Selection Guides', 'Browse engineering guides on thermocouple types, grounded junctions, Pt100 RTDs, heater selection and surface watt density.', `
${pageIntro('Engineering resources', 'Heating & Temperature Sensor Guides', 'Compare temperature sensors, match heaters to your process and prepare specifications before requesting a quote.', resourcesTrail)}
<div class="section"><div class="container guide-library">
  ${guideGroups.map(([heading, entries]) => `<section><h2>${heading}</h2><div class="resource-grid">
    ${entries.map(guide => `<article class="resource-card"><a href="/resources/${guide.slug}/"><h3>${escape(guide.name)}</h3><p>${escape(guide.description)}</p><span class="card-action">Read the guide ${icon('arrow')}</span></a></article>`).join('')}
  </div></section>`).join('')}
  ${questionsSection('Which Guide Should I Read First?', [
    ['Where should I start for a sensor or heater project?', 'For a sensor, start with thermocouple type and instrument compatibility, then review junction construction or compare an RTD. For a heater, match the heater family to the medium and mounting, then use the watt density guide to review the active surface area.'],
  ])}
  ${btn('Browse the Glossary', '/glossary/', 'secondary')}
</div></div>
`, { trail: resourcesTrail, type: 'CollectionPage', items: guideGroups.flatMap(([, entries]) =>
  entries.map(guide => ({ name: guide.name, path: `/resources/${guide.slug}/` }))) });
for (const guide of guides) {
  const trail = [...resourcesTrail, [guide.name]];
  await page(`/resources/${guide.slug}/`, guide.name, guide.description, `
${pageIntro('Selection guide', guide.name, guide.description, trail)}
<section class="section"><div class="container guide-grid">
  <article class="prose">
    <section class="use-case guide-answer"><h2>${escape(guide.answer[0])}</h2><p>${escape(guide.answer[1])}</p></section>
    ${guide.sections.map(([title, copy]) => `<section><h2>${escape(title)}</h2><p>${escape(copy)}</p></section>`).join('')}
  </article>
  <aside class="spec-card"><h2>Related Products</h2>${related(guide.related)}<h2 class="read-next">Read Next</h2>${selectionGuides(guide.readNext)}<a class="glossary-link" href="/glossary/">Browse the glossary ${icon('arrow')}</a></aside>
</div></section>
${callout('Have a specification to review?', 'Share your equipment, operating conditions and dimensions in a custom RFQ.')}
`, { trail, article: true });
}

const alphabet = Object.entries(Object.groupBy(glossary, term => term.name[0]));
await page('/glossary/', 'Industrial Heating & Thermocouple Glossary', 'Look up industrial heating and temperature measurement terms, from Type K thermocouples and Pt100 RTDs to immersion heaters and watt density.', `
${pageIntro('Engineering resources', 'Industrial Heating & Thermocouple Glossary', 'Look up terms used in heater drawings, thermocouple specifications and temperature measurement. Each definition links to a related product or guide.', glossaryTrail)}
<section class="section catalog-section"><div class="container" data-glossary>
  <div class="glossary-tools" role="search" hidden>
    <label for="glossary-search">Search terms</label>
    <input id="glossary-search" type="search" placeholder="e.g. Pt100, sheath, watt density">
    <p id="glossary-status" role="status"></p>
  </div>
  <nav class="glossary-alphabet" aria-label="Glossary letters">${alphabet.map(([letter]) =>
    `<a href="#terms-${letter.toLowerCase()}">${letter}</a>`).join('')}</nav>
  ${alphabet.map(([letter, entries]) => `<section class="glossary-group" id="terms-${letter.toLowerCase()}">
    <h2>${letter}</h2>
    <dl class="glossary-grid">${entries.map(term => `<div class="glossary-term" id="${term.id}">
      <dt>${escape(term.name)}</dt>
      <dd><p>${escape(term.definition)}</p><a class="glossary-link" href="${escape(term.related[1])}">${escape(term.related[0])} ${icon('arrow')}</a></dd>
    </div>`).join('')}</dl>
  </section>`).join('')}
  <p class="empty-state" data-glossary-empty hidden>No matching terms. Try a shorter search or clear the field.</p>
</div></section>
${callout('Compare products and specifications', 'Use the engineering guides to compare sensor types, heater families and watt density.', 'Read the Guides', '/resources/')}
`, { trail: glossaryTrail, type: 'CollectionPage', terms: glossary });

const factoryPhoto = '/assets/lichengda-factory.webp';
const workshopPhotos = [
  {
    image: 'lichengda-workshop',
    alt: 'Lichengda workshop with a cable reel feeding a machine beside an operator',
    caption: 'Workshop equipment and workstations',
  },
  {
    image: 'lichengda-cable-assembly',
    alt: 'Operator using hand tools to assemble braided leads at a workbench',
    caption: 'Cable assembly at the workbench',
  },
  {
    image: 'lichengda-sensor-packaging',
    alt: 'Temperature probe assemblies with coiled leads in individual bags',
    caption: 'Individually packed temperature probes',
  },
];
await page('/about-us/', 'About Lichengda | Custom Industrial Heating from Xiamen', 'Meet Xiamen Lichengda Precision Manufacturing Co., Ltd., a made-to-spec supplier of industrial thermocouples, temperature sensors and heating elements.', `
${pageIntro('Xiamen, China', 'About Lichengda', 'Xiamen Lichengda Precision Manufacturing Co., Ltd. supplies industrial thermocouples, temperature sensors and heating elements made to specification.', aboutTrail)}
<div class="section"><div class="container">
  <figure class="about-photo">
    <img src="${factoryPhoto}" width="2172" height="724" alt="Exterior of the Lichengda factory buildings and main entrance">
    <figcaption>Lichengda factory exterior</figcaption>
  </figure>
  <div class="guide-grid">
    <div class="prose">
      <section>
        <h2>What We Supply</h2>
        <p>Lichengda works with OEM and industrial equipment inquiries for parts that heat a process or measure its temperature. Heating configurations include tubular and immersion elements, cartridge and band heaters, and specialty elements. Temperature sensing configurations include thermocouples and Pt100 RTDs.</p>
        ${related(['thermocouples', 'tubular-heaters', 'immersion-heaters', 'rtd'])}
      </section>
      <section>
        <h2>From Drawing to Quotation</h2>
        <p>Start with a drawing, part dimensions or a photo of an existing component. Add the working medium, temperature, mounting and required quantity. Include voltage and wattage for heaters, and the sensor type, junction and instrument input for temperature probes.</p>
      </section>
    </div>
    <aside class="spec-card">
      <h2>Company &amp; Sales</h2>
      <p>${escape(companyName)}<br><span lang="zh-CN">${escape(chineseCompanyName)}</span></p>
      ${salesContacts()}
      <div class="actions">${btn('Request a Quote', quoteLink(), 'primary', 'external')}</div>
    </aside>
  </div>
  <section class="workshop" aria-labelledby="workshop-heading">
    <h2 id="workshop-heading">Inside the Workshop</h2>
    <div class="workshop-gallery">
      ${workshopPhotos.map(photo => photoFigure({ ...photo, width: 960, height: 720 })).join('')}
    </div>
  </section>
  ${questionsSection('Working with Lichengda', [
    ['Can Lichengda review an existing heater or sensor drawing?', 'Yes. Send the drawing or part reference, the actual operating conditions and the quantity. Include notes on any differences from the existing design, such as a new mount, a different electrical supply or a change in the process medium.'],
  ])}
</div></div>
`, { trail: aboutTrail, type: 'AboutPage', image: factoryPhoto });

const productOptions = Object.entries(groups).map(([id, label]) => `<optgroup label="${label}">${products.filter(p => p.group === id).map(p => `<option value="${p.id}" data-specs="${escape(p.specs.join(' · '))}">${escape(p.name)}</option>`).join('')}</optgroup>`).join('');

await page('/request-a-quote/', 'Request a Quote for Custom Thermocouples or Heaters', 'Prepare an RFQ for a custom industrial thermocouple or heating element. Add dimensions, operating conditions, quantity and drawings for a sales review.', `
${pageIntro('Made to specification', 'Request a Quote', 'Choose a product family and describe what it must heat or measure. Add quantities, operating conditions and a drawing so the configuration can be reviewed.', quoteTrail)}
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
</div><div class="container">
  ${questionsSection('Preparing and Sending Your RFQ', [
    ['What happens when I choose Download RFQ?', 'The form prepares an email draft with your specifications and any selected attachments. Open the downloaded draft in your email client, review it and send it to the sales address shown on this page.'],
    ['Can I request a quote without a finished drawing?', 'Yes. Include the equipment model or part number if known, the installed dimensions, the application, and any photos of markings or mounting. State the required operating conditions and which dimensions are still to be confirmed.'],
  ])}
</div></section>
`, { trail: quoteTrail, type: 'ContactPage' });

const robots = 'User-agent: *\nAllow: /\n' + (origin ? `Sitemap: ${origin}/sitemap.xml\n` : '');
await writeFile(resolve(dist, 'robots.txt'), robots);
if (origin) {
  const urlset = [...pageDescriptions.keys()].map(path => `<url><loc>${escape(origin + path)}</loc></url>`).join('\n');
  await writeFile(resolve(dist, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urlset + '\n</urlset>\n');

  const featured = products.filter(product => product.featured);
  const additional = products.filter(product => !product.featured);
  const sections = [
    ['Main product pages', [
      ...featured,
      { name: 'Industrial Heating Elements', path: '/heating-elements/' },
    ]],
    ['Product configurations', additional.filter(product => product.parent)],
    ['Engineering guides', guides.map(guide => ({
      name: guide.name, path: `/resources/${guide.slug}/`,
    }))],
    ['Applications and inquiries', [
      { name: 'Industrial Applications', path: '/applications/' },
      { name: 'About Lichengda', path: '/about-us/' },
      { name: 'Request a Quote', path: '/request-a-quote/' },
    ]],
    ['Optional', [
      { name: 'Home', path: '/' },
      { name: 'Industrial Product Catalog', path: '/products/' },
      { name: 'Selection Guides', path: '/resources/' },
      { name: 'Industrial Heating & Thermocouple Glossary', path: '/glossary/' },
      ...additional.filter(product => !product.parent),
    ]],
  ];
  const lists = sections.map(([heading, links]) => [
    `## ${heading}`,
    '',
    ...links.map(({ name, path }) => `- [${name}](${origin}${path}): ${pageDescriptions.get(path)}`),
  ].join('\n'));
  const llms = [
    `# ${brand} Industrial Heating`,
    '> Custom industrial thermocouples, tubular heaters and heating elements for OEM equipment and process applications.',
    `${companyName} (${chineseCompanyName}) supplies made-to-spec heating and sensing products. The product pages describe configuration options and information to include in an RFQ. Final specifications depend on the drawing and operating conditions. Product images are illustrative.`,
    ...lists,
  ].join('\n\n');
  await writeFile(resolve(dist, 'llms.txt'), llms + '\n');
}
console.log(`Built ${pageDescriptions.size} static pages in dist/`);
