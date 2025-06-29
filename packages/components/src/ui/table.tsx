import { cn } from "~/utils";

function Table({ ref, className, ...props }: React.ComponentProps<"table">) {
    return (
        <div className="relative w-full overflow-auto">
            <table ref={ref} className={cn("w-full caption-bottom text-base", className)} {...props} />
        </div>
    );
}
Table.displayName = "Table";

function TableHeader({ ref, className, ...props }: React.ComponentProps<"thead">) {
    return <thead ref={ref} className={cn("", className)} {...props} />;
}
TableHeader.displayName = "TableHeader";

function TableBody({ ref, className, ...props }: React.ComponentProps<"tbody">) {
    return <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}
TableBody.displayName = "TableBody";

function TableFooter({ ref, className, ...props }: React.ComponentProps<"tfoot">) {
    return (
        <tfoot
            ref={ref}
            className={cn("border-t border-background bg-shallow-background/50 font-medium [&>tr]:last:border-b-0", className)}
            {...props}
        />
    );
}
TableFooter.displayName = "TableFooter";

function TableRow({ ref, className, ...props }: React.ComponentProps<"tr">) {
    return (
        <tr
            ref={ref}
            className={cn("border-b border-background h-12 hover:bg-background/30 group bg_hover_stagger", className)}
            {...props}
        />
    );
}
TableRow.displayName = "TableRow";

function TableHead({ ref, className, ...props }: React.ComponentProps<"th">) {
    return (
        <th
            ref={ref}
            className={cn(
                "pt-2.5 pb-1.5 px-2 text-start align-middle text-foreground font-bold [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]",
                className,
            )}
            {...props}
        />
    );
}
TableHead.displayName = "TableHead";

function TableCell({ ref, className, ...props }: React.ComponentProps<"td">) {
    return (
        <td
            ref={ref}
            className={cn(
                "px-2 py-5 pe-4 align-middle [&:has([role=checkbox])]:pe-0 [&>[role=checkbox]]:translate-y-[2px]",
                className,
            )}
            {...props}
        />
    );
}
TableCell.displayName = "TableCell";

function TableCaption({ ref, className, ...props }: React.ComponentProps<"caption">) {
    return <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />;
}
TableCaption.displayName = "TableCaption";

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
