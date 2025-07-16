# Theme palette

*css variables for defining a new theme*

### Format

All the Colors must be hsl values without the wrapping `hsl()` function. \
Example: `--color: h, s%, l%, a;` \
where: `h` is hue (0-360), `s` is saturation (%), `l` is lightness (%) and `a` is alpha/opacity (optional)


| Variable Name | Description |
|:-- | :-- |
| |  |
| **Text Colors** |  |
| --foreground-bright | A bright text color (primarily used for section/page titles) |
| --foreground | The regular body text color |
| --foreground-muted | Secondary text color |
| --foreground-extra-muted | Tertiary text color (mostly used for decorative items like svg icons) |
| --foreground-link | A distinct color for links (Usually a bluish color or the accent color) |
| |  |
| **Background Colors** |  |
| --background | Regular body background |
| --card-background | Background color for cards |
| --raised-background | Background color for raised surfaces like Secondary btn bg, button style links' bg etc |
| --hover-background | Background for hover state |
| --hover-background-strong | A stronger version of hover-background for some special use cases |
|  |  |
| **Accents Colors** |  |
| --accent-text | Accent colored text |
| --accent-bg | Accent colored background |
| --accent-bg-foreground | Text color to be used when it's on `accent-bg` background, it's separate from regular text color because that might not always be readable on the accent background |
|  |  |
| **Status Colors** |  |
| --error-fg | Error text color |
| --error-bg | A tinted background for error message box |
| --warning-fg | Warning text color |
| --warning-bg | A tinted background for warning message box |
| --success-fg | success text color |
| --success-bg | A tinted background for success message box |
|  |  |
| **Buttons** |  |
| --primary-btn-bg | Background color of primary action button (Usually accent color) |
| --primary-btn-fg | Text color for primary button |
| --secondary-btn-bg | Background color of secondary action button (Usually a greyish color) |
| --secondary-btn-fg | Text color for secondary button (Similar the foreground color in most cases) |
| --danger-btn-bg | Background color of destructive action button (A variant of red) |
| --danger-btn-fg | Text color for destructive button |
| --moderation-btn-bg | A yellowish colored background for moderation related buttons |
| --moderation-btn-fg | Text color for moderation button |
|  |  |
| **Decorations** |  |
| --shadow | Shadow color |
| --border | Border color |
| --separator | Separator color (usually less strong than border color) |
