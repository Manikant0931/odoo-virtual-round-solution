/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern: /(bg|text)-(moss|coral|indigo|violet|amber)-(400|500|600|700)/,
      variants: ["hover"],
    },
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B120E",
          900: "#101A14",
          800: "#16221B",
          700: "#1F2E25",
          600: "#2C3F32",
        },
        paper: {
          50: "#F6F7F4",
          100: "#EEF0EA",
          200: "#E1E5DB",
        },
        moss: {
          400: "#7FA98A",
          500: "#5C8A6C",
          600: "#3F6B4C",
          700: "#2E5038",
        },
        amber: {
          400: "#E3A855",
          500: "#CC8B2E",
          600: "#A66E1F",
        },
        indigo: {
          400: "#7C8FD6",
          500: "#5A6FC0",
          600: "#4456A0",
        },
        violet: {
          400: "#B08BD6",
          500: "#9468C0",
          600: "#7850A0",
        },
        coral: {
          400: "#E08A7A",
          500: "#D06B58",
          600: "#B0503F",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        sig: "1.25rem",
      },
      boxShadow: {
        panel: "0 1px 2px rgba(11,18,14,0.04), 0 8px 24px -8px rgba(11,18,14,0.10)",
      },
    },
  },
  plugins: [],
};
