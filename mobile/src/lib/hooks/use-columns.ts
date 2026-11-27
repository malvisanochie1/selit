import { useWindowDimensions } from 'react-native';

/** Grid columns for the current screen width: 2 on phones, more on tablets and desktop. */
export function useColumns(base = 2) {
  const { width } = useWindowDimensions();
  if (width >= 1100) return base + 2;
  if (width >= 720) return base + 1;
  return base;
}
