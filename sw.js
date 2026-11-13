const C="amnet-cache-v3";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("amnet")&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 if(u.origin===location.origin){if(u.pathname.includes("/pharmacy/"))return;
  const key=r.mode==="navigate"?u.pathname:u.origin+u.pathname;
  e.respondWith(fetch(r,{cache:"no-store"}).then(res=>{if(res.ok){const c=res.clone();caches.open(C).then(x=>x.put(key,c))}return res}).catch(()=>caches.match(key).then(x=>x||Response.error())));return}
 if(/(cdnjs\.cloudflare\.com|www\.gstatic\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(u.hostname)&&!u.pathname.includes("firestore")){
  e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const c=res.clone();caches.open(C).then(y=>y.put(r,c))}return res})))}});
