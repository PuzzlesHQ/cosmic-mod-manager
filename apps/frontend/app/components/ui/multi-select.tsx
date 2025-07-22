import type { VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { useState } from "react";
import type { badgeVariants } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ChipButton } from "~/components/ui/chip";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/components/utils";

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

    ref?: React.ComponentProps<"button">["ref"];
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
                        className={cn("h-auto min-h-10 w-full px-2", className)}
                    >
                        {selectedValues.length > 0 ? (
                            <div className="flex w-full items-center justify-between">
                                <div className="flex flex-wrap items-center">
                                    {selectedValues.slice(0, maxCount).map((value) => {
                                        const option = (allOptions || options).find((o) => o.value === value);
                                        const IconComponent = option?.icon;
                                        return (
                                            <ChipButton
                                                variant="outline"
                                                key={value}
                                                className="m-[0.17rem] gap-1 pe-1 has-[svg:hover]:underline"
                                            >
                                                {IconComponent && <IconComponent className="me-2 h-4 w-4" />}
                                                {option?.label}
                                                <XIcon
                                                    className="inline h-3.5 w-3.5 cursor-pointer text-foreground-muted hover:text-error-fg"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        toggleOption(value);
                                                    }}
                                                />
                                            </ChipButton>
                                        );
                                    })}
                                    {selectedValues.length > maxCount && (
                                        <ChipButton
                                            variant="outline"
                                            className="m-[0.17rem] gap-1 pe-1 has-[svg:hover]:underline"
                                        >
                                            {`+ ${selectedValues.length - maxCount} more`}
                                            <XIcon
                                                className="inline h-3.5 w-3.5 cursor-pointer text-foreground-muted hover:text-error-fg"
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
                            <span className="ms-1 me-auto text-foreground-muted">{placeholder}</span>
                        )}
                        <ChevronDownIcon aria-hidden className="h-4 cursor-pointer text-foreground-muted" />
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent
                className={cn("w-max border-none p-0", defaultMinWidth === false && "min-w-48", popoverClassname)}
                align="start"
                onEscapeKeyDown={() => handleTogglePopover(false)}
            >
                <Command className="border border-border">
                    <CommandInput
                        placeholder={inputPlaceholder || "Search..."}
                        onKeyDown={handleInputKeyDown}
                        size={1}
                        className="w-full"
                        wrapperClassName={cn(searchBox === false && "h-0 w-0 overflow-hidden opacity-0")}
                        {...(searchBox === false ? { readOnly: true } : {})}
                    />
                    <CommandList className="grid gap-y-1">
                        <CommandEmpty>{noResultsElement || "No results"}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.includes(option.value);
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => toggleOption(option.value)}
                                        className={cn(
                                            "ps-3",
                                            isSelected
                                                ? "text-accent-text data-[selected=true]:text-accent-text"
                                                : "text-foreground-muted",
                                        )}
                                    >
                                        {option.icon && <option.icon className="me-2 h-4 w-4 text-current" />}
                                        <span>{option.label}</span>

                                        <div
                                            className={cn(
                                                "ms-auto flex h-4 w-4 items-center justify-center rounded-sm border",
                                                isSelected
                                                    ? "border-transparent bg-accent-bg text-accent-bg-foreground"
                                                    : "border-hover-background-strong [&_svg]:invisible",
                                            )}
                                        >
                                            <CheckIcon aria-hidden className="h-3.5 w-3.5" strokeWidth={2.8} />
                                        </div>
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
