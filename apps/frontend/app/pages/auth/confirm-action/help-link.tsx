import Link from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";

export default function SessionsPageLink() {
    const { t } = useTranslation();

    return (
        <div className="flex w-full items-center justify-start gap-1 text-sm">
            {t.auth.didntRequest}
            <Link to="/settings/sessions" className="text_link">
                {t.auth.checkSessions}
            </Link>
        </div>
    );
}
