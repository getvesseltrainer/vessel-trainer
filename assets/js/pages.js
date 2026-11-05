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
      ${ROADMAP[key].map(item => `<article class="task"><h3>${item[lang]}</h3><p>${item.note[lang]}</p></article>`).join('')}
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
    gsap.from('.release, .task', { y: 34, opacity: .1, duration: .9, stagger: .07, ease: 'expo.out', clearProps: 'all' });
  };
  enter();
  document.addEventListener('pagecontent', enter);
})();
