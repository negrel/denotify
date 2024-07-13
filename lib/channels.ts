export async function insertChannel(
  kv: Deno.Kv,
  { hostname, channel }: { hostname: string; channel: string },
) {
  const key = [hostname, "channels", channel];
  const res = await kv.atomic()
    .check({ key, versionstamp: null })
    .set(key, channel)
    .commit();

  if (!res.ok) {
    throw new ErrorChannelAlreadyExists("channel already exists");
  }
}

export async function* listChannels(kv: Deno.Kv, hostname: string) {
  const iter = kv.list<string>({
    prefix: [hostname, "channels"],
  });

  for await (const entry of iter) {
    yield entry.value;
  }
}

export async function deleteChannel(
  kv: Deno.Kv,
  { hostname, channel }: { hostname: string; channel: string },
) {
  const key = [hostname, "channels", channel];
  await kv.delete(key);
}

export class ErrorChannelAlreadyExists extends Error {}
