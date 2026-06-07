import { createContext, use, useState } from "react";

interface SpinnerCtx {
    showSpinner: boolean;
    setShowSpinner: (show: boolean) => void;
}

export const SpinnerCtx = createContext<SpinnerCtx>({
    showSpinner: false,
    setShowSpinner: () => {},
});

export function SpinnerCtxProvider({ children }: { children: React.ReactNode }) {
    const [showSpinner, setShowSpinner] = useState<boolean>(false);

    return <SpinnerCtx.Provider value={{ showSpinner, setShowSpinner }}>{children}</SpinnerCtx.Provider>;
}

export function useSpinnerCtx() {
    return use(SpinnerCtx);
}
