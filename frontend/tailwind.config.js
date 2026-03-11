module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./charts/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#050917",
        panel: "#0c142c",
        card: "#101a36",
        glow: "#39b8ff",
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(57,184,255,0.22)",
      },
      backgroundImage: {
        gradientMain: "radial-gradient(circle at 20% 10%, rgba(56,189,248,0.22), transparent 35%), radial-gradient(circle at 80% 0%, rgba(99,102,241,0.22), transparent 35%), linear-gradient(130deg,#050917,#0a1230 58%,#0a1a4a)",
      }
    }
  },
  plugins: []
};
