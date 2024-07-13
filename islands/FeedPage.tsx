import { useEffect, useState } from "preact/hooks";
import { objectStoreGetAll, openDb, pushMessagesStoreName } from "@/lib/idb.ts";
import XMarkIcon from "@/components/XMarkIcon.tsx";

interface Notification {
  title?: string;
  body?: string;
  timestamp: number;
  channel: string;
  key: string;
}

export default function () {
  const [errors, setErrors] = useState<string[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [db, setDb] = useState<IDBDatabase | null>(null);

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
      setDb(db);

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
    <section className="w-full h-full flex flex-col">
      <div className="space-y-4 mx-auto max-w-xl p-4 w-full">
        {errors.map((err) => (
          <div className="rounded shadow bg-slate-50 dark:bg-slate-900 p-4">
            {err}
          </div>
        ))}
        {notifs.map(({ title, body, timestamp, channel, key }, i) => (
          <div className="rounded shadow bg-slate-50 dark:bg-slate-900 p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-70">
                {new Date(timestamp).toLocaleString()}
              </span>
              <button
                onClick={() => {
                  if (!db) return;
                  const tx = db.transaction(pushMessagesStoreName, "readwrite");
                  const objectStore = tx.objectStore(pushMessagesStoreName);
                  const delRequest = objectStore.delete(key);
                  delRequest.onerror = console.error;
                  delRequest.onsuccess = () => {
                    setNotifs(notifs.slice(0, i).concat(notifs.slice(i + 1)));
                  };
                }}
              >
                <XMarkIcon />
              </button>
            </div>
            <h2
              className={title
                ? "text-xl font-bold"
                : "text-xl font-bold italic opacity-60"}
            >
              {title ? title : "No title."}
            </h2>
            <p className={body ? "" : "italic opacity-70"}>
              {body ? body : "No message."}
            </p>
            <p className="text-xs">
              <span className="font-bold">Channel</span>: {channel}
            </p>
          </div>
        ))}
      </div>
      {notifs.length === 0
        ? (
          <div className="flex-1 h-full flex justify-center items-center">
            <span className="opacity-70 italic">
              No notification received
            </span>
          </div>
        )
        : undefined}
    </section>
  );
}
