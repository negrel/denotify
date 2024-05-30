import { Handler } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";
import { PushSubscription } from "@negrel/webpush";

// deno-lint-ignore no-explicit-any
export const handler: Handler<any, State> = async (req, ctx) => {
  const subscription: PushSubscription = await req.json();

  ctx.state.kv.set(
    ["subscriptions", "all", crypto.randomUUID()],
    subscription,
  );

  return new Response();
};
