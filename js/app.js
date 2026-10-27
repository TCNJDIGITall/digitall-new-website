(() => {
  'use strict';

  const data = window.DIGITALL_DATA || { events: [], leadership: [] };
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('primary-navigation');
  if (menuButton && navigation) {
    function closeMenu() {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('is-open');
    }
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      navigation.classList.toggle('is-open', open);
    });
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });
  }

  const eventList = document.getElementById('event-list');
  if (eventList && Array.isArray(data.events)) {
    eventList.replaceChildren();
    data.events.forEach(event => {
      const row = document.createElement('article');
      row.className = 'event-row';
      const parsed = /^\d{4}-\d{2}-\d{2}$/.test(event.date) ? new Date(`${event.date}T12:00:00`) : null;
      const dateValid = parsed && !Number.isNaN(parsed.getTime());
      const month = dateValid ? parsed.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : 'TBA';
      const day = dateValid ? parsed.toLocaleDateString('en-US', { day: '2-digit' }) : '—';
      const dateBox = document.createElement('div'); dateBox.className = 'event-date';
      const monthSpan = document.createElement('span'); monthSpan.textContent = month;
      const daySpan = document.createElement('strong'); daySpan.textContent = day;
      dateBox.append(monthSpan, daySpan);
      const textBox = document.createElement('div'); textBox.className = 'event-info';
      const meta = document.createElement('div'); meta.className = 'event-meta';
      const category = document.createElement('span'); category.className = 'event-category'; category.textContent = event.category || 'Event';
      const status = document.createElement('span'); status.className = 'event-status'; status.textContent = event.status || 'Planned';
      meta.append(category, status);
      const heading = document.createElement('h3'); heading.textContent = event.title || 'Event';
      const description = document.createElement('p'); description.textContent = event.description || '';
      textBox.append(meta, heading, description);
      const end = document.createElement('div'); end.className = 'event-end';
      const location = document.createElement('span'); location.textContent = event.location || 'Details TBA';
      const arrow = document.createElement('span'); arrow.className = 'event-end-icon'; arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
      end.append(location, arrow);
      row.append(dateBox, textBox, end);
      eventList.append(row);
    });
  }

  const teamGrid = document.getElementById('team-grid');
  if (teamGrid && Array.isArray(data.leadership)) {
    teamGrid.replaceChildren();
    const symbols = ['✳', '⌘', '✦', '◈', '✴', '↗', '✺'];
    data.leadership.forEach((person, index) => {
      const card = document.createElement('article'); card.className = 'team-card reveal';
      const top = document.createElement('div'); top.className = 'team-symbol'; top.textContent = symbols[index % symbols.length]; top.setAttribute('aria-hidden', 'true');
      const info = document.createElement('div'); info.className = 'team-info';
      const role = document.createElement('span'); role.className = 'team-role'; role.textContent = person.role;
      const name = document.createElement('h3'); name.textContent = person.name;
      info.append(role, name); card.append(top, info); teamGrid.append(card);
    });
  }

  const year = document.getElementById('footer-year'); if (year) year.textContent = String(new Date().getFullYear());
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.06, rootMargin: '0px 0px 55px 0px' });
    document.querySelectorAll('.reveal').forEach(node => observer.observe(node));
  } else document.querySelectorAll('.reveal').forEach(node => node.classList.add('visible'));
})();

