import { CancelButtonIcon } from "@app/components/icons";
import { Button, type ButtonProps } from "@app/components/ui/button";
import { useTranslation } from "~/locales/provider";

export function CancelButton({ variant = "secondary", children, icon, ...props }: ButtonProps) {
    const { t } = useTranslation();

    return (
        <Button variant={variant} {...props}>
            {icon ? icon : <CancelButtonIcon aria-hidden className="h-btn-icon w-btn-icon" />}
            {children || t.form.cancel}
        </Button>
    );
}
