import { GlobalUserRole } from "~/types";

export const RESERVED_VERSION_SLUGS = ["new", "latest"];
export const RESERVED_PROJECT_SLUGS = [];

export const RESERVED_USERNAMES = ["deleted_user", ...Object.values(GlobalUserRole)];
