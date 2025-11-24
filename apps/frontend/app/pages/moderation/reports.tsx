import { encodeArrayIntoStr } from "@app/utils/string";
import {
    type ReportFilters as Filters,
    ReportItemType,
    ReportStatus_Filter,
    RuleViolationType,
    reportFilters_defaults,
} from "@app/utils/types/api/report";
import { FilterIcon, RotateCcwIcon, SlidersHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import type { ReportsData } from "~/components/layout/report/_additional-data-loader";
import ReportList from "~/components/layout/report/report-list";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { MultiSelect } from "~/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { useTranslation } from "~/locales/provider";

interface Props {
    data: ReportsData;
}

function initFilterState(searchParams: URLSearchParams): Filters {
    const filters = { ...reportFilters_defaults };
    for (const key of Object.keys(reportFilters_defaults)) {
        // @ts-expect-error
        filters[key] = searchParams.get(key) || reportFilters_defaults[key];
    }

    return filters;
}

export default function Reports_ModerationPage(props: Props) {
    const data = props.data;
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [filters, setFilters] = useState<Filters>(initFilterState(searchParams));

    function updateFilters(newFilters: Partial<Filters>) {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
        }));
    }

    function resetFilters() {
        updateFilters(reportFilters_defaults);
    }

    function applyFilters(custom_filters?: Filters) {
        const _filters = custom_filters ?? filters;

        setSearchParams((prev) => {
            const keys = Object.keys(reportFilters_defaults) as (keyof typeof reportFilters_defaults)[];
            for (const key of keys) {
                const val = _filters[key];

                if (!val?.length || val === reportFilters_defaults[key]) {
                    prev.delete(key);
                } else {
                    if (Array.isArray(val)) {
                        prev.set(key, encodeArrayIntoStr(val));
                    } else if (typeof val === "string") {
                        prev.set(key, val);
                    }
                }
            }

            return prev;
        });

        setDialogOpen(false);
        if (custom_filters) updateFilters(custom_filters);
    }

    const itemId_label =
        filters.itemType !== "all"
            ? // @ts-expect-error
              t?.[filters.itemType]?.[filters.itemType] || filters.itemType
            : "";

    const anyChangedFilter = (Object.keys(reportFilters_defaults) as (keyof typeof reportFilters_defaults)[]).some(
        (key) => {
            return filters[key] && reportFilters_defaults[key] !== filters[key];
        },
    );

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between gap-x-5">
                <CardTitle>{t.moderation.reports}</CardTitle>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="secondary">
                            <SlidersHorizontalIcon className="h-4 w-4" />
                            {t.search.filters}
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t.search.filters}</DialogTitle>
                            <VisuallyHidden>
                                <DialogDescription>{t.search.filters}</DialogDescription>
                            </VisuallyHidden>
                        </DialogHeader>

                        <DialogBody className="grid grid-cols-[2fr_3fr] items-center gap-x-4 gap-y-2">
                            <span className="px-0.5 font-medium text-foreground-muted" id="report-status-label">
                                {t.report.status("")}
                            </span>
                            <Select
                                value={filters.status}
                                onValueChange={(val) => updateFilters({ status: val as ReportStatus_Filter })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(ReportStatus_Filter).map((status) => {
                                        return (
                                            <SelectItem key={status} value={status}>
                                                {t.common[status]}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            <span className="px-0.5 font-medium text-foreground-muted">
                                {t.report.reportedItem("")}
                            </span>
                            <Select
                                value={filters.itemType}
                                onValueChange={(val) => updateFilters({ itemType: val as ReportItemType | "all" })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key="all" value="all">
                                        {t.common.all}
                                    </SelectItem>

                                    {Object.values(ReportItemType).map((item) => {
                                        return (
                                            <SelectItem key={item} value={item}>
                                                {/* @ts-expect-error */}
                                                {t?.[item]?.[item] || item}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            {filters.itemType !== "all" && (
                                <>
                                    <span className="px-0.5 font-medium text-foreground-muted" id="report-status-label">
                                        {itemId_label}
                                    </span>
                                    <Input
                                        placeholder={`${t.form.id} (${t.projectSettings.optional})`}
                                        value={filters.itemId}
                                        onChange={(e) => updateFilters({ itemId: e.target.value || "" })}
                                    />
                                </>
                            )}

                            <span className="px-0.5 font-medium text-foreground-muted">
                                {t.report.ruleViolated("")}
                            </span>

                            <MultiSelect
                                searchBox={false}
                                defaultMinWidth={false}
                                selectedValues={filters.ruleViolated}
                                options={Object.values(RuleViolationType).map((type) => ({
                                    label: t.report.violationType[type],
                                    value: type,
                                }))}
                                onValueChange={(values) => {
                                    updateFilters({
                                        ruleViolated: values.length ? (values as RuleViolationType[]) : [],
                                    });
                                }}
                                placeholder={t.common.all}
                                popoverClassname="violated-rule-selector"
                                noResultsElement={t.common.noResults}
                                inputPlaceholder={t.common.search}
                            />

                            <span className="px-0.5 font-medium text-foreground-muted" id="report-status-label">
                                {t.report.reportedBy(":")}
                            </span>
                            <Input
                                placeholder={`${t.form.id} (${t.projectSettings.optional})`}
                                value={filters.reportedBy}
                                onChange={(e) => updateFilters({ reportedBy: e.target.value || "" })}
                            />
                        </DialogBody>

                        <DialogFooter className="px-card-surround">
                            <Button variant="secondary" onClick={resetFilters}>
                                <RotateCcwIcon className="h-btn-icon w-btn-icon" />
                                {t.common.reset}
                            </Button>

                            <Button onClick={() => applyFilters()}>
                                <FilterIcon className="h-btn-icon w-btn-icon" />
                                {t.common.filter}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>

            <CardContent className="grid gap-3">
                {!data?.reports?.length ? (
                    anyChangedFilter ? (
                        <div className="grid gap-3">
                            <p className="text-foreground-extra-muted text-md italic">{t.common.noResults}</p>

                            <Button variant="secondary" onClick={() => applyFilters(reportFilters_defaults)}>
                                <RotateCcwIcon className="h-btn-icon w-btn-icon" />
                                {t.search.clearFilters}
                            </Button>
                        </div>
                    ) : (
                        <p>{t.report.noOpenReports}</p>
                    )
                ) : (
                    <ReportList data={data} />
                )}
            </CardContent>
        </Card>
    );
}
