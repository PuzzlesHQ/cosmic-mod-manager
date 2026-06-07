import { z } from "zod/v4";
import { MAX_LICENSE_NAME_LENGTH } from "~/constants";
import { nullableStringUrl } from "../index";

export const updateProjectLicenseFormSchema = z.object({
    name: z.string().max(MAX_LICENSE_NAME_LENGTH).nullable(),
    id: z.string().max(64).nullable(),
    url: nullableStringUrl,
});
