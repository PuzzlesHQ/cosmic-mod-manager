import { ChevronDownIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "~/components/utils";

const Accordion = AccordionPrimitive.Root;

function AccordionItem({ ref, className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
    return <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />;
}
AccordionItem.displayName = "AccordionItem";

function AccordionTrigger({ ref, className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
    return (
        <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
                ref={ref}
                className={cn(
                    "flex flex-1 items-center justify-between pt-4 pb-3 font-medium text-sm hover:underline [&[data-state=open]>svg]:rotate-180",
                    className,
                )}
                {...props}
            >
                {children}
                <ChevronDownIcon
                    aria-hidden
                    className="h-btn-icon w-btn-icon shrink-0 text-muted-foreground transition-transform duration-200"
                />
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
}
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

function AccordionContent({ ref, className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
    return (
        <AccordionPrimitive.Content
            ref={ref}
            className="overflow-hidden text-base data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
            {...props}
        >
            <div className={cn("pt-0 pb-4", className)}>{children}</div>
        </AccordionPrimitive.Content>
    );
}
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
