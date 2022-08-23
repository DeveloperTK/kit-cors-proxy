import { emptyModifier, getAgent } from "@/src/fetch"
import Targets from "@/src/targets"
import { fetchData } from "@/src/fetch"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json(await fetchData(
        Targets.APPOINTMENTS_URL,
        { json: true, agent: getAgent(req) },
        emptyModifier
    ))
}

export default handler;