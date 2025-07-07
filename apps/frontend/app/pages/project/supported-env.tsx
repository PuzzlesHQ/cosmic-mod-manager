import { cn } from "@app/components/utils";
import { EnvironmentSupport } from "@app/utils/types";
import { GlobeIcon, HardDriveIcon, MonitorIcon } from "lucide-react";
import { useTranslation } from "~/locales/provider";

interface Props {
    className?: string;
}
function ClientSide({ className }: Props) {
    const { t } = useTranslation();
    return (
        <span
            className={cn("flex cursor-help items-center justify-start gap-x-1 font-semibold text-muted-foreground", className)}
            title="Needs to be installed on the game client"
        >
            <MonitorIcon aria-hidden className="h-btn-icon w-btn-icon" />
            {t.projectSettings.clientSide}
        </span>
    );
}

function ServerSide({ className }: Props) {
    const { t } = useTranslation();
    return (
        <span
            className={cn("flex cursor-help items-center justify-start gap-x-1 font-semibold text-muted-foreground", className)}
            title="Needs to be installed on the game server"
        >
            <HardDriveIcon aria-hidden className="h-btn-icon w-btn-icon" />
            {t.projectSettings.serverSide}
        </span>
    );
}

function ClientOrServerSide({ className }: Props) {
    const { t } = useTranslation();
    return (
        <span
            className={cn("flex cursor-help items-center justify-start gap-x-1 font-semibold text-muted-foreground", className)}
            title="Needs to be installed on either the game client or the server"
        >
            <GlobeIcon aria-hidden className="h-btn-icon w-btn-icon" />
            {t.projectSettings.clientOrServer}
        </span>
    );
}

function ClientAndServerSide({ className }: Props) {
    const { t } = useTranslation();
    return (
        <span
            className={cn("flex cursor-help items-center justify-start gap-x-1 font-semibold text-muted-foreground", className)}
            title="Needs to be installed on both the game client and the server"
        >
            <GlobeIcon aria-hidden className="h-btn-icon w-btn-icon" />
            {t.projectSettings.clientAndServer}
        </span>
    );
}

function Unsupported({ className }: Props) {
    const { t } = useTranslation();
    return (
        <span className={cn("flex items-center justify-start gap-x-1 font-semibold text-muted-foreground", className)}>
            <GlobeIcon aria-hidden className="h-btn-icon w-btn-icon" />
            {t.projectSettings.unsupported}
        </span>
    );
}

export function ProjectSupprotedEnvironments({
    clientSide,
    serverSide,
}: {
    clientSide: EnvironmentSupport;
    serverSide: EnvironmentSupport;
}) {
    if (clientSide === EnvironmentSupport.REQUIRED && serverSide === EnvironmentSupport.REQUIRED) {
        return [<ClientAndServerSide key="Client-and-server" />];
    }

    if (clientSide === EnvironmentSupport.OPTIONAL && serverSide === EnvironmentSupport.OPTIONAL) {
        return [
            <ServerSide key="Server-side" />,
            <ClientSide key="Client-side" />,
            <ClientAndServerSide key="Client-and-server" />,
        ];
    }

    if (clientSide === EnvironmentSupport.REQUIRED && serverSide === EnvironmentSupport.OPTIONAL) {
        return [<ClientSide key="Client-side" />, <ClientAndServerSide key="Client-and-server" />];
    }

    if (clientSide === EnvironmentSupport.OPTIONAL && serverSide === EnvironmentSupport.REQUIRED) {
        return [<ServerSide key="Server-side" />, <ClientAndServerSide key="Client-and-server" />];
    }

    if (clientSide === EnvironmentSupport.REQUIRED || clientSide === EnvironmentSupport.OPTIONAL) {
        return [<ClientSide key="Client-side" />];
    }

    if (serverSide === EnvironmentSupport.REQUIRED || serverSide === EnvironmentSupport.OPTIONAL) {
        return [<ServerSide key="Server-side" />];
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
