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
const termLookup = new Map(glossary.map(term => [term.id, term]));
const productsTrail = [['Products', '/products/']];
const heatingTrail = [...productsTrail, ['Heating Elements', '/heating-elements/']];
const applicationsTrail = [['Applications', '/applications/']];
const guidesTrail = [['Guides', '/guides/']];
const glossaryTrail = [['Glossary', '/glossary/']];
const aboutTrail = [['About Us', '/about-us/']];
const quoteTrail = [['Request a Quote', '/request-a-quote/']];
const pageDescriptions = new Map();
const nav = [
  ['/', 'Home', navPath => navPath === '/'],
  ['/products/', 'Products', navPath => /^\/(products|heating-elements|thermocouples|temperature-sensors|temperature-controls)\//.test(navPath)],
  ['/applications/', 'Applications', navPath => navPath === '/applications/'],
  ['/guides/', 'Guides', navPath => navPath.startsWith('/guides/')],
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
const photoBackground = [238, 237, 240]; // Matches the catalog backdrop in styles.css.
const photoTones = [
  {
    id: 'cool',
    source: [231, 234, 237],
    images: ['finned-tubular-heaters', 'immersion-heaters', 'type-j', 'mineral-insulated', 'high-temperature',
      'rtd', 'sensor-accessories', 'screw-plug-immersion', 'over-the-side-immersion', 'circulation-heaters',
      'finned-strip-heaters', 'coil-heaters', 'infrared-heaters', 'ptc-ceramic-heaters', 'open-coil-heaters',
      'heating-cables', 'duct-heaters', 'crankcase-heaters'],
  },
  {
    id: 'warm',
    source: [234, 231, 235],
    images: ['oil-immersion-heaters', 'cartridge-heaters-with-thermocouple', 'type-n', 'type-r', 'type-b',
      'thermowells', 'polyimide-heaters', 'silicone-rubber-heaters', 'quartz-infrared-heating-elements',
      'ceramic-infrared-heating-elements', 'fine-wire-thermocouples', 'type-c', 'thermostatic-immersion-heaters',
      'capillary-thermostats', 'halogen-infrared-heating-elements'],
  },
  {
    id: 'neutral',
    source: [235, 235, 237],
    images: ['spring-loaded-thermocouple', 'surface-mount-thermocouple', 'flanged-thermocouple', 'defrost-heaters',
      'dual-element-thermocouples', 'connection-head-thermocouples'],
  },
  {
    id: 'soft-gray',
    source: [234, 233, 238],
    images: ['thermocouple-extension-wire', 'mica-band-heaters', 'ceramic-band-heaters',
      'industrial-oven-heating-elements', 'thermocouple-connectors', 'tri-clamp-immersion-heaters',
      'sauna-heating-elements', 'ceramic-thermocouple-protection-tubes',
      'high-density-cartridge-heaters', 'steam-table-heating-elements', 'silicone-drum-heaters',
      'pt1000-sensors', 'high-temperature-lead-wire', 'magnetic-thermocouples',
      '3d-printer-cartridge-heaters', 'cast-in-aluminum-heaters', 'pellet-stove-igniters',
      'carbon-fiber-infrared-heating-elements', 'deep-fryer-heating-elements', 'needle-thermocouples',
      'pid-temperature-controllers', 'commercial-dishwasher-heating-elements',
      'ds18b20-sensors', 'solid-state-relays', 'rtd-temperature-transmitters',
      'water-boiler-heating-elements', 'titanium-immersion-heaters', 'drum-immersion-heaters',
      'type-k-exhaust-gas-thermocouples', 'food-steamer-heating-elements', 'split-sheath-cartridge-heaters',
      'ntc-thermistor-probes', 'thermocouple-temperature-transmitters', 'threaded-rtd-probes',
      'mica-strip-heaters', 'washing-machine-heating-elements'],
  },
  { id: 'blue-gray', source: [225, 227, 231], images: ['type-t', 'type-s', 'type-e'] },
];
const photoToneByImage = new Map(photoTones.flatMap(({ id, images }) => images.map(image => [image, id])));

function photoToneStyle(product) {
  const id = photoToneByImage.get(product.image);
  return id ? ` style="--photo-tone: url(#photo-tone-${id})"` : '';
}

function photoToneFilter({ id, source }) {
  // Map a narrow range around the source backdrop to the common background.
  // Keep darker tones, and roll the correction back to white at the highlights.
  const darkEnd = 175;
  const channels = ['R', 'G', 'B'].map((name, channel) => {
    const bottom = source[channel] - 5;
    const top = source[channel] + 5;
    const target = photoBackground[channel];
    const values = Array.from({ length: 33 }, (_, index) => {
      const value = index * 255 / 32;
      const lowerTransition = Math.min(1, Math.max(0, (value - darkEnd) / (bottom - darkEnd)));
      const upperTransition = Math.max(0, (value - top) / (255 - top));
      const mapped = Math.min(value, darkEnd) + lowerTransition * (target - darkEnd) + upperTransition * (255 - target);
      return (mapped / 255).toFixed(4);
    });
    return `<feFunc${name} type="table" tableValues="${values.join(' ')}"/>`;
  });
  return `<filter id="photo-tone-${id}" color-interpolation-filters="sRGB"><feComponentTransfer>${channels.join('')}</feComponentTransfer></filter>`;
}

const photoFilters = `<svg class="photo-filters" aria-hidden="true"><defs>${photoTones.map(photoToneFilter).join('')}</defs></svg>`;

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
  const graph = [webPage, {
    '@type': 'Organization',
    '@id': organizationId,
    name: brand,
    alternateName: companyName,
    legalName: chineseCompanyName,
    url: origin + '/',
    logo: { '@type': 'ImageObject', url: origin + '/assets/mark.svg' },
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
    url: origin + '/',
    name: brand,
    inLanguage: 'en',
    publisher: { '@id': organizationId },
  }];

  if (path === '/' || type === 'AboutPage' || type === 'ContactPage') {
    webPage.about = { '@id': organizationId };
  }
  if (type === 'AboutPage') webPage.mainEntity = { '@id': organizationId };
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
${photoFilters}
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
    <nav aria-label="Footer navigation"><strong>Explore</strong><a href="/applications/">Applications</a><a href="/guides/">Guides</a><a href="/glossary/">Glossary</a><a href="/about-us/">About Us</a><a href="/request-a-quote/">Request a Quote</a></nav>
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
  const visual = photo(product) ? `<div class="card-image"${photoToneStyle(product)}><img src="/assets/${product.image}.webp" width="512" height="512" loading="lazy" alt=""></div>` : '';
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
    return `<li><a href="/guides/${guide.slug}/">${escape(guide.name)} ${icon('arrow')}</a></li>`;
  }).join('')}</ul>`;
}

function referenceSection([title, copy, { table, diagram, anchor } = {}], className = '') {
  const cell = value => Array.isArray(value) ? `<a href="${escape(value[1])}">${escape(value[0])}</a>` : escape(value);
  return `<section${className ? ` class="${className}"` : ''}${anchor ? ` id="${escape(anchor)}"` : ''}><h2>${escape(title)}</h2><p>${escape(copy)}</p>
    ${table ? `<div class="reference-table"><table>
      <caption class="sr-only">${escape(title)}</caption>
      <thead><tr>${table[0].map(column => `<th scope="col">${escape(column)}</th>`).join('')}</tr></thead>
      <tbody>${table.slice(1).map(([row, ...cells]) => `<tr><th scope="row">${cell(row)}</th>${cells.map(value => `<td>${cell(value)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>` : ''}
    ${diagram ? `<figure class="reference-diagram">
      <pre aria-hidden="true">${escape(diagram[1].join('\n'))}</pre>
      <figcaption>${escape(diagram[0])}</figcaption>
    </figure>` : ''}
  </section>`;
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
    <span class="tile-icon">${icon(app.icon)}</span><${heading}>${withSpecifications ? escape(app.name) : `<a href="/applications/#${app.id}">${escape(app.name)}</a>`}</${heading}><p>${escape(app.description)}</p>
    ${withSpecifications ? `<p><strong>For your RFQ</strong> ${escape(app.specification)}</p>` : ''}
    ${related(app.ids)}${withSpecifications ? `
    <h3 class="read-next">Selection Guides</h3>${selectionGuides(app.guides)}` : ''}
  </article>`).join('')}</div>`;
}

const home = `
<section class="hero">
  <div class="container hero-inner">
    <p class="eyebrow hero-eyebrow">Industrial heating &amp; temperature sensing</p>
    <h1>Industrial Heat.<br><span>Built to Spec.</span></h1>
    <p class="hero-copy">Custom <a href="/thermocouples/">industrial thermocouples</a>, <a href="/heating-elements/tubular-heaters/">tubular heaters</a> and heating elements for OEM equipment and process applications.</p>
    <div class="actions">${btn('Request a Quote', quoteLink(), 'primary', '')}${btn('Explore Products', '#products', 'outline')}</div>
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

