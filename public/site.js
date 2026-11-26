document.body.classList.add('enhanced');

function trackInquiry(eventName, productId) {
  window.gtag?.('event', eventName, productId ? { product_id: productId } : {});
}

if (window.gtag) {
  const pageProductId = document.querySelector('[data-product-id]')?.dataset.productId;
  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || link.origin !== location.origin || link.pathname !== '/request-a-quote/') return;
    const productId = new URLSearchParams(link.search).get('product') || pageProductId;
    trackInquiry('quote_click', productId);
  });
}

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#header-nav');

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  nav.classList.toggle('is-open', open);
}

menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    setMenu(false);
    menuToggle.focus();
  }
});

const backToTop = document.querySelector('.back-to-top');
const backToTopThreshold = 2;

function updateBackToTop() {
  const hide = window.scrollY <= backToTopThreshold * window.innerHeight;
  if (hide !== backToTop.hidden) backToTop.hidden = hide;
}

backToTop.addEventListener('click', () => {
  if (document.activeElement === backToTop) {
    document.querySelector('.site-header .brand').focus({ preventScroll: true });
  }
  window.scrollTo({ top: 0 });
});
window.addEventListener('scroll', updateBackToTop, { passive: true });
window.addEventListener('resize', updateBackToTop);
window.addEventListener('pageshow', updateBackToTop);
updateBackToTop();

const catalog = document.querySelector('[data-catalog]');
if (catalog) {
  const filters = [...catalog.querySelectorAll('[data-filter]')];
  const cards = [...catalog.querySelectorAll('.product-card')];
  const search = catalog.querySelector('#product-search');
  const empty = catalog.querySelector('.empty-state');
  const status = catalog.querySelector('#result-status');
  const termsByCard = cards.map(card => card.dataset.search.toLowerCase());
  let group = 'all';

  function refresh() {
    const words = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let matches = 0;
    cards.forEach((card, index) => {
      const match = (group === 'all' || group === card.dataset.group) &&
        words.every(word => termsByCard[index].includes(word));
      card.hidden = !match;
      if (match) matches += 1;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === group)));
    status.textContent = `${matches} ${matches === 1 ? 'product' : 'products'} found`;
    empty.hidden = matches > 0;
  }

  filters.forEach(button => button.addEventListener('click', () => {
    group = button.dataset.filter;
    refresh();
  }));
  search.addEventListener('input', refresh);
  empty.querySelector('[data-reset]').addEventListener('click', () => {
    search.value = '';
    group = 'all';
    refresh();
    search.focus();
  });
  if (new URLSearchParams(location.search).has('search')) search.focus();
}

const glossary = document.querySelector('[data-glossary]');
if (glossary) {
  const search = glossary.querySelector('#glossary-search');
  const status = glossary.querySelector('#glossary-status');
  const empty = glossary.querySelector('[data-glossary-empty]');
  const alphabets = new Map([...glossary.querySelectorAll('.glossary-alphabet a')]
    .map(link => [link.hash.slice(1), link]));
  const groups = [...glossary.querySelectorAll('.glossary-group')].map(section => ({
    section,
    link: alphabets.get(section.id),
    entries: [...section.querySelectorAll('.glossary-term')].map(entry => ({
      entry,
      text: (entry.querySelector('dt').textContent + ' ' + entry.querySelector('dd p').textContent).toLowerCase(),
    })),
  }));

  function filterTerms() {
    const words = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const { section, link, entries } of groups) {
      let hasMatches = false;
      for (const { entry, text } of entries) {
        const match = words.every(word => text.includes(word));
        entry.hidden = !match;
        if (match) {
          count += 1;
          hasMatches = true;
        }
      }
      section.hidden = !hasMatches;
      link.hidden = !hasMatches;
    }
    status.textContent = `${count} ${count === 1 ? 'term' : 'terms'}`;
    empty.hidden = count > 0;
  }

  glossary.querySelector('.glossary-tools').hidden = false;
  search.addEventListener('input', filterTerms);
  filterTerms();
}

