import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";

import UploadVersionPage from "~/pages/project/version/new-version";

export default function () {
    const session = useSession();

    if (!session) return <Redirect to="/login" />;
    return <UploadVersionPage />;
}
