import type React from "react";
import { cn } from "~/utils";

function Card({ ref, className, ...props }: React.ComponentProps<"div">) {
    return <div ref={ref} className={cn("rounded-lg bg-card-background text-foreground shadow-sm", className)} {...props} />;
}
Card.displayName = "Card";

function SectionCard({ ref, className, ...props }: React.ComponentProps<"div">) {
    return <section ref={ref} className={cn("rounded-lg bg-card-background text-foreground shadow-sm", className)} {...props} />;
}
SectionCard.displayName = "Card";

function CardHeader({ ref, className, ...props }: React.ComponentProps<"div">) {
    return <div ref={ref} className={cn("flex flex-col gap-y-1.5 p-card-surround", className)} {...props} />;
}
CardHeader.displayName = "CardHeader";

function CardTitle({ ref, className, ...props }: React.ComponentProps<"h2">) {
    return <h2 ref={ref} className={cn("text-xl font-semibold leading-none tracking-tight", className)} {...props} />;
}
CardTitle.displayName = "CardTitle";

function CardDescription({ ref, className, ...props }: React.ComponentProps<"p">) {
    return <p ref={ref} className={cn("text-base text-muted-foreground", className)} {...props} />;
}
CardDescription.displayName = "CardDescription";

function CardContent({ ref, className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            ref={ref}
            className={cn("p-card-surround pt-0 w-full flex flex-col items-start justify-start", className)}
            {...props}
        />
    );
}
CardContent.displayName = "CardContent";

function CardFooter({ ref, className, ...props }: React.ComponentProps<"div">) {
    return <div ref={ref} className={cn("flex justify-end gap-3 items-center p-card-surround pt-0", className)} {...props} />;
}
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, SectionCard };
