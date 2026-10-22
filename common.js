(() => {
  const sidebar = document.getElementById('sidebar');
  const opener = document.getElementById('menu-open');
  const closer = document.getElementById('menu-close');
  const overlay = document.querySelector('.overlay');
  const content = document.querySelector('.content-shell');
  const mobileBar = document.querySelector('.mobile-bar');
  const mobile = matchMedia('(max-width: 800px)');
  let lastFocus;
  function setMenu(open) {
    if (open) lastFocus = document.activeElement;
    document.body.classList.toggle('menu-visible', open);
    overlay.hidden = !open;
    opener.setAttribute('aria-expanded', String(open));
    content.inert = open;
    mobileBar.inert = open;
    if (open) {
      sidebar.setAttribute('role', 'dialog');
      sidebar.setAttribute('aria-modal', 'true');
      closer.focus();
    } else {
      sidebar.removeAttribute('role');
      sidebar.removeAttribute('aria-modal');
      if (lastFocus && mobile.matches) lastFocus.focus();
    }
  }
  opener.addEventListener('click', () => setMenu(true));
  closer.addEventListener('click', () => setMenu(false));
  overlay.addEventListener('click', () => setMenu(false));
  mobile.addEventListener('change', () => setMenu(false));
  sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (mobile.matches) setMenu(false);
  }));
  document.addEventListener('keydown', e => {
    if (!document.body.classList.contains('menu-visible')) return;
    if (e.key === 'Escape') { e.preventDefault(); setMenu(false); }
    if (e.key === 'Tab') {
      const items = [...sidebar.querySelectorAll('a,button,summary')].filter(el => el.getClientRects().length);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // Keep the current topic visible within its independently scrollable menu.
  const active = sidebar.querySelector('[aria-current="page"]');
  if (active && !mobile.matches) active.scrollIntoView({block:'nearest'});
  let folded = [];
  window.addEventListener('beforeprint', () => {
    folded = [...document.querySelectorAll('details.supplement:not([open])')];
    folded.forEach(d => d.open = true);
  });
  window.addEventListener('afterprint', () => { folded.forEach(d => d.open = false); folded = []; });
  document.querySelectorAll('.checklist').forEach(form => {
    const status = form.querySelector('.check-status');
    const rows = [...form.querySelectorAll('fieldset')];
    const hideHelp = () => rows.forEach(row => {
      row.querySelector('.answer-help').hidden = true;
    });
    form.reset();
    hideHelp();
    form.addEventListener('change', () => {
      rows.forEach(row => {
        row.querySelector('.answer-help').hidden = !row.querySelector('input[value="no"]:checked');
      });
      status.textContent = `${form.querySelectorAll('input:checked').length} / 10 항목 선택`;
    });
    form.addEventListener('reset', () => {
      hideHelp();
      status.textContent = '선택을 초기화했습니다.';
    });
  });
})();
