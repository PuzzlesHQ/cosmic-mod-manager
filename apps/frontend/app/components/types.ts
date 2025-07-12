import type { SVGProps } from "react";

export { cva, type VariantProps } from "class-variance-authority";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: string;
};
