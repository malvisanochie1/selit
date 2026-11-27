const palette = require('../shared/src/theme/palette.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: palette.ink,
        canvas: palette.canvas,
        surface: palette.surface,
        line: palette.line,
        'line-strong': palette.lineStrong,
        brand: palette.brand,
        glow: palette.glow,
        amber: palette.amber,
        danger: palette.danger,
        info: palette.info,
      },
      // One family per weight: Android ignores fontWeight with custom fonts.
      fontFamily: {
        body: ['PlusJakartaSans_400Regular'],
        'body-medium': ['PlusJakartaSans_500Medium'],
        'body-semibold': ['PlusJakartaSans_600SemiBold'],
        'body-bold': ['PlusJakartaSans_700Bold'],
        display: ['BricolageGrotesque_600SemiBold'],
        'display-bold': ['BricolageGrotesque_700Bold'],
      },
    },
  },
  plugins: [],
};
