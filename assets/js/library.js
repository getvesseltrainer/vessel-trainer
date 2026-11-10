/* The structure library: the public catalog, plus what this visitor added in this browser. */
const MAX_FILE_BYTES = 32 * 1024 * 1024;
const MAX_UNPACKED_BYTES = 256 * 1024 * 1024;
const COMMAND_BLOCKS = ['minecraft:command_block', 'minecraft:chain_command_block', 'minecraft:repeating_command_block'];
const escapeHtml = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Minimal reader for Minecraft's NBT format. */
function readNbt(buffer) {
  const view = new DataView(buffer);
  const decoder = new TextDecoder();
  let at = 0;
  const size = () => {
    const n = view.getInt32(at);
    if (n < 0) throw new Error('Bad length');
    at += 4;
    return n;
  };
  const text = () => {
    const length = view.getUint16(at);
    at += 2;
    const value = decoder.decode(new Uint8Array(buffer, at, length));
    at += length;
    return value;
  };
  const payload = type => {
    switch (type) {
      case 1: return view.getInt8(at++);
      case 2: at += 2; return view.getInt16(at - 2);
      case 3: at += 4; return view.getInt32(at - 4);
      case 4: at += 8; return 0;
      case 5: at += 4; return 0;
      case 6: at += 8; return 0;
      case 7: { at += size(); return null; }
      case 8: return text();
      case 9: {
        const inner = view.getInt8(at++);
        const n = size();
        const list = [];
        for (let i = 0; i < n; i++) list.push(payload(inner));
        return list;
      }
      case 10: {
        const compound = {};
        for (;;) {
          const inner = view.getInt8(at++);
          if (inner === 0) return compound;
          const name = text();
          compound[name] = payload(inner);
        }
      }
      case 11: { at += size() * 4; return null; }
      case 12: { at += size() * 8; return null; }
      default: throw new Error('Unknown tag');
    }
  };
  if (view.getInt8(at++) !== 10) throw new Error('Not a compound');
  text();
  return payload(10);
}

/* Previews: an isometric drawing made in the browser from the file itself, for structures without a screenshot. */
const BLOCK_COLORS = [
  [/glass/, '#a9dcec'], [/water|ice/, '#4f8fe0'], [/lava|magma/, '#f06a1e'], [/leaves|moss|azalea/, '#4c8a35'], [/grass_block/, '#6aa84a'],
  [/sandstone|sand/, '#dcc98c'], [/dirt|mud|podzol/, '#7d5a3c'], [/log|wood|plank|stairs|slab|fence|door|barrel|chest|crafting|bookshelf/, '#a87b48'],
  [/brick/, '#9a5a48'], [/deepslate|blackstone|basalt|obsidian|coal/, '#3c3c46'], [/quartz|snow|calcite|white/, '#e8e8ec'], [/gold|yellow/, '#e8c548'],
  [/iron|stone|cobble|andesite|tuff|gravel|gray/, '#8d8d90'], [/diamond|cyan|prismarine/, '#45c8c0'], [/emerald|lime|green/, '#55c060'], [/copper|orange/, '#d07a3a'],
  [/redstone|red|nether/, '#b03a3a'], [/purple|amethyst|magenta|pink/, '#a860d0'], [/blue|lapis/, '#3a5ad0'], [/brown/, '#7a5230'], [/black/, '#26262c'],
];
const colorCache = new Map();
const blockColor = name => {
  if (!colorCache.has(name)) {
    const found = BLOCK_COLORS.find(([pattern]) => pattern.test(name));
    colorCache.set(name, found ? found[1] : '#9c8fb0');
  }
  return colorCache.get(name);
};
const shade = (hex, amount) => `rgb(${[1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * amount)).join(',')})`;

