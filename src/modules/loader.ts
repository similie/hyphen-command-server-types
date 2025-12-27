// src/modules/loader.ts
import type { HyphenModule, ModuleContext, LoadedModule } from "./types.js";

export async function loadModulesFromEnv(
  ctx: ModuleContext,
): Promise<LoadedModule[]> {
  const raw = process.env.HYPHEN_MODULES?.trim();
  if (!raw) return [];

  const specList = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const loaded: LoadedModule[] = [];

  for (const spec of specList) {
    // spec can be:
    // - "hyphen-rtsp-module"
    // - "@similie/hyphen-rtsp-module"
    // - "file:./dist/my-module.js" (dev)
    try {
      const imported = await import(spec);
      const candidate: HyphenModule =
        imported.default ?? imported.module ?? imported;

      if (
        !candidate ||
        typeof candidate.init !== "function" ||
        !candidate.name
      ) {
        ctx.log(`[modules] invalid module export: ${spec}`, { spec });
        continue;
      }

      ctx.log(`[modules] init ${candidate.name}`, {
        spec,
        version: candidate.version,
      });
      const res = await candidate.init(ctx);
      loaded.push({ mod: candidate, res });
      ctx.log(`[modules] ready ${candidate.name}`, { spec });
    } catch (e: any) {
      ctx.log(`[modules] failed to load: ${spec}`, {
        error: e?.message ?? String(e),
      });
    }
  }

  return loaded;
}

export async function shutdownModules(
  ctx: ModuleContext,
  loaded: LoadedModule[],
) {
  for (const { mod, res } of loaded) {
    try {
      res && (await res?.shutdown?.());
      ctx.log(`[modules] shutdown ${mod.name}`);
    } catch (e: any) {
      ctx.log(`[modules] shutdown failed ${mod.name}`, {
        error: e?.message ?? String(e),
      });
    }
  }
}
