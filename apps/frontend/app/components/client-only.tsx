import { type JSX, useEffect, useState } from "react";

interface ClientOnlyProps {
    Element: () => JSX.Element | React.ReactNode | null;
    fallback?: JSX.Element | React.ReactNode | null;
}

export default function ClientOnly({ Element, fallback }: ClientOnlyProps) {
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        setRendered(true);
    }, []);

    if (!rendered) return fallback || null;
    return <Element />;
}
