//name of the cache
var cacheName = "afterschool";
//files to cache in the service worker
var filesToCache = [
    "index.html",
    "https://post-school.eu-west-2.elasticbeanstalk.com/images/icon.png",
    "https://post-school.eu-west-2.elasticbeanstalk.com/images/icon2.png",
    "src/main.js",
    "src/assets/main.css",
    "src/assets/base.css",
    "https://post-school.eu-west-2.elasticbeanstalk.com/images/art.jpg",
    "https://post-school.eu-west-2.elasticbeanstalk.com/images/dance.jpg",
    "https://post-school.eu-west-2.elasticbeanstalk.com/images/music.jpg",
    "https://post-school.eu-west-2.elasticbeanstalk.com/images/sport.jpg",
    "https://post-school.eu-west-2.elasticbeanstalk.com/images/health.jpg",
    "https://post-school.eu-west-2.elasticbeanstalk.com/images/hair.jpg",
    "https://post-school.eu-west-2.elasticbeanstalk.com/images/fashion.jpg",
    "https://post-school.eu-west-2.elasticbeanstalk.com/images/search.png",
    "https://post-school.eu-west-2.elasticbeanstalk.com/images/geometry_box.jpg",
    "https://post-school.eu-west-2.elasticbeanstalk.com/images/science.jpg",
    "https://post-school.eu-west-2.elasticbeanstalk.com/images/english.jpg",
    "https://post-school.eu-west-2.elasticbeanstalk.com/images/Math.jpg",
];

// install the service worker and cache the files
self.addEventListener("install", function(e) {
    console.log("[Service Worker] Install");
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log("[Service Worker] Caching files");
            return cache.addAll(filesToCache);
        })
    );
});

//activate the service worker
self.addEventListener("fetch", function (e) {
    e.respondWith(
        caches.match(e.request).then(function (cachedFile) {
            //if the file is in the cache, retrieve it from there
            if (cachedFile) {
                console.log("[Service Worker] Resource fetched from the cache for: " + e.request.url);
                return cachedFile;
            } else {//if the file is not in the cache, download the file
                return fetch(e.request).then(function (response) {
                    return caches.open(cacheName).then(function (cache) {
                        //add the new file to the cache
                        cache.put(e.request, response.clone());
                        console.log("[Service Worker] Resource fetched and saved in the cache for: " +
                            e.request.url);
                        return response;
                    });
                });
            }
        })
    );
});