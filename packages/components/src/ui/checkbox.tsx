import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "~/utils";
import { Label } from "./label";

function Checkbox({ ref, className, name, ...props }: React.ComponentPropsWithRef<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            ref={ref}
            className={cn(
                "peer relative h-4 w-4 shrink-0 rounded-sm bg-shallower-background/85 transition-opacity disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[hsla(var(--accent-background-dark))] data-[state=checked]:text-background",
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
    checked: boolean;
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
}: React.ComponentPropsWithRef<typeof CheckboxPrimitive.Root> & LabelledCheckboxProps) {
    return (
        <Label
            className={cn(
                "flex text-base font-normal py-1 gap-x-2.5 leading-tight items-center justify-start transition cursor-not-allowed text-muted-foreground opacity-75",
                !disabled && "hover:brightness-[85%] cursor-pointer opacity-100",
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
