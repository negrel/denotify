import { useRef, useState } from "preact/hooks";
import Input from "@/components/Input.tsx";
import Button from "@/components/Button.tsx";
import * as pushSignals from "@/islands/signals/push.ts";

export interface ChannelsGridData {
  channels: Record<string, boolean>;
}

export default function (data: ChannelsGridData) {
  const [channels, setChannels] = useState(Object.entries(data.channels));

  const channelNameInput = useRef<HTMLInputElement>(null);

  return (
    <section className="relative p-4 overflow-y-auto max-w-4xl mx-auto w-full">
      <form
        method="POST"
        id="channels-form"
        className="w-full space-y-4"
        onSubmit={async (ev) => {
          ev.preventDefault();
          const subscription = await subscribe();
          const form = ev.target as HTMLFormElement;
          const subInput = form.querySelector(
            "#denotify-subscription",
          ) as HTMLInputElement;
          subInput.value = JSON.stringify(subscription);
          form.submit();
        }}
      >
        <input
          type="hidden"
          id="denotify-subscription"
          name="denotify-subscription"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map(([name, isSubscribed], i) => (
            <div
              key={i}
              className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-lg shadow flex flex-col justify-between"
            >
              <input
                type="text"
                className="w-full font-bold text-xl text-center text-black dark:text-white bg-slate-50 dark:bg-slate-900 outline-none"
                placeholder="channel-name"
                // deno-lint-ignore no-explicit-any
                onChange={(ev: any) => {
                  setChannels((channels) => {
                    const result = [...channels];
                    result[i] = [ev.target.value, isSubscribed];
                    return result;
                  });
                }}
                value={name}
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={isSubscribed ? "ghost" : "destructive"}
                  className="w-full"
                  onClick={() => {
                    setChannels((channels) => {
                      const result = [...channels];
                      result[i] = [name, !isSubscribed];
                      return result;
                    });
                  }}
                >
                  <label for={name} className="hover:cursor-pointer">
                    {isSubscribed ? "subscribed" : "unsubscribe"}
                  </label>
                </Button>
                <input
                  type="hidden"
                  id={name}
                  name={name}
                  value={JSON.stringify(isSubscribed)}
                />
              </div>
            </div>
          ))}
          <div className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-lg shadow space-y-4">
            <Input
              inputRef={channelNameInput}
              label="Channel name"
              type="text"
              placeholder="channel-name"
            />
            <Button
              type="button"
              variant="primary"
              className="w-full"
              onClick={() => {
                if (!channelNameInput.current) return;

                setChannels([
                  [channelNameInput.current.value, true],
                  ...channels,
                ]);
                channelNameInput.current.value = "";
              }}
            >
              Create
            </Button>
          </div>
        </div>
        <Button
          variant="primary"
          className="w-full"
        >
          Save
        </Button>
      </form>
    </section>
  );
}

export async function subscribe(): Promise<PushSubscription> {
  if (!("serviceWorker" in navigator)) {
    throw new Error("service worker not supported.");
  }

  const vapidKey = await fetch("/api/vapid").then((r) => r.json());
  console.debug("subscribe with vapid key", vapidKey);

  const register = await navigator.serviceWorker.register(
    "./sw.js",
    {
      scope: "/",
      type: "module",
    },
  );

  return new Promise((resolve) => {
    const onServiceWorkerActive = async () => {
      // Create a push subscription.
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      pushSignals.subscription.value = subscription;
      resolve(subscription);
    };

    const sw = register.active ?? register.waiting ?? register.installing;
    if (sw?.state === "activated") {
      onServiceWorkerActive();
    } else if (sw !== null) {
      sw.onstatechange = () => {
        if (sw.state === "activated") {
          onServiceWorkerActive();
        }
      };
    }
  });
}

function urlBase64ToUint8Array(b64: string) {
  const padding = "=".repeat((4 - (b64.length % 4)) % 4);
  const base64 = (b64 + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = globalThis.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
