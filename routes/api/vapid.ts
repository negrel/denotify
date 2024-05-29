import { FreshContext } from "$fresh/server.ts";
import { encodeBase64Url } from "$std/encoding/base64url.ts";
import { State } from "@/routes/_middleware.ts";

export const handler = async (
  _req: Request,
  ctx: FreshContext<State>,
): Promise<Response> => {
  const publicKey = encodeBase64Url(
    await crypto.subtle.exportKey(
      "raw",
      ctx.state.config.vapidKeys.publicKey,
    ),
  );

  return new Response(JSON.stringify(publicKey), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
