import { Button, type ButtonVariants_T } from "@app/components/ui/button";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@app/components/ui/dialog";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { Trash2Icon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { CancelButton } from "~/components/ui/button";

interface ConfirmDialogProps extends ButtonVariants_T {
    title: string;
    shortDesc?: string;
    description: React.ReactNode;

    onConfirm: () => unknown | Promise<unknown>;
    children: React.ReactNode;
    confirmIcon?: React.ReactNode;
    confirmText: string;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const primaryBtnIcon = props.confirmIcon ? props.confirmIcon : <Trash2Icon aria-hidden className="w-btn-icon h-btn-icon" />;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{props.children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{props.title}</DialogTitle>
                    {props.shortDesc ? <DialogDescription>{props.shortDesc}</DialogDescription> : null}
                </DialogHeader>

                <DialogBody className="grid grid-cols-1 gap-form-elements">
                    <p>{props.description}</p>

                    <DialogFooter>
                        <DialogClose asChild>
                            <CancelButton />
                        </DialogClose>

                        <Button
                            onClick={async () => {
                                try {
                                    setIsLoading(true);
                                    await props.onConfirm();
                                } finally {
                                    setIsLoading(false);
                                    setOpen(false);
                                }
                            }}
                            size={props.size}
                            variant={props.variant || "default"}
                            disabled={isLoading}
                        >
                            {isLoading ? <LoadingSpinner size="xs" /> : primaryBtnIcon}

                            {props.confirmText}
                        </Button>
                    </DialogFooter>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
