import type * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import {
    Controller,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
    FormProvider,
    useFormContext,
} from "react-hook-form";
import { Label } from "~/ui/label";
import { cn } from "~/utils";

const Form = FormProvider;

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
};

function useFormField() {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState, formState } = useFormContext();

    const fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>");
    }

    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
}

type FormItemContextValue = {
    id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({ ref, className, ...props }: React.ComponentPropsWithRef<"div">) {
    const id = React.useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div
                ref={ref}
                className={cn("w-full max-w-full flex flex-col items-start justify-center mb-1.5 gap-y-1.5", className)}
                {...props}
            />
        </FormItemContext.Provider>
    );
}
FormItem.displayName = "FormItem";

function FormLabel({ ref, className, ...props }: React.ComponentPropsWithRef<typeof LabelPrimitive.Root>) {
    const { formItemId } = useFormField();

    return (
        <Label
            ref={ref}
            className={cn(
                "text-md font-medium leading-none text-foreground gap-x-6 w-full flex flex-wrap items-center justify-between",
                className,
            )}
            htmlFor={formItemId}
            {...props}
        />
    );
}
FormLabel.displayName = "FormLabel";

function FormControl({ ref, ...props }: React.ComponentPropsWithRef<typeof Slot>) {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
        <Slot
            ref={ref}
            id={formItemId}
            aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
            aria-invalid={!!error}
            {...props}
        />
    );
}
FormControl.displayName = "FormControl";

function FormDescription({ ref, className, ...props }: React.ComponentPropsWithRef<"p">) {
    const { formDescriptionId } = useFormField();

    return <p ref={ref} id={formDescriptionId} className={cn("text-[0.87rem] text-muted-foreground", className)} {...props} />;
}
FormDescription.displayName = "FormDescription";

function FormMessage({ ref, className, children, ...props }: React.ComponentPropsWithRef<"p">) {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
        return null;
    }

    return (
        <p
            ref={ref}
            id={formMessageId}
            className={cn("ps-0.5 text-sm leading-tight font-medium text-danger-foreground", className)}
            {...props}
        >
            {body}
        </p>
    );
}
FormMessage.displayName = "FormMessage";

interface CharacterCounterProps extends React.ComponentPropsWithRef<"span"> {
    currVal: string | undefined;
    max: number;
    visibleAfter?: number;
}

function CharacterCounter({ ref, currVal, max, visibleAfter, className, ...props }: CharacterCounterProps) {
    const field = useFormField();
    const curr = currVal && typeof currVal === "string" ? currVal?.length : 0;

    if (field?.error) return null;
    if (visibleAfter && curr <= visibleAfter) return null;
    if (max * 0.7 > curr && max - curr > 16) return null;

    return (
        <span
            ref={ref}
            className={cn(
                "pe-0.5 text-xs leading-none text-extra-muted-foreground self-center font-normal",
                curr > max && "text-danger-foreground",
                className,
            )}
            {...props}
        >
            {curr} / {max}
        </span>
    );
}
FormMessage.displayName = "CharacterCounter";

export { CharacterCounter, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField };
