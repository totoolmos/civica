const NewsManager = {
  STORAGE_KEY: 'civica_news',

  getAllNews() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  addNews(title, text, image, tags, fecha, impacto, autor, lectura, urgente, status = 'published') {
    const news = this.getAllNews();
    const finalDate = fecha || new Date().toISOString().split('T')[0];
    const estimatedTime = lectura || Math.max(1, Math.ceil(text.replace(/<[^>]*>/g, '').split(' ').length / 200));

    const newArticle = {
      id: Date.now(),
      title: title.trim(),
      text: text.trim(), // Contenido con HTML del editor
      image: image,
      tags: tags || [],
      fecha: finalDate,
      impacto: impacto || 'medium',
      autor: autor || 'Redacción',
      lectura: estimatedTime,
      urgente: urgente || false,
      status: status 
    };
    news.unshift(newArticle);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(news));
    return newArticle;
  },

  updateNews(id, title, text, image, tags, fecha, impacto, autor, lectura, urgente, status = 'published') {
    let news = this.getAllNews();
    const idx = news.findIndex(n => n.id === id);
    if (idx === -1) return;

    const estimatedTime = lectura || Math.max(1, Math.ceil(text.replace(/<[^>]*>/g, '').split(' ').length / 200));

    news[idx] = {
      ...news[idx],
      title: title.trim(),
      text: text.trim(),
      image: image || news[idx].image,
      fecha: fecha || news[idx].fecha,
      impacto: impacto,
      autor: autor,
      lectura: estimatedTime,
      urgente: urgente,
      status: status
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(news));
  },

  deleteNews(id) {
    let news = this.getAllNews();
    news = news.filter(n => n.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(news));
  },

  getNewsById(id) {
    return this.getAllNews().find(n => n.id === id);
  }
};