await page('/products/', 'Industrial Heaters, Sensors & Temperature Controls', 'Find industrial temperature sensors, tubular and immersion heaters, specialty elements and temperature controls. Compare configurations and RFQ requirements.', `
${pageIntro('Product catalog', 'Industrial Heating, Sensing & Controls', 'Search temperature sensors, tubular and immersion heaters, specialty elements and temperature controls. Open a product family for installation details and selection guides.', productsTrail)}
<section class="section catalog-section catalog-page"><div class="container">
  ${catalog(products, true)}
  ${questionsSection('How to Use the Product Catalog', [
    ['Which product group should I start with?', 'Choose Temperature Sensors for probes, thermowells and connectors, Tubular & Immersion for formed elements and liquid heaters, Specialty Heaters for cartridges, bands, strips, cables and flexible elements, or Temperature Controls for controllers, relays and transmitters.'],
    ['How can I narrow down a product when I only have a drawing?', 'Look for the device function and the mounting interface first. A threaded probe points to a sensor family; a cylindrical bore can indicate a cartridge heater; a heated loop through a tank port suggests an immersion configuration. Include uncertain details in the RFQ.'],
  ])}
</div></section>
${callout('Need a custom configuration?', 'Share your application, dimensions and requirements to prepare a quote request.')}
`, { trail: productsTrail, type: 'CollectionPage', items: catalogOrder(products) });

