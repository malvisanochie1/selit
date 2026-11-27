import { ApiError, toApiError } from '../errors';
import type { SessionUser, SignInInput, SignUpInput, SignUpResult } from '../types';
import { unwrap, type ApiContext } from './context';
import { MEMBER_COLUMNS, mapSessionUser } from './mappers';

export type AuthRedirects = {
  /** Where the confirmation email link lands, e.g. https://selit.ng/sign-in or selit://sign-in. */
  emailConfirmed?: string;
  /** Where the password-reset email link lands. */
  passwordReset?: string;
};

export function authApi(ctx: ApiContext, redirects: AuthRedirects = {}) {
  const { client } = ctx;

  async function loadUser(id: string, email: string): Promise<SessionUser> {
    const row = unwrap(await client.from('profiles').select(MEMBER_COLUMNS).eq('id', id).single());
    return mapSessionUser(ctx, row, email);
  }

  return {
    /** The signed-in member, checked with the auth server, or null. */
    async getSessionUser(): Promise<SessionUser | null> {
      const { data, error } = await client.auth.getUser();
      if (error || !data.user) return null;
      try {
        return await loadUser(data.user.id, data.user.email ?? '');
      } catch {
        return null;
      }
    },

    async signIn(input: SignInInput): Promise<SessionUser> {
      const { data, error } = await client.auth.signInWithPassword(input);
      if (error) throw toApiError(error);
      return loadUser(data.user.id, data.user.email ?? input.email);
    },

    async signUp(input: SignUpInput): Promise<SignUpResult> {
      const { data, error } = await client.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          emailRedirectTo: redirects.emailConfirmed,
          data: { full_name: input.fullName, account_type: input.accountType },
        },
      });
      if (error) throw toApiError(error);
      // With email confirmation on, an existing address comes back with no identities.
      if (data.user && data.user.identities?.length === 0) {
        throw new ApiError(
          'An account with this email already exists. Try signing in.',
          409,
          'user_already_exists',
        );
      }
      if (!data.session || !data.user) return { user: null, needsEmailConfirmation: true };
      return {
        user: await loadUser(data.user.id, data.user.email ?? input.email),
        needsEmailConfirmation: false,
      };
    },

    async signOut() {
      await client.auth.signOut();
    },

    async requestPasswordReset(email: string) {
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: redirects.passwordReset,
      });
      if (error) throw toApiError(error);
    },

    async updatePassword(password: string) {
      const { error } = await client.auth.updateUser({ password });
      if (error) throw toApiError(error);
    },

    async resendConfirmation(email: string) {
      const { error } = await client.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: redirects.emailConfirmed },
      });
      if (error) throw toApiError(error);
    },
  };
}
