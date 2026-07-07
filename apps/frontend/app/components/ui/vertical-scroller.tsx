import type { ComponentProps } from "react";
import { cn } from "~/components/utils";

export function VerticalScroll({ children, className, ...props }: ComponentProps<"div">) {
    function handleScroll(el: HTMLDivElement | null) {
        if (!el) return;

        if (Math.floor((el.scrollHeight - el.offsetHeight) / 10) < 1) {
            el.classList.remove("fade-top", "fade-bottom");
            console.log("removed both");
            return;
        }

        if (el.scrollTop > 0) {
            el.classList.add("fade-top");
        } else {
            el.classList.remove("fade-top");
        }

        if (el.scrollHeight - (el.scrollTop + el.offsetHeight) > 5) {
            el.classList.add("fade-bottom");
        } else {
            el.classList.remove("fade-bottom");
        }
    }

    return (
        <div
            className={cn("vertical-scroller overflow-x-auto", className)}
            {...props}
            onScroll={(e) => handleScroll(e.currentTarget)}
            ref={handleScroll}
        >
            {children}
        </div>
    );
}
