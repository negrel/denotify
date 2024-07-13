import { Config, config } from "@/lib/config.ts";
import { FreshContext } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import bunyan from "bunyan";

export interface State {
  config: Config;
  kv: Deno.Kv;
  deviceUuid: string;
}

const kv = await Deno.openKv("./deno.kv");
const logger = bunyan.createLogger({ name: "access_log" });

export const handler = [
  // Global server state.
  function (_req: Request, ctx: FreshContext<State>) {
    ctx.state.config = config;
    ctx.state.kv = kv;

    return ctx.next();
  },
  // Device ID.
  async function (req: Request, ctx: FreshContext<State>) {
    const cookies = getCookies(req.headers);
    ctx.state.deviceUuid = cookies["device_id"];
    if (ctx.state.deviceUuid === undefined) {
      ctx.state.deviceUuid = crypto.randomUUID();
    }

    const resp = await ctx.next().then((r) => r.clone());
    if (resp.ok) { // headers are immutable on redirect.
      setCookie(resp.headers, {
        name: "device_id",
        value: ctx.state.deviceUuid,
        domain: ctx.url.hostname,
        httpOnly: true,
        sameSite: "Strict",
        maxAge: Number.MAX_SAFE_INTEGER,
      });
    }

    return resp;
  },
  async function accessLog(req: Request, ctx: FreshContext) {
    const start = performance.now();

    const ua = req.headers.get("User-Agent");

    const resp = await ctx.next();

    const durationMs = performance.now() - start;
    logger.info({
      "duration_ms": durationMs,
      "user_agent": ua,
      "path": ctx.url.pathname + "?" + ctx.url.searchParams.toString(),
      "status": resp.status,
      "source_ip": ctx.remoteAddr.hostname,
      "device_id": ctx.state.deviceUuid,
    }, "request handled");

    return resp;
  },
];
