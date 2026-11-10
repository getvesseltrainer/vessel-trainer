/* Shared by the Changelog and Roadmap pages. */
const typeLabel = {
  added: () => tr('Added', 'Ajouté'),
  changed: () => tr('Changed', 'Modifié'),
  fixed: () => tr('Fixed', 'Corrigé'),
  missing: () => tr('Missing', 'Absent'),
};
const columnLabel = {
  next: () => [tr('In progress', 'En cours'), tr('Being built now: it comes first.', 'En train d\'être fait : ça arrive en premier.')],
  planned: () => [tr('Planned', 'Prévu'), tr('On the list, after that.', 'Sur la liste, juste après.')],
  ideas: () => [tr('Ideas', 'Idées'), tr('Being considered, nothing promised.', 'À l\'étude, rien de promis.')],
};

/* The Admin link only shows on the device where the site admin signed in. */
(() => {
  let admin = false;
  try {
    admin = localStorage.getItem('vt-admin') === '1';
  } catch {
    admin = false;
  }
  const links = document.querySelector('.nav-links');
  if (admin && links && !links.querySelector('a[href="admin.html"]')) {
    const link = document.createElement('a');
    link.href = 'admin.html';
    link.className = 'nav-admin';
    link.textContent = 'Admin';
    links.appendChild(link);
  }
})();

