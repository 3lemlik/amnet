/* AM NET service worker: always fetch the newest site, fall back to cache offline */
const C="amnet-cache-v2";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==C)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin===self.location.origin){
    e.respondWith((async()=>{
      try{const res=await fetch(r.url,{cache:"no-store",credentials:"same-origin"});
        if(res.ok&&!u.search){const c=await caches.open(C);c.put(r.mode==="navigate"?"./":r,res.clone())}
        return res}
      catch(err){const c=await caches.open(C);return (await c.match(r.mode==="navigate"?"./":r))||(await c.match("./"))||Response.error()}
    })());
    return;
  }
  if(/^(cdnjs\.cloudflare\.com|www\.gstatic\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(u.host)&&!u.pathname.includes("/firestore/")){
    e.respondWith((async()=>{const c=await caches.open(C);const m=await c.match(r);if(m)return m;const res=await fetch(r);if(res.ok||res.type==="opaque")c.put(r,res.clone());return res})());
  }
});
