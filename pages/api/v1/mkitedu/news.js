import Targets from "../../../../src/targets"
import { fetchData } from "../../../../src/fetch"
import { JSDOM } from "jsdom";

export default async function handler(req, res) {
    res.status(200).json(await fetchData(
        Targets.NEWS_URL,
        { json: false },
        eventsParser
    ))
}

function eventsParser(htmlText) {
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

function parseImageSourceFromCss(css) {
    return css.replace("url(\"", "").replace("\")", "")
}