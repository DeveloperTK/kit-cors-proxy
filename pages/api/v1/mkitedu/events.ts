import Targets from "@/src/targets"
import { fetchData, getAgent } from "@/src/fetch"
import { JSDOM } from "jsdom";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json(await fetchData(
        Targets.EVENTS_URL,
        { json: false, agent: getAgent(req) },
        eventsParser
    ))
}

export default handler;

function eventsParser(htmlText: string): object {
    let fetchDom = new JSDOM(htmlText);
    let articles = [];

    for (let article of fetchDom.window.document.getElementsByTagName('article')) {
        articles.push({
            name: article.querySelector('h3 a').textContent.trim(),
            url: (article.querySelector('h3 a') as HTMLAnchorElement).href.replace("veranstaltungen.php", "veranstaltungskalender.php"),
            time: article.querySelector('.newsteaser span').textContent.trim(),
            description: article.querySelector('.newsteaser p').textContent.trim(),
            image: parseImageSourceFromCss((article.querySelector('.event_image') as HTMLElement).style.backgroundImage)
        })
    }

    return articles;
}

function parseImageSourceFromCss(css: string): string {
    return css.replace("url(\"", "").replace("url(", "").replace("\")", "").replace(")", "")
}