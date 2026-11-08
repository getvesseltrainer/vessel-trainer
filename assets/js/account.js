/*
  Accounts and sharing from the website. Off until SUPABASE in data.js has an address: the GitHub forms keep
  working until then. Everything a player sends waits in a private folder until an admin approves it.
*/
const VesselAccount = (() => {
  const MAX_WAITING = 5;
  const MAX_BANNER_BYTES = 6 * 1024 * 1024;
  const MAX_STRUCTURE_BYTES = 32 * 1024 * 1024;
  const BANNER_LIMITS = { 'image/png': 1280, 'image/gif': 600 };
  const MAX_BANNER_HEIGHT = 720;
  const enabled = Boolean(window.supabase && SUPABASE.url && SUPABASE.anonKey);
  const client = enabled ? supabase.createClient(SUPABASE.url, SUPABASE.anonKey) : null;
  let user = null;
  let admin = false;
  const listeners = [];

  const esc = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const displayName = () => {
    const meta = (user && user.user_metadata) || {};
    return String(meta.custom_claims?.global_name || meta.full_name || meta.name || meta.user_name || '').slice(0, 40);
  };

  const refresh = async () => {
    if (!enabled) return;
    const { data } = await client.auth.getSession();
    user = data.session ? data.session.user : null;
    admin = false;
    if (user) {
      const { data: rows } = await client.from('admins').select('user_id').eq('user_id', user.id);
      admin = Boolean(rows && rows.length);
    }
    listeners.forEach(listener => listener());
  };

  const signIn = () => client.auth.signInWithOAuth({ provider: 'discord', options: { redirectTo: location.href.split('#')[0] } });
  const signOut = async () => { await client.auth.signOut(); await refresh(); };

  const mine = async () => {
    const { data, error } = await client.from('submissions').select('id,kind,name,status,reason,created_at,file_path').eq('user_id', user.id).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  };

  /** Sends a file. The database refuses it too if it breaks a rule, so these checks are only for a clear message. */
  const send = async (kind, { name, author, description, bytes, type }) => {
    if (!user) throw new Error(tr('Sign in first.', 'Connecte-toi d\'abord.'));
    const waiting = (await mine()).filter(entry => entry.status === 'pending').length;
    if (waiting >= MAX_WAITING) throw new Error(tr(`You already have ${MAX_WAITING} files waiting. Wait for a review first.`, `Tu as déjà ${MAX_WAITING} envois en attente. Attends qu'ils soient vérifiés.`));
    const extension = kind === 'banner' ? (type === 'image/gif' ? 'gif' : 'png') : 'nbt.gz';
    const path = `${kind}s/${user.id}/${crypto.randomUUID()}.${extension}`;
    const upload = await client.storage.from('submissions').upload(path, new Blob([bytes], { type: kind === 'banner' ? type : 'application/gzip' }), { upsert: false });
    if (upload.error) throw upload.error;
    const { error } = await client.from('submissions').insert({ kind, name: name.slice(0, 40), author: (author || displayName() || 'Player').slice(0, 40), description: (description || '').slice(0, 240), file_path: path });
    if (error) {
      await client.storage.from('submissions').remove([path]);
      throw error;
    }
  };

  const withdraw = async entry => {
    const { error } = await client.from('submissions').delete().eq('id', entry.id).eq('status', 'pending');
    if (error) throw error;
    await client.storage.from('submissions').remove([entry.file_path]);
  };

  /** Reads the real size of an image before it is sent, so a refused banner never leaves the browser. */
  const checkBanner = file => new Promise((resolve, reject) => {
    const limit = BANNER_LIMITS[file.type];
    if (!limit) return reject(new Error(tr('Pick a PNG or a GIF.', 'Choisis un PNG ou un GIF.')));
    if (file.size > MAX_BANNER_BYTES) return reject(new Error(tr('The image is larger than 6 MB.', 'L\'image dépasse 6 Mo.')));
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      if (image.naturalWidth > limit || image.naturalHeight > MAX_BANNER_HEIGHT) {
        reject(new Error(tr(`At most ${limit} × ${MAX_BANNER_HEIGHT} pixels for this format.`, `Au maximum ${limit} × ${MAX_BANNER_HEIGHT} pixels pour ce format.`)));
      } else {
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
      }
    };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error(tr('This image can\'t be read.', 'Cette image est illisible.'))); };
    image.src = url;
  });

  const statusLabel = status => ({
    pending: tr('Waiting for review', 'En attente de vérification'),
    approved: tr('Approved, joining the library', 'Validé, bientôt dans la bibliothèque'),
    published: tr('In the library', 'Dans la bibliothèque'),
    rejected: tr('Refused', 'Refusé'),
  })[status] || status;

  /* The account box on the library page. */
  const box = $('#accountBox');
  const renderBox = async () => {
    if (!box) return;
    box.hidden = !enabled;
    if (!enabled) return;
    if (!user) {
      box.innerHTML = `<p>${tr('Sign in with Discord to share your structures and banners right here.', 'Connecte-toi avec Discord pour partager tes structures et tes bannières directement ici.')}</p>
        <button class="pill" type="button" id="signIn">${tr('Sign in with Discord', 'Se connecter avec Discord')}</button>
        <p class="note">${tr('We only keep your Discord name and what you send.', 'On ne garde que ton nom Discord et ce que tu envoies.')} <a href="privacy.html">${tr('Privacy', 'Confidentialité')}</a></p>`;
      $('#signIn').addEventListener('click', signIn);
      return;
    }
    box.innerHTML = `<p>${tr('Signed in as', 'Connecté en tant que')} <b>${esc(displayName() || tr('player', 'joueur'))}</b>
        <button class="pill quiet" type="button" id="signOut">${tr('Sign out', 'Se déconnecter')}</button>
        ${admin ? `<a class="pill quiet" href="admin.html">${tr('Review files', 'Vérifier les envois')}</a>` : ''}</p>
      <h3>${tr('My files', 'Mes envois')}</h3><div class="my-files" id="myFiles"><p class="note">${tr('Loading…', 'Chargement…')}</p></div>`;
    $('#signOut').addEventListener('click', signOut);
    try {
      const entries = await mine();
      $('#myFiles').innerHTML = entries.length ? entries.map(entry => `<div class="my-file">
          <span><b>${esc(entry.name)}</b> · ${entry.kind === 'banner' ? tr('banner', 'bannière') : tr('structure', 'structure')}</span>
          <span class="status ${esc(entry.status)}">${statusLabel(entry.status)}${entry.reason ? ` : ${esc(entry.reason)}` : ''}</span>
          ${entry.status === 'pending' ? `<button class="pill quiet" type="button" data-withdraw="${entry.id}">${tr('Withdraw', 'Retirer')}</button>` : ''}
        </div>`).join('') : `<p class="note">${tr('Nothing sent yet.', 'Rien d\'envoyé pour l\'instant.')}</p>`;
      $('#myFiles').querySelectorAll('[data-withdraw]').forEach(button => button.addEventListener('click', async () => {
        const entry = entries.find(item => item.id === +button.dataset.withdraw);
        try { await withdraw(entry); } catch (error) { alert(error.message); }
        renderBox();
      }));
    } catch (error) {
      $('#myFiles').innerHTML = `<p class="note">${esc(error.message)}</p>`;
    }
  };

  /* The banner form shows once signed in; until then the share link stays. */
  const bannerForm = $('#bannerForm');
  const renderBannerForm = () => {
    if (!bannerForm) return;
    bannerForm.hidden = !(enabled && user);
    if (!enabled) return;
    // Once accounts are on, nothing goes through GitHub any more.
    $('#bannerShare').hidden = true;
    $('#bannerSignIn').hidden = Boolean(user);
    $('#bannerNote').textContent = tr('Sharing needs you to sign in with Discord. Your banner becomes public once an admin approves it. PNG up to 1280 pixels wide or GIF up to 600 pixels, 6 MB at most.', "Partager demande de te connecter avec Discord. Ta bannière devient publique une fois validée par un admin. PNG jusqu'à 1280 pixels de large ou GIF jusqu'à 600 pixels, 6 Mo maximum.");
    if (user && !$('#bannerAuthor').value) $('#bannerAuthor').value = displayName();
  };
  if (bannerForm) {
    $('#bannerSignIn').addEventListener('click', signIn);
    bannerForm.addEventListener('submit', async event => {
      event.preventDefault();
      const file = $('#bannerFile').files[0];
      const result = $('#bannerResult');
      const name = $('#bannerName').value.trim();
      try {
        if (!file) throw new Error(tr('Pick an image first.', 'Choisis d\'abord une image.'));
        if (!name) throw new Error(tr('Give your banner a name.', 'Donne un nom à ta bannière.'));
        await checkBanner(file);
        await send('banner', { name, author: $('#bannerAuthor').value.trim(), bytes: await file.arrayBuffer(), type: file.type });
        bannerForm.reset();
        result.textContent = tr('Sent! It joins the library once it has been reviewed.', 'Envoyé ! Elle rejoint la bibliothèque après vérification.');
        result.className = 'report';
        renderBox();
      } catch (error) {
        result.textContent = error.message;
        result.className = 'report bad';
      }
      result.hidden = false;
    });
  }

  if (enabled) {
    client.auth.onAuthStateChange(() => setTimeout(refresh, 0));
    listeners.push(renderBox, renderBannerForm);
    onLang(() => { renderBox(); renderBannerForm(); });
    refresh();
  } else if (box) {
    box.hidden = true;
  }

  return { enabled, client, signedIn: () => Boolean(user), isAdmin: () => admin, send, checkBanner, esc, statusLabel, onChange: listener => listeners.push(listener), refresh, signIn };
})();
