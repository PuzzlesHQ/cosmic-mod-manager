import { Button } from "@app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import { FullWidthSpinner } from "@app/components/ui/spinner";
import type { Organisation } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { PlusIcon } from "lucide-react";
import { OrgListItemCard } from "~/components/item-card";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { OrgPagePath } from "~/utils/urls";
import CreateNewOrg_Dialog from "./new-organization";

interface Props {
    organisations: Organisation[];
}

export default function OrganisationDashboardPage({ organisations }: Props) {
    const { t } = useTranslation();
    const session = useSession();

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="flex w-full flex-row flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <CardTitle>{t.dashboard.organizations}</CardTitle>

                <CreateNewOrg_Dialog>
                    <Button>
                        <PlusIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                        {t.dashboard.createOrg}
                    </Button>
                </CreateNewOrg_Dialog>
            </CardHeader>
            <CardContent>
                {!organisations?.length && <p className="text-muted-foreground">{t.common.noResults}</p>}
                {organisations === undefined ? (
                    <FullWidthSpinner />
                ) : (
                    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                        {organisations?.map((org) => {
                            if (org.members.find((member) => member.userId === session?.id)?.accepted === false) return;

                            return (
                                <OrgListItemCard
                                    vtId={org.id}
                                    key={org.id}
                                    title={org.name}
                                    url={OrgPagePath(org.slug)}
                                    icon={imageUrl(org.icon)}
                                    description={org.description || ""}
                                    members={org.members.length}
                                />
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
