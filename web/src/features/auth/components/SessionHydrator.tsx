'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import type { SessionUser } from '../auth.types';
import { sessionKey } from '../hooks/use-session';

/** Hands the user the server already checked to the browser, so the page doesn't fetch it again. */
export function SessionHydrator({ user }: { user: SessionUser }) {
  const queryClient = useQueryClient();
  useState(() => queryClient.setQueryData<SessionUser | null>(sessionKey, user));
  return null;
}
