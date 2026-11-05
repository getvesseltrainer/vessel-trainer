/* Shared by the Changelog and Roadmap pages. */
const typeLabel = {
  added: () => tr('Added', 'Ajouté'),
  changed: () => tr('Changed', 'Modifié'),
  fixed: () => tr('Fixed', 'Corrigé'),
};
const columnLabel = {
  next: () => [tr('Next', 'Prochainement'), tr('What comes first.', 'Ce qui arrive en premier.')],
  planned: () => [tr('Planned', 'Prévu'), tr('On the list, after that.', 'Sur la liste, juste après.')],
  ideas: () => [tr('Ideas', 'Idées'), tr('Being considered, nothing promised.', 'À l\'étude, rien de promis.')],
};

const changelogBox = $('#changelog');
if (changelogBox) onLang(() => {
  changelogBox.innerHTML = CHANGELOG.map((release, index) => `
    <article class="release">
      <div class="release-side">
        <span class="badge">v${release.version}</span>
        <time>${release.date[lang]}</time>
        ${index === 0 ? `<span class="latest">${tr('Latest', 'Dernière version')}</span>` : ''}
      </div>
      <div class="release-body">
        <h2>${release.title[lang]}</h2>
        <ul>${release.changes.map(c => `<li><b class="${c.type}">${typeLabel[c.type]()}</b><span>${c[lang]}</span></li>`).join('')}</ul>
      </div>
    </article>`).join('');
  document.dispatchEvent(new Event('pagecontent'));
});

const roadmapBox = $('#roadmap');
if (roadmapBox) onLang(() => {
  roadmapBox.innerHTML = Object.keys(ROADMAP).map(key => {
    const [name, hint] = columnLabel[key]();
    return `<section class="lane ${key}">
      <h2>${name}</h2>
      <p class="lane-hint">${hint}</p>
      ${ROADMAP[key].map(item => `<article class="task"><h3>${item[lang]}</h3><p>${item.note[lang]}</p></article>`).join('') || `<p class="lane-hint">${tr('Everything here has shipped. See the changelog.', 'Tout ce qui était ici est sorti. Regarde le changelog.')}</p>`}
    </section>`;
  }).join('');
  document.dispatchEvent(new Event('pagecontent'));
});

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
  const LOADERS = { fabric: 'Fabric', neoforge: 'NeoForge', forge: 'Forge' };
  const builds = [
    ...RELEASES.map((release, index) => ({ ...release, available: true, latest: index === 0 })),
    ...PLANNED_BUILDS.map(build => ({ ...build, available: false })),
  ];
  const filters = { loader: 'all', status: 'all', mc: 'all' };
  const mcBox = $('#mcFilter');
  const newest = (a, b) => b.localeCompare(a, 'en', { numeric: true });
  const games = [...new Set(builds.map(build => build.mc))].sort(newest);

  const row = build => {
    const loader = LOADERS[build.loader];
    if (!build.available) {
      return `<article class="build planned">
        <div class="build-main">
          <h2>${tr(`${loader} for Minecraft ${build.mc}`, `${loader} pour Minecraft ${build.mc}`)}</h2>
          <p>${build.note ? build.note[lang] : tr('Not available yet.', 'Pas encore disponible.')}</p>
        </div>
        <span class="build-status">${tr('Planned', 'Prévue')}</span>
      </article>`;
    }
    const release = CHANGELOG.find(entry => entry.version === build.version);
    return `<article class="build">
      <div class="build-main">
        <h2>${build.name} ${build.version}${build.latest ? ` <span class="latest">${tr('Latest', 'Dernière version')}</span>` : ''}</h2>
        <p>${loader} · Minecraft ${build.mc} · ${release ? `${release.date[lang]} · ` : ''}${build.kb} ${tr('KB', 'Ko')}</p>
      </div>
      <div class="build-actions">
        <a class="pill quiet" href="changelog.html">${tr('What changed', 'Nouveautés')}</a>
        <a class="pill" href="downloads/${build.file}" download>${tr('Download', 'Télécharger')}</a>
      </div>
    </article>`;
  };

  const render = () => {
    const shown = builds.filter(build => (filters.loader === 'all' || build.loader === filters.loader)
      && (filters.status === 'all' || build.available === (filters.status === 'available'))
      && (filters.mc === 'all' || build.mc === filters.mc));
    document.querySelectorAll('.chip').forEach(chip => chip.setAttribute('aria-pressed', filters[chip.dataset.filter] === chip.dataset.value));
    $('#buildCount').textContent = tr(`${shown.length} version${shown.length === 1 ? '' : 's'}`, `${shown.length} version${shown.length > 1 ? 's' : ''}`);
    buildsBox.innerHTML = shown.map(row).join('')
      || `<p class="sub">${tr('Nothing here yet for this choice. Try the Planned filter.', 'Rien pour ce choix pour l\'instant. Essaie le filtre Prévues.')}</p>`;
  };

  document.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => {
    filters[chip.dataset.filter] = chip.dataset.value;
    render();
  }));
  mcBox.addEventListener('change', () => {
    filters.mc = mcBox.value;
    render();
  });
  onLang(() => {
    mcBox.innerHTML = [`<option value="all">${tr('All versions', 'Toutes les versions')}</option>`, ...games.map(mc => `<option value="${mc}">${mc}</option>`)].join('');
    mcBox.value = filters.mc;
    render();
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
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  gsap.from('.page-head > *', { y: 40, opacity: 0, duration: 1.1, stagger: .1, ease: 'expo.out' });
  gsap.from('#vess', { scale: .7, opacity: 0, duration: 1.4, ease: 'expo.out' });
  const enter = () => {
    gsap.from('.release, .task, .build', { y: 34, opacity: .1, duration: .9, stagger: .07, ease: 'expo.out', clearProps: 'all' });
  };
  enter();
  document.addEventListener('pagecontent', enter);
})();
