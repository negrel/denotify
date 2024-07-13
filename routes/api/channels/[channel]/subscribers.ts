import { Handlers } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";
import { PushSubscription } from "@negrel/webpush";
import { subscribeDevice, unsubscribeDevice } from "@/lib/subscriptions.ts";

export const handler: Handlers<void, State> = {
  async POST(req, ctx) {
    const subscription: PushSubscription = await req.json();
    const channel = ctx.params["channel"];
    const deviceUuid = ctx.state.deviceUuid;
    const hostname = ctx.url.hostname;

    await subscribeDevice(ctx.state.kv, {
      hostname,
      channel,
      deviceUuid,
      subscription,
    });

    return new Response();
  },

  async DELETE(_req, ctx) {
    const channel = ctx.params["channel"];
    const deviceUuid = ctx.state.deviceUuid;
    const hostname = ctx.url.hostname;

    await unsubscribeDevice(ctx.state.kv, { hostname, channel, deviceUuid });

    return new Response();
  },
};
