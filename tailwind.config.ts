import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        barber: {
          black: "#080706",
          charcoal: "#171412",
          brass: "#c89b3c",
          cream: "#f3ead7",
          muted: "#9a8f7f",
          graphite: "#111418",
          steel: "#66717d",
          chrome: "#d9e2ea",
          frost: "#f6fbff",
          silver: "#9aa4ad",
        },
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
