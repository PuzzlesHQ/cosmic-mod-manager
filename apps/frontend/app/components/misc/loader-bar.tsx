import { enableInteractions, interactionsDisabled } from "@app/utils/dom";
import { useEffect, useRef } from "react";
import { useNavigation } from "react-router";
import LoadingBar, { type LoadingBarRef } from "./rtk-loading-indicator";

let timeoutRef: number | undefined;
let loaderStarted = false;

// For performance logging
let LoadingStartedAt: number | undefined;

interface Props extends Partial<React.ComponentProps<typeof LoadingBar>> {
    instantStart?: boolean;
}

export default function LoaderBar(props?: Props) {
    if (!props) props = {};

    const navigation = useNavigation();
    const ref = useRef<LoadingBarRef>(null);

    function loadingStart() {
        LoadingStartedAt = Date.now();

        ref.current?.staticStart(99);
        loaderStarted = true;
    }

    function loadingEnd() {
        if (interactionsDisabled()) enableInteractions();
        if (!loaderStarted) return;

        ref.current?.complete();
        loaderStarted = false;

        // Log performance
        if (LoadingStartedAt) {
            const timeTaken = Date.now() - LoadingStartedAt;
            console.log(
                `%c[NAVIGATION]: %c${window.location.pathname} %c${timeTaken}%cms`,
                "color: #8288A4; font-weight: bold;",
                "color: #50fa7b;",
                "color: #FF88D5; font-weight: bold;",
                "color: #FF88D5; font-style: italic;",
            );

            LoadingStartedAt = undefined;
        }
    }

    useEffect(() => {
        if (timeoutRef) window.clearTimeout(timeoutRef);

        if (navigation.state === "loading" || navigation.state === "submitting") {
            if (props.instantStart === true) loadingStart();
            else {
                timeoutRef = window.setTimeout(loadingStart, 32);
            }
        }

        if (navigation.state === "idle") {
            loadingEnd();
        }
    }, [navigation.state]);

    return (
        <LoadingBar
            ref={ref}
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
