import { CheckIcon, MinusIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "~/components/utils";
import { Label } from "./label";

export enum TernaryStates {
    INCLUDED = 1,
    UNCHECKED = 0,
    EXCLUDED = -1,
}

export function useTernaryState(init?: TernaryStates) {
    return useState<TernaryStates>(init || TernaryStates.UNCHECKED);
}

interface ThreeStateCheckboxProps extends React.ComponentProps<"div"> {
    state: TernaryStates;
    onCheckedChange: (val: TernaryStates) => void;
    disabled?: boolean;
}

export function TernaryCheckbox(props: ThreeStateCheckboxProps) {
    function handleClick() {
        if (props.disabled) return;
        if (props.state === TernaryStates.UNCHECKED) props.onCheckedChange(TernaryStates.INCLUDED);
        else if (props.state === TernaryStates.INCLUDED) props.onCheckedChange(TernaryStates.EXCLUDED);
        else if (props.state === TernaryStates.EXCLUDED) props.onCheckedChange(TernaryStates.UNCHECKED);
    }

    return (
        // biome-ignore lint/a11y/useSemanticElements: can't really use a checkbox here, since it has three states
        <button
            type="button"
            role="checkbox"
            aria-checked={props.state !== TernaryStates.UNCHECKED}
            onClick={handleClick}
            className={cn(
                "flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm",
                props.state === TernaryStates.UNCHECKED && "bg-raised-background",
                props.state === TernaryStates.INCLUDED && "bg-primary-btn-bg text-primary-btn-fg",
                props.state === TernaryStates.EXCLUDED && "bg-danger-btn-bg text-danger-btn-fg",
                props.className,
            )}
        >
            {props.state === TernaryStates.INCLUDED ? (
                <CheckIcon aria-hidden className="h-btn-icon-sm w-btn-icon-sm" strokeWidth="2.7" />
            ) : null}
            {props.state === TernaryStates.EXCLUDED ? (
                <MinusIcon aria-hidden className="h-btn-icon-sm w-btn-icon-sm" strokeWidth="2.5" />
            ) : null}
        </button>
    );
}

interface LabelledCheckboxProps extends ThreeStateCheckboxProps {
    className?: string;
    checkBoxClassname?: string;
    disabled?: boolean;
    checkBoxId?: string;
}

export function LabelledTernaryCheckbox(props: LabelledCheckboxProps) {
    return (
        <Label
            className={cn(
                "flex cursor-not-allowed items-center justify-start gap-x-2.5 py-1 font-normal text-base text-foreground-muted leading-tight opacity-75 transition",
                !props.disabled && "cursor-pointer opacity-100 hover:brightness-90 dark:hover:brightness-115",
                props.state === TernaryStates.EXCLUDED && "text-error-fg",
                props.className,
            )}
            title={props.title}
        >
            <TernaryCheckbox
                id={props.checkBoxId}
                state={props.state}
                onCheckedChange={props.onCheckedChange}
                className={props.checkBoxClassname}
                disabled={props.disabled}
                ref={props.ref}
            />
            {props.children}
        </Label>
    );
}
