export declare class RedisCache {
    private static client;
    private static DEFAULT_EXPIRATION_SECONDS;
    /**
     * Initializes the Redis client. Call this once on server startup.
     */
    static init(): Promise<void>;
    /**
     * Caches an object under a specified key.
     * @param key The cache key.
     * @param value The object to cache.
     * @param expirationSeconds Optional expiration time in seconds (defaults to 15 minutes).
     */
    static set(key: string, value: any, expirationSeconds?: number): Promise<void>;
    /**
     * Retrieves a cached object by its key.
     * @param key The cache key.
     * @returns The cached object, or null if not found.
     */
    static get<T>(key: string): Promise<T | null>;
    /**
     * Deletes a cache entry.
     * @param key The cache key.
     */
    static del(key: string): Promise<void>;
}
//# sourceMappingURL=redis.d.ts.map