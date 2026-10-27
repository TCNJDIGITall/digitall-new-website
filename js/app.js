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

  // Each current officer gets a portrait card. Photos load only when a verified path is added.
  const teamGrid = document.getElementById('team-grid');
  if (teamGrid && Array.isArray(data.leadership)) {
    teamGrid.replaceChildren();
    const accents = ['#baff77', '#c7afff', '#7ccbea', '#f6c2b0', '#a9d9ce', '#dfbafb', '#baff77'];
    data.leadership.forEach((person, index) => {
      const card = document.createElement('article');
      card.className = 'team-card reveal';
      card.style.setProperty('--accent', accents[index % accents.length]);
      card.style.setProperty('--reveal-delay', String((index % 4) * 85) + 'ms');
      const portrait = document.createElement('div');
      portrait.className = 'team-portrait';
      const monogram = document.createElement('span');
      monogram.className = 'team-initials';
      const words = (person.name || '').trim().split(/\s+/).filter(Boolean);
      monogram.textContent = (words[0]?.[0] || '') + (words.length > 1 ? words[words.length - 1][0] : '');
      monogram.setAttribute('aria-hidden', 'true');
      const photoStatus = document.createElement('span');
      photoStatus.className = 'team-portrait-label';
      photoStatus.textContent = 'PORTRAIT TO COME';
      portrait.append(monogram, photoStatus);
      if (typeof person.photo === 'string' && /^assets\/eboard\/[a-z\d._-]+\.(?:png|jpg|jpeg|webp)$/i.test(person.photo)) {
        const img = document.createElement('img');
        img.className = 'team-headshot';
        img.alt = 'Portrait of ' + person.name;
        img.src = person.photo;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.addEventListener('load', () => portrait.classList.add('has-photo'), { once: true });
        img.addEventListener('error', () => img.remove(), { once: true });
        portrait.append(img);
      }
      const info = document.createElement('div');
      info.className = 'team-info';
      const top = document.createElement('div');
      top.className = 'team-info-top';
      const role = document.createElement('span');
      role.className = 'team-role';
      role.textContent = person.role;
      const number = document.createElement('span');
      number.className = 'team-number';
      number.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(data.leadership.length).padStart(2, '0');
      top.append(role, number);
      const name = document.createElement('h3');
      name.textContent = person.name;
      info.append(top, name);
      card.append(portrait, info);
      teamGrid.append(card);
    });
  }

  // Track page scroll and highlight the section currently being read.
  const progressTrack = document.createElement('div');
  progressTrack.className = 'scroll-progress';
  progressTrack.setAttribute('aria-hidden', 'true');
  const progressBar = document.createElement('span');
  progressTrack.append(progressBar);
  document.querySelector('.site-header')?.append(progressTrack);
  let ticking = false;
  const updateProgress = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progressBar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, window.scrollY / max)) + ')';
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
  const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  if ('IntersectionObserver' in window) {
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-22% 0px -65% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => activeObserver.observe(section));
  }

  const year = document.getElementById('footer-year'); if (year) year.textContent = String(new Date().getFullYear());
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.06, rootMargin: '0px 0px 55px 0px' });
    document.querySelectorAll('.reveal').forEach(node => observer.observe(node));
  } else document.querySelectorAll('.reveal').forEach(node => node.classList.add('visible'));
})();

