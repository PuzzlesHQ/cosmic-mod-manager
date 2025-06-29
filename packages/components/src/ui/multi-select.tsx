import type { VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronDownIcon, XCircle } from "lucide-react";
import { useState } from "react";
import type { badgeVariants } from "~/ui/badge";
import { Button } from "~/ui/button";
import { ChipButton } from "~/ui/chip";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover";
import { cn } from "~/utils";

interface MultiSelectOption {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface MultiSelectProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof badgeVariants> {
    options: MultiSelectOption[];
    // allOptions is used when the selected values contains values that are not visibile and you want them to show up in the badges
    allOptions?: MultiSelectOption[];
    onValueChange: (value: string[]) => void;
    defaultValue?: string[];
    selectedValues: string[];
    placeholder?: string;
    animation?: number;
    maxCount?: number;
    modalPopover?: boolean;
    asChild?: boolean;
    className?: string;
    searchBox?: boolean;
    defaultMinWidth?: boolean;
    // A footer item displayed at the bottom of the popover
    // Fixed, because it won't scroll with the rest of the list
    fixedFooter?: React.ReactNode;
    customTrigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
    popoverClassname?: string;
    noResultsElement?: React.ReactNode;
    inputPlaceholder?: string;

    ref: React.ComponentProps<"button">["ref"];
}

export const MultiSelect = ({
    ref,
    allOptions,
    options,
    onValueChange,
    variant,
    defaultValue = [],
    selectedValues: values,
    placeholder = "Select options",
    animation = 0,
    maxCount = 3,
    modalPopover = false,
    asChild = false,
    className,
    searchBox,
    defaultMinWidth,
    fixedFooter,
    customTrigger,
    open,
    onOpenChange,
    popoverClassname,
    noResultsElement,
    inputPlaceholder,
    ...props
}: MultiSelectProps) => {
    const [localOpen, setLocalOpen] = useState(false);
    const isPopoverOpen = open === undefined ? localOpen : open;

    const selectedValues = values || defaultValue || [];
    function setSelectedValues(newValues: string[]) {
        onValueChange(newValues);
    }

    function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            setLocalOpen(true);
        } else if (event.key === "Backspace" && !event.currentTarget.value) {
            const newSelectedValues = [...selectedValues];
            newSelectedValues.pop();
            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
        }
    }

    function toggleOption(option: string) {
        const newSelectedValues = selectedValues.includes(option)
            ? selectedValues.filter((value) => value !== option)
            : [...selectedValues, option];
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
    }

    function handleTogglePopover(value: boolean) {
        if (onOpenChange) onOpenChange(value);
        else setLocalOpen(value);
    }

    function clearExtraOptions() {
        const newSelectedValues = selectedValues.slice(0, maxCount);
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
    }

    return (
        <Popover open={isPopoverOpen} onOpenChange={setLocalOpen} modal={modalPopover}>
            <PopoverTrigger
                asChild
                className={cn("[&_.indicator]:transition-transform", isPopoverOpen && "[&_.indicator]:rotate-180")}
            >
                {customTrigger ? (
                    customTrigger
                ) : (
                    <Button
                        ref={ref}
                        {...props}
                        onClick={() => handleTogglePopover(!isPopoverOpen)}
                        variant="secondary"
                        className={cn("w-full min-h-10 h-auto px-2", className)}
                    >
                        {selectedValues.length > 0 ? (
                            <div className="flex justify-between items-center w-full">
                                <div className="flex flex-wrap items-center">
                                    {selectedValues.slice(0, maxCount).map((value) => {
                                        const option = (allOptions || options).find((o) => o.value === value);
                                        const IconComponent = option?.icon;
                                        return (
                                            <ChipButton variant="outline" key={value} className={cn("m-[0.17rem]")}>
                                                {IconComponent && <IconComponent className="h-4 w-4 me-2" />}
                                                {option?.label}
                                                <XCircle
                                                    className="h-4 w-4 cursor-pointer"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        toggleOption(value);
                                                    }}
                                                />
                                            </ChipButton>
                                        );
                                    })}
                                    {selectedValues.length > maxCount && (
                                        <ChipButton variant="outline" className="m-[0.17rem]">
                                            {`+ ${selectedValues.length - maxCount} more`}
                                            <XCircle
                                                className="h-4 w-4 cursor-pointer"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    clearExtraOptions();
                                                }}
                                            />
                                        </ChipButton>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <span className="text-muted-foreground me-auto ms-1">{placeholder}</span>
                        )}
                        <ChevronDownIcon aria-hidden className="h-4 cursor-pointer text-muted-foreground" />
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent
                className={cn("w-max p-0 border-none", defaultMinWidth === false && "min-w-48", popoverClassname)}
                align="start"
                onEscapeKeyDown={() => handleTogglePopover(false)}
            >
                <Command className="border border-shallow-background">
                    <CommandInput
                        placeholder={inputPlaceholder || "Search..."}
                        onKeyDown={handleInputKeyDown}
                        size={1}
                        className="w-full"
                        wrapperClassName={cn(searchBox === false && "w-0 h-0 overflow-hidden opacity-0")}
                        {...(searchBox === false ? { readOnly: true } : {})}
                    />
                    <CommandList>
                        <CommandEmpty>{noResultsElement || "No results"}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.includes(option.value);
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => toggleOption(option.value)}
                                        className="cursor-pointer pe-6"
                                    >
                                        <div
                                            className={cn(
                                                "me-3 flex h-4 w-4 items-center justify-center rounded-sm border border-extra-muted-foreground/75",
                                                isSelected
                                                    ? "bg-muted-foreground text-background border-transparent"
                                                    : "opacity-50 [&_svg]:invisible",
                                            )}
                                        >
                                            <CheckIcon aria-hidden className="h-3.5 w-3.5" strokeWidth={2.3} />
                                        </div>

                                        {option.icon && (
                                            <option.icon
                                                className={cn(
                                                    "me-2 h-4 w-4 text-muted-foreground",
                                                    isSelected && "text-foreground",
                                                )}
                                            />
                                        )}
                                        <span className={cn(isSelected && "text-foreground-bright")}>{option.label}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>

                    {fixedFooter}
                </Command>
            </PopoverContent>
        </Popover>
    );
};

MultiSelect.displayName = "MultiSelect";