/* A release's anchor, shared with the Roadmap page: "2.7.2 Forge 1.20.1" becomes #v2-7-2-forge-1-20-1. */
const releaseId = version => 'v' + version.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const changelogBox = $('#changelog');
if (changelogBox) {
  const SHOWN_FIRST = 6;
  const PRODUCTS = {
    trainer: () => tr('Trainer', 'Trainer'),
    paper: () => tr('Paper plugin', 'Plugin Paper'),
    forge: () => 'Forge 1.20.1',
  };
  const productOf = release => /paper/i.test(release.version) ? 'paper' : /forge/i.test(release.version) ? 'forge' : 'trainer';
  const releases = CHANGELOG.map(release => ({ ...release, id: releaseId(release.version), product: productOf(release) }));
  const latestTrainer = releases.find(release => release.product === 'trainer');
  const filters = { type: 'all', product: 'all', query: '' };
  let showAll = false;

  const fold = text => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const highlight = text => {
    const safe = escape(text);
    const raw = $('#clSearch').value.trim();
    if (!raw) return safe;
    const pattern = new RegExp(escape(raw).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return safe.replace(pattern, match => `<mark>${match}</mark>`);
  };
  const changeMatches = change => (filters.type === 'all' || change.type === filters.type)
    && (!filters.query || fold(change[lang]).includes(filters.query));
  const releaseVisible = release => (filters.product === 'all' || release.product === filters.product)
    && (release.changes.some(changeMatches) || (filters.type === 'all' && filters.query && fold(`${release.version} ${release.title[lang]}`).includes(filters.query)));
  const filtering = () => filters.type !== 'all' || filters.product !== 'all' || filters.query;
  const counts = list => list.reduce((sum, change) => ({ ...sum, [change.type]: (sum[change.type] || 0) + 1 }), {});
  const summary = changes => {
    const n = counts(changes);
    return Object.keys(typeLabel).filter(type => n[type]).map(type => `<span class="cl-sum ${type}">${n[type]} ${typeLabel[type]().toLowerCase()}</span>`).join('');
  };

  const card = (release, index) => {
    const titleHit = filters.query && fold(`${release.version} ${release.title[lang]}`).includes(filters.query);
    const changes = release.changes.filter(change => changeMatches(change) || (titleHit && filters.type === 'all'));
    return `<article class="release${index === 0 ? ' newest' : ''}" id="${release.id}">
      <div class="release-side">
        <a class="badge" href="#${release.id}" title="${tr('Link to this version', 'Lien vers cette version')}">v${escape(release.version.split(' ')[0])}</a>
        <time>${release.date[lang]}</time>
        <span class="cl-product ${release.product}">${PRODUCTS[release.product]()}</span>
        ${release === releases[0] ? `<span class="latest">${tr('Latest update', 'Dernière mise à jour')}</span>` : ''}
        <button class="cl-copy" type="button" data-copy="${release.id}">${tr('Copy link', 'Copier le lien')}</button>
      </div>
      <div class="release-body">
        <h2>${highlight(release.title[lang])}</h2>
        <div class="cl-sums">${summary(release.changes)}</div>
        <ul>${changes.map(c => `<li><b class="${c.type}">${typeLabel[c.type]()}</b><span>${highlight(c[lang])}</span></li>`).join('')}</ul>
      </div>
    </article>`;
  };

  const renderList = () => {
    const visible = releases.filter(releaseVisible);
    const all = showAll || filtering();
    const shown = all ? visible : visible.slice(0, SHOWN_FIRST);
    changelogBox.innerHTML = shown.map(card).join('')
      || `<p class="rm-empty">${tr('No change matches. Try another filter or word.', 'Aucun changement ne correspond. Essaie un autre filtre ou un autre mot.')}</p>`;
    const older = $('#clOlder');
    older.hidden = all || visible.length <= SHOWN_FIRST;
    older.textContent = tr(`Show the ${visible.length - SHOWN_FIRST} older versions`, `Afficher les ${visible.length - SHOWN_FIRST} versions plus anciennes`);
    const changes = visible.reduce((sum, release) => sum + release.changes.filter(changeMatches).length, 0);
    $('#clCount').textContent = filtering()
      ? tr(`${visible.length} versions, ${changes} changes match`, `${visible.length} versions, ${changes} changements correspondent`)
      : tr(`${releases.length} versions since November 4, 2026`, `${releases.length} versions depuis le 4 novembre 2026`);
    renderTimeline(visible);
  };

  /* The timeline groups versions by day, newest first; the select does the same job on a phone. */
  const renderTimeline = visible => {
    const days = [];
    visible.forEach(release => {
      const day = days.find(group => group.date === release.date[lang]);
      day ? day.items.push(release) : days.push({ date: release.date[lang], items: [release] });
    });
    $('#clTimeline').innerHTML = days.map(day => `<div class="cl-day">
        <p class="cl-date">${day.date}</p>
        <ul>${day.items.map(release => `<li><a href="#${release.id}" data-id="${release.id}"><span class="cl-dot ${release.product}"></span><span>v${escape(release.version)}</span><small>${escape(release.title[lang])}</small></a></li>`).join('')}</ul>
      </div>`).join('');
    $('#clJump').innerHTML = visible.map(release => `<option value="${release.id}">v${escape(release.version)} · ${escape(release.title[lang])}</option>`).join('');
    watchActive();
  };

  /* Opens the list when a link points at an older, hidden version, then scrolls to it. */
  const goTo = id => {
    if (!document.getElementById(id) && !showAll) {
      showAll = true;
      renderList();
    }
    const target = document.getElementById(id);
    if (!target) return;
    history.replaceState(null, '', '#' + id);
    if (window.vtLenis) window.vtLenis.scrollTo(target, { offset: -150 });
    else target.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
  };

  let observer;
  const watchActive = () => {
    if (observer) observer.disconnect();
    if (!('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.cl-timeline a').forEach(link => link.classList.toggle('on', link.dataset.id === entry.target.id));
      const jump = $('#clJump');
      if (jump.value !== entry.target.id) jump.value = entry.target.id;
    }), { rootMargin: '-30% 0px -60% 0px' });
    changelogBox.querySelectorAll('.release').forEach(release => observer.observe(release));
  };

  const renderChips = () => {
    const all = releases.flatMap(release => release.changes);
    const n = counts(all);
    $('#clTypes').innerHTML = [['all', tr('All', 'Tout'), all.length], ...Object.keys(typeLabel).filter(type => n[type]).map(type => [type, typeLabel[type](), n[type]])]
      .map(([type, name, count]) => `<button class="chip cl-type ${type}" type="button" data-type="${type}" aria-pressed="${filters.type === type}">${name} <span class="chip-count">${count}</span></button>`).join('');
    $('#clProducts').innerHTML = [['all', tr('Everything', 'Tout')], ...Object.keys(PRODUCTS).map(product => [product, PRODUCTS[product]()])]
      .map(([product, name]) => `<button class="chip" type="button" data-product="${product}" aria-pressed="${filters.product === product}">${name}</button>`).join('');
  };

  $('#clTypes').addEventListener('click', event => {
    const chip = event.target.closest('[data-type]');
    if (!chip) return;
    filters.type = chip.dataset.type;
    renderChips();
    renderList();
  });
  $('#clProducts').addEventListener('click', event => {
    const chip = event.target.closest('[data-product]');
    if (!chip) return;
    filters.product = chip.dataset.product;
    renderChips();
    renderList();
  });
  $('#clSearch').addEventListener('input', event => {
    filters.query = fold(event.target.value.trim());
    renderList();
  });
  $('#clOlder').addEventListener('click', () => {
    showAll = true;
    renderList();
  });
  $('#clJump').addEventListener('change', event => goTo(event.target.value));
  $('#clTimeline').addEventListener('click', event => {
    const link = event.target.closest('a[data-id]');
    if (!link) return;
    event.preventDefault();
    goTo(link.dataset.id);
  });
  changelogBox.addEventListener('click', event => {
    const badge = event.target.closest('a.badge');
    if (badge) {
      event.preventDefault();
      goTo(badge.getAttribute('href').slice(1));
      return;
    }
    const copy = event.target.closest('[data-copy]');
    if (!copy) return;
    const url = `${location.href.split('#')[0]}#${copy.dataset.copy}`;
    const done = () => {
      copy.textContent = tr('Link copied', 'Lien copié');
      setTimeout(() => { copy.textContent = tr('Copy link', 'Copier le lien'); }, 1800);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => { history.replaceState(null, '', '#' + copy.dataset.copy); });
    else history.replaceState(null, '', '#' + copy.dataset.copy);
  });

  onLang(() => {
    const all = releases.flatMap(release => release.changes);
    const n = counts(all);
    const stat = (key, name, value) => `<div class="rm-stat ${key}"><dt>${name}</dt><dd>${value}</dd></div>`;
    $('#clStats').innerHTML = stat('shipped', tr('Versions', 'Versions'), releases.length)
      + stat('next', tr('Added', 'Ajouts'), n.added || 0)
      + stat('planned', tr('Changed', 'Modifications'), n.changed || 0)
      + stat('ideas', tr('Fixed', 'Corrections'), n.fixed || 0);
    $('#clLatest').innerHTML = latestTrainer ? `
      <div class="cl-latest-text">
        <p class="kicker">${tr('Latest trainer version', 'Dernière version du trainer')}</p>
        <h2><span class="badge">v${escape(latestTrainer.version)}</span> ${escape(latestTrainer.title[lang])}</h2>
        <p class="sub">${latestTrainer.date[lang]} · ${summary(latestTrainer.changes)}</p>
      </div>
      <div class="cl-latest-actions">
        <a class="pill" href="versions.html">${tr('Download', 'Télécharger')}</a>
        <a class="pill quiet" href="#${latestTrainer.id}" data-go="${latestTrainer.id}">${tr('What is new', 'Les nouveautés')}</a>
      </div>` : '';
    $('#clSearch').placeholder = tr('Search: Herobrine, Paper, X-ray…', 'Chercher : Herobrine, Paper, X-ray…');
    renderChips();
    renderList();
    document.dispatchEvent(new Event('pagecontent'));
  });
  $('#clLatest').addEventListener('click', event => {
    const link = event.target.closest('[data-go]');
    if (!link) return;
    event.preventDefault();
    goTo(link.dataset.go);
  });
  const hash = location.hash.slice(1);
  if (hash) requestAnimationFrame(() => goTo(hash));
}