const heatingProducts = products.filter(product => product.group === 'tubular' || product.group === 'specialty');
const heatingSelection = [
  'Choose an Element by Medium and Mount',
  'Start with the material being heated and the space available. Lichengda reviews custom heating element inquiries against the operating conditions and equipment drawing.',
  { table: [
    ['Heating method', 'Product family', 'Include in your inquiry'],
    ['Moving air through a duct or chamber', ['Finned tubular heaters', lookup.get('finned-tubular-heaters').path], 'Minimum airflow, inlet and target temperatures, and the space across the air path.'],
    ['Direct contact with liquid in a tank', ['Immersion heaters', lookup.get('immersion-heaters').path], 'Fluid chemistry, minimum liquid level, operating pressure and the available tank opening.'],
    ['Contact through a bore in tooling', ['Cartridge heaters', lookup.get('cartridge-heaters').path], 'Bore diameter and tolerance, usable depth, heated zone and lead exit.'],
    ['Contact around a barrel or nozzle', ['Band heaters', lookup.get('band-heaters').path], 'Outside diameter, usable width, interruptions in the contact surface and terminal clearance.'],
    ['Radiation to a surface', ['Infrared heating elements', lookup.get('infrared-heaters').path], 'Target material, stand-off distance, exposed area and production speed or dwell time.'],
    ['Heat along a pipe or vessel wall', ['Heat trace cables', lookup.get('heating-cables').path], 'Pipe size and length, insulation, minimum ambient temperature and target maintenance temperature.'],
  ] },
];

