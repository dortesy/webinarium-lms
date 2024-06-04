import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import createMiddleware from 'next-intl/middleware';
import {localePrefix, locales} from "@/i18n";


import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    publicRoutes,
    authRoutes
} from "@/routes";

const { auth } = NextAuth(authConfig)


const intlMiddleware = createMiddleware({
    defaultLocale: 'ru',
    localePrefix,
    locales
});


const createPagesRegex = (pages: string[]) =>
    RegExp(
        `^(/(${['ru', 'uz'].join("|")}))?(${pages
            .flatMap((p) => (p === "/" ? ["", "/"] : p))
            .join("|")})/?$`,
        "i"
    );



export default auth((req) => {

    const  {nextUrl} = req;
    const isLoggedIn = !!req.auth

    const isApiAuthRoute = apiAuthPrefix.some(prefix => nextUrl.pathname.startsWith(prefix));
    const isPublicRoute = createPagesRegex(publicRoutes).test(nextUrl.pathname);
    const isAuthRoute = createPagesRegex(authRoutes).test(nextUrl.pathname);
    req.headers.set('x-next-pathname', req.nextUrl.pathname);
    if (isApiAuthRoute) {
        return
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return intlMiddleware(req);
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL('/auth/login', nextUrl));
    }

    return intlMiddleware(req);
})



export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};