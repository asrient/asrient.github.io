/** @type {import('tailwindcss').Config} */

import { readFileSync, readdirSync } from 'fs';

const THEMES_PATH = 'config/themes';

const colors = {};

// temporary hack for dark mode
const explicitSafeList = [];

// ADD HERE MANUALLY ALL THE DARK MODE ACCENT COLORS USED
const DARK_MODE_ENABLE = [
  'bg-accent-5',
  'bg-accent-4',
  'border-accent-2',
  'border-accent-3',
  'text-accent-2',
  'border-accent-4'
]

function importTheme(themeData, themeName) {
  // import colors from theme
  Object.keys(themeData?.light || []).forEach((color) => {
    colors[`${color}-${themeName}`] = themeData.light[color];
  });
  Object.keys(themeData?.dark || []).forEach((color) => {
    colors[`${color}-${themeName}-dark`] = themeData.dark[color];
  });

  DARK_MODE_ENABLE.forEach((item) => {
    explicitSafeList.push(`dark:${item}-${themeName}-dark`);
  })
}

readdirSync(THEMES_PATH).map((filename) => {
  const themePath = `${THEMES_PATH}/${filename}`;
  const themeName = filename.split('.')[0];
  const themeData = JSON.parse(readFileSync(themePath, 'utf8'));
  importTheme(themeData, themeName);
});

module.exports = {
  content: ['./components/**/*.tsx', './pages/**/*.tsx'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        ...colors,
        success: '#0070f3',
        cyan: '#79FFE1',
      },
      spacing: {
        28: '7rem',
      },
      letterSpacing: {
        tighter: '-.04em',
      },
      lineHeight: {
        tight: 1.2,
      },
      fontSize: {
        '5xl': '2.5rem',
        '6xl': '2.75rem',
        '7xl': '4.5rem',
        '8xl': '6.25rem',
      },
      boxShadow: {
        sm: '0 5px 10px rgba(0, 0, 0, 0.12)',
        md: '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /.*-accent-.*/,
    },
    ...explicitSafeList
  ]
}
