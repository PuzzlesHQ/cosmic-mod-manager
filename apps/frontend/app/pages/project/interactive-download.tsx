import {
    getGameVersionFromValue,
    getGameVersionsFromValues,
    isExperimentalGameVersion,
} from "@app/utils/src/constants/game-versions";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { VersionReleaseChannel } from "@app/utils/types";
import type { ProjectVersionData } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { ChevronsUpDownIcon, DownloadIcon, Gamepad2Icon, WrenchIcon } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { fallbackProjectIcon } from "~/components/icons";
import { FileDownloader } from "~/components/misc/file-downloader";
import { ImgWrapper } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { LabelledCheckbox } from "~/components/ui/checkbox";
import ComboBox from "~/components/ui/combobox";
import { CommandSeparator } from "~/components/ui/command";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import Link from "~/components/ui/link";
import { ReleaseChannelBadge } from "~/components/ui/release-channel-pill";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { cn } from "~/components/utils";
import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import { isCurrLinkActive, ProjectPagePath, VersionPagePath } from "~/utils/urls";

export default function InteractiveDownloadPopup() {
    const { t } = useTranslation();
    const ctx = useProjectData();
    const projectData = ctx.projectData;
    const allProjectVersions = ctx.allProjectVersions;

    const [showAllVersions, setShowAllVersions] = useState(false);

    const supportedGameVersionsList = getGameVersionsFromValues(projectData?.gameVersions || []).filter(
        (version) => !isExperimentalGameVersion(version.releaseType) || showAllVersions,
    );
    const hasExperimentalGameVersion = getGameVersionsFromValues(projectData?.gameVersions || []).some((ver) =>
        isExperimentalGameVersion(ver.releaseType),
    );

    const [selectedGameVersion, setSelectedGameVersion] = useState<string>("");
    const [selectedLoader, setSelectedLoader] = useState<string>("");
    const location = useLocation();

    const gameVersionsList = useMemo(() => {
        if (!projectData || !allProjectVersions) return [];

        const list = [];
        for (const gameVersion of supportedGameVersionsList) {
            const projectVersion = getVersionData(gameVersion.value, selectedLoader, allProjectVersions);

            if (!projectVersion) continue;
            if (!selectedLoader) {
                list.push({ label: gameVersion.label, value: gameVersion.value });
                continue;
            }
            list.push({
                label: gameVersion.label,
                value: gameVersion.value,
                disabled: !projectVersion.loaders.includes(selectedLoader),
                disabledReason: t.project.doesNotSupport(
                    projectData.name,
                    gameVersion.label,
                    CapitalizeAndFormatString(selectedLoader),
                ),
            });
        }
        return list;
    }, [projectData, selectedLoader, allProjectVersions, supportedGameVersionsList]);

    const loadersList = useMemo(() => {
        if (!projectData || !allProjectVersions) return [];
        if (!selectedGameVersion)
            return projectData.loaders.map((loader) => ({
                label: CapitalizeAndFormatString(loader) || "",
                value: loader,
            }));

        const list = [];
        for (const loader of projectData.loaders) {
            const projectVersion = getVersionData(selectedGameVersion, loader, allProjectVersions);

            if (!projectVersion) continue;
            if (!selectedGameVersion) {
                list.push({ label: CapitalizeAndFormatString(loader) || "", value: loader });
                continue;
            }
            list.push({
                label: CapitalizeAndFormatString(loader) || "",
                value: loader,
                disabled: !projectVersion.loaders.includes(loader),
                disabledReason: t.project.doesNotSupport(
                    projectData.name,
                    CapitalizeAndFormatString(loader),
                    CapitalizeAndFormatString(selectedGameVersion),
                ),
            });
        }
        return list;
    }, [projectData, selectedGameVersion, allProjectVersions]);

    useEffect(() => {
        if (!projectData) return;

        const latestSupportedGameVersion = supportedGameVersionsList?.[0];
        setSelectedGameVersion(latestSupportedGameVersion?.value || "");
    }, [projectData]);

    if (!projectData || !allProjectVersions) return null;

    const isVersionDetailsPage = isCurrLinkActive(
        ProjectPagePath(ctx.projectType, projectData.slug, "version/"),
        location.pathname,
        false,
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={isVersionDetailsPage ? "secondary" : "default"}>
                    <DownloadIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                    {t.common.download}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="flex flex-row items-center justify-start gap-3 pb-3">
                    <ImgWrapper
                        vtId={projectData.id}
                        src={imageUrl(projectData.icon)}
                        alt={projectData.name}
                        className="h-9 w-9 rounded-md"
                        fallback={fallbackProjectIcon}
                    />
                    <DialogTitle>{t.project.downloadItem(projectData.name)}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{t.project.downloadItem(projectData.name)}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <DialogBody className="flex flex-col items-center justify-center gap-3">
                    <ComboBox
                        noResultsElem={t.common.noResults}
                        inputBox={supportedGameVersionsList.length > 5}
                        options={gameVersionsList}
                        value={selectedGameVersion}
                        setValue={setSelectedGameVersion}
                        footerItem={
                            hasExperimentalGameVersion ? (
                                <>
                                    <CommandSeparator />
                                    <LabelledCheckbox
                                        checked={showAllVersions}
                                        onCheckedChange={(checked) => setShowAllVersions(checked === true)}
                                        className="ms-2 mt-1 px-2 pb-2 text-foreground-extra-muted"
                                    >
                                        {t.form.showAllVersions}
                                    </LabelledCheckbox>
                                </>
                            ) : null
                        }
                    >
                        {/** biome-ignore lint/a11y/useSemanticElements: -- */}
                        <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between text-foreground-extra-muted"
                            disabled={projectData.gameVersions.length < 2}
                        >
                            <span className="flex items-center justify-start gap-2 font-medium">
                                <Gamepad2Icon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                                <span className="text-foreground-muted">
                                    {selectedGameVersion
                                        ? t.project.gameVersion(
                                              <em key="download-game-version" className="text-foreground/90 not-italic">
                                                  {getGameVersionFromValue(selectedGameVersion)?.label}
                                              </em>,
                                          )
                                        : t.project.selectGameVersion}
                                </span>
                            </span>
                            <ChevronsUpDownIcon aria-hidden className="ms-2 h-4 w-4 shrink-0" />
                        </Button>
                    </ComboBox>

                    {loadersList.length > 0 && (
                        <ComboBox
                            noResultsElem={t.common.noResults}
                            options={loadersList}
                            value={selectedLoader}
                            setValue={setSelectedLoader}
                            inputBox={false}
                        >
                            {/** biome-ignore lint/a11y/useSemanticElements: -- */}
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between text-foreground-extra-muted"
                            >
                                <span className="flex items-center justify-start gap-2 font-medium">
                                    <WrenchIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                                    <span className="text-foreground-muted">
                                        {selectedLoader
                                            ? t.project.platform(
                                                  <em key="download-version-loader" className="text-foreground/90 not-italic">
                                                      {CapitalizeAndFormatString(selectedLoader)}
                                                  </em>,
                                              )
                                            : t.project.selectPlatform}
                                    </span>
                                </span>
                                <ChevronsUpDownIcon aria-hidden className="ms-2 h-4 w-4 shrink-0" />
                            </Button>
                        </ComboBox>
                    )}

                    {selectedGameVersion ? (
                        <AvailableVersionsList selectedGameVersion={selectedGameVersion} selectedLoader={selectedLoader} />
                    ) : null}
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

function getVersionData(gameVersion: string, loader: string, versionsList: ProjectVersionData[]): ProjectVersionData | null {
    let latestVersion = null;

    if (!gameVersion) {
        for (const version of versionsList) {
            if (version.loaders.includes(loader)) {
                if (!latestVersion) break;
                latestVersion = version;
            }
        }
    } else {
        for (const version of versionsList) {
            if (version.gameVersions.includes(gameVersion)) {
                if (!latestVersion) latestVersion = version;
                if (version.loaders.includes(loader)) return version;
            }
        }
    }
    return latestVersion;
}

interface AvailableVersionsListProps {
    selectedGameVersion: string;
    selectedLoader: string | null;
}

function AvailableVersionsList({ selectedGameVersion, selectedLoader }: AvailableVersionsListProps) {
    const ctx = useProjectData();
    const projectdata = ctx.projectData;
    const allProjectVersions = ctx.allProjectVersions;
    const { t } = useTranslation();

    const { downloadFile, isVisible: isDownloadAnimationVisible } = useContext(FileDownloader);

    const versionsList = useMemo(() => {
        if (!projectdata || !allProjectVersions) return [];
        const list: ProjectVersionData[] = [];
        for (const version of allProjectVersions) {
            if (
                version.gameVersions.includes(selectedGameVersion) &&
                (!selectedLoader || version.loaders.includes(selectedLoader))
            ) {
                const lastItem = list[list.length - 1];
                if (lastItem && lastItem.releaseChannel === VersionReleaseChannel.RELEASE) break;
                if (
                    version.releaseChannel !== VersionReleaseChannel.RELEASE &&
                    list.some((v) => v.releaseChannel !== VersionReleaseChannel.RELEASE)
                ) {
                    continue;
                }
                list.push(version);
            }
        }
        return list;
    }, [selectedGameVersion, selectedLoader, allProjectVersions, projectdata]);

    if (!versionsList.length)
        return (
            <span className="flex w-full items-center justify-start px-1 py-3 text-foreground-extra-muted italic">
                No versions available for {getGameVersionFromValue(selectedGameVersion)?.label} on{" "}
                {CapitalizeAndFormatString(selectedLoader)}
            </span>
        );

    return (
        <div className="flex w-full flex-col items-center justify-center gap-3">
            {versionsList.map((version) => {
                return (
                    <div
                        key={version.id}
                        className="flex w-full items-center justify-between gap-x-4 gap-y-2 rounded-lg bg-background p-2"
                    >
                        <div className="flex items-center justify-start gap-3">
                            <ReleaseChannelBadge releaseChannel={version.releaseChannel} />
                            <div className="flex flex-col items-start justify-center gap-1">
                                <DialogClose asChild>
                                    <Link
                                        to={VersionPagePath(ctx.projectType, projectdata.slug, version.slug)}
                                        className="font-bold text-foreground leading-none"
                                    >
                                        {version.versionNumber}
                                    </Link>
                                </DialogClose>
                                <span className="font-medium text-foreground-muted/85 text-sm leading-none">{version.title}</span>
                            </div>
                        </div>

                        <Button
                            size="icon"
                            variant="default"
                            className={cn("shrink-0", isDownloadAnimationVisible && "pointer-events-none")}
                            title={t.project.downloadItem(version.primaryFile?.name || "")}
                            onClick={() => downloadFile(version.primaryFile?.url)}
                        >
                            <DownloadIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                        </Button>
                    </div>
                );
            })}
        </div>
    );
}
