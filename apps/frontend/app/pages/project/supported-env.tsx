import { EnvironmentSupport } from "@app/utils/types";
import { GlobeIcon, HardDriveIcon, MonitorIcon } from "lucide-react";
import { LabelledIcon } from "~/components/ui/labelled-icon";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";

export function ProjectSupprotedEnvironments({
    clientSide,
    serverSide,
    className,
}: {
    clientSide: EnvironmentSupport;
    serverSide: EnvironmentSupport;
    className?: string;
}) {
    if (clientSide === EnvironmentSupport.REQUIRED && serverSide === EnvironmentSupport.REQUIRED) {
        return [<ClientAndServerSide key="Client-and-server" className={className} />];
    }

    if (clientSide === EnvironmentSupport.OPTIONAL && serverSide === EnvironmentSupport.OPTIONAL) {
        return [
            <ServerSide key="Server-side" className={className} />,
            <ClientSide key="Client-side" className={className} />,
            <ClientAndServerSide key="Client-and-server" className={className} />,
        ];
    }

    if (clientSide === EnvironmentSupport.REQUIRED && serverSide === EnvironmentSupport.OPTIONAL) {
        return [
            <ClientSide key="Client-side" className={className} />,
            <ClientAndServerSide key="Client-and-server" className={className} />,
        ];
    }

    if (clientSide === EnvironmentSupport.OPTIONAL && serverSide === EnvironmentSupport.REQUIRED) {
        return [
            <ServerSide key="Server-side" className={className} />,
            <ClientAndServerSide key="Client-and-server" className={className} />,
        ];
    }

    if (clientSide === EnvironmentSupport.REQUIRED || clientSide === EnvironmentSupport.OPTIONAL) {
        return [<ClientSide key="Client-side" className={className} />];
    }

    if (serverSide === EnvironmentSupport.REQUIRED || serverSide === EnvironmentSupport.OPTIONAL) {
        return [<ServerSide key="Server-side" className={className} />];
    }

    return [];
}

export default function ProjectSupportedEnv({
    clientSide,
    serverSide,
    className,
}: {
    clientSide: EnvironmentSupport;
    serverSide: EnvironmentSupport;
    className?: string;
}) {
    if (clientSide === EnvironmentSupport.REQUIRED && serverSide === EnvironmentSupport.REQUIRED)
        return <ClientAndServerSide className={className} />;
    if (clientSide === EnvironmentSupport.OPTIONAL && serverSide === EnvironmentSupport.OPTIONAL)
        return <ClientOrServerSide className={className} />;

    if (serverSide === EnvironmentSupport.REQUIRED) return <ServerSide className={className} />;
    if (clientSide === EnvironmentSupport.REQUIRED) return <ClientSide className={className} />;

    if (serverSide === EnvironmentSupport.OPTIONAL) return <ServerSide className={className} />;
    if (clientSide === EnvironmentSupport.OPTIONAL) return <ClientSide className={className} />;

    if (serverSide === EnvironmentSupport.UNKNOWN || clientSide === EnvironmentSupport.UNKNOWN) return null;

    return <Unsupported className={className} />;
}

interface Props {
    className?: string;
}

function ClientSide({ className }: Props) {
    const { t } = useTranslation();

    return (
        <EnvSupportChip
            icon={<MonitorIcon aria-hidden className="h-btn-icon w-btn-icon" />}
            label={t.projectSettings.clientSide}
            title="Needs to be installed on the game client"
            className={className}
        />
    );
}

function ServerSide({ className }: Props) {
    const { t } = useTranslation();

    return (
        <EnvSupportChip
            icon={<HardDriveIcon aria-hidden className="h-btn-icon w-btn-icon" />}
            label={t.projectSettings.serverSide}
            title="Needs to be installed on the game server"
            className={className}
        />
    );
}

function ClientOrServerSide({ className }: Props) {
    const { t } = useTranslation();

    return (
        <EnvSupportChip
            icon={<GlobeIcon aria-hidden className="h-btn-icon w-btn-icon" />}
            label={t.projectSettings.clientOrServer}
            title="Needs to be installed on either the game client or the server"
            className={className}
        />
    );
}

function ClientAndServerSide({ className }: Props) {
    const { t } = useTranslation();

    return (
        <EnvSupportChip
            icon={<GlobeIcon aria-hidden className="h-btn-icon w-btn-icon" />}
            label={t.projectSettings.clientAndServer}
            title="Needs to be installed on both the game client and the server"
            className={className}
        />
    );
}

function Unsupported({ className }: Props) {
    const { t } = useTranslation();

    return (
        <EnvSupportChip
            icon={<GlobeIcon aria-hidden className="h-btn-icon w-btn-icon" />}
            label={t.projectSettings.unsupported}
            className={className}
        />
    );
}

interface EnvSupportChipProps {
    icon: React.ReactNode;
    label: string;
    className?: string;
    title?: string;
}

function EnvSupportChip(props: EnvSupportChipProps) {
    return (
        <LabelledIcon
            title={props.title}
            icon={props.icon}
            className={cn("font-semibold", props.title ? "cursor-help" : "", props.className)}
        >
            <span className="trim-both">{props.label}</span>
        </LabelledIcon>
    );
}
