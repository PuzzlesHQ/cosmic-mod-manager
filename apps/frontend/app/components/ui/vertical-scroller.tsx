import { type ComponentProps, useLayoutEffect, useRef } from "react";
import { cn } from "~/components/utils";

export function VerticalScroll({ children, className, ...props }: ComponentProps<"div">) {
    const scroller = useRef<HTMLDivElement | null>(null);
    const topMarker = useRef<HTMLDivElement | null>(null);
    const bottomMarker = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        const root = scroller.current;
        const topEl = topMarker.current;
        const bottomEl = bottomMarker.current;
        if (!root || !topEl || !bottomEl) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.target === topEl) {
                        root.style.setProperty("--scroller-mask-top", entry.isIntersecting ? "black" : "transparent");
                    }

                    if (entry.target === bottomEl) {
                        root.style.setProperty(
                            "--scroller-mask-bottom",
                            entry.isIntersecting ? "black" : "transparent",
                        );
                    }
                }
            },
            {
                root: root,
                threshold: 1,
                rootMargin: "10px 0px",
            },
        );

        observer.observe(topEl);
        observer.observe(bottomEl);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className={cn("vertical-scroller overflow-x-auto", className)} {...props} ref={scroller}>
            <div className="invisible h-px w-full" ref={topMarker}></div>
            {children}
            <div className="invisible h-px w-full" ref={bottomMarker}></div>
        </div>
    );
}
