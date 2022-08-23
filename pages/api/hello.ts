import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { generateJsonResponse } from "@/src/fetch"

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json(generateJsonResponse(
        false,
        "/api/hello",
        new Date().toUTCString(),
        200,
        { message: 'Hello World!' }
    ))
}

export default handler;