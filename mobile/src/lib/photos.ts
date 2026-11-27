import type { PhotoUpload } from '@selit/shared';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export type PickedPhoto = { uri: string; width: number; height: number };

const MAX_EDGE = 1280;

/**
 * Shrinks a photo on the phone before upload (often 4–8 MB down to ~200 KB),
 * so uploads work on slow networks and storage stays small.
 */
export async function toPhotoUpload(photo: PickedPhoto, maxEdge = MAX_EDGE): Promise<PhotoUpload> {
  const scale = Math.min(1, maxEdge / Math.max(photo.width || maxEdge, photo.height || maxEdge));
  const context = ImageManipulator.manipulate(photo.uri);
  if (scale < 1) {
    context.resize({ width: Math.round(photo.width * scale), height: Math.round(photo.height * scale) });
  }
  const image = await context.renderAsync();
  // WebP keeps photos smallest; iOS saves JPEG, which every browser also shows.
  const format = Platform.OS === 'android' || Platform.OS === 'web' ? SaveFormat.WEBP : SaveFormat.JPEG;
  const saved = await image.saveAsync({ compress: 0.78, format });
  const body = await (await fetch(saved.uri)).arrayBuffer();
  return {
    body,
    contentType: format === SaveFormat.WEBP ? 'image/webp' : 'image/jpeg',
    previewUrl: saved.uri,
  };
}

export function toPhotoUploads(photos: PickedPhoto[], maxEdge?: number) {
  return Promise.all(photos.map((photo) => toPhotoUpload(photo, maxEdge)));
}

async function ensurePermission(source: 'camera' | 'library') {
  const request =
    source === 'camera'
      ? ImagePicker.requestCameraPermissionsAsync
      : ImagePicker.requestMediaLibraryPermissionsAsync;
  const { granted } = await request();
  return granted;
}

/** Opens the camera or the gallery and returns the chosen photos. */
export async function pickPhotos(source: 'camera' | 'library', limit: number): Promise<PickedPhoto[]> {
  if (Platform.OS !== 'web' && !(await ensurePermission(source))) return [];
  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    quality: 1,
    allowsMultipleSelection: source === 'library' && limit > 1,
    selectionLimit: limit,
  };
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
  if (result.canceled) return [];
  return result.assets.slice(0, limit).map((asset) => ({ uri: asset.uri, width: asset.width, height: asset.height }));
}
