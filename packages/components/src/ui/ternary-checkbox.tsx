import { CheckIcon, MinusIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "~/utils";
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
        <button
            type="button"
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="checkbox"
            aria-checked={props.state !== TernaryStates.UNCHECKED}
            onClick={handleClick}
            className={cn(
                "flex items-center justify-center w-4 h-4 rounded-sm cursor-pointer text-background",
                props.state === TernaryStates.UNCHECKED && "bg-shallower-background/85",
                props.state === TernaryStates.INCLUDED && "bg-[hsla(var(--accent-background-dark))]",
                props.state === TernaryStates.EXCLUDED && "bg-danger-background",
                props.className,
            )}
        >
            {props.state === TernaryStates.INCLUDED ? (
                <CheckIcon aria-hidden className="h-btn-icon-sm w-btn-icon-sm" strokeWidth="2.5" />
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
                "flex text-base font-normal py-1 gap-x-2.5 leading-tight items-center justify-start transition cursor-not-allowed text-muted-foreground opacity-75",
                !props.disabled && "hover:brightness-[85%] cursor-pointer opacity-100",
                props.state === TernaryStates.EXCLUDED && "text-danger-foreground",
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
