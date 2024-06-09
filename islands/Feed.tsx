import { useEffect, useState } from "preact/hooks";
import { objectStoreGetAll, openDb, pushMessagesStoreName } from "@/lib/idb.ts";
import XMarkIcon from "@/components/XMarkIcon.tsx";

interface Notification {
  title?: string;
  message?: string;
  timestamp: number;
  channel: string;
}

export default function () {
  const [errors, setErrors] = useState<string[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    let pollNotifsTimer: number | null = null;
    (async () => {
      const db = await openDb()
        .catch((err) =>
          setErrors([
            ...errors,
            `Failed to open indexed db (${err.name}): ${err.message}`,
          ])
        );
      if (!db) return;

      const pollNotifs = async () => {
        const tx = db.transaction(pushMessagesStoreName);
        const objectStore = tx.objectStore(pushMessagesStoreName);
        const notifs = await objectStoreGetAll(objectStore) as Notification[];
        setNotifs(notifs.reverse());
      };
      pollNotifs();

      pollNotifsTimer = setInterval(pollNotifs, 1000);
    })();

    return () => {
      clearInterval(pollNotifsTimer ?? undefined);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 mx-auto max-w-xl p-4">
      {errors.map((err) => (
        <div className="rounded shadow bg-slate-50 dark:bg-slate-900 p-4">
          {err}
        </div>
      ))}
      {notifs.map(({ title, message, timestamp, channel }) => (
        <div className="rounded shadow bg-slate-50 dark:bg-slate-900 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs opacity-70">
              {new Date(timestamp).toLocaleString()}
            </span>
            <button onClick={console.log}>
              <XMarkIcon />
            </button>
          </div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className={message ? "" : "italic opacity-70"}>
            {message ? message : "No message."}
          </p>
          <p className="text-xs">
            <span className="font-bold">Channel</span>: {channel}
          </p>
        </div>
      ))}
    </div>
  );
}
