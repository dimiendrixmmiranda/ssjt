import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((request) => {
    const usuario = request.auth;

    const pathname = request.nextUrl.pathname;

    // Usuário não autenticado
    if (!usuario?.user) {
        return NextResponse.redirect(
            new URL("/", request.url)
        );
    }

    const role = usuario.user.role;

    // Área exclusiva do SUPER_ADMIN
    if (
        pathname.startsWith("/super-admin") &&
        role !== "SUPER_ADMIN"
    ) {
        return NextResponse.redirect(
            new URL("/admin", request.url)
        );
    }

    // Área administrativa
    if (
        pathname.startsWith("/admin") &&
        role !== "ADMIN" &&
        role !== "SUPER_ADMIN"
    ) {
        return NextResponse.redirect(
            new URL("/", request.url)
        );
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/super-admin/:path*",
        "/admin/:path*",
    ],
};