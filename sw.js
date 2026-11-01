// Hanko : notifications jeu fermé. Pas de mise en cache : le jeu se charge toujours en ligne, dans sa dernière version.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("push", e => { let d = {}; try { d = e.data.json(); } catch {}
  e.waitUntil(self.registration.showNotification(d.title || "Hanko", {body: d.body || "", tag: d.tag || "hanko", icon: "icone-192.png", badge: "icone-192.png", data: {tag: d.tag || ""}})); });
self.addEventListener("notificationclick", e => { e.notification.close(); const t = e.notification.data && e.notification.data.tag || "";
  const url = new URL("./", self.registration.scope).href + (t ? "#notif=" + encodeURIComponent(t) : "");
  e.waitUntil(self.clients.matchAll({type: "window", includeUncontrolled: true}).then(L => { const c = L[0]; if (c){ c.postMessage({notif: t}); return c.focus(); } return self.clients.openWindow(url); })); });