const roadmapBox = $('#roadmap');
if (roadmapBox) {
  const all = Object.keys(ROADMAP).flatMap(key => ROADMAP[key].map(item => ({ ...item, status: key })));
  const filters = { cat: 'all', query: '' };
  /* Accents and case do not matter in the search: "meteo" finds "Météo". */
  const fold = text => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const external = (url, label, quiet) => url ? `<a class="pill${quiet ? ' quiet' : ''}" href="${url}" target="_blank" rel="noopener">${label}</a>` : '';
  const links = () => external(IDEA_URL, tr('Suggest an idea', 'Propose une idée'), false)
    + external(DISCORD_URL, tr('Join the Discord', 'Rejoins le Discord'), true);

  const matches = item => (filters.cat === 'all' || item.cat === filters.cat)
    && (!filters.query || fold(`${item[lang]} ${item.note[lang]} ${ROADMAP_CATEGORIES[item.cat][lang]}`).includes(filters.query));

  const card = item => `<article class="task cat-${item.cat}">
      <div class="task-top">
        <span class="tag">${ROADMAP_CATEGORIES[item.cat][lang]}</span>
        ${item.status === 'next' ? `<span class="live">${tr('In progress', 'En cours')}</span>` : ''}
      </div>
      <h3>${item[lang]}</h3>
      <p>${item.note[lang]}</p>
    </article>`;

  const renderBoard = () => {
    const shown = all.filter(matches);
    roadmapBox.innerHTML = Object.keys(ROADMAP).map(key => {
      const items = shown.filter(item => item.status === key);
      if (!items.length) return '';
      const [name, hint] = columnLabel[key]();
      return `<section class="lane ${key}" aria-labelledby="lane-${key}">
        <div class="lane-head">
          <h2 id="lane-${key}"><i class="dot" aria-hidden="true"></i>${name}</h2>
          <span class="lane-count">${items.length}</span>
        </div>
        <p class="lane-hint">${hint}</p>
        <div class="lane-grid">${items.map(card).join('')}</div>
      </section>`;
    }).join('') || `<p class="rm-empty">${tr('Nothing matches. Try another category, or suggest it as an idea.', 'Rien ne correspond. Essaie une autre catégorie, ou propose-la comme idée.')}</p>`;
    $('#rmCount').textContent = shown.length === all.length
      ? tr(`${all.length} items`, `${all.length} éléments`)
      : tr(`${shown.length} of ${all.length} items`, `${shown.length} sur ${all.length} éléments`);
  };

  const renderFilters = () => {
    const count = cat => all.filter(item => cat === 'all' || item.cat === cat).length;
    const chips = [['all', tr('All', 'Tout')], ...Object.keys(ROADMAP_CATEGORIES).map(cat => [cat, ROADMAP_CATEGORIES[cat][lang]])]
      .filter(([cat]) => count(cat) > 0);
    $('#rmFilters').innerHTML = chips.map(([cat, name]) =>
      `<button class="chip${cat === 'all' ? '' : ` cat-${cat}`}" type="button" data-cat="${cat}" aria-pressed="${filters.cat === cat}">${name} <span class="chip-count">${count(cat)}</span></button>`).join('');
  };

  $('#rmFilters').addEventListener('click', event => {
    const chip = event.target.closest('[data-cat]');
    if (!chip) return;
    filters.cat = chip.dataset.cat;
    renderFilters();
    renderBoard();
  });
  $('#rmSearch').addEventListener('input', event => {
    filters.query = fold(event.target.value.trim());
    renderBoard();
  });

  onLang(() => {
    const stat = (key, name, value) => `<div class="rm-stat ${key}"><dt>${name}</dt><dd>${value}</dd></div>`;
    $('#rmStats').innerHTML = stat('next', tr('In progress', 'En cours'), ROADMAP.next.length)
      + stat('planned', tr('Planned', 'Prévu'), ROADMAP.planned.length)
      + stat('ideas', tr('Ideas', 'Idées'), ROADMAP.ideas.length)
      + stat('shipped', tr('Updates out', 'Mises à jour sorties'), CHANGELOG.length);
    $('#rmCta').innerHTML = links();
    $('#rmAsk').innerHTML = links();
    $('#rmShipped').innerHTML = CHANGELOG.slice(0, 3).map(release => `
      <a class="rm-ship" href="changelog.html#${releaseId(release.version)}">
        <span class="badge">v${release.version}</span>
        <b>${release.title[lang]}</b>
        <time>${release.date[lang]}</time>
      </a>`).join('');
    $('#rmSearch').placeholder = tr('Search: map, Paper, tornado…', 'Chercher : carte, Paper, tornade…');
    renderFilters();
    renderBoard();
    document.dispatchEvent(new Event('pagecontent'));
  });
}

