import { type LoaderNames, loaders } from "@app/utils/constants/loaders";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import tagIcons from "~/components/icons/tag-icons";
import { Badge } from "~/components/ui/badge";
import { Button, CancelButton } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LabelledCheckbox } from "~/components/ui/checkbox";
import Chip from "~/components/ui/chip";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { FormErrorMessage, FormSuccessMessage, FormWarningMessage } from "~/components/ui/form-message";
import { TextLink } from "~/components/ui/link";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { LabelledTernaryCheckbox, TernaryStates } from "~/components/ui/ternary-checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { ThemeSwitcher } from "~/pages/settings/preferences";

export default function () {
    const [ternaryState, setTernaryState] = useState<TernaryStates>(TernaryStates.EXCLUDED);

    return (
        <div className="grid gap-4">
            <ThemeSwitcher />

            <Separator className="my-2" />

            <h1 className="font-bold text-foreground-bright text-xl">TEXT</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-4">
                <p className="text-accent-text">text-accent-text</p>
                <p className="text-foreground">text-foreground</p>
                <p className="text-foreground-muted">text-foreground-muted</p>
                <p className="text-foreground-extra-muted">text-foreground-extra-muted</p>
                <TextLink to="#">Text link</TextLink>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Switches</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-x-8 gap-y-4">
                    <Switch defaultChecked />
                    <RadioGroup className="flex flex-wrap gap-4" defaultValue="1">
                        <label htmlFor="radio-1" className="flex items-center gap-2">
                            <RadioGroupItem value="1" id="radio-1" />
                            Option 1
                        </label>
                        <label htmlFor="radio-2" className="flex items-center gap-2">
                            <RadioGroupItem value="2" id="radio-2" />
                            Option 2
                        </label>
                        <label htmlFor="radio-3" className="flex items-center gap-2">
                            <RadioGroupItem value="3" id="radio-3" />
                            Option 3
                        </label>
                    </RadioGroup>

                    <LabelledCheckbox defaultChecked checked={undefined}>
                        Normal Checkbox
                    </LabelledCheckbox>

                    <LabelledTernaryCheckbox
                        state={ternaryState}
                        onCheckedChange={setTernaryState}
                        id="ternary-checkbox"
                    >
                        Ternary Checkbox
                    </LabelledTernaryCheckbox>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Buttons</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-x-8 gap-y-4">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="secondary-destructive">Secondary Destructive</Button>
                    <Button variant="ghost-destructive">Ghost Destructive</Button>
                    <Button variant="moderation">Moderation</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Message Boxes</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-x-8 gap-y-4">
                    <FormSuccessMessage text="This is a success message." />
                    <FormErrorMessage text="This is an error message." />
                    <FormWarningMessage text="This is a warning message." />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Popups and Dropdowns</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Open Dialog</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>A Dialog</DialogTitle>
                            </DialogHeader>
                            <DialogBody>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <CancelButton />
                                    </DialogClose>
                                </DialogFooter>
                            </DialogBody>
                        </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary">
                                Open Dropdown
                                <ChevronDownIcon className="indicator h-btn-icon w-btn-icon" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Group</DropdownMenuLabel>
                                <DropdownMenuItem>Item 1</DropdownMenuItem>
                                <DropdownMenuItem>Item 2</DropdownMenuItem>
                                <DropdownMenuItem>Item 3</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Select>
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Select Menu" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="item_1">Item 1</SelectItem>
                            <SelectSeparator />
                            <SelectItem value="item_2">Item 2</SelectItem>
                            <SelectItem value="item_3">Item 3</SelectItem>
                        </SelectContent>
                    </Select>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost">Hover for Tooltip</Button>
                            </TooltipTrigger>
                            <TooltipContent>This is a tooltip message.</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Loaders</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    {loaders.map((loader) => {
                        const loaderIcon: React.ReactNode = tagIcons[loader.name as LoaderNames];

                        return (
                            <Chip
                                key={loader.name}
                                style={{
                                    color: `hsla(var(--loader-fg-${loader.name}, --foreground-muted))`,
                                }}
                            >
                                {loaderIcon ? loaderIcon : null}
                                {CapitalizeAndFormatString(loader.name)}
                            </Chip>
                        );
                    })}

                    <div className="flex w-full flex-wrap gap-4">
                        <Badge variant="default">default</Badge>
                        <Badge variant="secondary">secondary</Badge>
                        <Badge variant="destructive">destructive</Badge>
                        <Badge variant="warning">warning</Badge>
                        <Badge variant="outline">outline</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
