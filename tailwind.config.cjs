/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    fontFamily: {
      montSerrat: ["Montserrat, sans-serif"],
    },
    extend: {
      colors: {
        "mega-sena": "#6BEFA3",
        quina: "#8666EF",
        "loto-facil": "#DD7AC6",
        "loto-mania": "#FFAB64",
        "time-mania": "#5AAD7D",
        "dia-de-sorte": "#BFAF83",
      },
    },
  },
  plugins: [],
};
