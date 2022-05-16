import cacheData from 'memory-cache';

const DEFAULT_CACHE_DURATION = 120_000;

/**
 * Respond to all requests with a consistent response format
 * 
 * @param {*} isCached whether the request was cached by the proxy
 * @param {*} originalURL the data origin URL
 * @param {*} receivedAt timestamp the fetched data was received or loaded from cache
 * @param {*} data the actual response data
 * @returns consistent json object with all data
 */
export function generateJsonResponse(isCached, originalURL, receivedAt, data) {
    return {
        cached: isCached,
        origin: originalURL,
        received: receivedAt,
        data: data
    }
}

/**
 * Load data from origin or cache
 * 
 * @param {*} url URL to fetch data from
 * @param {*} options fetch options
 * @returns fetched or cached data, see {@link generateJsonResponse}
 */
export async function fetchData(url, options) {
    let cachedResult = cacheData.get(url);

    if (!options) {
        options = {}
    }

    if (cachedResult && !options.ignoreCache) {
        return generateJsonResponse(true, url, new Date().toISOString(), cachedResult)
    } else {
        let request = fetch(url, {
            headers: {
                'User-Agent': 'kit-cors-proxy/1 (i am a friendly bot, see github.com/kit-mobile/kit-cors-proxy)'
            }
        })

        let content;
        if (options.json) {
            content = await request.then(res => res.json())
        } else {
            content = await request.then(res => res.text())
        }

        cacheData.put(url, content, options.cacheDuration || DEFAULT_CACHE_DURATION)
        
        return generateJsonResponse(false, url, new Date().toISOString(), content)
    }
}
