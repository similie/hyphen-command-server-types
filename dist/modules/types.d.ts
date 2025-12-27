import type { RedisCache, LeaderElector } from "../services";
import type { Ellipsies } from "@similie/ellipsies";
export type EllipsiesInstance = Ellipsies;
export type CommandCenterSystemIdentity = {
    name: string;
    identity: string;
    host: string;
    port: number;
};
export type ModuleContext = {
    ellipsies: EllipsiesInstance;
    redis: typeof RedisCache;
    leader: LeaderElector;
    identity?: CommandCenterSystemIdentity;
    log: (msg: string, extra?: Record<string, any>) => void;
};
export type ModuleInitResult = {
    shutdown?: () => Promise<void> | void;
};
export interface HyphenModule {
    name: string;
    version?: string;
    init(ctx: ModuleContext): Promise<ModuleInitResult | void> | (ModuleInitResult | void);
}
export type LoadedModule = {
    mod: HyphenModule;
    res?: ModuleInitResult | void;
};
//# sourceMappingURL=types.d.ts.map