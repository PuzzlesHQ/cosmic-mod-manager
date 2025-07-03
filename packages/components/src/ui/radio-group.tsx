import { CircleIcon } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cn } from "~/utils";
import { buttonVariants } from "./button";

export function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
    return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />;
}

export function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
    return (
        <RadioGroupPrimitive.Item
            data-slot="radio-group-item"
            className={cn(
                "border-extra-muted-foreground text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border-[0.14rem] shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                "data-[state='checked']:border-accent-background",
                className,
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator
                data-slot="radio-group-indicator"
                className="relative flex items-center justify-center"
            >
                <CircleIcon className="text-accent-background fill-current stroke-current absolute top-1/2 start-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
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
                    props.currvalue === item.value && "bg-shallow-background text-foreground-bright",
                )}
            >
                <RadioGroupItem value={item.value} id={id} />
                {item.label}
            </label>
        );
    });
}
