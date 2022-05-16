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
export function generateJsonResponse(isCached, originalURL, receivedAt, status, data) {
    return {
        cached: isCached,
        origin: originalURL,
        received: receivedAt,
        status: status,
        data: data
    }
}

/**
 * Load data from origin or cache
 * 
 * @param {*} url URL to fetch data from
 * @param {*} options fetch options
 * @param {*} resultModifier transform the fetched data before caching
 * @returns fetched or cached data, see {@link generateJsonResponse}
 */
export async function fetchData(url, options, resultModifier) {
    // get cached element if exists
    let cachedResult = cacheData.get(url);

    if (!options) {
        options = {}
    }

    // return if request was already cached
    if (cachedResult && !options.ignoreCache) {
        return generateJsonResponse(true, url, cachedResult.fetchTime, 200, cachedResult.content)
    }

    let request = await fetch(url, {
        headers: {
            'User-Agent': 'kit-cors-proxy/1 (i am a friendly bot, see github.com/developertk/kit-cors-proxy)'
        }
    })

    if (request.status >= 400) {
        return generateJsonResponse(false, url, new Date().toISOString, request.status, {});
    }

    let fetchDate = new Date().toISOString();
    let content;

    if (options.json) {
        content = await request.json()
    } else {
        content = await request.text()
    }

    if (resultModifier) {
        content = resultModifier(content)
    } else {
        console.warn("No result modifier was specified while handling URL " + url + ". Please specify one, even if it's empty!");
    }

    cacheData.put(url, {
        fetchTime: fetchDate,
        content: content
    }, options.cacheDuration || DEFAULT_CACHE_DURATION)
    
    return generateJsonResponse(false, url, fetchDate, request.status, content)
}

export function emptyModifier(data) {
    return data
}
