import type { SignInInput, SignUpInput } from '@selit/shared';

import { getApi } from '@/lib/api';

export function fetchSessionUser() {
  return getApi().auth.getSessionUser();
}

export function signIn(input: SignInInput) {
  return getApi().auth.signIn(input);
}

export function signUp(input: SignUpInput) {
  return getApi().auth.signUp(input);
}

export function signOut() {
  return getApi().auth.signOut();
}

export function requestPasswordReset(email: string) {
  return getApi().auth.requestPasswordReset(email);
}

export function updatePassword(password: string) {
  return getApi().auth.updatePassword(password);
}

export function resendConfirmation(email: string) {
  return getApi().auth.resendConfirmation(email);
}
