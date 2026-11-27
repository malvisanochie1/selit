import type { EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

import { safeRedirectPath } from '@/lib/safe-redirect';
import { getServerClient } from '@/lib/supabase/server';

/** Email links (confirm sign-up, reset password) land here and start a session. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeRedirectPath(searchParams.get('next'), '/account');
  const supabase = await getServerClient();

  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error('missing') };

  return NextResponse.redirect(new URL(error ? '/sign-in?link=expired' : next, origin));
}
