import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormProps, useForm as useForm_RHF } from "react-hook-form";
import type { z } from "zod/v4";

export function useFormHook<T extends z.ZodObject>(schema: T, options: UseFormProps<z.input<T>, unknown, z.output<T>>) {
    return useForm_RHF<z.input<T>, unknown, z.output<T>>({
        resolver: zodResolver(schema),
        ...options,
    });
}