/* Screenshots follow the page's language, as on the home page. */
onLang(() => document.querySelectorAll('img[data-shot]').forEach(img => { img.src = `assets/img/${lang}/${img.dataset.shot}.webp`; }));

/* The guide lists every entry of the real menu, with the same text as in the game. */
const reference = $('#reference');
if (reference) {
  const searchBox = $('#guideSearch');
  const groups = [];
  const collect = (menu, path) => {
    const items = menu.entries.filter(entry => entry.type !== 'sub');
    if (items.length) groups.push({ menu, path, items });
    menu.entries.filter(entry => entry.type === 'sub').forEach(entry => collect(entry.menu, [...path, entry.menu.title]));
  };
  MENU.entries.filter(entry => entry.type === 'sub').forEach(entry => collect(entry.menu, [entry.menu.title]));
  const loose = MENU.entries.filter(entry => entry.type !== 'sub');

  const row = (entry, menu) => `<div class="ref-row"><b>${L(entry.label)}</b><span>${describe(entry.label, menu.title)}</span></div>`;
  const render = () => {
    const query = searchBox.value.trim().toLowerCase();
    let shown = 0;
    const match = (entry, menu) => {
      const hit = !query || `${L(entry.label)} ${describe(entry.label, menu.title)}`.toLowerCase().includes(query);
      shown += hit ? 1 : 0;
      return hit;
    };
    const blocks = groups.map(group => {
      const rows = group.items.filter(entry => match(entry, group.menu)).map(entry => row(entry, group.menu)).join('');
      return rows ? `<section class="ref-group"><h3>${group.path.map(L).join(' › ')}</h3>${rows}</section>` : '';
    });
    const rest = loose.filter(entry => match(entry, MENU)).map(entry => row(entry, MENU)).join('');
    if (rest) blocks.push(`<section class="ref-group"><h3>${L(MENU.title)}</h3>${rest}</section>`);
    reference.innerHTML = blocks.join('');
    $('#guideCount').textContent = tr(`${shown} buttons`, `${shown} boutons`);
  };
  searchBox.addEventListener('input', render);
  onLang(() => {
    searchBox.placeholder = tr('Search a button', 'Chercher un bouton');
    render();
  });
}

