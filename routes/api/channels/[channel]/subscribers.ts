import { Handlers } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";
import { PushSubscription } from "@negrel/webpush";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    const subscription: PushSubscription = await req.json();
    const channel = ctx.params["channel"];
    const hostname = ctx.url.hostname;

    ctx.state.kv.set(
      [hostname, "subscriptions", channel, subscription.endpoint],
      subscription,
    );

    return new Response();
  },

  async DELETE(req, ctx) {
    const subscription: PushSubscription = await req.json();
    const channel = ctx.params["channel"];
    const hostname = ctx.url.hostname;

    await ctx.state.kv.delete([
      hostname,
      "subscriptions",
      channel,
      subscription.endpoint,
    ]);

    return new Response();
  },
};
