import { Handlers } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";
import {
  PushMessageError,
  PushMessageOptions,
  PushSubscription,
  Urgency,
} from "@negrel/webpush";

const encoder = new TextEncoder();

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    const payload = await req.json();
    const channel = ctx.params["channel"];
    const hostname = ctx.url.hostname;
    const queryParams = ctx.url.searchParams;

    // Adds channel to payload.
    payload.channel = channel;

    const pushOptions: PushMessageOptions = {};

    if (queryParams.has("urgency")) {
      pushOptions.urgency = queryParams.get("urgency") as Urgency;
    }
    if (queryParams.has("ttl")) {
      pushOptions.ttl = Number.parseInt(queryParams.get("ttl")!);
    }
    if (queryParams.has("topic")) {
      pushOptions.topic = queryParams.get("topic") as string;
    }

    const pushMessageErrors: PushMessageError[] = [];
    let subscribersOk = 0;

    const entries = ctx.state.kv.list({
      "prefix": [hostname, "subscriptions", channel],
    });
    for await (const entry of entries) {
      const sub = ctx.state.config.applicationServer.subscribe(
        entry.value as PushSubscription,
      );
      try {
        await sub.pushMessage(
          encoder.encode(JSON.stringify(payload)),
          pushOptions,
        );
        subscribersOk++;
      } catch (err) {
        if (err instanceof PushMessageError) {
          if (err.isGone()) {
            ctx.state.kv.delete([
              hostname,
              "subscriptions",
              channel,
              entry.key[entry.key.length - 1],
            ]);
          } else if (err.response.status === 400) {
            return err.response;
          } else {
            (err.response as Response).text().then((body) =>
              console.error(err.toString(), err, body)
            ).catch(() => console.error(err.toString(), err));
          }
          pushMessageErrors.push(err);
        } else {
          throw err;
        }
      }
    }

    return Response.json(
      JSON.stringify({
        messagesPushed: {
          ok: subscribersOk,
          errorsCount: pushMessageErrors.length,
          errors: pushMessageErrors.map((err) => err.toString()),
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
};