await page('/heating-elements/', 'Industrial Heating Elements & Custom Electric Heaters', 'Compare custom industrial heating elements by medium and mount. Find tubular, immersion, cartridge, band and infrared heaters for OEM equipment.', `
${pageIntro('Industrial heating', 'Industrial Heating Elements', 'Find made-to-spec electric heating elements for air, liquids, tooling and equipment surfaces. Compare heater types by how the heat reaches the load and where the element mounts.', heatingTrail)}
<section class="section catalog-section catalog-page"><div class="container">
  ${referenceSection(heatingSelection, 'heating-selection')}
  ${catalog(heatingProducts)}
  ${questionsSection('Selecting an Electric Heating Element', [
    ['What should I send to replace an industrial heating element?', 'Include the existing part number or a photo of its markings, measured dimensions, voltage and wattage. Add the process medium and working temperature, plus the connector or lead layout. Show any changes to the original mounting or operating conditions on the drawing.'],
    ['What determines whether a custom heating element can be used?', 'Voltage and power are only part of the specification. Confirm the heated length, sheath or insulation, available heat transfer, duty cycle, mounting and termination. Share the minimum and maximum operating conditions when evaluating a design.'],
  ])}
</div></section>
${callout('Specify a custom heating element', 'Include voltage, wattage, operating conditions and a drawing or dimensions.')}
`, { trail: heatingTrail, type: 'CollectionPage', items: catalogOrder(heatingProducts) });

