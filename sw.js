/* 凡人修仙傳 Service Worker：外殼預先快取，離線可玩；更新遊戲時請把 VER 加一 */
const VER='fanren-v1',SHELL=['./','./index.html','./manifest.webmanifest','./lib/three.min.js','./lib/rot.min.js',
 './icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-192.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png','./icons/favicon-32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VER).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin)return;
 if(r.headers.has('range')||/\/audio\//.test(u.pathname))return;          // 音檔（Range 請求）交給瀏覽器
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(VER).then(h=>h.put('./index.html',c));return x}).catch(()=>caches.match('./index.html')));return}
 e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(VER).then(k=>k.put(r,c))}return x})))});
