// Bootstrap for the KNSO site: renders the view for the current hash route
// and re-renders whenever the hash changes. Navigation is plain hash links,
// so every view works with the back button and can be bookmarked.

import { renderView, bindView } from './views.js';

const viewEl = document.getElementById('view');

function show() {
  const hash = window.location.hash || '#/';
  viewEl.innerHTML = renderView(hash);
  bindView(hash);
  document.querySelectorAll('nav a').forEach((link) => {
    const target = link.getAttribute('href');
    const current = hash === '#/' ? '#/' : hash.split('/').slice(0, 2).join('/');
    link.classList.toggle('active', target === current || (target !== '#/' && hash.startsWith(target)));
  });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', show);
show();
