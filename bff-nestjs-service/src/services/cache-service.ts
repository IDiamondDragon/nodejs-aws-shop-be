import { Cache } from './cache';

class CacheService {
  caches: { [key: string]: Cache } = {};

  addCache(url: string, data: any) {
    this.caches[url] = new Cache(url, data);
  }

  findDataByUrl(url: string): Cache | undefined  {
    const cache = this.caches[url];

    return this.isCacheValid(url) ? cache.data : undefined;
  }

  isCacheValid(url: string): boolean {
    const cache = this.caches[url];

    return cache && cache.isValid();
  }

  destroyCache(url: string) {
    delete this.caches[url];
  }

}

export const cacheService = new CacheService();
