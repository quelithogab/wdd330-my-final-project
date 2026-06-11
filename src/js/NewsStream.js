export class NewsStream {
  constructor(container, services) {
    this.container = container;
    this.services = services;
  }

  async render(brand) {
    this.container.innerHTML = `<p class="muted">Loading ${brand} news...</p>`;

    const articles = await this.services.getNewsByBrand(brand);

    if (articles.length === 0) {
      this.container.innerHTML = `<p class="muted">No news available right now.</p>`;
      return;
    }

    this.container.innerHTML = articles
      .map(
        (article) => `
          <article class="news-card">
            <h3>${article.title}</h3>
            <p>${article.description ?? "Latest sneaker and streetwear update."}</p>
            <a href="${article.url}" target="_blank" rel="noreferrer">Read article</a>
          </article>
        `
      )
      .join("");
  }
}
