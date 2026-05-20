// はとどけい Service Worker — stale-while-revalidate(同一オリジンGETのみ)。
// 本番ビルドのみ登録(main.ts で import.meta.env.PROD ガード)。scope は配信パス配下に限定。
const CACHE = 'hato-dokei-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => e.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
  await self.clients.claim();
})()));

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    const network = fetch(req).then((res) => {
      if (res && res.status === 200 && res.type === 'basic') cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    return cached || (await network) || (req.mode === 'navigate' ? cache.match('index.html') : Response.error());
  })());
});
