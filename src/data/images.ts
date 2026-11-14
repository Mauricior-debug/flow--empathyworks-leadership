import type { ImageSource } from 'expo-image';
import type { PhotoKey } from '../store/types';

export const mark = require('../../assets/mark.png');
export const wordmark = require('../../assets/logo.png');
export const appIcon = require('../../assets/apple-touch-icon.png');

export const photos: Record<PhotoKey, ImageSource> = {
  hero: require('../../assets/photos/hero.jpg'),
  hiker: require('../../assets/photos/hiker.jpg'),
  reflective: require('../../assets/photos/reflective.jpg'),
  steveNeil: require('../../assets/photos/steveNeil.jpg'),
  neilCoaching: require('../../assets/photos/neilCoaching.jpg'),
  steveStage: require('../../assets/photos/steveStage.jpg'),
  steveSuit: require('../../assets/photos/steveSuit.jpg'),
  stevePortrait: require('../../assets/photos/stevePortrait.jpg'),
  avSteve: require('../../assets/photos/avSteve.jpg'),
  avNeil: require('../../assets/photos/avNeil.jpg'),
};

export function photoSource(key?: string | null): ImageSource | null {
  if (!key) return null;
  if (key.startsWith('data:') || key.startsWith('file:') || key.startsWith('content:')) return { uri: key };
  if (key in photos) return photos[key as PhotoKey];
  return null;
}
