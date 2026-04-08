/* coi-serviceworker v0.1.7 - Guido Zuidhof, licensed under MIT */
let coi = self.coi || (()=>{
  let coiSW={};
  coiSW.shouldRegister=()=>!self.crossOriginIsolated;
  coiSW.shouldDeregister=()=>false;
  coiSW.doReload=()=>location.reload();
  coiSW.quiet=false;
  return coiSW;
})();

if ("document" in self) {
  // Main thread
  (async ()=>{
    if (!coi.shouldRegister()) return;
    const registration = await navigator.serviceWorker.register(
      document.currentScript.src,{scope:"/"}
    ).catch(e=>console.error("COOP/COEP Service Worker failed:",e));
    if (!registration) return;
    // Reload once the SW is active to get the isolation headers
    if (registration.active && !navigator.serviceWorker.controller) {
      if (!coi.quiet) console.log("Reloading for cross-origin isolation...");
      coi.doReload();
    }
  })();
} else {
  // Service Worker thread
  self.addEventListener("install",()=>self.skipWaiting());
  self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
  self.addEventListener("fetch",function(e){
    if (e.request.cache==="only-if-cached"&&e.request.mode!=="same-origin") return;
    e.respondWith(
      fetch(e.request).then(r=>{
        if (r.status===0) return r;
        const h=new Headers(r.headers);
        h.set("Cross-Origin-Opener-Policy","same-origin");
        h.set("Cross-Origin-Embedder-Policy","require-corp");
        return new Response(r.body,{status:r.status,statusText:r.statusText,headers:h});
      })
    );
  });
}
