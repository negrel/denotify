import { Handlers } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";
import { PushMessageError, PushMessageOptions, Urgency } from "@negrel/webpush";
import pushChannel from "@/lib/api.ts";

export const handler: Handlers<void, State> = {
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

    const { ok, gone, errors } = await pushChannel(
      ctx.state.kv,
      {
        hostname,
        channel,
        appServer: ctx.state.config.applicationServer,
      },
      payload,
      pushOptions,
    );

    return Response.json(
      JSON.stringify({
        messagesPushed: {
          ok,
          gone,
          errorsCount: errors.length,
          errors: errors.map((err: PushMessageError) => err.toString()),
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
