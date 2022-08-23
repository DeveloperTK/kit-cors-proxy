import Targets from "@/src/targets"
import { fetchData, getAgent } from "@/src/fetch"
import { JSDOM } from "jsdom";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json(await fetchData(
        Targets.NEWS_URL,
        { json: false, agent: getAgent(req) },
        newsParser
    ))
}

export default handler;

function newsParser(htmlText: string): object {
    let fetchDom = new JSDOM(htmlText);
    let articles = [];

    for (let article of fetchDom.window.document.getElementsByTagName('article')) {
        article.querySelector('.newsteaser p a').innerHTML = "";
        articles.push({
            name: article.querySelector('h3 a').textContent.trim(),
            url: article.querySelector('h3 a').href,
            description: article.querySelector('.newsteaser p').textContent.trim(),
        })
    }

    return articles;
}
