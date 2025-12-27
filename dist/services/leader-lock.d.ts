import { EventEmitter } from "events";
export type LeaderEvents = {
    elected: () => void;
    revoked: () => void;
    error: (err: Error) => void;
};
export declare class LeaderElector extends EventEmitter {
    private static instance;
    private redlock;
    private redis;
    private renewTimer?;
    private acquireTimer?;
    private lock?;
    private readonly lockKey;
    private readonly ttlMs;
    private readonly renewEveryMs;
    private readonly retryDelayMs;
    private readonly instanceId;
    private constructor();
    static get(): LeaderElector;
    init(redisUrl: string): void;
    /** Pure check: true only if we *currently* hold a live lock. */
    amLeader(): boolean;
    /** Stop loops and release if we are leader. */
    shutdown(): Promise<void>;
    private startAcquireLoop;
    private startRenewLoop;
    private safeRevoke;
    private safeRelease;
}
//# sourceMappingURL=leader-lock.d.ts.map