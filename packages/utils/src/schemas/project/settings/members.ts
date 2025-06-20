import { z } from "zod/v4";
import { MAX_MEMBER_ROLE_NAME_LENGTH, MAX_USERNAME_LENGTH } from "~/constants";
import { OrganisationPermission, ProjectPermission } from "~/types";

export const inviteTeamMemberFormSchema = z.object({
    userName: z.string().max(MAX_USERNAME_LENGTH),
});

export const updateTeamMemberFormSchema = z.object({
    role: z.string().max(MAX_MEMBER_ROLE_NAME_LENGTH),
    permissions: z.enum(ProjectPermission).array().optional(),
    organisationPermissions: z.enum(OrganisationPermission).array().optional(),
});

export const overrideOrgMemberFormSchema = z.object({
    userId: z.string().max(32),
    role: z.string().max(MAX_MEMBER_ROLE_NAME_LENGTH),
    permissions: z.enum(ProjectPermission).array().optional(),
});
