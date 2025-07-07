import { PageHeader as DefaultPageHeader } from "~/components/misc/page-header";
import { useRootData } from "~/hooks/root-data";

type Props = Omit<React.ComponentProps<typeof DefaultPageHeader>, "viewTransitions">;
export function PageHeader(props: Props) {
    const viewTransitions = useRootData()?.userConfig.viewTransitions !== false;
    return <DefaultPageHeader {...props} viewTransitions={viewTransitions} />;
}
