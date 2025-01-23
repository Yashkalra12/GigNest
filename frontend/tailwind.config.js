import { Select } from '@mui/material';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        notoSerif: ["Noto Serif Display", "serif"],
      },
    },
  },
  plugins: [],
  darkMode: 'selector' ,
};