const quote = document.querySelector('.quote-form');
if (quote) {
  const product = quote.querySelector('#quote-product');
  const specs = quote.querySelector('#spec-hint');
  const feedback = quote.querySelector('#quote-feedback');
  const attachments = quote.elements.drawings;
  const actions = [...quote.querySelectorAll('button[type="submit"]')];
  const emailAction = quote.querySelector('button[value="email"]');
  const maxBytes = 10 * 1024 * 1024;
  const types = new Map([
    ['pdf', 'application/pdf'], ['png', 'image/png'], ['jpg', 'image/jpeg'],
    ['jpeg', 'image/jpeg'], ['webp', 'image/webp'], ['dxf', 'application/dxf'],
    ['dwg', 'application/octet-stream'], ['step', 'application/step'], ['stp', 'application/step'],
  ]);

  function setSpecHint() {
    specs.textContent = product.selectedOptions[0].dataset.specs ||
      'Include dimensions, operating conditions and any required materials.';
  }

  function extension(name) {
    return name.split('.').at(-1).toLowerCase();
  }

  const initialProduct = new URLSearchParams(location.search).get('product');
  if (initialProduct && [...product.options].some(option => option.value === initialProduct)) {
    product.value = initialProduct;
    const requirements = quote.elements.requirements;
    const estimate = new URLSearchParams(location.hash.slice(1)).get('estimate')?.trim();
    if (estimate && !requirements.value && estimate.length + 2 <= requirements.maxLength) {
      requirements.value = estimate + '\n\n';
      quote.querySelector('#calculation-hint').hidden = false;
      requirements.setAttribute('aria-describedby', 'calculation-hint spec-hint');
    }
  }
  setSpecHint();
  product.addEventListener('change', setSpecHint);
  function updateAttachmentActions() {
    emailAction.hidden = attachments.files.length > 0;
    feedback.textContent = '';
  }
  attachments.addEventListener('change', updateAttachmentActions);
  updateAttachmentActions();
  actions.forEach(action => { action.disabled = false; });

  function base64(bytes) {
    let binary = '';
    for (let start = 0; start < bytes.length; start += 16384) {
      binary += String.fromCharCode(...bytes.subarray(start, start + 16384));
    }
    return btoa(binary);
  }

  function mimeBase64(bytes) {
    return base64(bytes).match(/.{1,76}/g)?.join('\r\n') || '';
  }

  function filenameParameter(name) {
    return encodeURIComponent(name).replace(/['()*]/g, char => '%' + char.charCodeAt(0).toString(16));
  }

  function inquiryText(fields, productName) {
    return [
      `Product family: ${productName}`,
      ...[['Name', 'name'], ['Work email', 'email'], ['Company', 'company'], ['Destination country', 'country'], ['Quantity', 'quantity'], ['Application', 'application']]
        .filter(([, key]) => fields.get(key)?.trim())
        .map(([label, key]) => `${label}: ${fields.get(key).trim()}`),
      '', 'Technical requirements', fields.get('requirements').trim(),
    ].join('\r\n');
  }

  async function draft(files, subject, text) {
    const headers = ['X-Unsent: 1', 'MIME-Version: 1.0'];
    if (quote.dataset.email) headers.push(`To: ${quote.dataset.email}`);
    headers.push(`Subject: ${subject}`);
    const body = ['Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', mimeBase64(new TextEncoder().encode(text))];
    if (!files.length) return [...headers, ...body].join('\r\n');

    const boundary = 'rfq-' + globalThis.crypto.getRandomValues(new Uint32Array(3)).join('-');
    const parts = [`--${boundary}\r\n${body.join('\r\n')}`];
    for (const file of files) {
      parts.push([
        `--${boundary}`, `Content-Type: ${types.get(extension(file.name))}`,
        'Content-Transfer-Encoding: base64',
        `Content-Disposition: attachment;\r\n filename*=UTF-8''${filenameParameter(file.name)}`,
        '', mimeBase64(new Uint8Array(await file.arrayBuffer())),
      ].join('\r\n'));
    }
    return [...headers, `Content-Type: multipart/mixed; boundary="${boundary}"`, '', ...parts, `--${boundary}--`, ''].join('\r\n');
  }

  quote.addEventListener('submit', async event => {
    event.preventDefault();
    const channel = event.submitter?.value || 'whatsapp';
    const fields = new FormData(quote);
    if (!fields.get('name').trim() || !fields.get('requirements').trim()) {
      feedback.textContent = 'Enter your name and technical requirements.';
      return;
    }
    const files = [...attachments.files];
    const productId = product.value;
    const productName = product.selectedOptions[0].textContent;
    const subject = `RFQ - ${productName}`;
    const text = inquiryText(fields, productName);
    if (channel === 'whatsapp') {
      const url = new URL(quote.dataset.whatsapp);
      url.searchParams.set('text', `${subject}\n\n${text.replaceAll('\r\n', '\n')}`);
      if (url.href.length > 8000) {
        feedback.textContent = 'This message is too long to open in WhatsApp. Shorten the requirements or use Download RFQ.';
        return;
      }
      trackInquiry('rfq_whatsapp_open', productId);
      // The message contains form fields. Keep the URL out of click analytics.
      window.open(url.href, '_blank', 'noopener,noreferrer');
      feedback.textContent = files.length
        ? 'Review the message in WhatsApp, add your drawings in the chat and tap Send.'
        : 'Review the message and tap Send in WhatsApp.';
      return;
    }
    if (channel === 'email' && !files.length) {
      const recipient = encodeURIComponent(quote.dataset.email).replace('%40', '@');
      const url = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      if (url.length <= 2000) {
        trackInquiry('rfq_email_draft_open', productId);
        window.location.assign(url);
        feedback.textContent = 'Review and send the draft in your email app.';
        return;
      }
    }
    if (files.some(file => !types.has(extension(file.name)))) {
      feedback.textContent = 'Choose PDF, image or CAD files in one of the listed formats for the email draft.';
      return;
    }
    if (files.reduce((total, file) => total + file.size, 0) > maxBytes) {
      feedback.textContent = 'Choose files with a combined size of 10 MB or less for the email draft.';
      return;
    }

    actions.forEach(action => { action.disabled = true; });
    try {
      const content = await draft(files, subject, text);
      const link = document.createElement('a');
      link.download = `RFQ-${productId}.eml`;
      link.href = URL.createObjectURL(new Blob([content], { type: 'message/rfc822' }));
      document.body.append(link);
      link.click();
      link.remove();
      trackInquiry('rfq_download', productId);
      setTimeout(() => URL.revokeObjectURL(link.href), 30000);
      feedback.textContent = 'Open the downloaded RFQ in your email app to review and send it.';
    } catch {
      feedback.textContent = 'The RFQ could not be prepared. Check your files and try again.';
    } finally {
      actions.forEach(action => { action.disabled = false; });
    }
  });
}
