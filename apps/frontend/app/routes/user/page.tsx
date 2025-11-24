import { useOutletContext } from "react-router";
import UserProjectsList from "~/pages/user/page";
import type { UserOutletData } from "~/routes/user/layout";

export default function () {
    const data = useOutletContext<UserOutletData>();

    if (!data.projectsList) return null;
    return (
        <UserProjectsList projectsList={data.projectsList} collections={data.collections} userData={data.userData} />
    );
}
