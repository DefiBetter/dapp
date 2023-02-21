/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "db-cyan-process": "#2aaee6",
        "db-background": "#cce5ff",
        "db-blue-gray": "#6D90C2",
        "db-little-boy": "#7EA6E0",
        "db-french-sky": "#8FBDFF",
        "db-beau-blue": "#D5E7F2",
        "db-cadet-grey": "#849CB3",
        "db-light-slate": "#758A9E",
      },
      fontFamily: {
        fancy: "marguerite",
      },
      boxShadow: {
        db: "2px 2px 0px 0px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
