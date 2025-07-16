import type { z } from "@app/utils/schemas";
import { inviteTeamMemberFormSchema } from "@app/utils/schemas/project/settings/members";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

interface Props {
    teamId: string;
    canInviteMembers: boolean;
    dataRefetch: () => Promise<void>;
    isOrg?: boolean;
}

export default function InviteMemberForm({ teamId, canInviteMembers, dataRefetch, isOrg }: Props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof inviteTeamMemberFormSchema>>({
        resolver: zodResolver(inviteTeamMemberFormSchema),
        defaultValues: {
            userName: "",
        },
    });

    async function inviteMember(values: z.infer<typeof inviteTeamMemberFormSchema>) {
        if (!canInviteMembers) {
            return toast.error(t.projectSettings.cantManageInvites);
        }

        if (isLoading || !values.userName) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/team/${teamId}/invite`, {
                method: "POST",
                body: JSON.stringify({ userName: values.userName }),
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || t.common.error);
            }

            await dataRefetch();
        } finally {
            setIsLoading(false);
        }
    }

    const inviteDesc = isOrg ? t.projectSettings.inviteOrgMemberDesc : t.projectSettings.inviteProjectMemberDesc;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(inviteMember)} className="flex w-full flex-col gap-2">
                <div className="flex w-full flex-col gap-1.5">
                    <h3 className="font-bold text-lg leading-none">{t.projectSettings.inviteMember}</h3>
                    <span className="text-foreground-muted leading-none">{inviteDesc}</span>
                </div>

                <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                        <FormItem className="mb-0 w-fit">
                            <FormLabel htmlFor="username-input">
                                <FormMessage />
                            </FormLabel>

                            <div className="flex w-full flex-wrap gap-x-4 gap-y-2">
                                <Input
                                    {...field}
                                    className="w-full md:w-[32ch]"
                                    placeholder={t.form.username}
                                    id="username-input"
                                />
                                <Button type="submit" disabled={!canInviteMembers || isLoading}>
                                    {isLoading ? (
                                        <LoadingSpinner size="xs" />
                                    ) : (
                                        <UserPlusIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" strokeWidth={2.25} />
                                    )}
                                    {t.projectSettings.invite}
                                </Button>
                            </div>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
