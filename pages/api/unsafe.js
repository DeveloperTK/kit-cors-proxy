import { fetchData } from "../../src/fetch"

export default async function handler(req, res) {
    res.status(404).json({ error: 404, message: "disabled" });
    return;
    res.status(200).json(await fetchData(req.query.url, { json: req.query.json }))
}
