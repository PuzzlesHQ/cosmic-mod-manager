import RefreshPage from "@app/components/misc/refresh-page";
import { CardContent, CardDescription, CardHeader, CardTitle, SectionCard } from "@app/components/ui/card";
import { Switch } from "@app/components/ui/switch";
import { disableInteractions } from "@app/utils/dom";
import { useLocation } from "react-router";
import { useNavigate } from "~/components/ui/link";
import { useRootData } from "~/hooks/root-data";
import { setUserConfig } from "~/hooks/user-config";
import { useTranslation } from "~/locales/provider";

export default function PreferencesPage() {
    const { t } = useTranslation();
    const data = useRootData();

    const navigate = useNavigate();
    const location = useLocation();

    function toggleViewTransitions(checked: boolean) {
        disableInteractions();
        setUserConfig({ viewTransitions: checked });

        setTimeout(() => {
            RefreshPage(navigate, location);
        }, 100);
    }

    return (
        <>
            <SectionCard className="w-full">
                <CardHeader>
                    <CardTitle>{t.settings.toggleFeatures}</CardTitle>
                    <CardDescription>{t.settings.enableOrDisableFeatures}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full flex items-center justify-between gap-x-6 gap-y-1">
                        <label htmlFor="view-transitions" className="basis-[min-content] grow shrink-[2]">
                            <span className="block text-lg font-bold text-foreground my-0">{t.settings.viewTransitions}</span>
                            <span className="block text-muted-foreground my-0">{t.settings.viewTransitionsDesc}</span>
                        </label>
                        <Switch
                            id="view-transitions"
                            checked={data?.userConfig.viewTransitions}
                            onCheckedChange={toggleViewTransitions}
                        />
                    </div>
                </CardContent>
            </SectionCard>
        </>
    );
}
