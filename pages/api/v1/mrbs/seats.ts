import { JSDOM } from "jsdom"
import Targets from "@/src/targets"
import { fetchData, getAgent } from "@/src/fetch"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.year || !req.query.month || !req.query.day || !req.query.area) {
        res.status(400).json({ status: 400, error: "Bad Request: year, month, day and area required!" });
        return;
    }

    res.status(200).json(await fetchData(
        Targets.SEAT_DAY_URL + `?year=${req.query.year}&month=${req.query.month}&day=${req.query.day}&area=${req.query.area}`,
        { json: false, ignoreCache: false, cacheDuration: 60_000, agent: getAgent(req) },
        raumbuchungParser
    ))
}

export default handler;

function raumbuchungParser(htmlText: string): object {
    const fetchDom = new JSDOM(htmlText)
    const document = fetchDom.window.document

    const mainTable = document.getElementById('day_main')
    const headerRow = mainTable.querySelector('thead tr').children
    const bodyRows = mainTable.querySelectorAll('tbody tr');

    let rooms = parseTableHeader(headerRow);
    
    for (const row of bodyRows) {
        // start at second element since first one is the label
        for (let i = 1; i < row.children.length; i++) {
            const element = row.children[i];
            const isAvailable = element.classList.contains('new');
            rooms[i - 1].slots.push(isAvailable);
        }
    }

    return {
        rooms: rooms
    };
}

function parseTableHeader(headerRow: HTMLCollection) {
    let rooms = [];

    for (const headerElement of headerRow) {
        // ignore first and last elements
        if (headerElement.classList.contains('first_last')) continue;

        rooms.push({
            id: headerElement.getAttribute('data-room'), // <th data-room="roomId">...</th>
            name: headerElement.children[0].innerHTML, // <th ...><a ...>RoomName</a></th>
            slots: []
        })
    }

    return rooms;
}
