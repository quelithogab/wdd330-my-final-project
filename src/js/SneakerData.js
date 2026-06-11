export class SneakerData {
  constructor(sneakers) {
    this.sneakers = sneakers;
  }

  getAll() {
    return [...this.sneakers].sort(
      (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)
    );
  }

  findById(id) {
    return this.sneakers.find((sneaker) => sneaker.id === id);
  }

  filter({ brand = "all", query = "" }) {
    const normalizedQuery = query.trim().toLowerCase();

    return this.getAll().filter((sneaker) => {
      const matchesBrand = brand === "all" || sneaker.brand === brand;
      const searchableText = [
        sneaker.name,
        sneaker.brand,
        sneaker.colorway,
        sneaker.athlete
      ]
        .join(" ")
        .toLowerCase();

      return matchesBrand && searchableText.includes(normalizedQuery);
    });
  }
}
