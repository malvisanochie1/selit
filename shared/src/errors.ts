export type FieldErrors = Record<string, string>;

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors: FieldErrors;

  constructor(message: string, status: number, code = '', fieldErrors: FieldErrors = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isNotFound() {
    return this.status === 404;
  }
}

const FRIENDLY_MESSAGES: Record<number, string> = {
  0: 'You seem to be offline. Check your connection.',
  400: 'Some details need fixing. Check the form and try again.',
  401: 'Please sign in to continue.',
  403: "You don't have access to do that.",
  404: "We couldn't find what you were looking for.",
  408: 'This is taking too long. Check your connection and try again.',
  409: 'That already exists.',
  413: 'That upload is too large. Try fewer or smaller photos.',
  429: "You're going a bit fast. Wait a moment and try again.",
  500: 'Something went wrong on our side. Please try again.',
  503: 'Selit is busy right now. Please try again shortly.',
};

/** Messages for the rules the database enforces (see backend migrations). */
const RULE_MESSAGES: Record<string, [string, number]> = {
  rate_limited: ["You're going a bit fast. Wait a while and try again.", 429],
  account_restricted: [
    'Your account is restricted. Contact support if you think this is a mistake.',
    403,
  ],
  category_paused: ['This category is paused for now. Choose another one.', 400],
  listing_limit: ['New sellers can have 5 open listings at a time. Mark some as sold first.', 400],
  status_not_allowed: ["You can't change that listing's status.", 403],
  verification_required: ['Verify your identity before listing apartments.', 403],
  sign_in_required: ['Please sign in to continue.', 401],
  already_submitted: ['Your verification is already being reviewed.', 409],
  invalid_id_number: ['That ID number does not look right.', 400],
  selfie_required: ['Take a live selfie to continue.', 400],
  photo_missing: ['A photo did not upload. Please try again.', 400],
  forbidden: ["You don't have access to do that.", 403],
  not_found: ["We couldn't find what you were looking for.", 404],
  cannot_change_self: ["You can't change your own account status.", 400],
};

const AUTH_MESSAGES: Record<string, string> = {
  invalid_credentials: 'That email and password do not match.',
  email_not_confirmed: 'Confirm your email first. Check your inbox for the link.',
  user_already_exists: 'An account with this email already exists. Try signing in.',
  weak_password: 'Choose a stronger password: at least 8 characters with letters and numbers.',
  over_email_send_rate_limit: 'Too many emails sent. Wait a few minutes and try again.',
  over_request_rate_limit: "You're going a bit fast. Wait a moment and try again.",
  same_password: 'Choose a password you have not used before.',
};

export function friendlyMessage(status: number) {
  return FRIENDLY_MESSAGES[status] ?? FRIENDLY_MESSAGES[500];
}

type ErrorLike = { message?: unknown; code?: unknown; status?: unknown; hint?: unknown };

/** Turns any Supabase (database, auth or storage) error into one readable ApiError. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  const raw = (typeof error === 'object' && error !== null ? error : {}) as ErrorLike;
  const message = typeof raw.message === 'string' ? raw.message : '';
  const code = typeof raw.code === 'string' ? raw.code : '';

  const rule = RULE_MESSAGES[message];
  if (rule) return new ApiError(rule[0], rule[1], message);

  if (AUTH_MESSAGES[code]) {
    return new ApiError(
      AUTH_MESSAGES[code],
      typeof raw.status === 'number' ? raw.status : 400,
      code,
    );
  }

  if (code === 'PGRST116') return new ApiError(friendlyMessage(404), 404, code);
  if (code === '23505') return new ApiError("You've already done that.", 409, code);
  if (code === '23514' || code === '22P02') return new ApiError(friendlyMessage(400), 400, code);
  if (code === '42501') return new ApiError(friendlyMessage(403), 403, code);
  if (/fetch|network|Failed to fetch/i.test(message))
    return new ApiError(friendlyMessage(0), 0, 'offline');

  const status = typeof raw.status === 'number' ? raw.status : 500;
  return new ApiError(friendlyMessage(status), status, code);
}

export function messageOf(error: unknown) {
  return toApiError(error).message;
}
