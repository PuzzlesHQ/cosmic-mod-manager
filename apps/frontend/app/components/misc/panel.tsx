import type React from "react";
import { Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle, SectionCard } from "~/components/ui/card";
import { ButtonLink, type LinkPrefetchStrategy } from "~/components/ui/link";
import { cn } from "~/components/utils";

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                "relative grid w-full grid-cols-1 place-items-start gap-panel-cards lg:grid-cols-[min-content_1fr]",
                className,
            )}
        >
            {children}
        </div>
    );
}

export function PanelContent({ children, className, main }: { children: React.ReactNode; className?: string; main?: boolean }) {
    if (main === true)
        return <main className={cn("grid w-full grid-cols-1 gap-panel-cards overflow-auto", className)}>{children}</main>;
    return <div className={cn("grid w-full grid-cols-1 gap-panel-cards overflow-auto", className)}>{children}</div>;
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
    const Slot = sectionTag === true ? SectionCard : Card;

    return (
        <Slot className={cn("w-full", !title && "pt-5", cardClassname)}>
            {!!title && (
                <CardHeader className={headerClassName}>
                    <CardTitle className={titleClassName}>{title}</CardTitle>
                </CardHeader>
            )}
            <CardContent className={className}>{children}</CardContent>
        </Slot>
    );
}

export function PanelContent_AsideCardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid w-full grid-cols-1 items-start justify-start gap-panel-cards md:grid-cols-[1fr_min-content] lg:grid-cols-1 xl:grid-cols-[1fr_min-content]">
            {children}
        </div>
    );
}

export interface SidePanelSection {
    name?: string;
    items: {
        label: string;
        href: string;
        icon?: React.ReactNode;
        prefetch?: LinkPrefetchStrategy;
        icon_2?: React.ReactNode;
    }[];
}

interface SidePanelProps {
    header: string;
    sections: SidePanelSection[];
    className?: string;
    children?: React.ReactNode;
}

export function SidePanel(props: SidePanelProps) {
    return (
        <aside className={cn("grid w-full gap-1 bg-card-background p-card-surround lg:w-sidebar", props.className)}>
            {props.children}
            <h2 className="mb-2 font-semibold text-xl leading-none tracking-tight">{props.header}</h2>

            {props.sections.map((section, index) => {
                return (
                    <Fragment key={`${section.name ?? index}`}>
                        {!!section.name && <span className="mt-3 font-semibold text-lg">{section.name}</span>}

                        {section.items.map((item) => (
                            <ButtonLink
                                className="relative"
                                url={item.href}
                                key={item.href}
                                preventScrollReset
                                prefetch={item.prefetch}
                            >
                                {item.icon}
                                {item.label}
                                {item.icon_2}
                            </ButtonLink>
                        ))}
                    </Fragment>
                );
            })}
        </aside>
    );
}
