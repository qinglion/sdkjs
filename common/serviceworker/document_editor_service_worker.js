let g_version = "0.0.0-0";//make empty for develop version
const pathnameParts = self.location.pathname.split('/');
if (pathnameParts.length > 1 && pathnameParts[pathnameParts.length - 2]) {
	g_version = pathnameParts[pathnameParts.length - 2];
}
const g_cacheNamePrefix = 'document_editor_static_';
const g_cacheName = g_cacheNamePrefix + g_version;
const patternPrefix = new RegExp(g_version + "/(web-apps|sdkjs|sdkjs-plugins|fonts|dictionaries)");

function putInCache(request, response) {
	return caches.open(g_cacheName)
		.then(function (cache) {
			return cache.put(request, response);
		})
		.catch(function (err) {
			console.error('putInCache failed with ' + err);
		});
}

function cacheFirst(event) {
	let request = event.request;
	return caches.match(request, {cacheName: g_cacheName})
		.then(function (responseFromCache) {
			if (responseFromCache) {
				return responseFromCache;
			} else {
				return fetch(request)
					.then(function (responseFromNetwork) {
						//todo 0 or 1223?
						//ensure response safe to cache
						if (responseFromNetwork.status === 200) {
							event.waitUntil(putInCache(request, responseFromNetwork.clone()));
						}
						return responseFromNetwork;
					});
			}
		});
}
function activateWorker(event) {
	return self.clients.claim()
		.then(function(){
			//remove stale caches
			return caches.keys();
		})
		.then(function (keys) {
			return Promise.all(keys.map(function(cache){
				if (cache.includes(g_cacheNamePrefix) && !cache.includes(g_cacheName)) {
					return caches.delete(cache);
				}
			}));
		}).catch(function (err) {
			console.error('activateWorker failed with ' + err);
		});
}

self.addEventListener('install', (event) => {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
	event.waitUntil(activateWorker());
});

self.addEventListener('fetch', (event) => {
	let request = event.request;
	if (request.method !== "GET" || !patternPrefix.test(request.url)) {
		return;
	}
	event.respondWith(cacheFirst(event));
});
