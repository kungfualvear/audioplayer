const C="reproductor-v2",A=["./","index.html","manifest.json","icon.svg"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(C).then(c=>c.addAll(A.map(u=>new Request(u,{cache:"reload"})))));
  self.skipWaiting();
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
// Con conexión: siempre pide la versión más reciente y actualiza la copia guardada.
// Sin conexión: usa la copia guardada.
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  e.respondWith(
    fetch(r,{cache:"no-cache"}).then(res=>{
      if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}
      return res;
    }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match("index.html")))
  );
});
