import type { Config } from "tailwindcss";

export default {
    content: ["./app/**/*.{ts,tsx,css}"],
    darkMode: ["class"],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "90rem",
            },
        },
        extend: {
            fontFamily: {
                mono: ["JetBrainsMono Nerd Font Mono", "JetBrainsMono", "ui-monospace", "monospace"],
            },

            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
            colors: {
                background: "hsla(var(--background))",
                "card-background": "hsla(var(--card-background))",
                "accent-background": "hsla(var(--accent-background))",
                "shallow-background": "hsla(var(--shallow-background))",
                "shallower-background": "hsla(var(--shallower-background))",
                foreground: "hsla(var(--foreground))",
                "foreground-bright": "hsla(var(--foreground-bright))",
                "accent-foreground": "hsla(var(--accent-foreground))",
                "muted-foreground": "hsla(var(--muted-foreground))",
                "extra-muted-foreground": "hsla(var(--extra-muted-foreground))",
                "danger-background": "hsla(var(--danger-background))",
                "danger-foreground": "hsla(var(--danger-foreground))",
                "warning-background": "hsla(var(--warning-background))",
                "warning-foreground": "hsla(var(--warning-foreground))",
                "success-background": "hsla(var(--success-background))",
                "success-foreground": "hsla(var(--success-foreground))",
                "link-foreground": "hsla(var(--link-foreground))",
                "link-hover-foreground": "hsla(var(--link-hover-foreground))",
                "chart-1": "hsla(var(--chart-1))",
            },
            fontSize: {
                "super-tiny": "var(--font-super-tiny)",
                tiny: "var(--font-tiny)",
                sm: "var(--font-sm)",
                base: "var(--font-base)",
                md: "var(--font-md)",
                lg: "var(--font-lg)",
                "lg-plus": "var(--font-lg-plus)",
                xl: "var(--font-xl)",
                "xl-plus": "var(--font-xl-plus)",
                "2xl": "var(--font-2xl)",
            },
            borderRadius: {
                sm: "0.33rem",
                md: "0.5rem",
                DEFAULT: "0.67rem",
                lg: "1em",
                xl: "1.3rem",
                "2xl": "1.77rem",
                "3xl": "2.5rem",
            },
            gap: {
                space: "0.6ch",
                "panel-cards": "0.75rem",
                "form-elements": "1rem",
            },
            screens: {
                sm: "40rem",
                md: "48rem",
                lg: "64rem",
                xl: "80rem",
                "2xl": "96rem",
            },
            height: {
                "nav-item": "2.5rem",
                "btn-icon-sm": "0.87rem",
                "btn-icon": "1.05rem",
                "btn-icon-md": "1.2rem",
                "btn-icon-lg": "1.35rem",
                "iconified-btn": "2.25rem",
                "form-submit-btn": "2.25rem",
            },
            width: {
                "nav-item": "2.5rem",
                "btn-icon-sm": "0.87rem",
                "btn-icon": "1.05rem",
                "btn-icon-md": "1.2rem",
                "btn-icon-lg": "1.35rem",
                "iconified-btn": "2.25rem",
                sidebar: "19rem",
            },
            padding: {
                "card-surround": "1.1rem",
                "table-side-pad-sm": "1rem",
                "table-side-pad": "2rem",
            },
            margin: {
                "card-surround": "1.1rem",
            },
            transitionDuration: {
                DEFAULT: "200ms",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
