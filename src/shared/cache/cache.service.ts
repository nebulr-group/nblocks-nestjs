import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly CACHE_TTL_S = 30;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<Type>(
    type: string,
    keys: Record<string, string>,
  ): Promise<{ exists: boolean; data: Type }> {
    const response = { exists: false, data: undefined };
    try {
      const cacheData = await this.cacheManager.get<Type>(
        this._createCacheKey(type, keys),
      );
      if (!!cacheData) {
        response.exists = true;
        response.data = cacheData;
      }
    } catch (error) {}

    return response;
  }

  async set(
    type: string,
    keys: Record<string, string>,
    data: unknown,
  ): Promise<void> {
    try {
      await this.cacheManager.set(this._createCacheKey(type, keys), data, {
        ttl: this.CACHE_TTL_S,
      });
    } catch (error) {}
  }

  private _createCacheKey(type: string, keys: Record<string, string>): string {
    return `${type}/${JSON.stringify(keys)}`;
  }
}
