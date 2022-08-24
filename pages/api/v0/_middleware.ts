import { NextMiddleware, NextRequest, NextResponse } from "next/server";

const handler: NextMiddleware = (_: NextRequest) => {
    if (process.env.NODE_ENV === 'development') {
        return NextResponse.next();
    } else {
        return NextResponse.json({
            status: 410,
            error: "API version 0 is not an acutal API and is only used for debugging purposes. Therefore it is not available in production."
        });
    }
}

export default handler;