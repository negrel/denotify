import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";
import PaperAirplainIcon from "@/components/PaperAirplainIcon.tsx";
import Input from "@/components/Input.tsx";
import Button from "@/components/Button.tsx";
import pushChannel from "@/lib/api.ts";
import Alert from "@/components/Alert.tsx";

interface PushData {
  channels: string[];
  errors: string[];
}

async function render(
  ctx: FreshContext<State, PushData, PushData>,
  // deno-lint-ignore no-explicit-any
  errors: any[],
) {
  const hostname = ctx.url.hostname;
  const channels = new Set<string>();

  const subsIter = ctx.state.kv.list({
    "prefix": [hostname, "subscriptions"],
  });

  for await (const entry of subsIter) {
    channels.add(entry.key[2] as string);
  }

  return ctx.render({ channels: [...channels], errors });
}

export const handler: Handlers<PushData, State> = {
  GET(_req, ctx) {
    return render(ctx, []);
  },
  async POST(req, ctx) {
    const hostname = ctx.url.hostname;
    const formData = await req.formData();

    if (!formData.has("channel")) {
      return render(ctx, ["no channel specified"]);
    }

    const title = formData.get("title");
    const message = formData.get("message");
    const channel = formData.get("channel")!.toString();

    const { errors } = await pushChannel(ctx.state.kv, {
      hostname,
      channel,
      appServer: ctx.state.config.applicationServer,
    }, {
      title,
      body: message,
      channel,
    }, {});

    return render(ctx, errors.map((err) => err.toString()));
  },
};

export default function ({ data }: PageProps<PushData>) {
  return (
    <div className="mx-4 mt-8">
      <form
        method="POST"
        className="max-w-3xl mx-auto bg-slate-50 dark:bg-slate-900 p-4 rounded-lg shadow space-y-4"
      >
        <h1 className="font-bold text-lg text-center">Send a notification</h1>

        <div className="space-y-2">
          <Input
            label="Title:"
            type="text"
            id="title"
            name="title"
            placeholder="Your title..."
          />
        </div>
        <div className="space-y-2">
          <Input
            label="Message:"
            id="message"
            type="textarea"
            name="message"
            placeholder="Your message..."
          />
        </div>
        <div className="space-y-2">
          <label
            for="channel"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Channel:
          </label>
          <select
            id="channel"
            name="channel"
            className="p-2 border rounded w-full bg-slate-100 dark:bg-slate-900"
          >
            {data.channels.map((ch) => <option value={ch}>{ch}</option>)}
          </select>
        </div>
        <div className="space-y-2 flex justify-end">
          <Button variant="primary">
            <PaperAirplainIcon />
            Send
          </Button>
        </div>
        {data.errors.length > 0
          ? (
            <Alert>
              <p>Unexpected error(s) occurred:</p>
              <ul className="list-disc pl-4">
                {data.errors.map((err) => <li>{err}</li>)}
              </ul>
            </Alert>
          )
          : undefined}
      </form>
    </div>
  );
}
