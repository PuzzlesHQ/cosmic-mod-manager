import { useTranslation } from "~/locales/provider";

interface SkipNavProps {
    children?: React.ReactNode;
    mainId?: string;
}

export function SkipNav({ mainId, children }: SkipNavProps) {
    const { t } = useTranslation();
    function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        const main = document.getElementById(mainId || "main");
        if (main) {
            main.tabIndex = -1;
            main.focus();
        }
    }

    return (
        <a
            href={`#${mainId || "main"}`}
            className="!w-fit !px-6 !py-0.5 !absolute sr-only start-1 top-1 rounded-md bg-background text-foreground underline focus:not-sr-only"
            onClick={handleClick}
        >
            {children ? children : t.navbar.skipToMainContent}
        </a>
    );
}
