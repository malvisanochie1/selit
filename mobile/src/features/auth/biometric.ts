import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CREDENTIALS_KEY = 'selit.biometric-credentials';
const OWNER_KEY = 'selit.biometric-owner';

type Credentials = { email: string; password: string };

/** True when the phone has a fingerprint or face enrolled. */
export async function canUseBiometrics() {
  if (Platform.OS === 'web') return false;
  const [hasHardware, isEnrolled] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
  ]);
  return hasHardware && isEnrolled;
}

export async function confirmWithBiometrics(reason: string) {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: reason,
    cancelLabel: 'Use password',
    disableDeviceFallback: true,
  });
  return result.success;
}

/**
 * Saves the member's sign-in in the Keystore/Keychain behind a fingerprint
 * check. Opt-in per account; the password always works as a fallback.
 */
export async function enableBiometricSignIn(credentials: Credentials) {
  await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify(credentials), {
    requireAuthentication: true,
    authenticationPrompt: 'Confirm to switch on fingerprint sign-in',
  });
  await SecureStore.setItemAsync(OWNER_KEY, credentials.email.toLowerCase());
}

export async function disableBiometricSignIn() {
  await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
  await SecureStore.deleteItemAsync(OWNER_KEY);
}

/** The email that fingerprint sign-in belongs to, read without a prompt. */
export async function biometricOwner() {
  if (Platform.OS === 'web') return null;
  return SecureStore.getItemAsync(OWNER_KEY);
}

/** Prompts for the fingerprint and returns the saved sign-in, or null if cancelled. */
export async function readBiometricCredentials(): Promise<Credentials | null> {
  try {
    const value = await SecureStore.getItemAsync(CREDENTIALS_KEY, {
      requireAuthentication: true,
      authenticationPrompt: 'Sign in to Selit',
    });
    return value ? (JSON.parse(value) as Credentials) : null;
  } catch {
    return null;
  }
}
