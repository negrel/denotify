export const pushMessagesStoreName = "pushMessages";

export function openDb(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const openRequest = globalThis.indexedDB.open("denotify", 1);
    openRequest.onerror = () => rej(openRequest.error);

    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      db.createObjectStore("pushMessages");
    };

    openRequest.onsuccess = () => {
      res(openRequest.result);
    };
  });
}

export function commitTx(tx: IDBTransaction) {
  return new Promise((res, rej) => {
    tx.oncomplete = res;
    tx.onerror = () => rej(tx.error);
    tx.commit();
  });
}

export function objectStoreAdd(
  objectStore: IDBObjectStore,
  // deno-lint-ignore no-explicit-any
  value: any,
  key?: IDBValidKey | undefined,
) {
  return new Promise((res, rej) => {
    const addRequest = objectStore.add(value, key);
    addRequest.onerror = () => rej(addRequest.error);
    addRequest.onsuccess = res;
  });
}

export function objectStoreGetAll(objectStore: IDBObjectStore) {
  return new Promise((res, rej) => {
    const getAllRequest = objectStore.getAll();
    getAllRequest.onerror = () => rej(getAllRequest.error);
    getAllRequest.onsuccess = () => res(getAllRequest.result);
  });
}
