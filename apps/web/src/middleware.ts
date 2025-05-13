import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
    const session = await auth(); // get user session
    const { pathname } = request.nextUrl;
    if (
        (pathname.startsWith("/login") || pathname.startsWith("/register")) &&
        session != null
    ) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }
    if (session?.user) {
        if (pathname.startsWith("/dashboard") && session?.user.role === "CUSTOMER") {
            return NextResponse.redirect(new URL("/", request.nextUrl));
        }
        if (!pathname.startsWith("/dashboard") && (session?.user.role !== "CUSTOMER")) {
            return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
        }
        if (pathname === "/dashboard" && session?.user.role === "CUSTOMER") {
            return NextResponse.redirect(new URL("/", request.nextUrl));
        }

    }
    else {

        if (!session?.user) {
            return NextResponse.redirect(new URL("/login", request.nextUrl))
        }
    }


}

export const config = {
    matcher: ["/", "/cart", "/payment", "/payment/:path+", "/transaction-list", "/order-list", "/register", "/profile", "/profile/:path+", "/dashboard", "/dashboard/:path+"],
};