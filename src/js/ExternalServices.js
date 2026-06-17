const NEWS_API_URL = "https://newsapi.org/v2/everything";
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

export class ExternalServices {
  async getSneakers() {
    const response = await fetch(new URL("../data/sneakers.json", import.meta.url));

    if (!response.ok) {
      throw new Error("Unable to load local sneaker catalog.");
    }

    return await response.json();
  }

  async getNewsByBrand(brand) {
    if (!NEWS_API_KEY || NEWS_API_KEY === "PASTE_YOUR_NEWSAPI_KEY_HERE") {
      return this.getFallbackNews(brand);
    }

    try {
      const url = new URL(NEWS_API_URL);
      url.searchParams.set("q", `${brand} sneakers OR streetwear`);
      url.searchParams.set("language", "en");
      url.searchParams.set("pageSize", "3");
      url.searchParams.set("sortBy", "publishedAt");
      url.searchParams.set("apiKey", NEWS_API_KEY);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("NewsAPI request failed.");
      }

      const data = await response.json();
      return data.articles ?? [];
    } catch (error) {
      console.warn("NewsAPI unavailable. Showing fallback news.", error);
      return this.getFallbackNews(brand);
    }
  }

  getFallbackNews(brand) {
    return [
      {
        title: `${brand} release calendar updates`,
        description:
          "Watch official brand channels for launch timing, raffle windows, and regional release changes.",
        url: "https://www.soleretriever.com/"
      },
      {
        title: `${brand} resale market watch`,
        description:
          "Demand often changes by size, colorway, collaboration history, and early stock numbers.",
        url: "https://stockx.com/news/"
      },
      {
        title: "Streetwear styling notes",
        description:
          "Neutral palettes, wide-leg denim, and technical outerwear remain common styling choices for current sneaker drops.",
        url: "https://www.highsnobiety.com/"
      }
    ];
  }
}
