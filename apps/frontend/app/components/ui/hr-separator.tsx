function HorizontalSeparator({ text = "OR" }: { text?: string }) {
    return (
        <div className="flex w-full items-center gap-4">
            <hr className="h-[0.1rem] w-full flex-1 border-none bg-shallow-background" />
            <p className="shrink-0 text-extra-muted-foreground text-sm">{text}</p>
            <hr className="h-[0.1rem] w-full flex-1 border-none bg-shallow-background" />
        </div>
    );
}

export default HorizontalSeparator;