/* Versions: real files come from the build, the rest from PLANNED_BUILDS. */
const buildsBox = $('#builds');
if (buildsBox) {
  const LOADERS = { fabric: 'Fabric', neoforge: 'NeoForge', forge: 'Forge', paper: 'Paper' };
  const builds = [
    ...RELEASES.map((release, index) => ({ ...release, available: true, latest: RELEASES.findIndex(other => other.loader === release.loader && other.mc === release.mc) === index })),
    ...PLANNED_BUILDS.map(build => ({ ...build, available: false })),
  ];
  const filters = { loader: 'all', status: 'all', mc: 'all' };
  const mcBox = $('#mcFilter');
  const newest = (a, b) => b.localeCompare(a, 'en', { numeric: true });
  const games = [...new Set(builds.map(build => build.mc))].sort(newest);
  const pairKey = build => `${build.loader}-${build.mc}`;

  /* A build for another game has its own changelog entry, such as "2.7.2 Forge 1.20.1". */
  const changesOf = build => {
    const own = `${build.version} ${LOADERS[build.loader]} ${build.mc}`;
    return CHANGELOG.some(entry => entry.version === own) ? own : build.version;
  };
  const releaseOf = build => CHANGELOG.find(entry => entry.version === changesOf(build));
  const size = kb => (kb >= 1024 ? `${(kb / 1024).toFixed(1).replace('.', lang === 'fr' ? ',' : '.')} ${tr('MB', 'Mo')}` : `${kb} ${tr('KB', 'Ko')}`);
  const needs = build => (BUILD_NEEDS[pairKey(build)] || []).map(need => `<span class="v-need">${need}</span>`).join('');

  /* The two downloads most people want: the trainer to play, and the plugin for a Paper server. */
  const renderPicks = () => {
    const play = RELEASES.find(release => release.loader === 'fabric');
    const server = RELEASES.find(release => release.loader === 'paper');
    const pick = (build, kind) => {
      if (!build) return '';
      const release = releaseOf(build);
      const steps = kind === 'play'
        ? [
          tr(`Install <a href="${FABRIC_INSTALLER_URL}" target="_blank" rel="noopener">Fabric Loader</a> for Minecraft ${build.mc}.`, `Installe <a href="${FABRIC_INSTALLER_URL}" target="_blank" rel="noopener">Fabric Loader</a> pour Minecraft ${build.mc}.`),
          tr(`Put this file and <a href="${FABRIC_API_URL}" target="_blank" rel="noopener">Fabric API</a> in <code>.minecraft/mods</code>.`, `Mets ce fichier et <a href="${FABRIC_API_URL}" target="_blank" rel="noopener">Fabric API</a> dans <code>.minecraft/mods</code>.`),
          tr('Start the game with the Fabric profile, open a world and press F4.', 'Lance le jeu avec le profil Fabric, ouvre un monde et appuie sur F4.'),
        ]
        : [
          tr('Put this file in the <code>plugins</code> folder of your Paper server and restart it.', 'Mets ce fichier dans le dossier <code>plugins</code> de ton serveur Paper et redémarre-le.'),
          tr('In the server console, type <code>op YourName</code> for each admin.', 'Dans la console du serveur, tape <code>op TonPseudo</code> pour chaque admin.'),
          tr('Admins join with the Fabric trainer and press F4 for the Admin tab.', "Les admins rejoignent avec le trainer Fabric et appuient sur F4 pour l'onglet Admin."),
        ];
      return `<article class="v-pick ${kind}">
        <p class="kicker">${kind === 'play' ? tr('To play', 'Pour jouer') : tr('For your server', 'Pour ton serveur')}</p>
        <h2>${build.name} <span class="badge">v${build.version}</span></h2>
        <p class="v-pick-meta">${LOADERS[build.loader]} · Minecraft ${build.mc}${release ? ` · ${release.date[lang]}` : ''} · ${size(build.kb)}</p>
        <div class="v-needs" aria-label="${tr('Needs', 'Il faut')}">${needs(build)}</div>
        <div class="v-pick-actions">
          <a class="pill" href="downloads/${build.file}" download>${tr('Download', 'Télécharger')} v${build.version}</a>
          ${release ? `<a class="pill quiet" href="changelog.html#${releaseId(release.version)}">${tr('What is new', 'Les nouveautés')}</a>` : ''}
        </div>
        <ol class="v-steps">${steps.map(step => `<li>${step}</li>`).join('')}</ol>
      </article>`;
    };
    $('#vPicks').innerHTML = pick(play, 'play') + pick(server, 'server');
  };

  /* One row per game version, one column per loader: what exists, what is coming. */
  const renderGrid = () => {
    const loaders = Object.keys(LOADERS);
    const cell = (loader, mc) => {
      const latest = builds.find(build => build.available && build.latest && build.loader === loader && build.mc === mc);
      if (latest) return `<td><a class="v-cell available" href="downloads/${latest.file}" download title="${tr('Download', 'Télécharger')} ${latest.name} ${latest.version}">v${latest.version}</a></td>`;
      if (builds.some(build => !build.available && build.loader === loader && build.mc === mc)) return `<td><span class="v-cell planned">${tr('Planned', 'Prévue')}</span></td>`;
      return `<td><span class="v-cell none" aria-label="${tr('Not planned', 'Pas prévue')}">—</span></td>`;
    };
    $('#vGrid').innerHTML = `<thead><tr><th scope="col">Minecraft</th>${loaders.map(loader => `<th scope="col">${LOADERS[loader]}</th>`).join('')}</tr></thead>
      <tbody>${games.map(mc => `<tr><th scope="row">${mc}</th>${loaders.map(loader => cell(loader, mc)).join('')}</tr>`).join('')}</tbody>`;
  };

  const row = (build, older) => {
    const loader = LOADERS[build.loader];
    if (!build.available) {
      return `<article class="build planned">
        <div class="build-main">
          <h2><span class="v-loader ${build.loader}">${loader}</span> ${tr(`for Minecraft ${build.mc}`, `pour Minecraft ${build.mc}`)}</h2>
          <p>${build.note ? build.note[lang] : tr('Not available yet.', 'Pas encore disponible.')}</p>
        </div>
        <span class="build-status">${tr('Planned', 'Prévue')}</span>
      </article>`;
    }
    const release = releaseOf(build);
    const note = BUILD_NOTES[pairKey(build)];
    return `<article class="build${older ? ' older' : ''}">
      <div class="build-main">
        <h2><span class="v-loader ${build.loader}">${loader}</span> ${build.name} ${build.version}${build.latest ? ` <span class="latest">${tr('Latest', 'Dernière version')}</span>` : ''}</h2>
        <p>Minecraft ${build.mc} · ${release ? `${release.date[lang]} · ` : ''}${size(build.kb)}${release ? ` · ${release.title[lang]}` : ''}</p>
        ${note && !older ? `<p>${note[lang]}</p>` : ''}
        ${build.latest && needs(build) ? `<div class="v-needs">${needs(build)}</div>` : ''}
        ${build.sha256 ? `<details class="lib-check"><summary>${tr('File check', 'Vérifier le fichier')}</summary><p>SHA-256 <code>${build.sha256}</code></p></details>` : ''}
      </div>
      <div class="build-actions">
        <button class="pill quiet build-what" type="button" data-version="${changesOf(build)}" aria-describedby="buildTip">${tr('What changed', 'Nouveautés')}</button>
        <a class="pill" href="downloads/${build.file}" download>${tr('Download', 'Télécharger')}</a>
      </div>
    </article>`;
  };

  /* The latest build of each loader and game first; its older builds fold away beneath it. */
  const render = () => {
    const shown = builds.filter(build => (filters.loader === 'all' || build.loader === filters.loader)
      && (filters.status === 'all' || build.available === (filters.status === 'available'))
      && (filters.mc === 'all' || build.mc === filters.mc));
    document.querySelectorAll('.filters .chip').forEach(chip => chip.setAttribute('aria-pressed', filters[chip.dataset.filter] === chip.dataset.value));
    $('#buildCount').textContent = tr(`${shown.length} version${shown.length === 1 ? '' : 's'}`, `${shown.length} version${shown.length > 1 ? 's' : ''}`);
    const groups = [];
    shown.forEach(build => {
      // Planned builds for the same game share one row: "Minecraft 26.4: Fabric, NeoForge, Forge".
      const key = build.available ? `a-${pairKey(build)}` : `p-${build.mc}`;
      const group = groups.find(item => item.key === key);
      group ? group.items.push(build) : groups.push({ key, items: [build] });
    });
    buildsBox.innerHTML = groups.map(({ items }) => {
      const [first, ...rest] = items;
      if (!first.available) {
        const noted = items.find(build => build.note);
        return `<article class="build planned">
          <div class="build-main">
            <h2>Minecraft ${first.mc} ${items.map(build => `<span class="v-loader ${build.loader}">${LOADERS[build.loader]}</span>`).join(' ')}</h2>
            <p>${noted ? noted.note[lang] : tr('Not available yet.', 'Pas encore disponible.')}</p>
          </div>
          <span class="build-status">${tr('Planned', 'Prévue')}</span>
        </article>`;
      }
      if (!rest.length) return row(first, false);
      return row(first, false) + `<details class="v-older">
        <summary>${tr(`${rest.length} older ${LOADERS[first.loader]} ${first.mc} versions`, `${rest.length} versions ${LOADERS[first.loader]} ${first.mc} plus anciennes`)}</summary>
        <div class="builds">${rest.map(build => row(build, true)).join('')}</div>
      </details>`;
    }).join('')
      || `<p class="rm-empty">${tr('Nothing here yet for this choice. Try the Planned filter.', 'Rien pour ce choix pour l\'instant. Essaie le filtre Prévues.')}</p>`;
  };

  /* What changed: a box next to the button. On a touch screen, where nothing hovers, a tap opens it. */
  const tip = $('#buildTip');
  let tipFor = null;
  const hideTip = () => {
    tip.hidden = true;
    tipFor = null;
  };
  const showTip = button => {
    const release = CHANGELOG.find(entry => entry.version === button.dataset.version);
    if (!release) return;
    tipFor = button;
    tip.innerHTML = `<b>${release.title[lang]}</b><ul>${release.changes.map(change => `<li><b class="${change.type}">${typeLabel[change.type]()}</b><span>${change[lang]}</span></li>`).join('')}</ul>`;
    tip.hidden = false;
    placeTip();
  };
  const placeTip = () => {
    const box = tipFor.getBoundingClientRect();
    if (box.bottom < 0 || box.top > innerHeight) {
      hideTip();
      return;
    }
    const gap = 12;
    const margin = 8;
    const fitsLeft = box.left - gap - tip.offsetWidth >= margin;
    tip.style.left = `${fitsLeft ? box.left - gap - tip.offsetWidth : Math.max(margin, innerWidth - tip.offsetWidth - margin)}px`;
    const below = box.bottom + gap;
    const beside = box.top + box.height / 2 - tip.offsetHeight / 2;
    tip.style.top = `${Math.max(margin, Math.min(fitsLeft ? beside : below, innerHeight - tip.offsetHeight - margin))}px`;
  };
  const whatButton = event => event.target.closest && event.target.closest('.build-what');
  buildsBox.addEventListener('pointerover', event => { if (event.pointerType === 'mouse' && whatButton(event)) showTip(whatButton(event)); });
  buildsBox.addEventListener('pointerout', event => { if (event.pointerType === 'mouse' && whatButton(event)) hideTip(); });
  buildsBox.addEventListener('focusin', event => { if (whatButton(event)) showTip(whatButton(event)); });
  buildsBox.addEventListener('focusout', event => { if (whatButton(event)) hideTip(); });
  document.addEventListener('click', event => {
    const button = whatButton(event);
    if (!button) hideTip();
    else if (tipFor !== button) showTip(button);
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') hideTip(); });
  addEventListener('scroll', () => { if (tipFor) placeTip(); }, { passive: true });

  document.querySelectorAll('.filters .chip').forEach(chip => chip.addEventListener('click', () => {
    filters[chip.dataset.filter] = chip.dataset.value;
    render();
  }));
  mcBox.addEventListener('change', () => {
    filters.mc = mcBox.value;
    render();
  });
  onLang(() => {
    const available = builds.filter(build => build.available);
    const stat = (key, label, value) => `<div class="rm-stat ${key}"><dt>${label}</dt><dd>${value}</dd></div>`;
    $('#vStats').innerHTML = stat('next', tr('Available', 'Disponibles'), available.length)
      + stat('planned', tr('Planned', 'Prévues'), builds.length - available.length)
      + stat('shipped', tr('Minecraft versions', 'Versions de Minecraft'), new Set(available.map(build => build.mc)).size)
      + stat('ideas', tr('Loaders', 'Chargeurs'), new Set(available.map(build => build.loader)).size);
    mcBox.innerHTML = [`<option value="all">${tr('All versions', 'Toutes les versions')}</option>`, ...games.map(mc => `<option value="${mc}">${mc}</option>`)].join('');
    mcBox.value = filters.mc;
    renderPicks();
    renderGrid();
    render();
  });
}

const partnerBox = $('#partners');
if (partnerBox) {
  /*
    A browser cannot reach a Minecraft server, so a public service (mcstatus.io) asks for it.
    No answer means unknown, never offline. What the server sends is untrusted text: it is always escaped.
  */
  const statuses = {};
  const escape = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const servers = PARTNERS.filter(partner => partner.address);
  const PLAYER_NAMES = 8;
  let checkedAt = null;

  const live = partner => {
    const status = statuses[partner.address];
    if (status === undefined) return `<p class="pt-status checking"><i></i>${tr('Checking the server…', 'Vérification du serveur…')}</p>`;
    if (status === null) return `<p class="pt-status unknown"><i></i>${tr('Status unknown right now', 'Statut inconnu pour le moment')}</p>`;
    if (!status.online) return `<p class="pt-status offline"><i></i>${tr('Offline', 'Hors ligne')}</p>`;
    const { players = {}, version, motd } = status;
    const list = players.list || [];
    const names = list.slice(0, PLAYER_NAMES).map(player => `<li>${escape(player.name_clean || player.name || '')}</li>`).join('');
    const more = (players.online || 0) - Math.min(list.length, PLAYER_NAMES);
    return `<p class="pt-status online"><i></i>${tr('Online', 'En ligne')}<b>${players.online ?? 0}/${players.max ?? '?'}</b>${tr('players', 'joueurs')}</p>
      ${version && version.name_clean ? `<p class="pt-version">${tr('Version', 'Version')} <b>${escape(version.name_clean)}</b></p>` : ''}
      ${motd && motd.clean ? `<p class="pt-motd">${escape(motd.clean).replace(/\n/g, '<br>')}</p>` : ''}
      ${names ? `<ul class="pt-players" aria-label="${tr('Players online', 'Joueurs connectés')}">${names}${more > 0 ? `<li class="more">+${more}</li>` : ''}</ul>` : ''}`;
  };

  const icon = partner => {
    if (partner.icon) return `<img class="pt-icon" src="assets/img/partners/${partner.icon}" alt="" width="96" height="96">`;
    const status = statuses[partner.address];
    // The server's own icon: a PNG it sends inside its status, checked before use.
    if (status && status.icon && /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(status.icon)) return `<img class="pt-icon pixel" src="${status.icon}" alt="" width="96" height="96">`;
    return `<span class="pt-icon" aria-hidden="true">${escape(partner.name[0])}</span>`;
  };

  const accent = partner => /^#[0-9a-f]{6}$/i.test(partner.color || '') ? partner.color : '#ff6a4a';

  const card = (partner, index) => `
    <article class="pt-card" style="--accent: ${accent(partner)}">
      <div class="pt-banner" aria-hidden="true"></div>
      <div class="pt-body">
        <div class="pt-head">
          ${icon(partner)}
          <div class="pt-title">
            <h3>${escape(partner.name)}</h3>
            <div class="pt-tags">
              <span class="pt-tag">Discord</span>
              ${partner.address ? `<span class="pt-tag">${tr('Minecraft server', 'Serveur Minecraft')}</span>` : ''}
            </div>
          </div>
        </div>
        <p class="pt-text">${partner.text[lang]}</p>
        ${partner.address ? `<div class="pt-live" data-live="${index}">${live(partner)}</div>` : ''}
        <div class="pt-actions">
          <a class="pill" href="${partner.invite}" target="_blank" rel="noopener">${tr('Join the Discord', 'Rejoindre le Discord')}</a>
          ${partner.address ? `<span class="pt-ip"><code>${escape(partner.address)}</code><button class="partner-copy" type="button" data-copy="${escape(partner.address)}">${tr('Copy IP', "Copier l'IP")}</button></span>` : ''}
        </div>
        ${partner.address ? `<details class="pt-how">
          <summary>${tr('How to join the server', 'Comment rejoindre le serveur')}</summary>
          <ol>
            <li>${tr('Copy the IP above.', "Copie l'IP ci-dessus.")}</li>
            <li>${tr('In Minecraft Java, open Multiplayer, then Add Server.', 'Dans Minecraft Java, ouvre Multijoueur, puis Ajouter un serveur.')}</li>
            <li>${tr('Paste the IP in Server Address, then Done and Join Server.', "Colle l'IP dans Adresse du serveur, puis Terminé et Rejoindre le serveur.")}</li>
          </ol>
        </details>` : ''}
      </div>
    </article>`;

  const renderStats = () => {
    const known = servers.map(partner => statuses[partner.address]).filter(status => status && status.online);
    const pending = servers.some(partner => statuses[partner.address] === undefined);
    const players = known.reduce((sum, status) => sum + ((status.players && status.players.online) || 0), 0);
    const stat = (key, name, value) => `<div class="rm-stat ${key}"><dt>${name}</dt><dd>${value}</dd></div>`;
    const wait = pending && !known.length;
    $('#ptStats').innerHTML = stat('shipped', tr('Partners', 'Partenaires'), PARTNERS.length)
      + stat('planned', tr('Minecraft servers', 'Serveurs Minecraft'), servers.length)
      + stat('next', tr('Online now', 'En ligne'), wait ? '…' : known.length)
      + stat('ideas', tr('Players on them', 'Joueurs connectés'), wait ? '…' : players);
    const time = checkedAt ? checkedAt.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' }) : '';
    $('#ptChecked').textContent = checkedAt ? tr(`Checked at ${time}, every minute`, `Vérifié à ${time}, chaque minute`) : '';
  };

  const refreshLive = () => {
    partnerBox.querySelectorAll('[data-live]').forEach(box => { box.innerHTML = live(PARTNERS[box.dataset.live]); });
    partnerBox.querySelectorAll('.pt-card').forEach((cardBox, index) => {
      const head = cardBox.querySelector('.pt-icon');
      if (head && !PARTNERS[index].icon) head.outerHTML = icon(PARTNERS[index]);
    });
    renderStats();
  };

  onLang(() => {
    $('#ptDiscord').href = DISCORD_URL;
    $('#ptApply').innerHTML = (PARTNER_URL ? `<a class="pill" href="${PARTNER_URL}" target="_blank" rel="noopener">${tr('Apply on GitHub', 'Postuler sur GitHub')}</a>` : '')
      + `<a class="pill quiet" href="${DISCORD_URL}" target="_blank" rel="noopener">${tr('Write to us on Discord', 'Écris-nous sur Discord')}</a>`;
    partnerBox.innerHTML = PARTNERS.map(card).join('')
      || `<p class="rm-empty">${tr('The first partners will appear here soon. Yours could be first.', 'Les premiers partenaires arriveront ici bientôt. Le tien pourrait être le premier.')}</p>`;
    renderStats();
    document.dispatchEvent(new Event('pagecontent'));
  });

  const check = () => Promise.all(servers.map(async ({ address }) => {
    try {
      const reply = await fetch(`https://api.mcstatus.io/v2/status/java/${encodeURIComponent(address)}`, { signal: AbortSignal.timeout(8000) });
      if (!reply.ok) throw new Error(`status ${reply.status}`);
      const { online, players, version, motd, icon: serverIcon } = await reply.json();
      statuses[address] = { online, players, version, motd, icon: serverIcon };
    } catch {
      // Keep the last answer on a failed refresh; only a first failure means unknown.
      if (statuses[address] === undefined) statuses[address] = null;
    }
  })).then(() => {
    checkedAt = new Date();
    refreshLive();
  });
  if (servers.length) {
    check();
    setInterval(() => { if (!document.hidden) check(); }, 60000);
  }

  partnerBox.addEventListener('click', async event => {
    const button = event.target.closest('.partner-copy');
    if (!button) return;
    const label = button.textContent;
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = tr('Copied', 'Copié');
    } catch {
      getSelection().selectAllChildren(button.previousElementSibling);
      button.textContent = tr('Press Ctrl+C', 'Fais Ctrl+C');
    }
    setTimeout(() => { button.textContent = label; }, 1800);
  });
}

const supportBox = $('#supportLinks');
if (supportBox) onLang(() => {
  const links = SUPPORT_LINKS.filter(link => link.url);
  supportBox.innerHTML = links.length
    ? links.map(link => `<a class="give-card" href="${link.url}" rel="noopener"><b>${link.name}</b><span>${link.text[lang]}</span></a>`).join('')
    : `<p class="sub">${tr('Donations open soon. Thank you for your patience.', 'Les dons ouvrent bientôt. Merci de ta patience.')}</p>`;
});

mountVess($('#vess'));

(() => {
  if (calm || !window.gsap) return;
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: .09 });
    window.vtLenis = lenis;
    // Lenis takes over scrolling, so links to a place on the same page go through it too.
    const jump = (target, immediate) => lenis.scrollTo(target, { offset: -110, immediate });
    document.addEventListener('click', event => {
      const link = event.target.closest && event.target.closest('a[href^="#"]');
      if (!link || event.defaultPrevented || link.getAttribute('href').length < 2) return;
      const target = document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1)));
      if (!target) return;
      event.preventDefault();
      history.pushState(null, '', link.getAttribute('href'));
      jump(target, false);
    });
    // The changelog opens its own hidden versions first, then scrolls itself.
    if (location.hash && !document.getElementById('changelog')) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) requestAnimationFrame(() => jump(target, true));
    }
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  gsap.from('.page-head > *', { y: 40, opacity: 0, duration: 1.1, stagger: .1, ease: 'expo.out' });
  gsap.from('#vess', { scale: .7, opacity: 0, duration: 1.4, ease: 'expo.out' });
  const enter = () => {
    gsap.from('.release, .task, .build, .rm-ship', { y: 34, opacity: .1, duration: .9, stagger: .07, ease: 'expo.out', clearProps: 'all' });
  };
  enter();
  document.addEventListener('pagecontent', enter);
})();
