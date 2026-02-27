// src/services/cache.js
class SearchCache {
  constructor(maxSize = 50) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  key(term, entity = "song") {
    return `${entity}:${term.toLowerCase()}`;
  }

  get(term, entity = "song") {
    return this.cache.get(this.key(term, entity));
  }

  set(term, data, entity = "song") {
    const k = this.key(term, entity);
    this.cache.set(k, data);

    // Remove oldest if exceeds maxSize
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  clear() {
    this.cache.clear();
  }
}

export const searchCache = new SearchCache();
