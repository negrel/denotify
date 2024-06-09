// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $_middleware from "./routes/_middleware.ts";
import * as $api_channels_channel_messages from "./routes/api/channels/[channel]/messages.ts";
import * as $api_channels_channel_subscribers from "./routes/api/channels/[channel]/subscribers.ts";
import * as $api_vapid from "./routes/api/vapid.ts";
import * as $channels from "./routes/channels.tsx";
import * as $feed from "./routes/feed.tsx";
import * as $index from "./routes/index.tsx";
import * as $push from "./routes/push.tsx";
import * as $settings from "./routes/settings.tsx";
import * as $AppBar from "./islands/AppBar.tsx";
import * as $Feed from "./islands/Feed.tsx";
import * as $NotificationsFeed from "./islands/NotificationsFeed.tsx";
import * as $SubscribeBanner from "./islands/SubscribeBanner.tsx";
import * as $signals_push from "./islands/signals/push.ts";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/_middleware.ts": $_middleware,
    "./routes/api/channels/[channel]/messages.ts":
      $api_channels_channel_messages,
    "./routes/api/channels/[channel]/subscribers.ts":
      $api_channels_channel_subscribers,
    "./routes/api/vapid.ts": $api_vapid,
    "./routes/channels.tsx": $channels,
    "./routes/feed.tsx": $feed,
    "./routes/index.tsx": $index,
    "./routes/push.tsx": $push,
    "./routes/settings.tsx": $settings,
  },
  islands: {
    "./islands/AppBar.tsx": $AppBar,
    "./islands/Feed.tsx": $Feed,
    "./islands/NotificationsFeed.tsx": $NotificationsFeed,
    "./islands/SubscribeBanner.tsx": $SubscribeBanner,
    "./islands/signals/push.ts": $signals_push,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
