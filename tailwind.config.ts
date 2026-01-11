import { p } from 'framer-motion/client';
import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          light: '#1E3A8A',
          dark: '#3B82F6',
          DEFAULT: '#1E3A8A',
        },
        secondary: {
          light: '#10B981',
          dark: '#34D399',
          DEFAULT: '#10B981',
        },
        tertiary: {
          light: '#F1F5F9',
          dark: '#111827',
          DEFAULT: '#F1F5F9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;
