import { Handlers } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";
import { deleteChannel } from "@/lib/channels.ts";

export const handler: Handlers<void, State> = {
  async DELETE(_req, ctx) {
    const channel = ctx.params["channel"];
    await deleteChannel(ctx.state.kv, { hostname: ctx.url.hostname, channel });

    return new Response();
  },
};
