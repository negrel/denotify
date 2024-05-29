import { Handlers } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    const entries = ctx.state.kv.list({ prefix: ["subscriptions", "all"] });
    const subscriptions: PushSubscription[] = [];
    for await (const entry of entries) {
      subscriptions.push(entry);
    }
    return ctx.render({ subscriptions });
  },
};

export default function Home(
  { data }: { data: { subscriptions: PushSubscription[] } },
) {
  return (
    <div class="min-h-screen">
      <h1>Subscriptions</h1>
      <p>
        Number of subscriptions: <span>{data.subscriptions.length}</span>
      </p>
      {data.subscriptions.map((el) => JSON.stringify(el))}
    </div>
  );
}