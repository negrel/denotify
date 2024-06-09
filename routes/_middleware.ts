import { Config, config } from "@/lib/config.ts";
import { FreshContext } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";

export interface State {
  config: Config;
  kv: Deno.Kv;
  deviceUuid: string;
}

const kv = await Deno.openKv();

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
  // Access logs.
  async function (req: Request, ctx: FreshContext<State>) {
    const date = new Date();
    const response = await ctx.next();

    console.log(
      date.toISOString(),
      req.method,
      req.url,
      response.status,
      ctx.state.deviceUuid,
    );

    return response;
  },
];
