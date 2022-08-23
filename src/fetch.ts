import cacheData from 'memory-cache';
import { NextApiRequest } from 'next';

const DEFAULT_CACHE_DURATION = 120_000;

/**
 * Respond to all requests with a consistent response format
 * 
 * @param {boolean} isCached whether the request was cached by the proxy
 * @param {string} originalURL the data origin URL
 * @param {string} receivedAt timestamp (ISO-String) the fetched data was received or loaded from cache
 * @param {number} status received status code
 * @param {object} data the actual response data
 * @returns consistent json object with all data
 */
export function generateJsonResponse(isCached: boolean, originalURL: string, receivedAt: string, status: number, data: object) {
    return {
        cached: isCached,
        origin: originalURL,
        received: receivedAt,
        status: status,
        data: data
    };
}

export interface FetchOptions {
    ignoreCache?: boolean;
    json?: boolean;
    cacheDuration?: number;
    agent: AgentFetchOption;
    ignoreForwardHeader?: boolean;
}

interface AgentFetchOption {
    use: 'client' | 'proxy';
    client: string;
    ip: string;
}

/**
 * Load data from origin or cache
 * 
 * @param url URL to fetch data from
 * @param options fetch options
 * @param resultModifier transform the fetched data before caching
 * @returns fetched or cached data, see {@link generateJsonResponse}
 */
export async function fetchData(url: string, options: FetchOptions, resultModifier: (_: any) => any) {
    // get cached element if exists
    let cachedResult = cacheData.get(url);

    // return if request was already cached
    if (cachedResult && !options.ignoreCache) {
        return generateJsonResponse(true, url, cachedResult.fetchTime, 200, cachedResult.content)
    }

    // kit-cors-proxy/1 (i am a friendly bot, see github.com/developertk/kit-cors-proxy)
    let userAgent = 'Mozilla/5.0 (compatible; KITMobile-Proxy/1.0; +http://github.com/DeveloperTK/kit-cors-proxy) AppleWebKit/534.34';

    if (options.agent && options.agent.use === 'client') {
        userAgent = options.agent.client.trimEnd()
        + ` OriginalIP+${options.agent.ip}`
        + ' (ProxiedUserRequest; KITMobile-Proxy/1.0; +http://github.com/DeveloperTK/kit-cors-proxy)'
    }

    let request = await fetch(url, {
        headers: {
            'User-Agent': userAgent,
            'X-Forwarded-For': options.ignoreForwardHeader ? undefined : options.agent.ip
        }
    })

    if (request.status >= 400) {
        return generateJsonResponse(false, url, new Date().toISOString(), request.status, {});
    }

    let fetchDate = new Date().toISOString();
    let content: any;

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

export function getAgent(req: NextApiRequest): AgentFetchOption {
    return {
        use: 'client',
        client: req.headers['user-agent'],
        ip: clientIp(req) || 'unknown'
    }
}

function clientIp(req: NextApiRequest) {
    let ip: string;

    if (req.headers["x-forwarded-for"]) {
        ip = req.headers["x-forwarded-for"].toString()
    } else if (req.headers["x-real-ip"]) {
        ip = req.socket.remoteAddress
    } else {
        ip = req.socket.remoteAddress
    }

    return ip;
}

export function emptyModifier(data: any) {
    return data
}
