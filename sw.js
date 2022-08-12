function limpiarCache(cacheName,numeroItems){
    caches.open(cacheName)
    .then(cache=>{
        cache.keys()
        .then((keys=>{
            if(keys.length>numeroItems){
                cache.delete(keys[0])
                .then(limpiarCache(cacheName,numeroItems));
            }
        }))
    })
}

self.addEventListener('install', event=>{

    //abrir un cache para almacenar cosas ahi

    const cacheProm = caches.open('estatico-v2')
    .then(cache=>{
        return cache.addAll([
            './index.html',
            /*'/css/animate.css',
            '/css/fontawesome.css',
            '/css/templatemo_misc.css',
            '/css/templatemo_style.css',*/
            '/js/app.js'
        ]);
    });

});

self.addEventListener('fetch',event=>{
    
   //3. Network with cache fallback
    const respuesta = fetch(event.request).then(resp=>{
       caches.open('dinamico-v2')
       .then(cache=>{
           cache.put(event.request,resp);
           limpiarCache('dinamico-v2',50);
       })
       return resp.clone();
   }).catch(err=>{
    return caches.match(event.request);
   });
event.respondWith(respuesta);
})
