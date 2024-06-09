import { type PageProps } from "$fresh/server.ts";
import TopBar from "@/components/TopBar.tsx";
import AppBar from "@/islands/AppBar.tsx";
import SubscribeBanner from "@/islands/SubscribeBanner.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="https://deno.news/favicon.ico" />
        <link
          rel="shortcut icon"
          href="https://deno.news/favicon.ico"
          type="image/x-icon"
        />
        <title>Denotify</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body className="h-screen dark:bg-slate-950 dark:text-slate-50 bg-slate-100 text-black flex portrait:flex-col landscape:flex-row-reverse">
        <div className="w-full h-full">
          <TopBar />
          <SubscribeBanner />
          <Component />
        </div>
        <AppBar />
      </body>
    </html>
  );
}
