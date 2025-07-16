import { Check, InfoIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/components/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

export interface ComboBoxItem {
    label: string;
    value: string;
    disabled?: boolean;
    disabledReason?: string;
    onlyVisibleWhenSearching?: boolean;
}

interface ComboBoxProps {
    options: ComboBoxItem[];
    value: string;
    children: React.ReactNode;
    inputBox?: boolean;
    inputLabel?: string;
    setValue: (value: string) => void;
    footerItem?: React.ReactNode;
    noResultsElem?: React.ReactNode;
}

function ComboBox(props: ComboBoxProps) {
    const [searchVal, setSearchVal] = useState("");
    const [open, setOpen] = useState(false);

    const idToValueMap = useMemo(() => {
        const map = new Map<string, string>();
        for (const option of props.options) {
            const id = `${option.value} ${option.label}`;
            map.set(id, option.value);
        }

        return map;
    }, [props.options]);

    const commandItems = useMemo(() => {
        return props.options.map((option) => {
            if (!searchVal?.trim() && option.onlyVisibleWhenSearching) return null;
            return (
                <CommandItem
                    key={option.value}
                    value={`${option.value} ${option.label}`}
                    onSelect={(currentValue) => {
                        props.setValue(idToValueMap.get(currentValue) || "");
                        setOpen(false);
                    }}
                    className={cn(
                        option?.disabled === true &&
                            "text-danger-fg data-[selected=true]:bg-raised-background data-[selected=true]:text-danger-fg",
                    )}
                >
                    <Check className={cn("me-2 h-4 w-4", props.value === option.value ? "opacity-100" : "opacity-0")} />
                    {option.label}
                    {option?.disabled === true ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <InfoIcon aria-hidden className="ms-auto me-2 h-btn-icon w-btn-icon" />
                            </TooltipTrigger>

                            <TooltipContent>{option?.disabledReason || "Disabled"}</TooltipContent>
                        </Tooltip>
                    ) : null}
                </CommandItem>
            );
        });
    }, [props.options, !!searchVal?.trim()]);

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>{props.children}</PopoverTrigger>
            <PopoverContent align="end" className="border-none p-0 sm:min-w-[28rem]">
                <Command className="border border-border">
                    {props.inputBox === false ? null : (
                        <CommandInput
                            value={searchVal}
                            onValueChange={setSearchVal}
                            placeholder={props.inputLabel || "Search..."}
                        />
                    )}
                    <TooltipProvider delayDuration={200}>
                        <CommandList>
                            <CommandEmpty>{props.noResultsElem || "No results"}</CommandEmpty>
                            <CommandGroup>{commandItems}</CommandGroup>
                        </CommandList>
                    </TooltipProvider>
                    {props.footerItem}
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default ComboBox;
