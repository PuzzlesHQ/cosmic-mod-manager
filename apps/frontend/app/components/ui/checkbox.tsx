import { CheckIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cn } from "~/components/utils";
import { Label } from "./label";

function Checkbox({ ref, className, name, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            ref={ref}
            className={cn(
                "peer relative h-4 w-4 shrink-0 rounded-sm bg-raised-background transition-opacity disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent-bg data-[state=checked]:text-accent-bg-foreground",
                className,
            )}
            name={name}
            aria-label={name}
            {...props}
        >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
                <CheckIcon aria-hidden className="h-btn-icon-sm w-btn-icon-sm" strokeWidth="2.5" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

interface LabelledCheckboxProps {
    checked: boolean | undefined;
    className?: string;
    checkBoxClassname?: string;
    onCheckedChange?: (e: CheckboxPrimitive.CheckedState) => void;
    disabled?: boolean;
    checkBoxId?: string;
    name?: string;
}

function LabelledCheckbox({
    ref,
    checkBoxId,
    children,
    checked,
    className,
    checkBoxClassname,
    onCheckedChange,
    disabled,
    name,
    ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & LabelledCheckboxProps) {
    return (
        <Label
            className={cn(
                "flex cursor-not-allowed items-center justify-start gap-x-2.5 py-1 font-normal text-base text-foreground-muted leading-tight opacity-75 transition",
                !disabled && "cursor-pointer opacity-100 hover:brightness-[85%]",
                className,
            )}
            title={props.title}
        >
            <Checkbox
                id={checkBoxId}
                checked={checked}
                onCheckedChange={onCheckedChange}
                className={checkBoxClassname}
                disabled={disabled}
                ref={ref}
                name={name}
            />
            {children}
        </Label>
    );
}

export { Checkbox, LabelledCheckbox };
