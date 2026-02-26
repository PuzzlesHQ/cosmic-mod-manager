# Theme palette

*css variables for defining a new theme*

## Adding a custom theme

1. **Create a CSS file** at `app/components/themes/your-theme.css`.
    - Copy paste this boilerplate code
        ```css
        @tailwind utilities;

        @layer utilities {
            .YOUR_THEME {
                
            }
        }
        ```
    
    - Add the fallback theme and color scheme (dark/light) at the top
        ```css
        @apply dark;
        color-scheme: dark;
        ```

        If you're adding a light theme you'd make `light` the fallback theme and `color-scheme: light;` instead.


    - Now you can start adding the theme variables (See [the format below](#format))
        ```css
        --foreground-bright: 0, 0%, 100%;
        /* ... rest of the variables */
        ```

2. **Import the file** in `app/components/themes/index.css` at the bottom:

    ```css
    /* existing themes */
    @import "./your-theme.css";
    ```

3. **Register the theme** in [`app/components/themes/config.tsx`](/apps/frontend/app/components/themes/config.tsx):

    - Add a key to the `ThemePreference` enum:
        ```ts
        export enum ThemePreference {
            // ...existing themes
            YOUR_THEME = "your-theme",
        }
        ```

    - Add an entry to the `Themes` array:
        ```ts
        {
            label: "Your Theme",
            name: ThemePreference.YOUR_THEME,
            icon: <SomeIcon className="h-5 w-5 text-current" />,
            variant: ThemeVariant.DARK, // or ThemeVariant.LIGHT
        }
        ```
        If you're not sure about the icon, just copy the icon of dark/light theme.

---

### Format

All the Colors must be hsl values without the wrapping `hsl()` function. \
Example: `--color: h, s%, l%, a;` \
where: `h` is hue (0-360), `s` is saturation (%), `l` is lightness (%) and `a` is alpha/opacity (optional)

You can also reference the [base theme](/apps/frontend/app/components/themes/_base.css).

| **Text Colors** | |
|:-- | :-- |
| --foreground-bright | A bright text color (primarily used for section/page titles) |
| --foreground | The regular body text color |
| --foreground-muted | Secondary text color |
| --foreground-extra-muted | Tertiary text color (mostly used for decorative items like svg icons) |
| --foreground-link | A distinct color for links (Usually a bluish color or the accent color) |

| **Background Colors** |  |
|:-- | :-- |
| --background | Regular body background |
| --card-background | Background color for cards |
| --raised-background | Background color for raised surfaces like Secondary btn bg, button style links' bg etc |
| --hover-background | Background for hover state |
| --hover-background-strong | A stronger version of hover-background for some special use cases |

| **Accents Colors** |  |
|:-- | :-- |
| --accent-text | Accent colored text |
| --accent-bg | Accent colored background |
| --accent-bg-foreground | Text color to be used when it's on `accent-bg` background, it's separate from regular text color because that might not always be readable on the accent background |

| **Status Colors** |  |
|:-- | :-- |
| --error-fg | Error text color |
| --error-bg | A tinted background for error message box |
| --warning-fg | Warning text color |
| --warning-bg | A tinted background for warning message box |
| --success-fg | success text color |
| --success-bg | A tinted background for success message box |

| **Buttons** |  |
|:-- | :-- |
| --primary-btn-bg | Background color of primary action button (Usually accent color) |
| --primary-btn-fg | Text color for primary button |
| --secondary-btn-bg | Background color of secondary action button (Usually a greyish color) |
| --secondary-btn-fg | Text color for secondary button (Similar the foreground color in most cases) |
| --danger-btn-bg | Background color of destructive action button (A variant of red) |
| --danger-btn-fg | Text color for destructive button |
| --moderation-btn-bg | A yellowish colored background for moderation related buttons |
| --moderation-btn-fg | Text color for moderation button |

| **Decorations** |  |
|:-- | :-- |
| --shadow | Shadow color |
| --border | Border color |
| --separator | Separator color (usually less strong than border color) |

| **Charts** |  |
|:-- | :-- |
| --chart-1 | Primary chart/graph color (used in analytics charts) |

| **Loader Colors** | Text color for mod loaders and plugins |
|:-- | :-- |
| --loader-fg-quilt | |
| --loader-fg-puzzle_loader | |
| --loader-fg-paradox | |
| --loader-fg-simply_shaders | |

| **User Role Colors** |  |
|:-- | :-- |
| --role-moderator-fg | Username/badge color for moderators |
| --role-admin-fg | Username/badge color for admins |

| **Border Radius** |  |
|:-- | :-- |
| --radius-sm | |
| --radius-md | |
| --radius-DEFAULT | |
| --radius-lg | |
| --radius-xl | |
| --radius-2xl | |
| --radius-3xl | |
| --radius-full | |

| **Font Sizes** | From small to large |
|:-- | :-- |
| --font-super-tiny | |
| --font-tiny | |
| --font-sm | |
| --font-base | |
| --font-md | |
| --font-lg | |
| --font-lg-plus | |
| --font-xl | |
| --font-xl-plus | |
| --font-2xl | |
