import { EnvironmentSupport } from "@app/utils/types";
import { GlobeIcon, HardDriveIcon, MonitorIcon } from "lucide-react";
import { LabelledIcon } from "~/components/ui/labelled-icon";
import { TooltipProvider, TooltipTemplate } from "~/components/ui/tooltip";
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
            title={t.project.supportedEnvHelp.clientSide}
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
            title={t.project.supportedEnvHelp.serverSide}
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
            title={t.project.supportedEnvHelp.clientOrServerSide}
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
            title={t.project.supportedEnvHelp.clientAndServerSide}
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
        <TooltipProvider>
            <TooltipTemplate content={props.title}>
                <LabelledIcon
                    icon={props.icon}
                    className={cn(
                        "font-semibold text-foreground-muted",
                        props.title ? "cursor-help" : "",
                        props.className,
                    )}
                >
                    {props.label}
                </LabelledIcon>
            </TooltipTemplate>
        </TooltipProvider>
    );
}
