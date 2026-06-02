/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "tl-bg": "oklch(0.997 0 0)",
        "tl-surface": "oklch(1 0 0)",
        "tl-surface-muted": "oklch(0.965 0 0)",
        "tl-panel": "oklch(0.985 0 0)",
        "tl-sidebar": "oklch(1 0 0)",
        "tl-sidebar-muted": "oklch(0.9 0 0)",
        "tl-text": "oklch(0.18 0 0)",
        "tl-text-muted": "oklch(0.44 0 0)",
        "tl-text-soft": "oklch(0.62 0 0)",
        "tl-border": "oklch(0.86 0 0)",
        "tl-border-strong": "oklch(0.74 0.01 95)",
        "tl-accent": "oklch(0.54 0.13 245)",
        "tl-accent-ink": "oklch(0.99 0.004 95)",
        "tl-focus": "oklch(0.62 0.14 245)",
        "tl-source": "oklch(0.47 0.11 150)",
        "tl-source-bg": "oklch(0.94 0.035 150)",
        "tl-verify": "oklch(0.58 0.12 78)",
        "tl-verify-bg": "oklch(0.95 0.05 78)",
        "tl-assumption": "oklch(0.55 0.11 245)",
        "tl-assumption-bg": "oklch(0.94 0.035 245)",
        "tl-conflict": "oklch(0.52 0.15 28)",
        "tl-conflict-bg": "oklch(0.95 0.035 28)",
      },
      borderRadius: {
        "tl-sm": "6px",
        "tl-md": "8px",
        "tl-lg": "10px",
      },
      fontFamily: {
        sans: ["Geist", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "SFMono-Regular", "Consolas", "monospace"],
      },
      transitionDuration: {
        "tl-fast": "150ms",
        "tl-base": "250ms",
        "tl-slow": "350ms",
        "tl-panel": "400ms",
      },
      zIndex: {
        sidebar: "30",
        "trust-lens": "40",
        recheck: "45",
        modal: "50",
        toast: "60",
      },
      boxShadow: {
        "tl-soft": "0 16px 40px oklch(0.22 0.01 95 / 0.08)",
        "tl-composer": "0 18px 60px oklch(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};
