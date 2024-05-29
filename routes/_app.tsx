import { type PageProps } from "$fresh/server.ts";
import SubscribeBanner from "@/islands/SubscribeBanner.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Denotify</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <SubscribeBanner />
        <Component />
      </body>
    </html>
  );
}
