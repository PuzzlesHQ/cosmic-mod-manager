import { fallbackUserIcon } from "@app/components/icons";
import { Button } from "@app/components/ui/button";
import { Card } from "@app/components/ui/card";
import { LabelledCheckbox } from "@app/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { toast } from "@app/components/ui/sonner";
import { Switch } from "@app/components/ui/switch";
import { cn } from "@app/components/utils";
import { ProjectPermissionsList } from "@app/utils/config/project";
import { doesMemberHaveAccess } from "@app/utils/project";
import type { z } from "@app/utils/schemas";
import { updateTeamMemberFormSchema } from "@app/utils/schemas/project/settings/members";
import { handleFormError } from "@app/utils/schemas/utils";
import { hasRootAccess } from "@app/utils/src/constants/roles";
import { type LoggedInUserData, ProjectPermission } from "@app/utils/types";
import type { ProjectDetailsData, TeamMember } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightLeftIcon, ChevronDownIcon, CrownIcon, RefreshCcwIcon, SaveIcon, UserXIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImgWrapper } from "~/components/ui/avatar";
import Link from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import { UserProfilePath } from "~/utils/urls";
import { RemoveMemberDialog, TransferOwnershipDialog } from "./dialogs";

interface ProjectTeamMemberProps {
    session: LoggedInUserData | null;
    member: TeamMember;
    currUsersMembership: TeamMember | null;
    fetchProjectData: () => Promise<void>;
    projectTeamId: string;
    doesProjectHaveOrg: boolean;
}

