import { Config, config } from "@/lib/config.ts";
import { FreshContext } from "$fresh/server.ts";

export interface State {
  config: Config;
  kv: Deno.Kv;
}

const kv = await Deno.openKv();

export const handler = [
  function (_req: Request, ctx: FreshContext<State>) {
    ctx.state.config = config;
    ctx.state.kv = kv;

    return ctx.next();
  },
  async function (req: Request, ctx: FreshContext<State>) {
    const date = new Date();
    const response = await ctx.next();

    console.log(date.toISOString(), req.method, req.url, response.status);

    return response;
  },
];
