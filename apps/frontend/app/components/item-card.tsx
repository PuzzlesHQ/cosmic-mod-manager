import {
    CollectionListItemCard as DefaultCollectionListItemCard,
    OrgListItemCard as DefaultOrgListItemCard,
} from "@app/components/misc/item-card";
import type React from "react";
import { useRootData } from "~/hooks/root-data";
import { useTranslation } from "~/locales/provider";

type OrgListItemCardProps = Omit<React.ComponentProps<typeof DefaultOrgListItemCard>, "t" | "viewTransitions">;

export function OrgListItemCard(props: OrgListItemCardProps) {
    const viewTransitions = useRootData()?.userConfig.viewTransitions !== false;
    const { t } = useTranslation();

    return <DefaultOrgListItemCard {...props} t={t} viewTransitions={viewTransitions} />;
}

type CollectionListItemCardProps = Omit<React.ComponentProps<typeof DefaultCollectionListItemCard>, "t">;

export function CollectionListItemCard(props: CollectionListItemCardProps) {
    const { t } = useTranslation();
    const viewTransitions = useRootData()?.userConfig.viewTransitions !== false;

    return <DefaultCollectionListItemCard {...props} t={t} viewTransitions={viewTransitions} />;
}
