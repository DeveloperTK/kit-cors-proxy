import { emptyModifier } from "../../../../src/fetch"
import Targets from "../../../../src/targets"
import { fetchData } from "../../../../src/fetch"

export default async function handler(req, res) {
    res.status(200).json(await fetchData(
        Targets.SHUTTLE_URL,
        { json: true },
        emptyModifier
    ))
}
