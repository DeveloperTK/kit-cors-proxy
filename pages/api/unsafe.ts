import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).json({ error: 404, message: "disabled" });
}

export default handler;