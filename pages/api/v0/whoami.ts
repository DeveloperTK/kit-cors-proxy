import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { generateJsonResponse, getAgent } from "@/src/fetch"

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json(generateJsonResponse(
        false,
        "/api/v0/whoami",
        new Date().toUTCString(),
        200,
        { ip: getAgent(req).ip }
    ))
}

export default handler;