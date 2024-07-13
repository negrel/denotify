import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";
import {
  listSubscribedChannels,
  subscribeDevice,
  unsubscribeDevice,
} from "@/lib/subscriptions.ts";
import ChannelsPage from "@/islands/ChannelsPage.tsx";

interface PageData {
  channels: Record<string, boolean>;
}

export const handler: Handlers<PageData, State> = {
  async GET(_req, ctx) {
    const channels: Record<string, boolean> = {};

    const iter = listSubscribedChannels(ctx.state.kv, {
      hostname: ctx.url.hostname,
      deviceUuid: ctx.state.deviceUuid,
    });

    for await (const ch of iter) {
      channels[ch] = true;
    }

    return ctx.render({ channels });
  },
  async POST(req, ctx) {
    const formData = await req.formData();

    if (!formData.has("denotify-subscription")) {
      return new Response("push subscription is missing", { status: 400 });
    }

    const channels: Record<string, boolean> = {};
    const subscription = JSON.parse(
      formData.get("denotify-subscription")!.toString(),
    );

    for (const key of formData.keys()) {
      if (formData.get(key) !== "true") {
        await unsubscribeDevice(ctx.state.kv, {
          hostname: ctx.url.hostname,
          channel: key,
          deviceUuid: ctx.state.deviceUuid,
        });
      } else {
        await subscribeDevice(ctx.state.kv, {
          hostname: ctx.url.hostname,
          channel: key,
          deviceUuid: ctx.state.deviceUuid,
          subscription,
        });

        channels[key] = true;
      }
    }

    return ctx.render({ channels });
  },
};

export default function ({ data }: PageProps<PageData>) {
  return <ChannelsPage channels={data.channels} />;
}
