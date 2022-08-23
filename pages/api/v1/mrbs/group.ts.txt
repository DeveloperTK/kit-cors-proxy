import { JSDOM } from "jsdom"
import Targets from "@/src/targets"
import { fetchData, getAgent } from "@/src/fetch"
import structuredClone from '@ungap/structured-clone';
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.year || !req.query.month || !req.query.day || !req.query.area) {
        res.status(400).json({ status: 400, error: "Bad Request: year, month, day and area required!" })
    }

    res.status(200).json(await fetchData(
        Targets.RAUMBUCHUNG_URL + `?year=${req.query.year}&month=${req.query.month}&day=${req.query.day}&area=${req.query.area}`,
        { json: false, ignoreCache: true, agent: getAgent(req) },
        raumbuchungParser
    ))
}

export default handler;

function raumbuchungParser(htmlText: string): object {
    let fetchDom = new JSDOM(htmlText)
    let document = fetchDom.window.document

    let mainTable = document.getElementById('day_main')
    let headerRow = mainTable.querySelector('thead tr').children
    
    let rooms = {};
    let defaultSlotObject = {};

    for (let i = 1; i < headerRow.length; i++) {
        const element = headerRow[i].querySelector('a')
        
        rooms[i - 1] = {
            id: new URLSearchParams(element.href).get('room'),
            name: element.textContent.trim()
        }

        defaultSlotObject[i - 1] = true
    }

    let slots = {};

    let tableRows = mainTable.querySelector('tbody').children;

    for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i].children;
        slots[i] = {
            time: row[0].querySelector('div a').textContent,
            rooms: structuredClone(defaultSlotObject) 
        }
    }

    for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i].children;
        
        let data = [];
        for (let j = 1; j < row.length; j++) {
            const entry = row[j];
            data.push(entry);
        }

        for (let j = 1; j < data.length; j++) {
            const element = data[j];
            if (slots[i].rooms[j] == true) {
                let entry = data.pop();
                
                /*
                if (entry.classList.contains('new')) {
                    continue;
                } else if (entry.)
                */
            }
        }
    }

    return {
        rooms: rooms,
        slots: slots
    };
}