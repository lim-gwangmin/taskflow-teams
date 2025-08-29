// tailwind.config.js
const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(alert|avatar|button|calendar|card|checkbox|date-input|date-picker|dropdown|image|input|link|listbox|menu|modal|navbar|number-input|pagination|popover|radio|scroll-shadow|select|toggle|table|tabs|user|ripple|spinner|form|divider|spacer).js",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};