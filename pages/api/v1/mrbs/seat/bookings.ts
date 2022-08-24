import Targets from "@/src/targets"
import { fetchData, getAgent } from "@/src/fetch"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.year || !req.query.month || !req.query.day || !req.query.areas) {
        res.status(400).json({ status: 400, error: "Bad Request: year, month, day and areas required!" });
        return;
    }

    try {
        JSON.parse(req.query.areas.toString());
    } catch (error) {
        res.status(400).json({ status: 400, error: "Bad Request: areas need to be JSON array of id strings!" });
        return;
    }
    
    // these variables were being used when I needed to calculate dates, leaving in for now
    let [startDay, startMonth, startYear] = [Number(req.query.day), Number(req.query.month), Number(req.query.year)]
    let [endDay, endMonth, endYear] = [Number(req.query.day), Number(req.query.month), Number(req.query.year)]

    // MRBS only likes properly encoded request parameters
    const startTime = encodeURIComponent(`${startYear}-${startMonth}-${startDay}T08:00:00+01:00`);
    const endTime = encodeURIComponent(`${endYear}-${endMonth}-${endDay}T23:59:59+01:00`);
    const locations = encodeURIComponent(req.query.areas.toString());

    const reqURL = Targets.MRBS_SEAT_API + `?start_time=${startTime}&end_time=${endTime}&locations=${locations}`

    res.status(200).json(await fetchData(
        reqURL,
        { json: true, ignoreCache: false, cacheDuration: 30_000, agent: getAgent(req) },
        extractPayload
    ))
}

export default handler;

const extractPayload = (apiResponse) => {
    const responseCode = apiResponse?.meta?.code;
    if (!responseCode || typeof responseCode !== 'number') {
        return {
            status: 500,
            error: "Unknown error, original server response is attached",
            serverResponse: apiResponse
        }
    } else if (responseCode >= 400) {
        return {
            status: responseCode,
            error: "See HTTP status code for explanation, original server response is attached",
            serverResponse: apiResponse
        }
    } else {
        // only send payload, meta stuff is irrelevant
        return apiResponse.payload;
    }
}