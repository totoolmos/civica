/**
 * Renderizado del mosaico de noticias — Civica
 */

document.addEventListener('DOMContentLoaded', () => {
  renderNews();
  setupNewsModal();
});

function renderNews() {
  const newsGrid = document.getElementById('newsGrid');
  if (!newsGrid) return;

  // Solo mostrar noticias publicadas (no borradores)
  const news = NewsManager.getAllNews().filter(a => !a.status || a.status === 'published');

  if (news.length === 0) {
    newsGrid.innerHTML = '<div class="news-empty">No hay noticias publicadas aún</div>';
    return;
  }

  newsGrid.innerHTML = news.map(article => {
    const excerpt = article.text
      ? article.text.replace(/<[^>]*>/g, '').substring(0, 120)
      : '';
    const hasMore = article.text && article.text.replace(/<[^>]*>/g, '').length > 120;

    return `
      <div class="news-card" onclick="openNewsModal(${article.id})" data-id="${article.id}">
        ${article.image ? `<div class="news-card-bg" style="background-image:url('${article.image}');"></div>` : ''}
        <div class="news-card-overlay"></div>
        <div class="news-card-content">
          ${article.tags?.length ? `
            <div class="news-card-tags">
              ${article.tags.map(t => `<span class="news-card-tag">${t}</span>`).join('')}
            </div>` : ''}
          ${article.urgente ? '<span style="background:var(--rust);color:#fff;padding:2px 6px;font-size:0.7rem;font-weight:bold;margin-bottom:5px;display:inline-block;">ÚLTIMO MOMENTO</span>' : ''}
          <span class="news-card-date">
            ${article.fecha || article.date} • ${article.autor || 'Redacción'} • ${article.lectura} min
          </span>
          <h3 class="news-card-title">${escapeHtml(article.title)}</h3>
          ${excerpt ? `<p class="news-card-excerpt">${escapeHtml(excerpt)}${hasMore ? '…' : ''}</p>` : ''}
        </div>
      </div>`;
  }).join('');
}

function setupNewsModal() {
  const modal = document.getElementById('newsModalOverlay');
  const closeBtn = document.getElementById('newsModalClose');
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', closeNewsModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeNewsModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeNewsModal(); });
}

function openNewsModal(newsId) {
  const article = NewsManager.getNewsById(newsId);
  if (!article) return;

  document.getElementById('newsModalTitle').textContent = article.title;

  const tagsEl = document.getElementById('newsModalTags');
  tagsEl.innerHTML = article.tags?.length
    ? article.tags.map(t => `<span class="news-modal-tag">${t}</span>`).join('')
    : '';

  let meta = `${article.fecha || article.date} • ${article.autor || 'Redacción'} • ${article.lectura || 1} min lectura`;
  if (article.urgente) meta = `🔥 ÚLTIMO MOMENTO | ${meta}`;
  document.getElementById('newsModalDate').textContent = meta;

  // Usar innerHTML para renderizar el contenido del editor WYSIWYG
  document.getElementById('newsModalText').innerHTML = article.text || '';

  const img = document.getElementById('newsModalImage');
  if (article.image) {
    img.src = article.image;
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }

  document.getElementById('newsModalOverlay').hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeNewsModal() {
  document.getElementById('newsModalOverlay').hidden = true;
  document.body.style.overflow = '';
}

function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

window.openNewsModal = openNewsModal;
window.closeNewsModal = closeNewsModal;

window.addEventListener('storage', e => {
  if (e.key === 'civica_news') renderNews();
});
