import type { LinkedProvidersListData, LoggedInUserData } from "@app/utils/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useTranslation } from "~/locales/provider";
import DeleteAccountDialog from "./delete-account";
import ManageAuthProviders from "./manage-providers";
import ManagePassword from "./password/password";

interface Props {
    session: LoggedInUserData;
    linkedAuthProviders: LinkedProvidersListData[];
}

export default function AccountSettingsPage({ session, linkedAuthProviders }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Card useSectionTag className="w-full">
                <CardHeader>
                    <CardTitle>{t.settings.accountSecurity}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex w-full max-w-md flex-col items-start justify-center gap-1.5">
                        <Label className="">{t.auth.email}</Label>
                        <Input readOnly value={session?.email} />
                    </div>

                    <div className="flex w-full flex-wrap items-end justify-between gap-2 gap-x-8">
                        <div className="flex flex-shrink-0 flex-col items-start justify-start gap-1.5">
                            <Label>{t.auth.password}</Label>
                            {session.hasAPassword ? (
                                <p className="text-foreground-muted">{t.settings.changePassTitle}</p>
                            ) : (
                                <p className="text-foreground-muted">{t.settings.addPassDesc}</p>
                            )}
                        </div>

                        <ManagePassword session={session} />
                    </div>

                    <div className="flex w-full flex-wrap items-end justify-between gap-2 gap-x-8">
                        <div className="flex flex-col items-start justify-start gap-1.5">
                            <Label>{t.settings.manageAuthProviders}</Label>
                            <p className="text-foreground-muted">{t.settings.manageProvidersDesc}</p>
                        </div>

                        <ManageAuthProviders linkedAuthProviders={linkedAuthProviders || []} />
                    </div>
                </CardContent>
            </Card>

            <Card useSectionTag className="w-full">
                <CardHeader>
                    <CardTitle>{t.auth.deleteAccount}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full flex-wrap items-center justify-between gap-x-12 gap-y-4">
                        <p className="max-w-[60ch] text-foreground-muted">{t.auth.deleteAccountDesc}</p>
                        <DeleteAccountDialog />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
