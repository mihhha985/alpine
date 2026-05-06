import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
	const { pathname, search } = request.nextUrl;

	if (pathname === "/catalog" && search === "") {
		const url = request.nextUrl.clone();
		url.searchParams.set("category", "man");
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: "/catalog",
};
