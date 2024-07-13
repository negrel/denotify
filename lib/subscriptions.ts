import { PushSubscription } from "@negrel/webpush";

export async function subscribeDevice(
  kv: Deno.Kv,
  { hostname, channel, deviceUuid, subscription }: {
    hostname: string;
    channel: string;
    deviceUuid: string;
    subscription: PushSubscription;
  },
) {
  const primaryKey = [hostname, "subscriptions", channel, deviceUuid];
  const secondaryKey = [hostname, "deviceChannels", deviceUuid, channel];
  const res = await kv.atomic()
    .set(primaryKey, subscription)
    .set(secondaryKey, channel)
    .commit();

  if (!res.ok) {
    throw new Error("commit to add subscriptions and device failed");
  }
}

export async function unsubscribeDevice(
  kv: Deno.Kv,
  { hostname, channel, deviceUuid }: {
    hostname: string;
    channel: string;
    deviceUuid: string;
  },
) {
  const primaryKey = [hostname, "subscriptions", channel, deviceUuid];
  const secondaryKey = [hostname, "deviceChannels", deviceUuid, channel];
  const res = await kv.atomic()
    .delete(primaryKey)
    .delete(secondaryKey)
    .commit();

  if (!res.ok) {
    throw new Error("commit to delete subscriptions and device failed");
  }
}

export async function* listSubscribedChannels(
  kv: Deno.Kv,
  { hostname, deviceUuid }: { hostname: string; deviceUuid: string },
) {
  const iter = kv.list({
    prefix: [hostname, "deviceChannels", deviceUuid],
  });

  for await (const entry of iter) {
    yield entry.key[3] as string;
  }
}
