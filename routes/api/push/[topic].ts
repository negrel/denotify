import { Handlers } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";
import { PushMessageError } from "../../../../webpush/mod.ts";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    const payload = await req.arrayBuffer();
    const topic = ctx.params["topic"];

    const entries = ctx.state.kv.list({
      "prefix": ["subscriptions", topic],
    });
    for await (const entry of entries) {
      const sub = ctx.state.config.applicationServer.subscribe(
        entry.value,
      );
      try {
        await sub.pushMessage(payload, {});
      } catch (err) {
        if ((err as PushMessageError).isGone()) {
          ctx.state.kv.delete([
            "preferences",
            topic,
            entry.key[entry.key.length - 1],
          ]);
        } else {
          console.error(err);
        }
      }
    }

    return new Response();
  },
};