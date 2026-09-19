const CACHE_NAME = "hokka-shell-v4";

const SHARE_TARGET_PATH = "/share-target";
const SHARE_LANDING = "/transaction/new?shared=1";
// Mirrors SHARE_INBOX_PREFIX and the SharedFile shape in src/data/local/shareInbox.ts, and the
// database in src/lib/storage/idb.ts. A worker cannot import from the bundle, so they repeat here.
const SHARE_INBOX_PREFIX = "share.inbox.v1.";
const DB_NAME = "hokka";
const DB_STORE = "keyval";
const DB_VERSION = 1;

const APP_SHELL = [
  "/",
  "/transactions",
  "/transaction/new",
  "/filings",
  "/filings/new",
  "/search",
  "/settings",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/logo/favicon.svg",
  "/logo/logo-full.svg",
  "/logo/logo-maskable.svg",
  "/logo/icon-192.png",
  "/logo/icon-512.png",
  "/logo/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(APP_SHELL.map((path) => cache.add(path).catch(() => undefined))).then(() =>
          self.skipWaiting(),
        ),
      ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

function isPrecachedAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/logo/") ||
    url.pathname.startsWith("/ocr/") ||
    url.pathname.startsWith("/icons/")
  );
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    // A shared receipt lands on /transaction/new?shared=1, and offline that query string must
    // still resolve to the precached form rather than falling back to the dashboard.
    const route = await cache.match(request, { ignoreSearch: true });
    if (route) return route;
    const shell = await cache.match("/");
    if (shell) return shell;
    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(DB_STORE)) {
        request.result.createObjectStore(DB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function replaceShareInbox(files) {
  const database = await openDatabase();
  const sharedAt = new Date().toISOString();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(DB_STORE, "readwrite");
    const store = transaction.objectStore(DB_STORE);
    const existing = store.getAllKeys();
    existing.onsuccess = () => {
      for (const key of existing.result) {
        if (typeof key === "string" && key.startsWith(SHARE_INBOX_PREFIX)) store.delete(key);
      }
      files.forEach((file, index) => {
        const id = `${Date.now().toString(36)}-${index}`;
        store.put(
          {
            id,
            fileName: file.name || `Shared receipt ${index + 1}`,
            contentType: file.type || "application/octet-stream",
            sharedAt,
            blob: file,
          },
          `${SHARE_INBOX_PREFIX}${id}`,
        );
      });
    };
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

// The share sheet POSTs the file here. It is stashed for the page to pick up rather than handled
// in the worker, so compression and OCR still run where they always run, and it never leaves the
// device. The redirect turns the POST back into an ordinary navigation.
async function handleShare(request) {
  const landing = new URL("/transaction/new", self.location.origin);
  try {
    const form = await request.formData();
    const files = form.getAll("file").filter((entry) => entry instanceof File && entry.size > 0);
    if (files.length > 0) {
      await replaceShareInbox(files);
      return Response.redirect(new URL(SHARE_LANDING, self.location.origin).href, 303);
    }
  } catch {
    // A malformed share should still open the app, with an empty form to fill by hand.
  }
  return Response.redirect(landing.href, 303);
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.method === "POST" && url.pathname === SHARE_TARGET_PATH) {
    event.respondWith(handleShare(request));
    return;
  }

  if (request.method !== "GET") return;
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isPrecachedAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});

self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});
