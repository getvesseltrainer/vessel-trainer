/* The structure library: entries shipped with the site, plus what this visitor added in this browser. */
const MAX_FILE_BYTES = 32 * 1024 * 1024;
const MAX_UNPACKED_BYTES = 256 * 1024 * 1024;
const COMMAND_BLOCKS = ['minecraft:command_block', 'minecraft:chain_command_block', 'minecraft:repeating_command_block'];
const escapeHtml = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Minimal reader for Minecraft's NBT format. */
function readNbt(buffer) {
  const view = new DataView(buffer);
  const decoder = new TextDecoder();
  let at = 0;
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
      case 7: { const n = view.getInt32(at); at += 4 + n; return null; }
      case 8: return text();
      case 9: {
        const inner = view.getInt8(at++);
        const n = view.getInt32(at);
        at += 4;
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
      case 11: { const n = view.getInt32(at); at += 4 + n * 4; return null; }
      case 12: { const n = view.getInt32(at); at += 4 + n * 8; return null; }
      default: throw new Error('Unknown tag');
    }
  };
  if (view.getInt8(at++) !== 10) throw new Error('Not a compound');
  text();
  return payload(10);
}

async function inspectStructure(file) {
  if (file.size > MAX_FILE_BYTES) throw new Error(tr('This file is larger than 32 MB.', 'Ce fichier dépasse 32 Mo.'));
  const packed = await file.arrayBuffer();
  const head = new Uint8Array(packed);
  if (head[0] !== 0x1f || head[1] !== 0x8b) throw new Error(tr('This is not a Minecraft .nbt structure.', 'Ce n\'est pas une structure .nbt de Minecraft.'));

  let buffer;
  let root;
  try {
    buffer = await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
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
const grid = $('#library');
const search = $('#libSearch');

const stats = (size, blocks) => `${size.join(' × ')} · ${blocks.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')} ${tr('blocks', 'blocs')}`;

function renderLibrary() {
  const query = search.value.trim().toLowerCase();
  const shipped = LIBRARY.map(item => {
    const meta = LIBRARY_META[item.id];
    return `<article class="lib-card" data-find="${escapeHtml(`${item.name.en} ${item.name.fr} ${item.author}`.toLowerCase())}">
      <img loading="lazy" src="assets/img/library/${item.id}.webp" width="800" height="450" alt="${escapeHtml(item.name[lang])}">
      <div class="lib-body">
        <h2>${escapeHtml(item.name[lang])}</h2>
        <p class="lib-stats">${stats(meta.size, meta.blocks)}</p>
        <p>${escapeHtml(item.text[lang])}</p>
        <p class="lib-author">${tr('By', 'Par')} ${escapeHtml(item.author)}</p>
        <a class="pill" href="library/${item.id}.nbt" download>${tr('Download', 'Télécharger')}</a>
      </div>
    </article>`;
  });
  const local = mine.map(item => `<article class="lib-card" data-find="${escapeHtml(`${item.name} ${item.author}`.toLowerCase())}">
      <div class="lib-blank" aria-hidden="true">${escapeHtml(item.size.join(' × '))}</div>
      <div class="lib-body">
        <span class="lib-badge">${tr('Only in this browser', 'Seulement dans ce navigateur')}</span>
        <h2>${escapeHtml(item.name)}</h2>
        <p class="lib-stats">${stats(item.size, item.blocks)}</p>
        <p>${escapeHtml(item.text)}</p>
        <p class="lib-author">${tr('By', 'Par')} ${escapeHtml(item.author || tr('you', 'toi'))}</p>
        <div class="lib-actions">
          <button class="pill" type="button" data-save="${item.id}">${tr('Download', 'Télécharger')}</button>
          <button class="pill quiet" type="button" data-remove="${item.id}">${tr('Remove', 'Retirer')}</button>
        </div>
      </div>
    </article>`);
  grid.innerHTML = [...local, ...shipped].join('');
  grid.querySelectorAll('.lib-card').forEach(card => { card.hidden = !card.dataset.find.includes(query); });
}

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
    renderLibrary();
  }
});

let checked = null;
const report = $('#addReport');
const showReport = (html, bad) => {
  report.hidden = false;
  report.classList.toggle('bad', bad);
  report.innerHTML = html;
};

$('#addFile').addEventListener('change', async event => {
  const file = event.target.files[0];
  checked = null;
  $('#addButton').disabled = true;
  if (!file) { report.hidden = true; return; }
  try {
    const result = await inspectStructure(file);
    if (result.blocks === 0) throw new Error(tr('This structure has no blocks.', 'Cette structure ne contient aucun bloc.'));
    const warnings = [];
    if (result.commandBlocks) warnings.push(tr('It contains command blocks. The trainer will skip them.', 'Elle contient des blocs de commande. Le trainer les ignorera.'));
    if (result.clickCommands) warnings.push(tr('It contains text that can run a command when clicked. Be careful with this file.', 'Elle contient du texte qui peut lancer une commande au clic. Méfie-toi de ce fichier.'));
    showReport(`<b>${tr('Valid structure', 'Structure valide')}</b> ${stats(result.size, result.blocks)}<br>${escapeHtml(result.top.join(', '))}${warnings.map(w => `<br><span class="warn">${escapeHtml(w)}</span>`).join('')}`, false);
    checked = result;
    if (!$('#addName').value) $('#addName').value = file.name.replace(/\.nbt$/i, '');
    $('#addButton').disabled = false;
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
  $('#addButton').disabled = true;
  renderLibrary();
  grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

search.addEventListener('input', renderLibrary);
onLang(() => {
  search.placeholder = tr('Search a structure', 'Chercher une structure');
  $('#addNote').textContent = SUBMIT_URL
    ? ''
    : tr('For now your structure stays in this browser. Sharing with all players opens once the library is online.', 'Pour l\'instant, ta structure reste dans ce navigateur. Le partage avec tous les joueurs ouvrira quand la bibliothèque sera en ligne.');
  renderLibrary();
});
store.all().then(entries => { mine = entries; renderLibrary(); });
