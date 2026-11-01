// Hanko : notifications jeu fermé. Le jeu lui-même n'est pas mis en cache : il se charge toujours en ligne, dans sa dernière version.
// 2 nov. 2026 : les images en fichiers séparés (.webp, .jpg, .png du site) sont gardées : affichées tout de suite depuis le cache,
// puis remises à jour en arrière-plan (une image changée sous le même nom apparaît à la visite suivante)
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
const IMG = "hanko-img-v1";
self.addEventListener("fetch", e => { const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || !/\.(webp|jpe?g|png)$/i.test(u.pathname)) return;
  e.respondWith(caches.open(IMG).then(c => c.match(r, {ignoreSearch: true}).then(hit => { const net = fetch(r).then(res => { if (res && res.ok) c.put(r, res.clone()); return res; }).catch(() => hit);
    if (hit){ e.waitUntil(net); return hit; } return net; }))); });
self.addEventListener("push", e => { let d = {}; try { d = e.data.json(); } catch {}
  e.waitUntil(self.registration.showNotification(d.title || "Hanko", {body: d.body || "", tag: d.tag || "hanko", icon: "icone-192.png", badge: "icone-192.png", data: {tag: d.tag || ""}})); });
self.addEventListener("notificationclick", e => { e.notification.close(); const t = e.notification.data && e.notification.data.tag || "";
  const url = new URL("./", self.registration.scope).href + (t ? "#notif=" + encodeURIComponent(t) : "");
  e.waitUntil(self.clients.matchAll({type: "window", includeUncontrolled: true}).then(L => { const c = L[0]; if (c){ c.postMessage({notif: t}); return c.focus(); } return self.clients.openWindow(url); })); });
