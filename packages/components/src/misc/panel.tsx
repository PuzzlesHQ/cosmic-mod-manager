import type React from "react";
import { Card, CardContent, CardHeader, CardTitle, SectionCard } from "~/ui/card";
import { cn } from "~/utils";

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("w-full gap-panel-cards relative grid place-items-start grid-cols-1 lg:grid-cols-[min-content_1fr]", className)}>
            {children}
        </div>
    );
}

export function PanelAside({ children, className, aside }: { children: React.ReactNode; className?: string; aside?: boolean }) {
    if (aside === true) return <aside className={cn("w-full lg:w-sidebar", className)}>{children}</aside>;
    return <div className={cn("w-full lg:w-sidebar", className)}>{children}</div>;
}

export function PanelContent({ children, className, main }: { children: React.ReactNode; className?: string; main?: boolean }) {
    if (main === true) return <main className={cn("w-full grid grid-cols-1 overflow-auto gap-panel-cards", className)}>{children}</main>;
    return <div className={cn("w-full grid grid-cols-1 overflow-auto gap-panel-cards", className)}>{children}</div>;
}

export function PanelAsideNavCard({ children, className, label }: { children: React.ReactNode; className?: string; label: string }) {
    return (
        <Card className={cn("w-full gap-1 flex flex-col items-start justify-center p-4", className)}>
            <CardHeader className="p-0">
                <CardTitle className="text-xl mb-2">{label}</CardTitle>
            </CardHeader>
            {children}
        </Card>
    );
}

export function ContentCardTemplate({
    children,
    title,
    className,
    cardClassname,
    headerClassName,
    titleClassName,
    sectionTag,
}: {
    children: React.ReactNode;
    title?: React.ReactNode;
    className?: string;
    cardClassname?: string;
    headerClassName?: string;
    titleClassName?: string;
    sectionTag?: boolean;
}) {
    const CardTag = sectionTag === true ? SectionCard : Card;

    return (
        <CardTag className={cn("w-full", !title && "pt-5", cardClassname)}>
            {!!title && (
                <CardHeader className={headerClassName}>
                    <CardTitle className={titleClassName}>{title}</CardTitle>
                </CardHeader>
            )}
            <CardContent className={className}>{children}</CardContent>
        </CardTag>
    );
}

export function PanelContent_AsideCardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full gap-panel-cards grid grid-cols-1 md:grid-cols-[1fr_min-content] lg:grid-cols-1 xl:grid-cols-[1fr_min-content] items-start justify-start">
            {children}
        </div>
    );
}
