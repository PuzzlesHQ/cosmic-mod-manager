import { useEffect } from "react";
import { useNavigate } from "./link";

export default function Redirect({ to }: { to: string }) {
    const navigate = useNavigate();

    useEffect(() => {
        const url = new URL(to, window.location.href).href;
        navigate(url);
    }, []);

    return (
        <div className="grid w-full place-items-center gap-4 py-8">
            <span className="text-muted-foreground">Redirecting...</span>
        </div>
    );
}
