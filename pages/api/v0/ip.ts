import { emptyModifier, fetchData, getAgent } from "@/src/fetch";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json(await fetchData(
        'https://php.shirkanesi.com/ip.php',
        { ignoreCache: true, agent: getAgent(req) },
        emptyModifier
    ));
};

export default handler;