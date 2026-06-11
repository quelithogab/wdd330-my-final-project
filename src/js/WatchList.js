const STORAGE_KEY = "sneaker-drop-tracker-watchlist";

export class WatchList {
  constructor() {
    this.items = new Set(this.load());
  }

  load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
      return [];
    }
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.items]));
  }

  toggle(id) {
    if (this.items.has(id)) {
      this.items.delete(id);
    } else {
      this.items.add(id);
    }

    this.save();
  }

  has(id) {
    return this.items.has(id);
  }

  count() {
    return this.items.size;
  }
}
