import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/components/utils";

type Props = {
    id: string;
    text: string | number;
    label?: string;
    maxLabelChars?: number;
    className?: string;
    labelClassName?: string;
    iconClassName?: string;
    successMessage?: string;
};

const timeoutRef = new Map<string, number>();
function CopyBtn({ id, text, label, className, labelClassName, iconClassName, maxLabelChars }: Props) {
    const [showTickIcon, setShowTickIcon] = useState(false);

    function copyText() {
        const existingTimeout = timeoutRef.get(id);
        if (existingTimeout) clearTimeout(existingTimeout);

        const success = copyTextToClipboard(text);
        if (!success) return console.error("Unable to copy text to clipboard");

        setShowTickIcon(true);
        const timeoutId = window.setTimeout(() => {
            setShowTickIcon(false);
        }, 2000);
        timeoutRef.set(id, timeoutId);
    }

    return (
        <Button
            // size="icon"
            id={`copy-btn-${text}-${label}`}
            variant="ghost"
            aria-label="Copy"
            className={cn(
                "flex h-fit min-h-6 w-fit min-w-6 shrink-0 items-center justify-center gap-2 rounded-md px-1 py-0",
                className,
            )}
            onClick={copyText}
        >
            {label ? (
                <span className={cn("font-mono text-foreground text-sm leading-none dark:text-foreground-muted", labelClassName)}>
                    {label.slice(0, maxLabelChars || label.length)}
                    {maxLabelChars && label.length > maxLabelChars ? "…" : ""}
                </span>
            ) : null}
            <div className="flex h-btn-icon w-btn-icon items-center justify-center">
                {showTickIcon ? (
                    <CheckIcon aria-hidden className={cn("h-btn-icon w-btn-icon text-success-fg", iconClassName)} />
                ) : (
                    <CopyIcon aria-hidden className={cn("h-3 w-3 text-foreground-extra-muted", iconClassName)} />
                )}
            </div>
        </Button>
    );
}

export default CopyBtn;

export function copyTextToClipboard(text: unknown) {
    try {
        navigator.clipboard.writeText(`${text}`);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
