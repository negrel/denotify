import { Handlers } from "$fresh/server.ts";
import { insertChannel, listChannels } from "@/lib/channels.ts";
import { State } from "@/routes/_middleware.ts";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    const channels: string[] = [];
    for await (
      const channel of listChannels(ctx.state.kv, ctx.url.hostname)
    ) {
      channels.push(channel);
    }

    return Response.json(channels);
  },
  async POST(req, ctx) {
    let channel;
    try {
      const body = await req.json();
      channel = body.name;
    } catch (err) {
      return new Response(err, { status: 400 });
    }

    try {
      await insertChannel(ctx.state.kv, {
        hostname: ctx.url.hostname,
        channel,
      });
    } catch (err) {
      return new Response(err, { status: 400 });
    }

    return new Response();
  },
};
