import { cn } from "~/components/utils";

/**
 * NOTE: ensure that whatever this is applied to has only 1 direct child element
 */
export function collapsibleBoxClassName(isOpen: boolean, openClassName?: string, closedClassName?: string) {
    return cn(
        "grid overflow-y-hidden transition-all duration-300 [&>*]:min-h-0",
        isOpen ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0",
        isOpen ? openClassName : closedClassName,
    );
}
