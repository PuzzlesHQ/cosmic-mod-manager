import type { SVGProps } from "react";

export { ThemeOptions, type UseThemeProps } from "@app/utils//types";
export { cva, type VariantProps } from "class-variance-authority";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: string;
};
