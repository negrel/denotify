const pushMessagesStoreName = "pushMessages";

function openDb() {
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

function commitTx(tx) {
  return new Promise((res, rej) => {
    tx.oncomplete = res;
    tx.onerror = () => rej(tx.error);
    tx.commit();
  });
}

function objectStoreAdd(objectStore, item, key) {
  return new Promise((res, rej) => {
    const addRequest = objectStore.add(item, key);
    addRequest.onerror = () => rej(addRequest.error);
    addRequest.onsuccess = res;
  });
}

let idb = null;

openDb().then((db) => {
  idb = db;
}).catch(console.error);

self.addEventListener("push", (e) => {
  const data = e.data.json();
  data.timestamp = Date.now();
  self.registration.showNotification(data.title, data);

  if (idb) {
    const tx = idb.transaction(pushMessagesStoreName, "readwrite");
    const objectStore = tx.objectStore(pushMessagesStoreName);
    objectStoreAdd(objectStore, data, new Date()).catch(console.error);
    commitTx(tx).catch(console.error);
  }
});
