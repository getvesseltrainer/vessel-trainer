/* The review page. The database only lets admins see other people's files, so this page shows nothing to anyone else. */
const reviewBox = $('#review');
const REVIEW_STATUSES = ['pending', 'approved', 'rejected', 'published'];
let reviewFilter = 'pending';

const renderReview = async () => {
  const { client, esc } = VesselAccount;
  if (!VesselAccount.enabled) {
    reviewBox.innerHTML = `<p class="sub">${tr('Accounts are not set up yet.', 'Les comptes ne sont pas encore configurés.')}</p>`;
    return;
  }
  if (!VesselAccount.signedIn()) {
    reviewBox.innerHTML = `<button class="pill" type="button" id="reviewSignIn">${tr('Sign in with Discord', 'Se connecter avec Discord')}</button>`;
    $('#reviewSignIn').addEventListener('click', VesselAccount.signIn);
    return;
  }
  if (!VesselAccount.isAdmin()) {
    reviewBox.innerHTML = `<p class="sub">${tr('This page is for the site admins.', 'Cette page est réservée aux admins du site.')}</p>`;
    return;
  }
  const { data, error } = await client.from('submissions').select('*').eq('status', reviewFilter).order('created_at', { ascending: true }).limit(100);
  if (error) {
    reviewBox.innerHTML = `<p class="sub">${esc(error.message)}</p>`;
    return;
  }
  const filters = REVIEW_STATUSES.map(status => `<button class="chip" type="button" data-status="${status}" aria-pressed="${status === reviewFilter}">${VesselAccount.statusLabel(status)}</button>`).join('');
  const cards = await Promise.all(data.map(async entry => {
    const { data: signed } = await client.storage.from('submissions').createSignedUrl(entry.file_path, 600);
    const url = signed ? signed.signedUrl : '';
    const preview = entry.kind === 'banner'
      ? `<img class="banner-image" src="${esc(url)}" alt="">`
      : `<p class="lib-stats">${tr('Structure file', 'Fichier de structure')}</p>`;
    return `<article class="lib-card review-card">
      ${preview}
      <div class="lib-body">
        <span class="lib-badge">${entry.kind === 'banner' ? tr('Banner', 'Bannière') : tr('Structure', 'Structure')}</span>
        <h2>${esc(entry.name)}</h2>
        <p>${esc(entry.description)}</p>
        <p class="lib-author">${tr('By', 'Par')} ${esc(entry.author)} · ${new Date(entry.created_at).toLocaleString(lang)}</p>
        ${entry.reason ? `<p class="note">${esc(entry.reason)}</p>` : ''}
        <div class="lib-actions">
          ${url ? `<a class="pill quiet" href="${esc(url)}" download>${tr('Download', 'Télécharger')}</a>` : ''}
          ${entry.status === 'pending' ? `<button class="pill" type="button" data-approve="${entry.id}">${tr('Approve', 'Valider')}</button>
          <button class="pill quiet" type="button" data-reject="${entry.id}">${tr('Refuse', 'Refuser')}</button>` : ''}
        </div>
      </div>
    </article>`;
  }));
  reviewBox.innerHTML = `<div class="chips review-filters">${filters}</div>
    <p class="note">${tr('Approved files are checked again and published to the library within 15 minutes.', 'Les envois validés sont revérifiés puis publiés dans la bibliothèque sous 15 minutes.')}</p>
    <div class="lib-grid">${cards.join('') || `<p class="sub">${tr('Nothing here.', 'Rien ici.')}</p>`}</div>`;
  reviewBox.querySelectorAll('[data-status]').forEach(button => button.addEventListener('click', () => { reviewFilter = button.dataset.status; renderReview(); }));
  const review = async (id, status, reason) => {
    const { error: failed } = await client.from('submissions').update({ status, reason: reason || null, reviewed_at: new Date().toISOString() }).eq('id', id);
    if (failed) alert(failed.message);
    renderReview();
  };
  reviewBox.querySelectorAll('[data-approve]').forEach(button => button.addEventListener('click', () => review(+button.dataset.approve, 'approved')));
  reviewBox.querySelectorAll('[data-reject]').forEach(button => button.addEventListener('click', () => {
    const reason = prompt(tr('Why? The sender sees this.', 'Pourquoi ? La personne verra ce message.'), '');
    if (reason !== null) review(+button.dataset.reject, 'rejected', reason.slice(0, 240));
  }));
};

if (reviewBox) {
  VesselAccount.onChange(renderReview);
  onLang(renderReview);
}
