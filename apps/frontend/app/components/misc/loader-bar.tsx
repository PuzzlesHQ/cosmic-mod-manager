import { enableInteractions, interactionsDisabled } from "@app/utils/dom";
import { useEffect, useRef } from "react";
import { useNavigation } from "react-router";
import LoadingBar, { type LoadingBarRef } from "./rtk-loading-indicator";

interface Props extends Partial<React.ComponentProps<typeof LoadingBar>> {
    instantStart?: boolean;
}

export default function LoaderBar(props?: Props) {
    if (!props) props = {};

    const navigation = useNavigation();
    const loaderRef = useRef<LoadingBarRef>(null);

    const timeoutRef = useRef<number | undefined>(undefined);
    const loadingStartedAt = useRef<number | undefined>(undefined);

    function loadingStart() {
        loadingStartedAt.current = Date.now();
        loaderRef.current?.staticStart(99);
    }

    function loadingEnd() {
        if (interactionsDisabled()) enableInteractions();
        if (!loadingStartedAt.current) return;

        loaderRef.current?.complete();

        // Log performance
        const timeTaken = Date.now() - loadingStartedAt.current;
        console.log(
            `%c[NAVIGATION]: %c${window.location.pathname} %c${timeTaken}%cms`,
            "color: #8288A4; font-weight: bold;",
            "color: #50fa7b;",
            "color: #FF88D5; font-weight: bold;",
            "color: #FF88D5; font-style: italic;",
        );
        loadingStartedAt.current = undefined;
    }

    useEffect(() => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

        if (navigation.state === "loading" || navigation.state === "submitting") {
            if (props.instantStart === true) loadingStart();
            else {
                timeoutRef.current = window.setTimeout(loadingStart, 32);
            }
        }

        if (navigation.state === "idle") {
            loadingEnd();
        }
    }, [navigation.state]);

    return (
        <LoadingBar
            ref={loaderRef}
            className="!bg-gradient-to-r !from-accent-text !via-accent-bg/85 !to-accent-bg"
            loaderSpeed={1500}
            shadow={false}
            height={props.height || 2.5}
            transitionTime={350}
            waitingTime={250}
            {...props}
        />
    );
}
