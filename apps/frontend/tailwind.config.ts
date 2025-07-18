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
            brightness: {
                115: "1.15",
                85: "0.85",
            },
            colors: {
                "foreground-bright": "hsla(var(--foreground-bright))",
                foreground: "hsla(var(--foreground))",
                "foreground-muted": "hsla(var(--foreground-muted))",
                "foreground-extra-muted": "hsla(var(--foreground-extra-muted))",
                "foreground-link": "hsla(var(--foreground-link))",

                background: "hsla(var(--background))",
                "card-background": "hsla(var(--card-background))",
                "raised-background": "hsla(var(--raised-background))",
                "hover-background": "hsla(var(--hover-background))",
                "hover-background-strong": "hsla(var(--hover-background-strong))",

                "accent-text": "hsla(var(--accent-text))",
                "accent-bg": "hsla(var(--accent-bg))",
                "accent-bg-foreground": "hsla(var(--accent-bg-foreground))",

                "error-fg": "hsla(var(--error-fg))",
                "error-bg": "hsla(var(--error-bg))",
                "warning-fg": "hsla(var(--warning-fg))",
                "warning-bg": "hsla(var(--warning-bg))",
                "success-fg": "hsla(var(--success-fg))",
                "success-bg": "hsla(var(--success-bg))",

                "primary-btn-bg": "hsla(var(--primary-btn-bg))",
                "primary-btn-fg": "hsla(var(--primary-btn-fg))",
                "secondary-btn-bg": "hsla(var(--secondary-btn-bg))",
                "secondary-btn-fg": "hsla(var(--secondary-btn-fg))",
                "danger-btn-bg": "hsla(var(--danger-btn-bg))",
                "danger-btn-fg": "hsla(var(--danger-btn-fg))",
                "moderation-btn-bg": "hsla(var(--moderation-btn-bg))",
                "moderation-btn-fg": "hsla(var(--moderation-btn-fg))",

                shadow: "hsla(var(--shadow))",
                border: "hsla(var(--border))",
                separator: "hsla(var(--separator))",

                "role-moderator-fg": "hsla(var(--role-moderator-fg))",
                "role-admin-fg": "hsla(var(--role-admin-fg))",

                //  ----------
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
                sm: "var(--radius-sm)",
                md: "var(--radius-md)",
                DEFAULT: "var(--radius-DEFAULT)",
                lg: "var(--radius-lg)",
                xl: "var(--radius-xl)",
                "2xl": "var(--radius-2xl)",
                "3xl": "var(--radius-3xl)",
                full: "var(--radius-full)",
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
