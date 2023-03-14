/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
  
      colors: {
        "db-dark": "#131B2A",
        "db-dark-info": '#586b8c',
        "db-dark-input": '#2a374d',
        "db-dark-nav": '#1D2738',
        "db-light": "#F4FBFE",
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
      keyframes: {
        zoom: {
          "0%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.05)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        "slide-left-to-right": {
          "0%": {
            transform: "translate(-50px)",
          },
          "50%": {
            transform: "translate(50px)",
          },
          "100%": {
            transform: "translate(-50px)",
          },
        },
        "slide-right": {
          "0%": {
            transform: "translate(0)",
          },
          "50%": {
            transform: "translate(50px)",
          },
          "100%": {
            transform: "translate(0px)",
          },
        },
        "slide-left": {
          "0%": {
            transform: "translate(0)",
          },
          "50%": {
            transform: "translate(-50px)",
          },
          "100%": {
            transform: "translate(0px)",
          },
        },
        "toast-slider": {
          "0%": {
            width: "0%",
          },
          "100%": {
            width: "100%",
          },
        },
        toast: {
          "0%": {
            transform: "translate(-500px)",
            opacity: 0,
          },
          "3%": {
            transform: "translate(0px)",
            opacity: 1,
          },
          "97%": {
            transform: "translate(0px)",
            opacity: 1,
          },
          "100%": {
            transform: "translate(-500px)",
            opacity: 1,
          },
        },
      },
      animation: {
        "slide-left-to-right": "slide-left-to-right 1500ms linear count(3)",
        "slide-right": "slide-right 1000ms linear infinite",
        "slide-left": "slide-left 1000ms linear infinite",
        toast: "toast 5500ms linear",
        zoom: "zoom 1000ms linear infinite",
        "toast-slider": "toast-slider 5000ms linear",
      },
    },
  },
  plugins: [],
};
