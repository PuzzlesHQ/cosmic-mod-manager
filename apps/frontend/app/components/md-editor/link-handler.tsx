import { useEffect } from "react";
import { useNavigate } from "~/components/ui/link";
import { formatLocaleCode } from "~/locales";
import { useTranslation } from "~/locales/provider";
import { omitOrigin } from "~/utils/urls";

// HANDLE SAME SITE NAVIGATIONS FROM MARKDOWN RENDERED LINKS
export function MarkdownLinkHandler() {
    const { locale } = useTranslation();
    const navigate = useNavigate();

    // Use React router to handle internal links
    function handleNavigate(e: MouseEvent) {
        if (!e.target) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;

        // @ts-expect-error
        if (!e.target?.closest(".markdown-body")) return;

        try {
            if (!(e.target instanceof HTMLAnchorElement)) return;
            e.preventDefault();

            const target = e.target as HTMLAnchorElement;
            const targetUrl = new URL(target.href);

            if (target.getAttribute("href")?.startsWith("#")) {
                navigate(omitOrigin(targetUrl), { preventScrollReset: true });
                return;
            }

            const targetHost = targetUrl.hostname;
            const currHost = window.location.hostname;

            if (currHost.replace("www.", "") !== targetHost.replace("www.", "")) {
                window.open(targetUrl.href, "_blank");
                return;
            }

            navigate(omitOrigin(targetUrl));
        } catch {}
    }

    useEffect(() => {
        document.body.addEventListener("click", handleNavigate);

        return () => document.body.removeEventListener("click", handleNavigate);
    }, [formatLocaleCode(locale)]);

    return null;
}
