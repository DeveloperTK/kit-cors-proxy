import Targets from "@/src/targets"
import { fetchData, getAgent } from "@/src/fetch"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { raumbuchungParser } from "./area";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.year || !req.query.month || !req.query.day || !req.query.area) {
        res.status(400).json({ status: 400, error: "Bad Request: year, month, day and area required!" });
        return;
    }

    res.status(200).json(await fetchData(
        Targets.SEAT_DAY_URL + `?year=${req.query.year}&month=${req.query.month}&day=${req.query.day}&area=${req.query.area}`,
        { json: false, ignoreCache: true, agent: getAgent(req) },
        raumbuchungParser
    ))
}

export default handler;
