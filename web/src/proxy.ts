import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { env, isSampleMode } from '@/config/env';
import { SAMPLE_SESSION_COOKIE } from '@/lib/sample-session';

const PROTECTED_PREFIXES = ['/account', '/seller', '/sell', '/admin'];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function toSignIn(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signIn = request.nextUrl.clone();
  signIn.pathname = '/sign-in';
  signIn.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
  return NextResponse.redirect(signIn);
}

/**
 * Keeps the Supabase session fresh on every request and sends signed-out
 * visitors away from private pages. Roles are checked again in each layout.
 */
export async function proxy(request: NextRequest) {
  if (isSampleMode) {
    if (isProtected(request.nextUrl.pathname) && !request.cookies.has(SAMPLE_SESSION_COOKIE)) {
      return toSignIn(request);
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet)
          response.cookies.set(name, value, options);
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims && isProtected(request.nextUrl.pathname)) return toSignIn(request);
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|icon.svg|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|svg)$).*)',
  ],
};
