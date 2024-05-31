import { Handler } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";
import { PushSubscription } from "@negrel/webpush";

// deno-lint-ignore no-explicit-any
export const handler: Handler<any, State> = async (req, ctx) => {
  const subscription: PushSubscription = await req.json();
  const channel = ctx.params["channel"];
  const hostname = ctx.url.hostname;

  ctx.state.kv.set(
    [hostname, "subscriptions", channel, crypto.randomUUID()],
    subscription,
  );

  return new Response();
};
