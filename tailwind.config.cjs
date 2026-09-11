/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    screens: {
      xs: "450px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // Base ink — original palette kept, plus deeper surfaces
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",

        // Extended surface ramp
        ink: {
          950: "#05060f",
          900: "#080a18",
          800: "#0d1024",
          700: "#141334",
          600: "#1c1945",
        },

        // Brand accents
        violet: {
          DEFAULT: "#915eff",
          soft: "#b18cff",
          deep: "#6d3ce0",
        },
        aqua: {
          DEFAULT: "#22d3ee",
          soft: "#67e8f9",
          deep: "#0e9bb5",
        },
        blush: "#f272c8",
      },

      fontFamily: {
        sans: ["Sora", "Poppins", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["Sora", "Poppins", "system-ui", "sans-serif"],
        mono: ["Space Grotesk", "ui-monospace", "SFMono-Regular", "monospace"],
        poppins: ["Poppins", "system-ui", "sans-serif"],
      },

      fontSize: {
        // Fluid type — scales smoothly between mobile and desktop
        "fluid-hero": ["clamp(2.15rem, 1.05rem + 4.1vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "fluid-h2": ["clamp(1.9rem, 1.1rem + 3.4vw, 3.75rem)", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "fluid-h3": ["clamp(1.25rem, 0.95rem + 1.2vw, 1.75rem)", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "fluid-body": ["clamp(0.95rem, 0.88rem + 0.35vw, 1.125rem)", { lineHeight: "1.75" }],
        eyebrow: ["clamp(0.65rem, 0.6rem + 0.2vw, 0.8rem)", { lineHeight: "1", letterSpacing: "0.3em" }],
      },

      spacing: {
        "safe-b": "env(safe-area-inset-bottom)",
        "safe-t": "env(safe-area-inset-top)",
        18: "4.5rem",
        30: "7.5rem",
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },

      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
        glow: "0 0 0 1px rgba(145,94,255,.28), 0 18px 60px -18px rgba(145,94,255,.55)",
        "glow-aqua": "0 0 0 1px rgba(34,211,238,.25), 0 18px 60px -18px rgba(34,211,238,.45)",
        lift: "0 24px 70px -24px rgba(0,0,0,.85)",
        inset: "inset 0 1px 0 0 rgba(255,255,255,.06)",
      },

      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
        "grid-fade":
          "linear-gradient(to bottom, transparent, #05060f 78%), repeating-linear-gradient(90deg, rgba(255,255,255,.045) 0 1px, transparent 1px 72px), repeating-linear-gradient(0deg, rgba(255,255,255,.045) 0 1px, transparent 1px 72px)",
        "violet-aqua": "linear-gradient(120deg, #915eff 0%, #b18cff 45%, #22d3ee 100%)",
        "aqua-violet": "linear-gradient(90.13deg, #00cea8 1.9%, #bf61ff 97.5%)",
        "sheen":
          "linear-gradient(105deg, transparent 38%, rgba(255,255,255,.16) 48%, transparent 58%)",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(.22,1,.36,1)",
        snap: "cubic-bezier(.34,1.56,.64,1)",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(0,-26px,0) scale(1.04)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        sheen: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(.9)", opacity: ".7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 45%": { opacity: "1" },
          "50%, 95%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 14s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        "marquee-reverse": "marquee-reverse 38s linear infinite",
        sheen: "sheen 1.1s ease-in-out",
        "gradient-pan": "gradient-pan 8s ease infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0,0,.2,1) infinite",
        "fade-up": "fade-up .7s cubic-bezier(.22,1,.36,1) both",
        blink: "blink 1.1s step-end infinite",
        "scan-line": "scan-line 5s linear infinite",
      },

      backdropBlur: {
        xs: "2px",
      },

      maxWidth: {
        "8xl": "88rem",
      },
    },
  },
  plugins: [],
};
