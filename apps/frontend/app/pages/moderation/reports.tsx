import { Button } from "@app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@app/components/ui/dialog";
import { Input } from "@app/components/ui/input";
import { MultiSelect } from "@app/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select";
import { VisuallyHidden } from "@app/components/ui/visually-hidden";
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
import { useTranslation } from "~/locales/provider";

interface Props {
    data: ReportsData;
}

function initFilterState(searchParams: URLSearchParams): Filters {
    const filters = { ...reportFilters_defaults };
    for (const key of Object.keys(reportFilters_defaults)) {
        // @ts-ignore
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
            ? // @ts-ignore
              t?.[filters.itemType]?.[filters.itemType] || filters.itemType
            : "";

    const anyChangedFilter = (Object.keys(reportFilters_defaults) as (keyof typeof reportFilters_defaults)[]).some((key) => {
        return filters[key] && reportFilters_defaults[key] !== filters[key];
    });

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between gap-x-5">
                <CardTitle>{t.moderation.reports}</CardTitle>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="secondary">
                            <SlidersHorizontalIcon className="w-4 h-4" />
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

                        <DialogBody className="grid gap-x-4 gap-y-2 grid-cols-[2fr_3fr] items-center">
                            <span className="font-medium px-0.5 text-muted-foreground" id="report-status-label">
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

                            <span className="font-medium px-0.5 text-muted-foreground">{t.report.reportedItem("")}</span>
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
                                                {/* @ts-ignore */}
                                                {t?.[item]?.[item] || item}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>

                            {filters.itemType !== "all" && (
                                <>
                                    <span className="font-medium px-0.5 text-muted-foreground" id="report-status-label">
                                        {itemId_label}
                                    </span>
                                    <Input
                                        placeholder={`${t.form.id} (${t.projectSettings.optional})`}
                                        value={filters.itemId}
                                        onChange={(e) => updateFilters({ itemId: e.target.value || "" })}
                                    />
                                </>
                            )}

                            <span className="font-medium px-0.5 text-muted-foreground">{t.report.ruleViolated("")}</span>

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

                            <span className="font-medium px-0.5 text-muted-foreground" id="report-status-label">
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
                                <RotateCcwIcon className="w-btn-icon h-btn-icon" />
                                {t.common.reset}
                            </Button>

                            <Button onClick={() => applyFilters()}>
                                <FilterIcon className="w-btn-icon h-btn-icon" />
                                {t.common.filter}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>

            <CardContent className="gap-3">
                {!data?.reports?.length ? (
                    anyChangedFilter ? (
                        <div className="grid gap-3">
                            <p className="text-md text-extra-muted-foreground italic">{t.common.noResults}</p>

                            <Button variant="secondary" onClick={() => applyFilters(reportFilters_defaults)}>
                                <RotateCcwIcon className="w-btn-icon h-btn-icon" />
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
