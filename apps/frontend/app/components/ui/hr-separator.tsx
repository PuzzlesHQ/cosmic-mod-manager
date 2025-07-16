function HorizontalSeparator({ text = "OR" }: { text?: string }) {
    return (
        <div className="flex w-full items-center gap-4">
            <hr className="h-[0.1rem] w-full flex-1 border-none bg-border" />
            <p className="shrink-0 text-foreground-extra-muted text-sm" aria-hidden role="image">
                {text}
            </p>
            <hr className="h-[0.1rem] w-full flex-1 border-none bg-border" />
        </div>
    );
}

export default HorizontalSeparator;
