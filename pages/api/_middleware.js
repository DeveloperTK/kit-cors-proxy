import { NextResponse } from 'next/server'

export async function middleware(req, ev) {
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
}
