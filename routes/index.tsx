import { Handlers } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  GET(_req, ctx) {
    return Response.redirect(`${ctx.url.origin}/feed`);
  },
};
