import { useId } from "react";
import { LoginPageCard } from "./login-card";

export default function LoginPage() {
    const id = useId();

    return (
        <main className="full_page flex w-full items-center justify-center py-12">
            <LoginPageCard id={id} />
        </main>
    );
}
