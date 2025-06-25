import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/ui/button";
import { cn } from "~/utils";

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
                "w-fit h-fit px-1 py-0 min-h-6 min-w-6 gap-2 shrink-0 flex items-center justify-center rounded-md",
                className,
            )}
            onClick={copyText}
        >
            {label ? (
                <span className={cn("text-sm font-mono leading-none text-foreground dark:text-muted-foreground", labelClassName)}>
                    {label.slice(0, maxLabelChars || label.length)}
                    {maxLabelChars && label.length > maxLabelChars ? "…" : ""}
                </span>
            ) : null}
            <div className="w-btn-icon h-btn-icon flex items-center justify-center">
                {showTickIcon ? (
                    <CheckIcon aria-hidden className={cn("w-btn-icon h-btn-icon text-success-foreground", iconClassName)} />
                ) : (
                    <CopyIcon aria-hidden className={cn("w-3 h-3 text-extra-muted-foreground", iconClassName)} />
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
