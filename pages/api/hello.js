import { generateJsonResponse } from "../../src/fetch"

export default function handler(req, res) {
    res.status(200).json(generateJsonResponse(
        false,
        "/api/hello",
        new Date().toUTCString(),
        { message: 'Hello World!' }
    ))
}
