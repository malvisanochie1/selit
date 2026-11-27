import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// SecureStore keeps values in the Android Keystore / iOS Keychain but caps each
// value at about 2 KB, so longer values (auth sessions) are split into chunks.
const CHUNK_SIZE = 1800;

function chunkKey(key: string, index: number) {
  return `${key}.${index}`;
}

async function getItem(key: string) {
  if (Platform.OS === 'web') return globalThis.localStorage?.getItem(key) ?? null;
  const count = Number(await SecureStore.getItemAsync(`${key}.count`));
  if (!count) return null;
  const parts: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const part = await SecureStore.getItemAsync(chunkKey(key, index));
    if (part === null) return null;
    parts.push(part);
  }
  return parts.join('');
}

async function removeItem(key: string) {
  if (Platform.OS === 'web') return globalThis.localStorage?.removeItem(key);
  const count = Number(await SecureStore.getItemAsync(`${key}.count`));
  for (let index = 0; index < count; index += 1) {
    await SecureStore.deleteItemAsync(chunkKey(key, index));
  }
  await SecureStore.deleteItemAsync(`${key}.count`);
}

async function setItem(key: string, value: string) {
  if (Platform.OS === 'web') return globalThis.localStorage?.setItem(key, value);
  await removeItem(key);
  const count = Math.ceil(value.length / CHUNK_SIZE);
  for (let index = 0; index < count; index += 1) {
    await SecureStore.setItemAsync(
      chunkKey(key, index),
      value.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE),
    );
  }
  await SecureStore.setItemAsync(`${key}.count`, String(count));
}

/** Storage for secrets (sessions, tokens), encrypted by the operating system. */
export const secureStorage = { getItem, setItem, removeItem };
