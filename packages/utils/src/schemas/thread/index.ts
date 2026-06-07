import { z } from "zod/v4";
import { MAX_THREAD_MESSAGE_LENGTH, STRING_ID_LENGTH } from "~/constants";

export const createThreadMessage_Schema = z.object({
    isPrivate: z.boolean().default(false).nullable(),
    message: z.string().max(MAX_THREAD_MESSAGE_LENGTH),
    replyingTo: z.string().max(STRING_ID_LENGTH).nullable(),
});