for (const product of products) {
  const parent = lookup.get(product.parent);
  const trail = [...(heatingProducts.includes(product) ? heatingTrail : productsTrail)];
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
  </div>${image ? `<figure class="detail-image"${photoToneStyle(product)}><img src="${image}" alt="${escape(imageAlt)}" width="512" height="512"><figcaption>Illustrative configuration</figcaption></figure>` : ''}</div>
</div></section>
<section class="section detail-section" id="specifications"><div class="container">
  ${sectionHead('Configuration', 'Specify Your Requirements', 'The final construction depends on your drawing and operating conditions.')}
  <div class="spec-grid">
    <article class="spec-card"><h3>Configuration Options</h3><ul>${product.options.map(item => `<li>${escape(item)}</li>`).join('')}</ul></article>
    <article class="spec-card"><h3>Include in Your RFQ</h3><ul>${product.specs.map(item => `<li>${escape(item)}</li>`).join('')}</ul></article>
  </div>
  ${product.comparison ? referenceSection(product.comparison, 'product-selection') : ''}
  ${product.selection ? referenceSection(product.selection, 'product-selection') : ''}
  ${product.variants ? `<section class="product-photos product-variants" aria-labelledby="product-variants-heading">
    <h2 id="product-variants-heading">${escape(product.variants.title)}</h2>
    <div class="product-photos-grid">${product.variants.photos.map(photoFigure).join('')}</div>
  </section>` : ''}
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

const guideCalculators = {
  'watt-density': {
    title: 'Tubular Heater Watt Density Calculator',
    instructions: 'Enter the power and dimensions of one round tubular element. Measure the active heated span along the tube centerline, excluding cold ends. The calculation uses the round sheath surface.',
    fields: `
      <label>Length units<select name="lengthUnit"><option value="mm">Millimeters (mm)</option><option value="in">Inches (in)</option></select></label>
      <label>Element power (W)<input name="power" type="number" inputmode="decimal" min="0" step="any" required></label>
      <label>Sheath outside diameter<input name="diameter" type="number" inputmode="decimal" min="0" step="any" required></label>
      <label>Active heated length<input name="length" type="number" inputmode="decimal" min="0" step="any" required></label>`,
  },
  'water-heating': {
    title: 'Water Heating Power and Time Calculator',
    instructions: 'Estimate the ideal heat-up power or time for liquid water at atmospheric pressure. Allow separately for the tank, losses and other loads when sizing the heater.',
    fields: `
      <label class="full">Calculate<select name="mode"><option value="power">Required heat-up power</option><option value="time">Heat-up time</option></select></label>
      <label>Water volume<input name="volume" type="number" inputmode="decimal" min="0" step="any" required></label>
      <label>Volume units<select name="volumeUnit"><option value="l">Liters (L)</option><option value="gal">US gallons (gal)</option></select></label>
      <label class="full">Temperature units<select name="temperatureUnit"><option value="c">Celsius (°C)</option><option value="f">Fahrenheit (°F)</option></select></label>
      <label>Starting water temperature<input name="start" type="number" inputmode="decimal" step="any" required></label>
      <label>Target water temperature<input name="target" type="number" inputmode="decimal" step="any" required></label>
      <label class="full"><span data-amount-label>Allowed heat-up time (minutes)</span><input name="amount" type="number" inputmode="decimal" min="0" step="any" required></label>`,
  },
};

function guideCalculator(kind, quoteProduct) {
  const { title, instructions, fields } = guideCalculators[kind];
  return `<section class="spec-card" id="${kind}-calculator" aria-labelledby="${kind}-calculator-title">
    <h2 id="${kind}-calculator-title">${escape(title)}</h2><p>${escape(instructions)}</p>
    <form class="engineering-calculator" data-calculator="${kind}" aria-labelledby="${kind}-calculator-title">
      <fieldset disabled>
        <div class="form-grid">${fields}</div>
        <div class="form-actions"><button class="button button-primary" type="submit">Calculate</button></div>
      </fieldset>
      <output class="calculator-result" aria-live="polite" aria-atomic="true"></output>
      <a class="button button-secondary calculator-quote" data-calculator-quote href="${escape(quoteLink(quoteProduct))}" hidden>Use in RFQ ${icon('arrow')}</a>
      <noscript><p class="form-hint">Use the formula and worked example below to calculate manually.</p></noscript>
    </form>
  </section>
  <script type="module" src="/calculators.js"></script>`;
}

const guideGroups = [
  ['Temperature Measurement', guides.filter(guide => guide.group === 'sensing')],
  ['Electric Heating', guides.filter(guide => guide.group === 'heating')],
];
await page('/guides/', 'Thermocouple, RTD & Heating Element Guides', 'Find thermocouple testing steps, Pt100 wiring diagrams, thermowell selection and calculators for immersion heater sizing and watt density.', `
${pageIntro('Engineering guides', 'Heating & Temperature Sensor Guides', 'Test a thermocouple, find wiring diagrams, compare sensors, and calculate heat-up power and heater watt density.', guidesTrail)}
<div class="section"><div class="container guide-library">
  ${guideGroups.map(([heading, entries]) => `<section><h2>${heading}</h2><div class="resource-grid">
    ${entries.map(guide => `<article class="resource-card"><a href="/guides/${guide.slug}/"><h3>${escape(guide.name)}</h3><p>${escape(guide.description)}</p><span class="card-action">Read the guide ${icon('arrow')}</span></a></article>`).join('')}
  </div></section>`).join('')}
  ${questionsSection('Which Guide Should I Read First?', [
    ['Where should I start for a sensor or heater project?', 'For a sensor, start with thermocouple type and instrument compatibility, then review junction construction or compare an RTD. For a heater, match the heater family to the medium and mounting, then use the watt density guide to review the active surface area.'],
  ])}
  ${btn('Browse the Glossary', '/glossary/', 'secondary')}
</div></div>
`, { trail: guidesTrail, type: 'CollectionPage', items: guideGroups.flatMap(([, entries]) =>
  entries.map(guide => ({ name: guide.name, path: `/guides/${guide.slug}/` }))) });
for (const guide of guides) {
  const trail = [...guidesTrail, [guide.name]];
  const terms = (guide.terms || []).map(id => termLookup.get(id));
  await page(`/guides/${guide.slug}/`, guide.name, guide.description, `
${pageIntro('Selection guide', guide.name, guide.description, trail)}
<section class="section"><div class="container guide-grid">
  <article class="prose">
    <p class="guide-byline">By <a href="/about-us/">${escape(brand)}</a></p>
    <section class="use-case guide-answer"><h2>${escape(guide.answer[0])}</h2><p>${escape(guide.answer[1])}</p></section>
    ${guide.calculator ? guideCalculator(guide.calculator, guide.quoteProduct) : ''}
    ${guide.sections.map(section => referenceSection(section)).join('')}
  </article>
  <aside class="spec-card">
    <h2>Related Products</h2>${related(guide.related)}
    <h2 class="read-next">Read Next</h2>${selectionGuides(guide.readNext)}
    ${terms.length ? `<h2 class="read-next">Glossary Terms</h2><ul class="link-list">
      ${terms.map(term => `<li><a href="/glossary/#${term.id}">${escape(term.name)} ${icon('arrow')}</a></li>`).join('')}
    </ul>` : ''}
    <a class="glossary-link" href="/glossary/">Browse the glossary ${icon('arrow')}</a>
  </aside>
</div></section>
${callout('Have a specification to review?', 'Share your equipment, operating conditions and dimensions in a custom RFQ.', 'Request a Quote', quoteLink(guide.quoteProduct))}
`, { trail, article: true });
}

const alphabet = Object.entries(Object.groupBy(glossary, term => term.name[0]));
await page('/glossary/', 'Industrial Heating & Thermocouple Glossary', 'Look up terms for thermocouples, Pt100 and Pt1000 RTDs, IEC temperature sensor standards, thermowells, and immersion heater sizing.', `
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
${callout('Compare products and specifications', 'Use the engineering guides to compare sensor types, heater families and watt density.', 'Read the Guides', '/guides/')}
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
  <div class="about-photo about-reception" id="reception">
    ${photoFigure({
      image: 'lichengda-reception', width: 1400, height: 788,
      alt: 'Lichengda reception wall with the company logo and name in Chinese and English',
      caption: 'Lichengda reception',
    })}
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

await page('/request-a-quote/', 'Request a Quote for Custom Thermocouples or Heaters', 'Share an RFQ for a custom industrial sensor, heating element or temperature controller by WhatsApp or email. Include operating conditions and any drawings.', `
${pageIntro('Made to specification', 'Request a Quote', 'Share your equipment specifications in WhatsApp or email. Include the quantity, dimensions or wiring requirements, and any drawings you have.', quoteTrail)}
<section class="section"><div class="container quote-grid">
  <form class="quote-form" method="post" data-email="${escape(email)}" data-whatsapp="${escape(whatsApp)}">
    <h2>Project Details</h2>
    <p class="form-hint">Fields marked * are required.</p><noscript><p>Use the email or WhatsApp link under Contact Sales to send your specifications.</p></noscript>
    <div class="form-grid">
      <label class="full">Product family *<select name="product" id="quote-product" required><option value="">Select a product family</option>${productOptions}<option value="other">Other custom product</option></select></label>
      <label>Your name *<input name="name" autocomplete="name" required maxlength="120"></label>
      <label>Work email<input name="email" type="email" autocomplete="email" maxlength="160"></label>
      <label>Company<input name="company" autocomplete="organization" maxlength="160"></label>
      <label>Destination country<input name="country" autocomplete="country-name" maxlength="100"></label>
      <label>Quantity<input type="number" name="quantity" min="1" max="100000000" placeholder="e.g. 100"></label>
      <label>Application<input name="application" maxlength="200" placeholder="e.g. Packaging sealing jaw"></label>
      <div class="full"><label>Technical requirements *<textarea name="requirements" rows="5" required maxlength="6000" aria-describedby="spec-hint"></textarea></label><p class="form-hint" id="calculation-hint" hidden>Review the calculator estimate and add any installation and operating details.</p><p class="form-hint" id="spec-hint">Include dimensions, operating conditions and any required materials.</p></div>
      <div class="full"><label>Drawings or photos<input type="file" name="drawings" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.dxf,.dwg,.step,.stp" aria-describedby="file-hint"></label><p class="form-hint" id="file-hint">Add files in WhatsApp after opening the chat, or download an email draft with attachments. PDF, images or CAD files, up to 10 MB combined per draft.</p></div>
    </div>
    <div class="form-actions">
      <div class="quote-actions">
        <button class="button button-primary" type="submit" value="whatsapp" disabled>Open WhatsApp ${icon('external')}</button>
        <button class="button button-secondary" type="submit" value="email" disabled>Open Email Draft</button>
        <button class="button button-secondary" type="submit" value="download" disabled>Download RFQ</button>
      </div>
      <p class="form-hint" id="quote-feedback" role="status" aria-live="polite"></p>
    </div>
  </form>
  <aside class="spec-card quote-aside"><h2>What to Include</h2><h3>Thermocouples</h3><p>Sensor type, working temperature, probe dimensions, sheath, junction and termination.</p><h3>Heating elements</h3><p>Voltage, wattage, heating medium, installation geometry and mounting.</p><h3>Temperature controls</h3><p>Sensor input, control output, controller supply and panel cutout.</p><div class="quote-contact"><h3>Contact Sales</h3>${salesContacts()}</div></aside>
</div><div class="container">
  ${questionsSection('Preparing and Sending Your RFQ', [
    ['How do I send my RFQ?', 'Open the prefilled message in WhatsApp or your email app and send it there. Add files in the chat, or use Download RFQ to save an email draft with the selected files. Open that draft in your email app to review and send it.'],
    ['Can I request a quote without a finished drawing?', 'Yes. Include the equipment model or part number if known, the installed dimensions, the application, and any photos of markings or mounting. State the required operating conditions and which dimensions are still to be confirmed.'],
  ])}
</div></section>
`, { trail: quoteTrail, type: 'ContactPage' });

const robots = 'User-agent: *\nAllow: /\n' + (origin ? `Sitemap: ${origin}/sitemap.xml\n` : '');
await writeFile(resolve(dist, 'robots.txt'), robots);
if (origin) {
  const urlset = [...pageDescriptions.keys()].map(path => `<url><loc>${escape(origin + path)}</loc></url>`).join('\n');
  await writeFile(resolve(dist, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urlset + '\n</urlset>\n');

  const sections = [
    ['Website and product catalog', [
      { name: 'Home', path: '/' },
      { name: 'Industrial Product Catalog', path: '/products/' },
      { name: 'Industrial Heating Elements', path: '/heating-elements/' },
    ]],
    ...Object.entries(groups).map(([group, label]) => [
      label, products.filter(product => product.group === group),
    ]),
    ['Engineering guides and glossary', [
      { name: 'Selection Guides', path: '/guides/' },
      ...guides.map(guide => ({ name: guide.name, path: `/guides/${guide.slug}/` })),
      { name: 'Industrial Heating & Thermocouple Glossary', path: '/glossary/' },
    ]],
    ['Applications and inquiries', [
      { name: 'Industrial Applications', path: '/applications/' },
      { name: 'About Lichengda', path: '/about-us/' },
      { name: 'Request a Quote', path: '/request-a-quote/' },
    ]],
  ];
  const lists = sections.map(([heading, links]) => [
    `## ${heading}`,
    '',
    ...links.map(({ name, path }) => `- [${name}](${origin}${path}): ${pageDescriptions.get(path)}`),
  ].join('\n'));
  const llms = [
    `# ${brand} Industrial Heating`,
    '> Custom industrial thermocouples, electric heaters and temperature controls for OEM equipment and process applications.',
    `${companyName} (${chineseCompanyName}) supplies made-to-spec heating and sensing products. The product pages describe configuration options and information to include in an RFQ. Final specifications depend on the drawing and operating conditions. Main product images illustrate configurations. Sections labeled Product Photos show factory examples. About Us includes photos of the factory exterior, reception and workshop.`,
    ...lists,
  ].join('\n\n');
  await writeFile(resolve(dist, 'llms.txt'), llms + '\n');
}
console.log(`Built ${pageDescriptions.size} static pages in dist/`);
