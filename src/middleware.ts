import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
    '/dashboard',
    '/editor',
    '/projects',
    '/settings',
    '/account',
    '/materials',
    '/shop'
];

const authRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password'
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    if (!isProtectedRoute && !isAuthRoute) {
        return NextResponse.next();
    }

    const token = request.cookies.get('auth_token')?.value;

    // No token + protected route → go to login
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Has token + auth route → go to dashboard
    // BUT only redirect if token is present AND valid-looking
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
