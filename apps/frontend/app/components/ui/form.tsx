import type { Label as LabelPrimitive } from "radix-ui";
import { Slot } from "radix-ui";
import { createContext, use, useId } from "react";
import {
    Controller,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
    FormProvider,
    useFormContext,
} from "react-hook-form";
import { Label } from "~/components/ui/label";
import { cn } from "~/components/utils";

const Form = FormProvider;

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

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
    const fieldContext = use(FormFieldContext);
    const itemContext = use(FormItemContext);
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

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({ ref, className, ...props }: React.ComponentProps<"div">) {
    const id = useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div
                ref={ref}
                className={cn("mb-1.5 flex w-full max-w-full flex-col items-start justify-center gap-y-1.5", className)}
                {...props}
            />
        </FormItemContext.Provider>
    );
}
FormItem.displayName = "FormItem";

function FormLabel({ ref, className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
    const { formItemId } = useFormField();

    return (
        <Label
            ref={ref}
            className={cn(
                "flex w-full flex-wrap items-center justify-between gap-x-6 font-medium text-foreground text-md leading-none",
                className,
            )}
            htmlFor={formItemId}
            {...props}
        />
    );
}
FormLabel.displayName = "FormLabel";

function FormControl({ ref, ...props }: React.ComponentProps<typeof Slot.Root>) {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
        <Slot.Root
            ref={ref}
            id={formItemId}
            aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
            aria-invalid={!!error}
            {...props}
        />
    );
}
FormControl.displayName = "FormControl";

function FormDescription({ ref, className, ...props }: React.ComponentProps<"p">) {
    const { formDescriptionId } = useFormField();

    return <p ref={ref} id={formDescriptionId} className={cn("text-[0.87rem] text-foreground-muted", className)} {...props} />;
}
FormDescription.displayName = "FormDescription";

function FormMessage({ ref, className, children, ...props }: React.ComponentProps<"p">) {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
        return null;
    }

    return (
        <p
            ref={ref}
            id={formMessageId}
            className={cn("ps-0.5 font-medium text-error-fg text-sm leading-tight", className)}
            {...props}
        >
            {body}
        </p>
    );
}
FormMessage.displayName = "FormMessage";

interface CharacterCounterProps extends React.ComponentProps<"span"> {
    currVal: string | null;
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
                "self-center pe-0.5 font-normal text-foreground-extra-muted text-xs leading-none",
                curr > max && "text-error-fg",
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
