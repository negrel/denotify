import { useState } from "preact/hooks";

import { Button } from "@/components/Button.tsx";
import * as pushSignals from "@/islands/signals/push.ts";

export default function () {
  const [isClosed, setClosed] = useState(false);

  if (isClosed || pushSignals.subscription.value !== null) return <></>;

  return (
    <div className="flex items-center justify-between p-2">
      <span>
        This device is not subscribed.
      </span>
      <div className="space-x-2">
        <Button onClick={subscribe}>
          Subscribe
        </Button>
        <Button onClick={() => setClosed(true)}>X</Button>
      </div>
    </div>
  );
}

export async function subscribe() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("service worker not supported.");
  }

  const vapidKey = await fetch("/api/vapid").then((r) => r.json());
  console.log("subscribe", vapidKey);

  const register = await navigator.serviceWorker.register(
    "./sw.js",
    {
      scope: "/",
    },
  );

  const onServiceWorkerActive = async () => {
    // Create a push subscription.
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    // Send subscription to server.
    const response = await fetch("/api/channels/all/subscribers", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "content-type": "application/json",
      },
    });
    if (!response.ok) {
      console.error("failed to send subscription");
      await subscription.unsubscribe();
      return;
    }

    pushSignals.subscription.value = subscription;
  };

  const sw = register.active ?? register.waiting ?? register.installing;
  if (sw?.state === "activated") {
    await onServiceWorkerActive();
  } else if (sw !== null) {
    sw.onstatechange = () => {
      if (sw.state === "activated") {
        onServiceWorkerActive();
      }
    };
  }
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