export function ProjectTeamMember({
    session,
    member,
    currUsersMembership,
    fetchProjectData,
    projectTeamId,
    doesProjectHaveOrg,
}: ProjectTeamMemberProps) {
    const { t } = useTranslation();
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof updateTeamMemberFormSchema>>({
        resolver: zodResolver(updateTeamMemberFormSchema),
        defaultValues: {
            role: member.role,
            permissions: member.permissions,
        },
    });
    form.watch();

    async function updateMemberDetails(values: z.infer<typeof updateTeamMemberFormSchema>) {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/team/${member.teamId}/member/${member.id}`, {
                method: "PATCH",
                body: JSON.stringify(values),
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || t.common.error);
            }

            await fetchProjectData();
            return toast.success(t.projectSettings.memberUpdated);
        } finally {
            setIsLoading(false);
        }
    }

    const canEditMember = doesMemberHaveAccess(
        ProjectPermission.EDIT_MEMBER,
        currUsersMembership?.permissions,
        currUsersMembership?.isOwner,
        session?.role,
    );
    const canAddPermissions = hasRootAccess(currUsersMembership?.isOwner, session?.role);
    const canRemoveMembers = doesMemberHaveAccess(
        ProjectPermission.REMOVE_MEMBER,
        currUsersMembership?.permissions,
        currUsersMembership?.isOwner,
        session?.role,
    );
    const canTransferOwnership =
        hasRootAccess(currUsersMembership?.isOwner, session?.role) &&
        member.isOwner === false &&
        member.accepted &&
        !doesProjectHaveOrg;

    useEffect(() => {
        form.reset({
            role: member.role,
            permissions: member.permissions,
        });
    }, [member]);

    return (
        <Card className="w-full flex flex-col gap-4 p-card-surround">
            {/* Head */}
            <div className="w-full flex flex-wrap items-center justify-between">
                {/* Member profile details */}
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <ImgWrapper
                        vtId={member.userId}
                        src={imageUrl(member.avatar)}
                        alt={member.userName}
                        fallback={fallbackUserIcon}
                        className="h-12 w-12 rounded-full"
                    />
                    <div className="flex flex-col items-start justify-center gap-1.5">
                        <Link
                            to={UserProfilePath(member.userName)}
                            className="flex items-baseline justify-center gap-1.5 font-semibold text-foreground leading-none"
                        >
                            {member.userName}
                            {member.isOwner && (
                                <span className="flex items-baseline justify-center shrink-0" title={t.projectSettings.owner}>
                                    <CrownIcon aria-hidden className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                                </span>
                            )}
                        </Link>
                        <span className="leading-none text-[0.93rem] text-muted-foreground/80">{member.role}</span>
                    </div>
                </div>

                {/* Accepted status */}
                <div className="flex items-center justify-center gap-x-4">
                    {member.accepted === false && (
                        <span className="flex items-center justify-center gap-1.5 font-bold text-orange-500 dark:text-orange-400">
                            <RefreshCcwIcon aria-hidden className="w-btn-icon h-btn-icon" />
                            {t.projectSettings.pending}
                        </span>
                    )}

                    <Button size="icon" variant="ghost" onClick={() => setDetailsOpen((prev) => !prev)}>
                        <ChevronDownIcon
                            aria-hidden
                            className={cn("w-btn-icon-lg h-btn-icon-lg transition-all", detailsOpen && "rotate-180")}
                        />
                    </Button>
                </div>
            </div>

            {/* Body */}
            {detailsOpen && (
                <Form {...form}>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                        }}
                        className="w-full flex flex-col gap-form-elements"
                    >
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="flex-col md:flex-row justify-between">
                                    <div className="flex flex-col items-start justify-center">
                                        <FormLabel className="font-bold" htmlFor={`member-role-input_${member.id}`}>
                                            {t.projectSettings.role}
                                        </FormLabel>
                                        <span className="text-muted-foreground/90">{t.projectSettings.roleDesc}</span>
                                    </div>
                                    <Input
                                        {...field}
                                        disabled={!canEditMember}
                                        placeholder={t.projectSettings.role}
                                        className="w-[24ch]"
                                        id={`member-role-input_${member.id}`}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {member.isOwner === false && (
                            <FormField
                                control={form.control}
                                disabled={!canEditMember}
                                name="permissions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">{t.projectSettings.permissions}</FormLabel>
                                        <div
                                            className="w-full grid gap-x-4 gap-y-1"
                                            style={{
                                                gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
                                            }}
                                        >
                                            {ProjectPermissionsList.map((permissionName: ProjectPermission) => {
                                                const checked = (field?.value || []).includes(permissionName);
                                                return (
                                                    <LabelledCheckbox
                                                        key={permissionName}
                                                        name={permissionName}
                                                        disabled={field.disabled || (!checked && !canAddPermissions)}
                                                        checked={checked}
                                                        onCheckedChange={(checked) => {
                                                            const currList = field.value || [];
                                                            if (checked === true) {
                                                                field.onChange([...currList, permissionName]);
                                                            } else {
                                                                field.onChange(currList.filter((p) => p !== permissionName));
                                                            }
                                                        }}
                                                    >
                                                        {t.projectSettings.perms[permissionName]}
                                                    </LabelledCheckbox>
                                                );
                                            })}
                                        </div>
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="w-full flex flex-wrap gap-x-4 gap-y-2">
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isLoading || !form.formState.isDirty || (!canEditMember && !canAddPermissions)}
                                onClick={async () => {
                                    await handleFormError(async () => {
                                        const values = await updateTeamMemberFormSchema.parseAsync(form.getValues());
                                        await updateMemberDetails(values);
                                    }, toast.error);
                                }}
                            >
                                <SaveIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                {t.form.saveChanges}
                            </Button>

                            {!member.isOwner && canRemoveMembers && (
                                <RemoveMemberDialog member={member} refreshData={fetchProjectData}>
                                    <Button type="button" variant="secondary-destructive" size="sm" disabled={isLoading}>
                                        <UserXIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                        {t.projectSettings.removeMember}
                                    </Button>
                                </RemoveMemberDialog>
                            )}

                            {canTransferOwnership ? (
                                <TransferOwnershipDialog member={member} teamId={projectTeamId} refreshData={fetchProjectData}>
                                    <Button variant="secondary" size="sm" disabled={isLoading}>
                                        <ArrowRightLeftIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                        {t.projectSettings.transferOwnership}
                                    </Button>
                                </TransferOwnershipDialog>
                            ) : null}
                        </div>
                    </form>
                </Form>
            )}
        </Card>
    );
}

interface OrgTeamMemberProps {
    session: LoggedInUserData | null;
    project: ProjectDetailsData;
    orgMember: TeamMember;
    currUsersMembership: TeamMember | null;
    fetchProjectData: () => Promise<void>;
}

export function OrgTeamMember({ session, project, orgMember, fetchProjectData, currUsersMembership }: OrgTeamMemberProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const permsOverridden = project.members.find((teamMember) => teamMember.userId === orgMember.userId);
    const projectMembership = permsOverridden;
    const [overridePerms, setOverridePerms] = useState(!!permsOverridden);

    const effectiveMembership = projectMembership || orgMember;
    const canEditMember = doesMemberHaveAccess(
        ProjectPermission.EDIT_MEMBER,
        currUsersMembership?.permissions || [],
        currUsersMembership?.isOwner,
        session?.role,
    );
    const canAddPermissions = hasRootAccess(currUsersMembership?.isOwner, session?.role);
    const canRemoveMembers = doesMemberHaveAccess(
        ProjectPermission.REMOVE_MEMBER,
        currUsersMembership?.permissions || [],
        currUsersMembership?.isOwner,
        session?.role,
    );

    const defaultValues = {
        role: effectiveMembership.role,
        permissions: effectiveMembership.permissions,
    };

    const form = useForm<z.infer<typeof updateTeamMemberFormSchema>>({
        resolver: zodResolver(updateTeamMemberFormSchema),
        defaultValues: defaultValues,
    });
    form.watch();

    async function updateMemberDetails(values: z.infer<typeof updateTeamMemberFormSchema>) {
        if (isLoading || !projectMembership) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/team/${project.teamId}/member/${projectMembership.id}`, {
                method: "PATCH",
                body: JSON.stringify(values),
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || t.common.error);
            }

            await fetchProjectData();
            return toast.success(t.projectSettings.memberUpdated);
        } finally {
            setIsLoading(false);
        }
    }

    async function removePermissionOverride() {
        if (isLoading || !projectMembership) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/team/${project.teamId}/member/${projectMembership.id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || t.common.error);
            }

            await fetchProjectData();
            return toast.success(t.projectSettings.memberUpdated);
        } finally {
            setIsLoading(false);
        }
    }

    async function addPermissionOverride(values: z.infer<typeof updateTeamMemberFormSchema>) {
        if (isLoading || projectMembership) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/team/${project.teamId}/members`, {
                method: "POST",
                body: JSON.stringify({
                    ...values,
                    userId: orgMember.userId,
                }),
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || t.common.error);
            }

            await fetchProjectData();
            return toast.success(t.projectSettings.memberUpdated);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        form.reset({
            role: effectiveMembership.role,
            permissions: effectiveMembership.permissions,
        });
    }, [effectiveMembership]);

    useEffect(() => {
        setOverridePerms(!!permsOverridden);
    }, [permsOverridden]);

    let submitButtonDisabled = false;
    if (isLoading === true) submitButtonDisabled = true;
    else if (canEditMember === false) submitButtonDisabled = true;
    // If the form hasn't been changed and the toggle to override member permissions is still the same, the submitButton will be disabled
    else if (form.formState.isDirty === false && !!permsOverridden === overridePerms) {
        submitButtonDisabled = true;
    }

    return (
        <Card className="w-full flex flex-col gap-4 p-card-surround">
            {/* Head */}
            <div className="w-full flex flex-wrap items-center justify-between">
                {/* Member profile details */}
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <ImgWrapper
                        vtId={effectiveMembership.userId}
                        src={imageUrl(effectiveMembership.avatar)}
                        alt={effectiveMembership.userName}
                        fallback={fallbackUserIcon}
                        className="h-12 w-12 rounded-full"
                    />
                    <div className="flex flex-col items-start justify-center gap-1.5">
                        <Link
                            to={UserProfilePath(effectiveMembership.userName)}
                            className="flex items-baseline justify-center gap-1.5 font-semibold text-foreground leading-none"
                        >
                            {effectiveMembership.userName}
                            {orgMember.isOwner && (
                                <span className="flex items-baseline justify-center shrink-0" title={t.projectSettings.owner}>
                                    <CrownIcon aria-hidden className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                                </span>
                            )}
                        </Link>
                        <span className="leading-none text-[0.93rem] text-muted-foreground/80">{effectiveMembership.role}</span>
                    </div>
                </div>

                {/* Accepted status */}
                <div className="flex items-center justify-center gap-x-4">
                    {effectiveMembership.accepted === false && (
                        <span className="flex items-center justify-center gap-1.5 font-bold text-orange-500 dark:text-orange-400">
                            <RefreshCcwIcon aria-hidden className="w-btn-icon h-btn-icon" />
                            {t.projectSettings.pending}
                        </span>
                    )}

                    <Button size="icon" variant="ghost" onClick={() => setDetailsOpen((prev) => !prev)}>
                        <ChevronDownIcon
                            aria-hidden
                            className={cn("w-btn-icon-lg h-btn-icon-lg transition-all", detailsOpen && "rotate-180")}
                        />
                    </Button>
                </div>
            </div>

            {/* Body */}
            {detailsOpen && (
                <Form {...form}>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                        }}
                        className="w-full flex flex-col gap-form-elements"
                    >
                        <FormItem className="flex-row justify-between items-center gap-x-4 sm:gap-x-8">
                            <div className="flex flex-col items-start justify-center gap-1">
                                <FormLabel className="font-bold" htmlFor={`override-perms-input_${effectiveMembership.id}`}>
                                    {t.projectSettings.overrideValues}
                                    <FormMessage />
                                </FormLabel>
                                <span className="text-muted-foreground/90 leading-tight">
                                    {t.projectSettings.overrideValuesDesc}
                                </span>
                            </div>
                            <Switch
                                id={`override-perms-input_${effectiveMembership.id}`}
                                checked={overridePerms}
                                onCheckedChange={setOverridePerms}
                                disabled={!canEditMember || (overridePerms && !canRemoveMembers)}
                            />
                        </FormItem>

                        <FormField
                            control={form.control}
                            disabled={!overridePerms || !canEditMember}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="flex-col md:flex-row justify-between">
                                    <div className="flex flex-col items-start justify-center gap-1">
                                        <FormLabel className="font-bold" htmlFor={`member-role-input_${effectiveMembership.id}`}>
                                            {t.projectSettings.role}
                                            <FormMessage />
                                        </FormLabel>
                                        <span className="text-muted-foreground/90 leading-tight">
                                            {t.projectSettings.roleDesc}
                                        </span>
                                    </div>
                                    <Input
                                        {...field}
                                        placeholder={t.projectSettings.role}
                                        className="w-[24ch]"
                                        id={`member-role-input_${effectiveMembership.id}`}
                                    />
                                </FormItem>
                            )}
                        />

                        {orgMember.isOwner === false && (
                            <FormField
                                control={form.control}
                                disabled={!overridePerms}
                                name="permissions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Permissions</FormLabel>
                                        <div
                                            className="w-full grid gap-x-4 gap-y-1"
                                            style={{
                                                gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
                                            }}
                                        >
                                            {ProjectPermissionsList.map((permissionName: ProjectPermission) => {
                                                const checked = (field?.value || []).includes(permissionName);
                                                return (
                                                    <LabelledCheckbox
                                                        key={permissionName}
                                                        name={permissionName}
                                                        disabled={field.disabled || (!checked && !canAddPermissions)}
                                                        checked={checked}
                                                        onCheckedChange={(checked) => {
                                                            const currList = field.value || [];
                                                            if (checked === true) {
                                                                field.onChange([...currList, permissionName]);
                                                            } else {
                                                                field.onChange(currList.filter((p) => p !== permissionName));
                                                            }
                                                        }}
                                                    >
                                                        {t.projectSettings.perms[permissionName]}
                                                    </LabelledCheckbox>
                                                );
                                            })}
                                        </div>
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="w-full flex flex-wrap gap-x-4 gap-y-2">
                            <Button
                                type="submit"
                                size="sm"
                                disabled={submitButtonDisabled}
                                onClick={async () => {
                                    if (permsOverridden && !overridePerms) return await removePermissionOverride();

                                    await handleFormError(async () => {
                                        const values = await updateTeamMemberFormSchema.parseAsync(form.getValues());
                                        if (permsOverridden && overridePerms) await updateMemberDetails(values);
                                        else if (!permsOverridden && overridePerms) await addPermissionOverride(values);
                                    }, toast.error);
                                }}
                            >
                                <SaveIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                {t.form.saveChanges}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </Card>
    );
}
