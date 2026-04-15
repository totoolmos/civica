/**
 * Renderizado del mosaico de noticias con filtro de etiquetas
 */

let activeTagFilter = null; // etiqueta activa para filtrar

document.addEventListener('DOMContentLoaded', () => {
  // renderTagFilter();  // ELIMINADO: botones de filtro de etiquetas
  renderNews();
  setupNewsModal();
});

function getAllUniqueTags() {
  const news = NewsManager.getAllNews();
  const tagsSet = new Set();
  
  news.forEach(article => {
    if (article.tags && Array.isArray(article.tags)) {
      article.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet).sort();
}

// ELIMINADO: Filtro de etiquetas - función renderTagFilter()
// function renderTagFilter() {
//   const filterContainer = document.getElementById('tagsFilter');
//   if (!filterContainer) return;
//   const tags = getAllUniqueTags();
//   if (tags.length === 0) {
//     filterContainer.innerHTML = '';
//     return;
//   }
//   filterContainer.innerHTML = tags.map(tag => `
//     <div class="tag-filter-chip ${activeTagFilter === tag ? 'active' : ''}" 
//          onclick="filterByTag('${tag}')">
//       ${tag}
//     </div>
//   `).join('');
// }

// ELIMINADO: Filtro de etiquetas - función filterByTag()
// function filterByTag(tag) {
//   if (activeTagFilter === tag) {
//     activeTagFilter = null;
//   } else {
//     activeTagFilter = tag;
//   }
//   renderTagFilter();
//   renderNews();
// }

function renderNews() {
  const newsGrid = document.getElementById('newsGrid');
  if (!newsGrid) return;

  let news = NewsManager.getAllNews();

  // Filtrar por etiqueta si hay un filtro activo
  if (activeTagFilter) {
    news = news.filter(article => {
      return article.tags && article.tags.includes(activeTagFilter);
    });
  }

  if (news.length === 0) {
    newsGrid.innerHTML = '<div class="news-empty">No hay noticias publicadas aún</div>';
    return;
  }

  newsGrid.innerHTML = news.map((article, index) => `
    <div class="news-card" onclick="openNewsModal(${article.id})" data-id="${article.id}">
      ${article.image ? `
        <div class="news-card-bg" style="background-image: url('${article.image}');"></div>
      ` : ''}
      <div class="news-card-overlay"></div>
      <div class="news-card-content">
        ${article.tags && article.tags.length > 0 ? `
          <div class="news-card-tags">
            ${article.tags.map(tag => `<span class="news-card-tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
        <span class="news-card-date">${article.date}</span>
        <h3 class="news-card-title">${escapeHtml(article.title)}</h3>
        ${article.text ? `
          <p class="news-card-excerpt">${escapeHtml(article.text.substring(0, 100))}${article.text.length > 100 ? '...' : ''}</p>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function setupNewsModal() {
  const modal = document.getElementById('newsModalOverlay');
  const closeBtn = document.getElementById('newsModalClose');

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', closeNewsModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeNewsModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeNewsModal();
  });
}

function openNewsModal(newsId) {
  const article = NewsManager.getNewsById(newsId);
  if (!article) return;

  const modal = document.getElementById('newsModalOverlay');
  const title = document.getElementById('newsModalTitle');
  const tagsContainer = document.getElementById('newsModalTags');
  const image = document.getElementById('newsModalImage');
  const date = document.getElementById('newsModalDate');
  const text = document.getElementById('newsModalText');

  title.textContent = article.title;

  // Renderizar tags
  if (article.tags && article.tags.length > 0) {
    tagsContainer.innerHTML = article.tags.map(tag => `
      <span class="news-modal-tag">${tag}</span>
    `).join('');
  } else {
    tagsContainer.innerHTML = '';
  }

  date.textContent = article.date;
  text.textContent = article.text || '';

  if (article.image) {
    image.src = article.image;
    image.style.display = 'block';
  } else {
    image.style.display = 'none';
  }

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeNewsModal() {
  const modal = document.getElementById('newsModalOverlay');
  modal.hidden = true;
  document.body.style.overflow = '';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Exponer globalmente
window.openNewsModal = openNewsModal;
window.closeNewsModal = closeNewsModal;

// Re-render cuando el NewsManager cambio (ej: desde admin panel en otra pestaña)
window.addEventListener('storage', (e) => {
  if (e.key === 'civica_news') {
    renderNews();
  }
});
