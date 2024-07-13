import {
  ApplicationServer,
  PushMessageError,
  PushMessageOptions,
  PushSubscription,
} from "@negrel/webpush";

const encoder = new TextEncoder();

export default async function pushChannel(
  kv: Deno.Kv,
  { hostname, channel, appServer }: {
    hostname: string;
    channel: string;
    appServer: ApplicationServer;
  },
  // deno-lint-ignore no-explicit-any
  payload: any,
  pushOptions: PushMessageOptions,
) {
  const pushMessageErrors: PushMessageError[] = [];
  let ok = 0;
  let gone = 0;

  const entries = kv.list({
    "prefix": [hostname, "subscriptions", channel],
  });
  for await (const entry of entries) {
    const sub = appServer.subscribe(
      entry.value as PushSubscription,
    );
    try {
      await sub.pushMessage(
        encoder.encode(JSON.stringify(payload)),
        pushOptions,
      );
      ok++;
    } catch (err) {
      if (err instanceof PushMessageError) {
        if (err.isGone()) {
          kv.delete([
            hostname,
            "subscriptions",
            channel,
            entry.key[entry.key.length - 1],
          ]);
          gone++;
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

  return {
    ok,
    gone,
    errors: pushMessageErrors,
  };
}
