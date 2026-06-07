import { CircleIcon } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cn } from "~/components/utils";
import { buttonVariants } from "./button";

export function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
    return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />;
}

export function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
    return (
        <RadioGroupPrimitive.Item
            data-slot="radio-group-item"
            className={cn(
                "aspect-square size-4 shrink-0 rounded-full border-[0.14rem] border-foreground-extra-muted text-primary shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
                "data-[state='checked']:border-accent-bg",
                className,
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator
                data-slot="radio-group-indicator"
                className="relative flex items-center justify-center"
            >
                <CircleIcon className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-current stroke-current text-accent-bg" />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
}

interface ButtonStyleRadioGroup_Props {
    items: {
        value: string;
        label: string;
    }[];
    currvalue: string | undefined;
}

export function ButtonStyleRadioGroup(props: ButtonStyleRadioGroup_Props) {
    return props.items.map((item) => {
        const id = `${item.value}-radio`;

        return (
            <label
                key={id}
                htmlFor={id}
                className={cn(
                    "cursor-pointer",
                    buttonVariants({
                        variant: "ghost",
                        size: "sm",
                    }),
                    props.currvalue === item.value && "bg-raised-background text-foreground-bright",
                )}
            >
                <RadioGroupItem value={item.value} id={id} />
                {item.label}
            </label>
        );
    });
}
