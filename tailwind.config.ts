import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Wealth Manager Theme - Core Colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#000000", // Pure black background
        foreground: "#ffffff", // Pure white text
        
        // Primary Gold System
        primary: {
          DEFAULT: "#fbbf24", // Amber-400
          foreground: "#000000",
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        
        // Secondary Gold Variants
        secondary: {
          DEFAULT: "#eab308", // Yellow-500
          foreground: "#000000",
        },
        
        // Wealth Manager Gray Scale
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af", // Secondary text
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937", // Card borders
          900: "#111827", // Card backgrounds
          950: "#0a0a0a", // Dark card variant
        },
        
        // Semantic Colors
        destructive: {
          DEFAULT: "#ef4444", // Red-500
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#10b981", // Emerald-500
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59e0b", // Amber-500
          foreground: "#000000",
        },
        
        // Component-Specific Colors
        muted: {
          DEFAULT: "#0a0a0a", // Very dark gray
          foreground: "#9ca3af", // Light gray text
        },
        accent: {
          DEFAULT: "#1a1a1a", // Dark gray for accents
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "rgba(17, 24, 39, 0.3)", // Gray-900 with opacity
          foreground: "#ffffff",
          border: "#1f2937", // Gray-800
        },
        
        // Wealth Manager Specific Colors
        "wm-black": "#000000",
        "wm-gold": "#fbbf24",
        "wm-gold-light": "#fcd34d",
        "wm-gold-dark": "#f59e0b",
      },
      
      // Enhanced Border Radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      
      // Backdrop Blur Utilities
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
      },
      
      // Box Shadow Enhancements
      boxShadow: {
        'wm-card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'wm-card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'wm-glow': '0 0 20px rgba(251, 191, 36, 0.3)',
        'wm-glow-lg': '0 0 40px rgba(251, 191, 36, 0.2)',
      },
      
      // Animation Keyframes
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
      },
      
      // Custom Animations
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "shimmer": "shimmer 2s linear infinite",
      },
      
      // Typography Extensions
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.16' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.05' }],
      },
      
      // Spacing Extensions
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom Wealth Manager Plugin
    function({ addUtilities }: { addUtilities: (utilities: Record<string, any>) => void }) {
      const newUtilities = {
        '.wm-card': {
          backgroundColor: 'rgba(17, 24, 39, 0.3)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #1f2937',
          borderRadius: '1rem', 
        },
        '.wm-card:hover': {
          borderColor: 'rgba(251, 191, 36, 0.3)',
        },
        '.wm-gold-gradient': {
          background: 'linear-gradient(to right, #fbbf24, #eab308)',
        },
        '.wm-text-gold': {
          background: 'linear-gradient(to right, #fbbf24, #eab308)',
          '-webkit-background-clip': 'text',
          backgroundClip: 'text',
          color: 'transparent',
        },
        '.wm-glow': {
          boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config

export default config