function drawPreview(canvas, root) {
  const palette = root.palette || (root.palettes && root.palettes[0]);
  const filled = new Map();
  const key = (x, y, z) => (y * 4096 + z) * 4096 + x;
  for (const block of root.blocks) {
    const entry = palette[block.state];
    const name = entry && (entry.id || entry.Name);
    if (name && name !== 'minecraft:air' && name !== 'minecraft:structure_void' && Array.isArray(block.pos)) {
      filled.set(key(block.pos[0], block.pos[1], block.pos[2]), { pos: block.pos, color: blockColor(name) });
    }
  }
  // Only blocks with an open top or front side can be seen from this angle.
  const shown = [...filled.values()].filter(({ pos: [x, y, z] }) => !filled.has(key(x, y + 1, z)) || !filled.has(key(x + 1, y, z)) || !filled.has(key(x, y, z + 1)));
  shown.sort((a, b) => (a.pos[0] + a.pos[1] + a.pos[2]) - (b.pos[0] + b.pos[1] + b.pos[2]));

  const [sizeX, sizeY, sizeZ] = root.size;
  const width = canvas.width = 800;
  const height = canvas.height = 450;
  const unit = Math.min((width * .9) / (sizeX + sizeZ), (height * .9) / ((sizeX + sizeZ) / 2 + sizeY));
  const half = unit;
  const quarter = unit / 2;
  const originX = width / 2 + (sizeZ - sizeX) * half / 2;
  const originY = height / 2 - ((sizeX + sizeZ) / 2 * quarter * 2 - sizeY * unit) / 2 + 0;
  const context = canvas.getContext('2d');
  const face = (points, fill) => {
    context.fillStyle = fill;
    context.beginPath();
    points.forEach(([x, y], index) => (index ? context.lineTo(x, y) : context.moveTo(x, y)));
    context.closePath();
    context.fill();
  };
  for (const { pos: [x, y, z], color } of shown) {
    const px = originX + (x - z) * half;
    const py = originY + (x + z) * quarter - y * unit;
    if (!filled.has(key(x, y + 1, z))) face([[px, py - unit], [px + half, py - unit + quarter], [px, py - unit + quarter * 2], [px - half, py - unit + quarter]], shade(color, 1));
    if (!filled.has(key(x, y, z + 1))) face([[px - half, py - unit + quarter], [px, py - unit + quarter * 2], [px, py + quarter * 2], [px - half, py + quarter]], shade(color, .72));
    if (!filled.has(key(x + 1, y, z))) face([[px + half, py - unit + quarter], [px, py - unit + quarter * 2], [px, py + quarter * 2], [px + half, py + quarter]], shade(color, .55));
  }
}

const unpack = async packed => new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();

/* Files are only downloaded when their card comes near the screen. */
const previewWatcher = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    previewWatcher.unobserve(entry.target);
    fillPreview(entry.target);
  }
}), { rootMargin: '300px' }) : null;

async function fillPreview(canvas) {
  try {
    const item = canvas.dataset.local ? mine.find(entry => entry.id === +canvas.dataset.local) : null;
    const packed = item ? item.bytes : await fetch(`library/${canvas.dataset.file}.nbt`).then(response => (response.ok ? response.arrayBuffer() : Promise.reject(new Error('No file'))));
    if (packed.byteLength > MAX_FILE_BYTES) return;
    const buffer = await unpack(packed);
    if (buffer.byteLength <= MAX_UNPACKED_BYTES) drawPreview(canvas, readNbt(buffer));
  } catch {
    // The card keeps its plain background: a missing preview must never break the page.
  }
}

const watchPreviews = () => grid.querySelectorAll('canvas.lib-preview').forEach(canvas => {
  if (previewWatcher) previewWatcher.observe(canvas);
  else fillPreview(canvas);
});

async function inspectStructure(file) {
  if (file.size > MAX_FILE_BYTES) throw new Error(tr('This file is larger than 32 MB.', 'Ce fichier dépasse 32 Mo.'));
  const packed = await file.arrayBuffer();
  const head = new Uint8Array(packed);
  if (head[0] !== 0x1f || head[1] !== 0x8b) throw new Error(tr('This is not a Minecraft .nbt structure.', 'Ce n\'est pas une structure .nbt de Minecraft.'));

  let buffer;
  let root;
  try {
    buffer = await unpack(packed);
    if (buffer.byteLength > MAX_UNPACKED_BYTES) throw new Error('Too large');
    root = readNbt(buffer);
  } catch {
    throw new Error(tr('This file is damaged or too large to read.', 'Ce fichier est abîmé ou trop gros pour être lu.'));
  }
  const palette = root.palette || (root.palettes && root.palettes[0]);
  if (!Array.isArray(root.size) || root.size.length !== 3 || !Array.isArray(root.blocks) || !palette) {
    throw new Error(tr('This .nbt file is not a structure.', 'Ce fichier .nbt n\'est pas une structure.'));
  }

  const counts = new Map();
  for (const block of root.blocks) {
    // Current files write "id", files from older versions write "Name".
    const entry = palette[block.state];
    const name = entry && (entry.id || entry.Name);
    if (name && name !== 'minecraft:air' && name !== 'minecraft:structure_void') counts.set(name, (counts.get(name) || 0) + 1);
  }
  const blocks = [...counts.values()].reduce((a, b) => a + b, 0);
  return {
    size: root.size,
    blocks,
    top: [...counts].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([name, n]) => `${name.replace('minecraft:', '').replaceAll('_', ' ')} × ${n}`),
    commandBlocks: COMMAND_BLOCKS.some(name => counts.has(name)),
    clickCommands: new TextDecoder('latin1').decode(buffer).includes('run_command'),
    bytes: packed,
    root,
  };
}

