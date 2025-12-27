import type { UUID } from "../models/index.js";
import { Client } from "pg";

export type ListenerFragments = {
  id: number | UUID;
  station: number;
  date: string;
  table: string;
  schema: string;
  context: string;
};

export class SQLService {
  private static instance: SQLService;
  private readonly _client: Client;
  private listerCallbacks: {
    [key: string]: ((payload: ListenerFragments) => void)[];
  } = {};
  private constructor(
    private readonly _triggers: string[] = [],
    private readonly _listeners: Record<string, string> = {},
  ) {
    this._client = new Client({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
  }
  public get client(): Client {
    return this._client;
  }

  public static get i() {
    if (!this.instance) {
      throw new Error("SQLService not initialized. Call setup() first.");
    }
    return this.instance;
  }

  public static setup(
    triggers: string[] = [],
    listeners: Record<string, string> = {},
  ): SQLService {
    if (!SQLService.instance) {
      SQLService.instance = new SQLService(triggers, listeners);
    }
    return SQLService.instance;
  }

  public getStartTriggersSQL(): string[] {
    return this._triggers;
  }

  private listenToChannel = async (channel: string): Promise<void> => {
    const rawClient = this._client;
    if (!rawClient) {
      throw new Error(
        "Could not obtain PG raw client. Check TypeORM driver internals.",
      );
    }

    await rawClient.query(`LISTEN ${channel}`);
    console.log(`[PG-LISTENER] Listening for ${channel}`);
  };

  private applyClientListeners = (): void => {
    this.client.on("notification", async (msg: any) => {
      try {
        // console.log("Notification received:", msg);
        const payload = JSON.parse(msg.payload);
        for (const callback of this.listerCallbacks[payload.context] || []) {
          await callback(payload);
        }
      } catch (err) {
        console.error(`[PG-LISTENER] Failed to process payload:`, err);
      }
    });

    this.client.on("error", (err: any) => {
      console.error(`[PG-LISTENER] PG error, reconnecting in 5 seconds`, err);
      //   setTimeout(() => this.listenToChannel(channel), 5000);
    });
  };

  public seedTriggers = async (): Promise<void> => {
    const triggers = this.getStartTriggersSQL();
    await this._client.connect();
    for (const triggerSQL of triggers) {
      await this._client.query(triggerSQL);
    }

    for (const key of Object.keys(this._listeners)) {
      if (!this._listeners[key]) {
        continue;
      }
      await this.listenToChannel(this._listeners[key]);
    }
    this.applyClientListeners();
  };

  public addListener = async (
    key: string,
    cb: (payload: ListenerFragments) => void | Promise<void>,
  ): Promise<void> => {
    const channel = (this._listeners as any)[key];
    if (!channel) {
      return;
    }
    this.listerCallbacks[key] = this.listerCallbacks[key] || [];
    this.listerCallbacks[key].push(cb);
  };
}
