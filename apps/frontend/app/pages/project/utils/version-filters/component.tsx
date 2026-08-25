import { getLoaderFromString } from "@app/utils/convertors";
import { getGameVersionsFromValues } from "@app/utils/src/constants/game-versions";
import { CapitalizeAndFormatString } from "@app/utils/string";
import type { VersionReleaseChannel } from "@app/utils/types";
import { ChevronDownIcon, FilterIcon, FlaskConicalIcon, XIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { Button } from "~/components/ui/button";
import { LabelledCheckbox } from "~/components/ui/checkbox";
import { ChipButton } from "~/components/ui/chip";
import { CommandSeparator } from "~/components/ui/command";
import { MultiSelect } from "~/components/ui/multi-select";
import { releaseChannelTextColor } from "~/components/ui/release-channel-pill";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";
import type useVersionFilters from "./hook";

interface Props {
    hook: ReturnType<typeof useVersionFilters>;
}

const DownArrowIcon = (
    <ChevronDownIcon aria-hidden className="indicator h-btn-icon-md w-btn-icon-md text-foreground-extra-muted" />
);
export function VersionFilters(props: Props) {
    const { t } = useTranslation();
    const filterOptions = props.hook.availableFilterOptions;
    const activeFilters = props.hook.activeFilters;
    const setActiveFilters = props.hook.setActiveFilters;

    return (
        <>
            {filterOptions.anyFilterVisible || props.hook.hasDevVersion ? (
                <div className="flex flex-wrap items-center justify-start gap-2">
                    {filterOptions.loaders.length > 0 ? (
                        <MultiSelect
                            selectedValues={activeFilters.loaders}
                            options={filterOptions.loaders.map((loader) => ({
                                label: CapitalizeAndFormatString(loader) || "",
                                value: loader,
                            }))}
                            onValueChange={(values) => {
                                setActiveFilters({ ...activeFilters, loaders: values });
                            }}
                            searchBox={false}
                            customTrigger={
                                <Button variant="secondary">
                                    <FilterIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                    Loaders
                                    {DownArrowIcon}
                                </Button>
                            }
                            noResultsElement={t.common.noResults}
                            inputPlaceholder={t.common.search}
                        />
                    ) : null}

                    {filterOptions.gameVersions.length > 0 ? (
                        <MultiSelect
                            searchBox={filterOptions.gameVersions.length > 5}
                            selectedValues={activeFilters.gameVersions}
                            options={filterOptions.gameVersions.map((ver) => ({
                                label: ver.label,
                                value: ver.value,
                            }))}
                            onValueChange={(values) => {
                                setActiveFilters({ ...activeFilters, gameVersions: values });
                            }}
                            customTrigger={
                                <Button variant="secondary">
                                    <FilterIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                    {t.search.gameVersions}
                                    {DownArrowIcon}
                                </Button>
                            }
                            fixedFooter={
                                props.hook.hasExperimentalVersion ? (
                                    <>
                                        <CommandSeparator />
                                        <LabelledCheckbox
                                            checked={props.hook.showExperimentalGameVersions}
                                            onCheckedChange={(checked) =>
                                                props.hook.setShowExperimentalGameVersions(checked === true)
                                            }
                                            className="my-1 ps-3.5 pe-2 text-foreground-extra-muted"
                                        >
                                            {t.form.showAllVersions}
                                        </LabelledCheckbox>
                                    </>
                                ) : null
                            }
                            noResultsElement={t.common.noResults}
                            inputPlaceholder={t.common.search}
                        />
                    ) : null}

                    {filterOptions.releaseChannels.length > 0 ? (
                        <MultiSelect
                            searchBox={false}
                            selectedValues={activeFilters.releaseChannels}
                            options={filterOptions.releaseChannels.map((channel) => ({
                                label: CapitalizeAndFormatString(channel) || "",
                                value: channel,
                            }))}
                            onValueChange={(values) => {
                                setActiveFilters({ ...activeFilters, releaseChannels: values });
                            }}
                            customTrigger={
                                <Button variant="secondary">
                                    <FilterIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                    {t.search.channels}
                                    {DownArrowIcon}
                                </Button>
                            }
                            noResultsElement={t.common.noResults}
                            inputPlaceholder={t.common.search}
                        />
                    ) : null}

                    {props.hook.hasDevVersion ? (
                        <LabelledCheckbox
                            className="mx-2 sm:ms-auto"
                            checked={props.hook.showDevVersions}
                            onCheckedChange={(checked) => props.hook.setShowDevVersions(checked === true)}
                            icon={<FlaskConicalIcon aria-hidden className="h-btn-icon w-btn-icon" />}
                        >
                            {t.project.showDevVersions}
                        </LabelledCheckbox>
                    ) : null}
                </div>
            ) : null}

            {props.hook.activeFiltersCount > 0 ? (
                <div className="flex w-full flex-wrap items-center justify-start gap-x-2 gap-y-1">
                    {props.hook.activeFiltersCount > 1 ? (
                        <FilterItemChip label={t.search.clearFilters} onClick={props.hook.resetActiveFilters} />
                    ) : null}

                    {activeFilters.releaseChannels.map((channel) => (
                        <FilterItemChip
                            key={channel}
                            label={CapitalizeAndFormatString(channel)}
                            className={releaseChannelTextColor(channel as VersionReleaseChannel)}
                            onClick={() => {
                                setActiveFilters({
                                    ...activeFilters,
                                    releaseChannels: activeFilters.releaseChannels.filter((c) => c !== channel),
                                });
                            }}
                        />
                    ))}

                    {getGameVersionsFromValues(activeFilters.gameVersions).map((version) => (
                        <FilterItemChip
                            key={version.label}
                            label={version.label}
                            onClick={() => {
                                setActiveFilters({
                                    ...activeFilters,
                                    gameVersions: activeFilters.gameVersions.filter((v) => v !== version.value),
                                });
                            }}
                        />
                    ))}

                    {activeFilters.loaders.map((loader) => {
                        const loaderData = getLoaderFromString(loader);
                        if (!loaderData) return null;

                        return (
                            <FilterItemChip
                                key={loader}
                                label={CapitalizeAndFormatString(loader)}
                                style={{
                                    color: `hsla(var(--loader-fg-${loaderData.name}, --foreground-muted))`,
                                }}
                                onClick={() => {
                                    setActiveFilters({
                                        ...activeFilters,
                                        loaders: activeFilters.loaders.filter((l) => l !== loader),
                                    });
                                }}
                            />
                        );
                    })}
                </div>
            ) : null}
        </>
    );
}

function FilterItemChip(props: { label: string; onClick: () => void; className?: string; style?: CSSProperties }) {
    return (
        <ChipButton
            onClick={props.onClick}
            style={props.style}
            className={cn("gap-1 pe-1.5 hover:underline", props.className)}
        >
            {props.label}
            <XIcon aria-hidden className="h-btn-icon-sm w-btn-icon-sm" />
        </ChipButton>
    );
}
