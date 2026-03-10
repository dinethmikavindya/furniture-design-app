import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add the routes that require authentication
const protectedRoutes = [
    '/dashboard',
    '/editor',
    '/projects',
    '/settings',
    '/account',
    '/materials',
    '/shop'
];

// Add the routes that logged-in users shouldn't access
const authRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password'
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the route is protected or auth-related
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // Skip middleware for API routes, public assets, and others
    if (!isProtectedRoute && !isAuthRoute) {
        return NextResponse.next();
    }

    // Get the auth token from cookies
    const token = request.cookies.get('auth_token')?.value;

    // SCENARIO 1: User is trying to access a protected route without a token
    if (isProtectedRoute && !token) {
        // Redirect them to the login page
        const loginUrl = new URL('/login', request.url);
        // Optionally pass the requested page as a callback URL
        // loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // SCENARIO 2: User is already logged in but tries to go to login/signup/etc
    if (isAuthRoute && token) {
        // Redirect them to the dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// Ensure the middleware is only run on matching paths
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
