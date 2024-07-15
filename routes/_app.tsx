import { type PageProps } from "$fresh/server.ts";
import TopBar from "@/components/TopBar.tsx";
import AppBar from "@/islands/AppBar.tsx";

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
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="h-dvh dark:bg-slate-950 dark:text-slate-50 bg-slate-100 text-black flex portrait:flex-col landscape:flex-row-reverse">
        <div className="w-full h-full flex flex-col overflow-y-auto">
          <TopBar />
          <Component />
        </div>
        <AppBar />
      </body>
    </html>
  );
}
