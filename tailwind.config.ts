import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#070707",
        bone: "#f6f5f1",
        smoke: "#d9d8d3",
        steel: "#8f9292",
        chrome: "#eceff0"
      },
      fontFamily: {
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"]
      },
      letterSpacing: {
        archive: "0.18em"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(0, 0, 0, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
