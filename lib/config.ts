import { ApplicationServer, importVapidKeys } from "../../webpush/mod.ts";

export interface Config {
  vapidKeys: CryptoKeyPair;
  applicationServer: ApplicationServer;
}

const vapidKeys = await importVapidKeys({
  publicKey: JSON.parse(Deno.env.get("DENOTIFY_VAPID_PUBLIC_KEY")!),
  privateKey: JSON.parse(Deno.env.get("DENOTIFY_VAPID_PRIVATE_KEY")!),
}, { extractable: false });

export const config = {
  vapidKeys,
  applicationServer: await ApplicationServer.new({
    contactInformation: "mailto:alexandre@negrel.dev",
    vapidKeys,
  }),
};
