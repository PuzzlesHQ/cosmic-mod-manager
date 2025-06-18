import { fallbackProjectIcon } from "@app/components/icons";
import { ImgWrapper } from "@app/components/ui/avatar";
import { Button, CancelButton, buttonVariants } from "@app/components/ui/button";
import ComboBox from "@app/components/ui/combobox";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@app/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { InteractiveLabel } from "@app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select";
import { toast } from "@app/components/ui/sonner";
import { cn } from "@app/components/utils";
import { CapitalizeAndFormatString } from "@app/utils/src/string";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon, PlusIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import type z from "zod/v4";
import useRootData from "~/hooks/root-data";
import { CreateInstanceFormSchema } from "~/schemas/create-instance";
import { Loaders } from "~/types";

interface Props {
    children: ReactNode;
}

export default function CreateInstance(props: Props) {
    const form = useForm<z.infer<typeof CreateInstanceFormSchema>>({
        resolver: zodResolver(CreateInstanceFormSchema),
        defaultValues: {
            name: "",
            loader: Loaders.VANILLA,
            gameVersion: "",
        },
    });

    function isFormSubmittable() {
        const values = form.getValues();
        const isFormInvalid = !values.name || !values.loader || !values.gameVersion;
        return !isFormInvalid;
    }

    const clientVersions = getGameClientVersions();
    const versionOptions = clientVersions
        .map((version) => {
            if (isExperimentalVersion(version.id)) return null;

            return {
                label: version.id,
                value: version.id,
            };
        })
        .filter((version) => version !== null);

    useEffect(() => {
        if (!form.getValues().gameVersion) {
            form.setValue("gameVersion", versionOptions[0]?.value);
        }
    }, [versionOptions]);

    return (
        <Dialog>
            <DialogTrigger asChild>{props.children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create instance</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Form {...form}>
                        <form className="w-full grid grid-cols-1 gap-4">
                            <FormField
                                name="icon"
                                control={form.control}
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel className="font-bold">
                                                <FormMessage />
                                            </FormLabel>
                                            <div className="flex flex-wrap items-center justify-start gap-4">
                                                <input
                                                    hidden
                                                    className="hidden"
                                                    id="project-icon-input"
                                                    type="file"
                                                    value=""
                                                    name={field.name}
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        try {
                                                            await CreateInstanceFormSchema.parseAsync({
                                                                ...form.getValues(),
                                                                icon: file,
                                                            });
                                                            field.onChange(file);
                                                        } catch (error) {
                                                            // @ts-ignore
                                                            toast.error(error?.issues?.[0]?.message || "Error with the file");
                                                            console.error(error);
                                                        }
                                                    }}
                                                />

                                                <ImgWrapper
                                                    alt="name"
                                                    src={(() => {
                                                        const image = form.getValues()?.icon;
                                                        if (image instanceof File) {
                                                            return URL.createObjectURL(image);
                                                        }
                                                        if (!image) {
                                                            return "";
                                                        }
                                                        return "";
                                                    })()}
                                                    className="rounded"
                                                    fallback={fallbackProjectIcon}
                                                />

                                                <div className="flex flex-col items-start justify-center gap-2">
                                                    <InteractiveLabel
                                                        htmlFor="project-icon-input"
                                                        className={cn(
                                                            buttonVariants({ variant: "secondary", size: "default" }),
                                                            "cursor-pointer",
                                                        )}
                                                    >
                                                        <UploadIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                                        Upload icon
                                                    </InteractiveLabel>
                                                    {form.getValues().icon ? (
                                                        <Button
                                                            variant="secondary"
                                                            type="button"
                                                            onClick={() => {
                                                                form.setValue("icon", undefined);
                                                            }}
                                                        >
                                                            <Trash2Icon aria-hidden className="w-btn-icon h-btn-icon" />
                                                            Remove icon
                                                        </Button>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </FormItem>
                                    );
                                }}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem {...field}>
                                        <FormLabel>
                                            Name
                                            <FormMessage />
                                        </FormLabel>
                                        <Input placeholder="Name of the instance" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="loader"
                                render={({ field }) => (
                                    <FormItem {...field}>
                                        <FormLabel>
                                            Loader
                                            <FormMessage />
                                        </FormLabel>
                                        <Select defaultValue={Loaders.VANILLA}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[Loaders.VANILLA, Loaders.QUILT, Loaders.PUZZLE_LOADER].map((loader) => {
                                                    return (
                                                        <SelectItem key={loader} value={loader}>
                                                            {CapitalizeAndFormatString(loader)}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gameVersion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Game version
                                            <FormMessage />
                                        </FormLabel>

                                        <ComboBox
                                            options={versionOptions}
                                            value={field.value}
                                            setValue={(val) => {
                                                if (val) field.onChange(val);
                                            }}
                                        >
                                            <Button variant="secondary" className="w-full justify-between">
                                                {field.value || "Select game version"}
                                                <ChevronDownIcon aria-hidden className="w-4 h-4" />
                                            </Button>
                                        </ComboBox>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <CancelButton type="button" />
                                </DialogClose>
                                <Button disabled={!isFormSubmittable()}>
                                    <PlusIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                                    Create
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

function getGameClientVersions() {
    const allVersions = useRootData()?.gameVersions;

    return (
        allVersions?.filter((ver) => {
            if (ver.client.url?.length > 0) return true;
            return false;
        }) || []
    );
}

// Ids ending with an alphabet character are experimental versions
function isExperimentalVersion(id: string) {
    return /[a-zA-Z]$/.test(id);
}
