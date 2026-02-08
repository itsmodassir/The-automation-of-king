import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("admin_token");

    if (!token && !req.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (token && req.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
