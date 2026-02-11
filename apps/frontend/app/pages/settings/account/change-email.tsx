// import { emailFormSchema } from "@app/utils/schemas/settings";
// import { PencilLineIcon, SendIcon } from "lucide-react";
// import { useState } from "react";
// import { Button } from "~/components/ui/button";
// import {
//     Dialog,
//     DialogBody,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "~/components/ui/dialog";
// import { Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
// import { Input } from "~/components/ui/input";
// import { LoadingSpinner } from "~/components/ui/spinner";
// import { VisuallyHidden } from "~/components/ui/visually-hidden";
// import { useFormHook } from "~/hooks/use-form";
// import { useTranslation } from "~/locales/provider";

// export function ChangeEmailDialog() {
//     const { t } = useTranslation();
//     const [dialogOpen, setDialogOpen] = useState(false);

//     return (
//         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//             <DialogTrigger asChild>
//                 <Button variant="ghost" size="icon" className="aspect-square h-full w-auto">
//                     <PencilLineIcon aria-hidden className="h-btn-icon w-btn-icon" />
//                 </Button>
//             </DialogTrigger>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Change email</DialogTitle>
//                     <VisuallyHidden>
//                         <DialogDescription>Change email</DialogDescription>
//                     </VisuallyHidden>
//                 </DialogHeader>

//                 <DialogBody>
//                     <SendConfirmationCode />
//                 </DialogBody>
//             </DialogContent>
//         </Dialog>
//     );
// }

// interface SendConfirmationCodeProps {}

// function SendConfirmationCode(props: SendConfirmationCodeProps) {
//     const [isLoading, setIsLoading] = useState(false);
//     const { t } = useTranslation();

//     const form = useFormHook(emailFormSchema, {
//         defaultValues: {
//             email: "",
//         },
//     });

//     return (
//         <Form {...form}>
//             <form
//                 className="flex flex-col items-center justify-start gap-form-elements"
//                 // onSubmit={form.handleSubmit(addNewPassword)}
//             >
//                 <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel htmlFor="new-email">{t.auth.email}</FormLabel>
//                             <Input
//                                 {...field}
//                                 autoComplete="email"
//                                 type="email"
//                                 id="new-email"
//                                 placeholder={t.auth.enterEmail}
//                                 spellCheck={false}
//                             />
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <DialogFooter>
//                     <Button disabled={!form.formState.isDirty || isLoading}>
//                         {isLoading ? (
//                             <LoadingSpinner size="xs" />
//                         ) : (
//                             <SendIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
//                         )}
//                         Send confirmation code
//                     </Button>
//                 </DialogFooter>
//             </form>
//         </Form>
//     );
// }
