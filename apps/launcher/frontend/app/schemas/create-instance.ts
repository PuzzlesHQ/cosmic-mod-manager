import z from "zod/v4";
import { Loaders } from "~/types";

export const CreateInstanceFormSchema = z.object({
    icon: z.file().optional(),
    name: z.string().max(64),
    loader: z.enum(Loaders),
    gameVersion: z.string(),
});
