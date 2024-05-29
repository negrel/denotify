import { Handlers } from "$fresh/server.ts";
import { Config, config } from "@/lib/config.ts";

export interface State {
  config: Config;
  kv: Deno.Kv;
}

const kv = await Deno.openKv();

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = [
  function (_req, ctx) {
    ctx.state.config = config;
    ctx.state.kv = kv;

    return ctx.next();
  },
  async function (req, ctx) {
    const date = new Date();
    const response = await ctx.next();

    console.log(date.toISOString(), req.method, req.url, response.status);

    return response;
  },
];
