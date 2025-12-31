// src/modules/types.ts
import type { RedisCache, LeaderElector } from "../services/index.js"; // or your Redis wrapper type
import type { Ellipsies } from "@similie/ellipsies";
// If you have an Ellipsies instance type, use it. Otherwise keep as `any` and tighten later.
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
  log: (msg: string, ...args: any[]) => void;
};

export type ModuleInitResult = {
  // Optional cleanup hook called on shutdown
  shutdown?: () => Promise<void> | void;
};

export interface HyphenModule {
  name: string;
  version?: string;

  // Called once per process on boot
  init(
    ctx: ModuleContext,
  ): Promise<ModuleInitResult | void> | (ModuleInitResult | void);
}

export type LoadedModule = {
  mod: HyphenModule;
  res?: ModuleInitResult | void;
};
