import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sentinel: {
          primary: "#bf2451",
          900: "#141517",
          800: "#1e1f21",
          700: "#2a2b2e",
        },
      },
    },
  },
  plugins: [],
};
export default config;