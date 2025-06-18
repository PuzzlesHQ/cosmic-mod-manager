import z from "zod";
import { Loaders } from "~/types";

export const CreateInstanceFormSchema = z.object({
    icon: z.instanceof(File).optional(),
    name: z.string().max(64),
    loader: z.enum(Loaders),
    gameVersion: z.string(),
});
