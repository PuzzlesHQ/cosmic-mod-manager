import { z } from "zod/v4";
import { MAX_LICENSE_NAME_LENGTH } from "~/constants";
import { formLink } from "../index";

export const updateProjectLicenseFormSchema = z.object({
    name: z.string().max(MAX_LICENSE_NAME_LENGTH).optional(),
    id: z.string().max(64).optional(),
    url: formLink.optional(),
});
