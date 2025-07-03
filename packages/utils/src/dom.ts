function disablePathNavigations(e: KeyboardEvent) {
    if (e.altKey || e.code === "Tab") {
        e.preventDefault();
        e.stopPropagation();
    }
}

export function interactionsDisabled() {
    return document.documentElement.classList.contains("disable-interactions");
}

export function disableInteractions() {
    document.documentElement.setAttribute("inert", "");
    document.documentElement.classList.add("disable-interactions");
    document.addEventListener("keydown", disablePathNavigations);
}

export function enableInteractions() {
    document.documentElement.removeAttribute("inert");
    document.documentElement.classList.remove("disable-interactions");
    document.removeEventListener("keydown", disablePathNavigations);
}

export function scrollElementIntoView(element: HTMLElement | null, options?: ScrollIntoViewOptions) {
    if (!element) return;
    element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
        ...options,
    });
}
