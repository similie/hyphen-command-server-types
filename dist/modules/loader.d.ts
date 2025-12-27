import type { ModuleContext, LoadedModule } from "./types";
export declare function loadModulesFromEnv(ctx: ModuleContext): Promise<LoadedModule[]>;
export declare function shutdownModules(ctx: ModuleContext, loaded: LoadedModule[]): Promise<void>;
//# sourceMappingURL=loader.d.ts.map