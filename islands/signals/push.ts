import { Signal, signal } from "@preact/signals";

export const subscription: Signal<PushSubscription | null> = signal(null);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.ready.then(async (registration) => {
    const pushSubscription = await registration.pushManager.getSubscription();
    subscription.value = pushSubscription;
  });
}
