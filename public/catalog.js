export const catalogPageSize = 24;
export const catalogPagePath = page => page === 1 ? '/products/' : `/products/page/${page}/`;

export function catalogResultCount(page, total) {
  if (!total) return 'No products found';
  const first = (page - 1) * catalogPageSize + 1;
  const last = Math.min(page * catalogPageSize, total);
  return `${first}–${last} of ${total} ${total === 1 ? 'product' : 'products'}`;
}

export function catalogPagination(page, total, pathForPage) {
  if (total < 2) return '';
  const pages = [1, page - 1, page, page + 1, total];
  const numbers = [...new Set(pages)].filter(number => number >= 1 && number <= total).sort((a, b) => a - b);
  const control = (number, text, label) => pathForPage
    ? `<a href="${pathForPage(number)}#catalog-results" aria-label="${label}">${text}</a>`
    : `<button type="button" data-go-to-page="${number}" aria-label="${label}">${text}</button>`;
  const links = numbers.map((number, index) => {
    const gap = index > 0 && number - numbers[index - 1] > 1 ? '<span aria-hidden="true">…</span>' : '';
    const label = `Page ${number}`;
    return gap + (number === page
      ? `<span aria-current="page" aria-label="${label}">${number}</span>`
      : control(number, number, label));
  });
  if (page > 1) links.unshift(control(page - 1, 'Previous', 'Previous page'));
  if (page < total) links.push(control(page + 1, 'Next', 'Next page'));
  return `<nav class="catalog-pagination" aria-label="Product catalog pages">${links.join('')}</nav>`;
}

export function setupCatalog(catalog) {
  const tools = catalog.querySelector('.catalog-tools');
  const filters = [...tools.querySelectorAll('[data-filter]')];
  const search = tools.querySelector('#product-search');
  const grid = catalog.querySelector('.product-grid');
  const pagination = catalog.querySelector('[data-pagination]');
  const status = catalog.querySelector('#result-status');
  const empty = catalog.querySelector('.empty-state');
  const initial = { cards: grid.innerHTML, pages: pagination.innerHTML, status: status.textContent };

  const params = new URLSearchParams(location.search);
  const selected = params.get('category');
  let group = filters.some(button => button.dataset.filter === selected) ? selected : 'all';
  search.value = params.get('q') ?? '';
  let indexRequest;
  let renderVersion = 0;

  function loadIndex() {
    indexRequest ??= fetch(catalog.dataset.searchIndex)
      .then(response => {
        if (!response.ok) throw new Error('Catalog search request failed');
        return response.json();
      })
      .catch(error => {
        indexRequest = undefined;
        throw error;
      });
    return indexRequest;
  }

  function saveFilters(query, page) {
    const url = new URL(location.href);
    url.searchParams.delete('search');
    for (const [name, value] of [['q', query], ['category', group === 'all' ? '' : group], ['p', page > 1 ? page : '']]) {
      if (value) url.searchParams.set(name, value);
      else url.searchParams.delete(name);
    }
    if (url.href !== location.href) history.replaceState(history.state, '', url);
  }

  async function refresh(page = 1, focusResults = false) {
    const version = ++renderVersion;
    const query = search.value.trim();
    for (const button of filters) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === group));
    }
    if (!query && group === 'all') {
      grid.innerHTML = initial.cards;
      pagination.innerHTML = initial.pages;
      status.textContent = initial.status;
      empty.hidden = true;
      saveFilters('', 1);
      return;
    }

    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    status.textContent = 'Searching products…';
    let index;
    try {
      index = await loadIndex();
    } catch {
      if (version === renderVersion) status.textContent = 'Search is temporarily unavailable. You can still browse the catalog.';
      return;
    }
    if (version !== renderVersion) return;

    const matches = index.filter(item =>
      (group === 'all' || item.group === group) && words.every(word => item.search.includes(word)));
    const pageCount = Math.ceil(matches.length / catalogPageSize);
    page = Math.max(1, Math.min(page, pageCount));
    const start = (page - 1) * catalogPageSize;
    grid.innerHTML = matches.slice(start, start + catalogPageSize).map(item => item.html).join('');
    pagination.innerHTML = catalogPagination(page, pageCount);
    status.textContent = catalogResultCount(page, matches.length);
    empty.hidden = matches.length > 0;
    saveFilters(query, page);
    if (focusResults) {
      status.focus({ preventScroll: true });
      catalog.scrollIntoView();
    }
  }

  for (const button of filters) {
    button.addEventListener('click', () => {
      group = button.dataset.filter;
      refresh();
    });
  }
  search.addEventListener('input', () => refresh());
  pagination.addEventListener('click', event => {
    const target = event.target.closest('[data-go-to-page]');
    if (target) refresh(Number(target.dataset.goToPage), true);
  });
  empty.querySelector('[data-reset]').addEventListener('click', () => {
    group = 'all';
    search.value = '';
    refresh();
    search.focus();
  });
  tools.hidden = false;
  if (group !== 'all' || search.value.trim()) {
    const requested = Number.parseInt(params.get('p'), 10);
    refresh(requested || 1);
  }
  if (params.has('search')) search.focus();
}