/* Entries added here stay in this browser, so they survive a reload without pretending to be public. */
const store = (() => {
  const open = () => new Promise((resolve, reject) => {
    const request = indexedDB.open('vessel-library', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('mine', { keyPath: 'id', autoIncrement: true });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  const run = async (mode, action) => {
    const db = await open();
    return new Promise((resolve, reject) => {
      const request = action(db.transaction('mine', mode).objectStore('mine'));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
  return {
    all: () => run('readonly', s => s.getAll()).catch(() => []),
    add: entry => run('readwrite', s => s.add(entry)),
    remove: id => run('readwrite', s => s.delete(id)),
  };
})();

let mine = [];
let shared = LIBRARY_FALLBACK;
const grid = $('#library');
const search = $('#libSearch');
let banners = [];
const bannerBox = $('#bannerList');

const number = n => Number(n || 0).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US');
const stats = (size, blocks) => `${size.join(' × ')} · ${number(blocks)} ${tr('blocks', 'blocs')}`;

/* What the visitor is looking at: kind, who made it, a search and an order. */
const view = { kind: 'all', source: 'all', sort: 'name' };
const fold = text => String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const sourceOf = item => (item.local ? 'mine' : item.community ? 'community' : 'team');
const SOURCES = {
  team: () => tr('Vessel team', 'Équipe Vessel'),
  community: () => tr('Community', 'Communauté'),
  mine: () => tr('In this browser', 'Dans ce navigateur'),
};
const matchesView = (item, words) => (view.source === 'all' || sourceOf(item) === view.source) && fold(words).includes(fold(search.value.trim()));
const ordered = list => {
  const name = item => (item.local ? item.name : item.name[lang]);
  const by = {
    name: (a, b) => name(a).localeCompare(name(b), lang),
    big: (a, b) => (b.blocks || 0) - (a.blocks || 0),
    small: (a, b) => (a.blocks || 0) - (b.blocks || 0),
  }[view.sort] || (() => 0);
  return [...list].sort(by);
};

const structureCard = item => {
  // Community entries come from players, so everything from the catalog is escaped.
  const local = item.local;
  const id = escapeHtml(local ? item.id : item.id);
  const name = local ? item.name : item.name[lang];
  const text = local ? item.text : item.text[lang];
  const source = sourceOf(item);
  const [x, y, z] = item.size;
  const picture = !local && item.image
    ? `<img loading="lazy" src="assets/img/library/${id}.webp" width="800" height="450" alt="${escapeHtml(name)}">`
    : `<canvas class="lib-preview" width="800" height="450" ${local ? `data-local="${item.id}"` : `data-file="${id}"`} role="img" aria-label="${escapeHtml(tr(`Preview of ${name}`, `Aperçu de ${name}`))}"></canvas>`;
  return `<article class="lib-card">
      <div class="lib-media">
        ${picture}
        <span class="lib-size" title="${tr('Width × height × depth', 'Largeur × hauteur × profondeur')}">${x} × ${y} × ${z}</span>
      </div>
      <div class="lib-body">
        <span class="lib-badge ${source}">${SOURCES[source]()}</span>
        <h2>${escapeHtml(name)}</h2>
        ${text ? `<p>${escapeHtml(text)}</p>` : ''}
        <ul class="lib-meta">
          <li><b>${number(item.blocks)}</b> ${tr('blocks', 'blocs')}</li>
          <li>${tr('By', 'Par')} <b>${escapeHtml(item.author || tr('you', 'toi'))}</b></li>
        </ul>
        <div class="lib-actions">
          ${local
            ? `<button class="pill" type="button" data-save="${item.id}">${tr('Download', 'Télécharger')}</button>
               <button class="pill quiet" type="button" data-remove="${item.id}">${tr('Remove', 'Retirer')}</button>`
            : `<a class="pill" href="library/${id}.nbt" download>${tr('Download', 'Télécharger')}</a>`}
        </div>
        ${!local && item.sha256 ? `<details class="lib-check"><summary>${tr('File check', 'Vérifier le fichier')}</summary><p>SHA-256 <code>${escapeHtml(item.sha256)}</code></p></details>` : ''}
      </div>
    </article>`;
};

function renderLibrary() {
  const all = [...mine.map(item => ({ ...item, local: true })), ...shared];
  const shown = ordered(all.filter(item => matchesView(item, item.local ? `${item.name} ${item.author} ${item.text}` : `${item.name.en} ${item.name.fr} ${item.text.en} ${item.text.fr} ${item.author}`)));
  grid.innerHTML = shown.map(structureCard).join('');
  $('#structures').hidden = view.kind === 'banners';
  $('#libStructCount').textContent = shown.length;
  const empty = $('#libEmpty');
  empty.hidden = shown.length > 0;
  empty.textContent = tr('No structure matches. Try another word or filter, or share yours below.', 'Aucune structure ne correspond. Essaie un autre mot ou un autre filtre, ou partage la tienne plus bas.');
  watchPreviews();
  renderSummary();
}

/* Counts at the top of the page and under the filters. */
const renderSummary = () => {
  const structures = mine.length + shared.length;
  const community = shared.filter(item => item.community).length + banners.filter(item => item.community).length;
  const stat = (key, label, value) => `<div class="rm-stat ${key}"><dt>${label}</dt><dd>${value}</dd></div>`;
  $('#libStats').innerHTML = stat('shipped', 'Structures', structures)
    + stat('ideas', tr('Banners', 'Bannières'), banners.length)
    + stat('next', tr('From the community', 'De la communauté'), community);
  const shownStructures = view.kind === 'banners' ? 0 : grid.children.length;
  const shownBanners = view.kind === 'structures' ? 0 : bannerBox.children.length;
  $('#libCount').textContent = tr(`${shownStructures} structures and ${shownBanners} banners shown`, `${shownStructures} structures et ${shownBanners} bannières affichées`);
};

const renderFilters = () => {
  const chip = (group, value, label) => `<button class="chip" type="button" data-${group}="${value}" aria-pressed="${view[group] === value}">${label}</button>`;
  $('#libKinds').innerHTML = chip('kind', 'all', tr('Everything', 'Tout')) + chip('kind', 'structures', 'Structures') + chip('kind', 'banners', tr('Banners', 'Bannières'));
  $('#libSources').innerHTML = chip('source', 'all', tr('Anyone', 'Tout le monde'))
    + Object.keys(SOURCES).filter(key => key !== 'mine' || mine.length).map(key => chip('source', key, SOURCES[key]())).join('');
  const sort = $('#libSort');
  sort.innerHTML = [['name', tr('Name', 'Nom')], ['big', tr('Biggest first', 'Les plus grandes')], ['small', tr('Smallest first', 'Les plus petites')]]
    .map(([value, label]) => `<option value="${value}">${label}</option>`).join('');
  sort.value = view.sort;
};
const renderAll = () => {
  renderFilters();
  renderLibrary();
  renderBanners();
};
document.querySelector('.lib-toolbar').addEventListener('click', event => {
  const button = event.target.closest('[data-kind], [data-source]');
  if (!button) return;
  if (button.dataset.kind) view.kind = button.dataset.kind;
  if (button.dataset.source) view.source = button.dataset.source;
  renderAll();
});
$('#libSort').addEventListener('change', event => {
  view.sort = event.target.value;
  renderLibrary();
});

grid.addEventListener('click', async event => {
  const save = event.target.closest('[data-save]');
  const remove = event.target.closest('[data-remove]');
  if (save) {
    const item = mine.find(entry => entry.id === +save.dataset.save);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([item.bytes]));
    link.download = `${item.name.replace(/[^\w-]+/g, '-')}.nbt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  if (remove) {
    await store.remove(+remove.dataset.remove);
    mine = await store.all();
    if (!mine.length && view.source === 'mine') view.source = 'all';
    renderAll();
  }
});

let checked = null;
const report = $('#addReport');
const showReport = (html, bad) => {
  report.hidden = false;
  report.classList.toggle('bad', bad);
  report.innerHTML = html;
};
const setReady = ready => {
  $('#addButton').disabled = !ready;
  $('#shareButton').disabled = !ready;
};

$('#addFile').addEventListener('change', async event => {
  const file = event.target.files[0];
  checked = null;
  setReady(false);
  if (!file) { report.hidden = true; return; }
  try {
    const result = await inspectStructure(file);
    if (result.blocks === 0) throw new Error(tr('This structure has no blocks.', 'Cette structure ne contient aucun bloc.'));
    const warnings = [];
    if (result.commandBlocks) warnings.push(tr('It contains command blocks. The trainer will skip them.', 'Elle contient des blocs de commande. Le trainer les ignorera.'));
    if (result.clickCommands) warnings.push(tr('It contains text that can run a command when clicked. Be careful with this file.', 'Elle contient du texte qui peut lancer une commande au clic. Méfie-toi de ce fichier.'));
    showReport(`<b>${tr('Valid structure', 'Structure valide')}</b> ${stats(result.size, result.blocks)}<br>${escapeHtml(result.top.join(', '))}${warnings.map(w => `<br><span class="warn">${escapeHtml(w)}</span>`).join('')}<canvas class="form-preview" width="800" height="450" aria-hidden="true"></canvas>`, false);
    drawPreview($('.form-preview'), result.root);
    checked = result;
    if (!$('#addName').value) $('#addName').value = file.name.replace(/\.nbt$/i, '');
    setReady(true);
  } catch (error) {
    showReport(escapeHtml(error.message), true);
  }
});

$('#addForm').addEventListener('submit', async event => {
  event.preventDefault();
  const name = $('#addName').value.trim();
  if (!checked || !name) return;
  await store.add({ name, author: $('#addAuthor').value.trim(), text: $('#addText').value.trim(), size: checked.size, blocks: checked.blocks, bytes: checked.bytes });
  mine = await store.all();
  event.target.reset();
  checked = null;
  report.hidden = true;
  setReady(false);
  view.kind = view.kind === 'banners' ? 'all' : view.kind;
  renderAll();
  grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* GitHub refuses .nbt attachments but accepts .gz. A .nbt file is already gzip, so only the name changes. */
$('#shareButton').addEventListener('click', async () => {
  const name = $('#addName').value.trim();
  if (!checked) return;
  if (!name) {
    showReport(escapeHtml(tr('Give your structure a name first.', 'Donne d\'abord un nom à ta structure.')), true);
    return;
  }
  if (checked.commandBlocks || checked.clickCommands) {
    showReport(escapeHtml(tr('This structure can\'t be shared: it contains command blocks or text that runs a command.', 'Cette structure ne peut pas être partagée : elle contient des blocs de commande ou du texte qui lance une commande.')), true);
    return;
  }
  if (VesselAccount.enabled) {
    if (!VesselAccount.signedIn()) {
      showReport(escapeHtml(tr('Sign in with Discord above to share it.', 'Connecte-toi avec Discord ci-dessus pour la partager.')), true);
      return;
    }
    try {
      await VesselAccount.send('structure', { name, author: $('#addAuthor').value.trim(), description: $('#addText').value.trim(), bytes: checked.bytes });
      showReport(`<b>${tr('Sent!', 'Envoyé !')}</b> ${escapeHtml(tr('Your structure joins the library once it has been reviewed. You can follow it in My files.', 'Ta structure rejoint la bibliothèque après vérification. Tu peux la suivre dans Mes envois.'))}`);
      VesselAccount.refresh();
    } catch (error) {
      showReport(escapeHtml(error.message), true);
    }
    return;
  }
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([checked.bytes], { type: 'application/gzip' }));
  link.download = `${name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'structure'}.nbt.gz`;
  link.click();
  URL.revokeObjectURL(link.href);

  const form = new URL(SUBMIT_URL);
  form.searchParams.set('title', `Structure: ${name}`);
  form.searchParams.set('name', name);
  form.searchParams.set('author', $('#addAuthor').value.trim());
  form.searchParams.set('description', $('#addText').value.trim());
  window.open(form, '_blank', 'noopener');
  showReport(`<b>${tr('Last step', 'Dernière étape')}</b> ${escapeHtml(tr(`${link.download} was saved. Drag it into the Structure file box on GitHub, then send the form.`, `${link.download} est enregistré. Glisse-le dans la case Structure file sur GitHub, puis envoie le formulaire.`))}<br><a href="${escapeHtml(form.href)}" target="_blank" rel="noopener">${tr('Open the form again', 'Rouvrir le formulaire')}</a>`, false);
});

search.addEventListener('input', () => {
  renderLibrary();
  renderBanners();
});
onLang(() => {
  search.placeholder = tr('Search: castle, Vess, tower…', 'Chercher : château, Vess, tour…');
  $('#shareButton').hidden = !SUBMIT_URL;
  $('#addNote').textContent = VesselAccount.enabled
    ? tr('Sharing needs you to sign in with Discord. Your name, text and file become public once an admin approves them.', 'Partager demande de te connecter avec Discord. Ton pseudo, ton texte et ton fichier deviennent publics une fois validés par un admin.')
    : SUBMIT_URL
    ? tr('Sharing needs a free GitHub account. Your name, text and file are public as soon as you send them, and the structure joins the library once reviewed.', 'Le partage demande un compte GitHub gratuit. Ton pseudo, ton texte et ton fichier sont publics dès l\'envoi, et la structure rejoint la bibliothèque une fois vérifiée.')
    : tr('For now your structure stays in this browser.', 'Pour l\'instant, ta structure reste dans ce navigateur.');
  renderAll();
});
store.all().then(entries => { mine = entries; renderAll(); });
/* Banners. Names come from players, so everything from the catalog is escaped. */
function renderBanners() {
  const shown = banners.filter(item => matchesView(item, `${item.name.en} ${item.name.fr} ${item.author}`));
  bannerBox.innerHTML = shown.map(item => {
    const file = `library/banners/${escapeHtml(item.id)}.${escapeHtml(item.format)}`;
    const source = sourceOf(item);
    return `<article class="lib-card lib-banner">
      <div class="lib-media banner-media">
        <img class="banner-image" loading="lazy" src="${file}" alt="${escapeHtml(item.name[lang])}">
        <span class="lib-size">${item.format === 'gif' ? tr('Animated GIF', 'GIF animé') : 'PNG'}</span>
      </div>
      <div class="lib-body">
        <span class="lib-badge ${source}">${SOURCES[source]()}</span>
        <h2>${escapeHtml(item.name[lang])}</h2>
        <ul class="lib-meta"><li>${tr('By', 'Par')} <b>${escapeHtml(item.author)}</b></li></ul>
        <div class="lib-actions"><a class="pill" href="${file}" download>${tr('Download', 'Télécharger')}</a></div>
      </div>
    </article>`;
  }).join('');
  $('#banners').hidden = view.kind === 'structures';
  $('#libBannerCount').textContent = shown.length;
  const empty = $('#libBannerEmpty');
  empty.hidden = shown.length > 0 || !banners.length;
  empty.textContent = tr('No banner matches.', 'Aucune bannière ne correspond.');
  renderSummary();
}
$('#bannerShare').href = BANNER_SUBMIT_URL;
$('#bannerShare').hidden = !BANNER_SUBMIT_URL || VesselAccount.enabled;
fetch('library/banners/index.json', { cache: 'no-cache' })
  .then(response => (response.ok ? response.json() : Promise.reject(new Error('No catalog'))))
  .then(entries => { banners = entries; renderBanners(); })
  .catch(() => {});

/* The catalog changes without a site update. Pages opened from a local file keep the built-in copy. */
fetch('library/index.json', { cache: 'no-cache' })
  .then(response => (response.ok ? response.json() : Promise.reject(new Error('No catalog'))))
  .then(entries => { shared = entries; renderLibrary(); })
  .catch(() => {});
