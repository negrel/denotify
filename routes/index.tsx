import { Handlers } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";

export const handler: Handlers<void, State> = {
  GET(_req, ctx) {
    return Response.redirect(`${ctx.url.origin}/feed`);
  },
};
