class CacheManager {
  private memoryCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly DEFAULT_TTL = 45000;

  async get<T>(key: string, ttl: number = this.DEFAULT_TTL): Promise<T | null> {
    const item = this.memoryCache.get(key);
    if (item && Date.now() - item.timestamp < ttl) {
      return item.data as T;
    }
    return null;
  }

  set(key: string, data: any): void {
    this.memoryCache.set(key, { data, timestamp: Date.now() });
    if (this.memoryCache.size > 50) {
      const oldestKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(oldestKey);
    }
  }

  clear(): void {
    this.memoryCache.clear();
  }
}

export const cacheManager = new CacheManager();
