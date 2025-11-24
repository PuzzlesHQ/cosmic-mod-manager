import { zodParse } from "@app/utils/schemas/utils";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod/v4";

export async function submitFormWithErrorHandling<T extends z.ZodObject>(
    e: React.FormEvent,
    schema: T,
    form: UseFormReturn<z.infer<T>, unknown, z.infer<T>>,
    onSuccess: (data: z.infer<T>) => Promise<unknown>,
    onError?: ((error: string) => void | Promise<void>) | typeof toast.error,
) {
    e.preventDefault();

    // show a toast if there are errors
    const parseResult = await zodParse(schema, form.getValues());
    if (parseResult.error) {
        await (onError || toast.error)(parseResult.error);
    }

    // let react-hook-form handle the errors and callback
    await form.handleSubmit(onSuccess)();
}
