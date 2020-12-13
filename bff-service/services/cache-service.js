const Cache = require('./cache');

class CacheService {
  caches = {};

  addCache(url, data) {
    this.caches[url] = new Cache(url, data);
  }

  findDataByUrl(url) {
    const cache = this.caches[url];

    return this.isCacheValid(url) ? cache.data : undefined;
  }

  isCacheValid(url) {
    const cache = this.caches[url];

    return cache && cache.isValid();
  }

  destroyCache(url) {
    delete this.caches[url];
  }

}

module.exports = new CacheService();
