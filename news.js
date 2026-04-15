/**
 * Capa de datos para gestionar noticias
 * Guarda en localStorage bajo "labola_news"
 */

const NewsManager = {
  STORAGE_KEY: 'civica_news',

  // Obtener todas las noticias
  getAllNews() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Agregar noticia
  addNews(title, text, imageBase64, tags = []) {
    const news = this.getAllNews();
    const newArticle = {
      id: Date.now(),
      title: title.trim(),
      text: text.trim(),
      image: imageBase64,
      tags: Array.isArray(tags) ? tags : [],
      date: new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
    news.unshift(newArticle); // agregar al principio
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(news));
    return newArticle;
  },

  // Eliminar noticia por ID
  deleteNews(id) {
    let news = this.getAllNews();
    news = news.filter(article => article.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(news));
  },

  // Obtener noticia por ID
  getNewsById(id) {
    const news = this.getAllNews();
    return news.find(article => article.id === id);
  },

  // Actualizar noticia existente
  updateNews(id, title, text, imageBase64, tags = []) {
    let news = this.getAllNews();
    const index = news.findIndex(article => article.id === id);
    
    if (index === -1) return null; // noticia no encontrada
    
    // Mantener id y fecha original
    news[index] = {
      ...news[index],
      title: title.trim(),
      text: text.trim(),
      image: imageBase64 || news[index].image,
      tags: Array.isArray(tags) ? tags : []
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(news));
    return news[index];
  },

  // Limpiar todas las noticias (para testing)
  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
};

// Exponer globalmente
window.NewsManager = NewsManager;
