import { type CSSProperties, useEffect, useImperativeHandle, useRef, useState } from "react";

export type IProps = {
    progress?: number;
    color?: string;
    gradient?: string;
    shadow?: boolean;
    background?: string;
    height?: number;
    onLoaderFinished?: () => void;
    className?: string;
    containerClassName?: string;
    loaderSpeed?: number;
    transitionTime?: number;
    waitingTime?: number;
    style?: CSSProperties;
    containerStyle?: CSSProperties;
    shadowStyle?: CSSProperties;
    fixedPosition?: boolean;
    ref: React.Ref<LoadingBarRef>;
};

export type LoadingBarRef = {
    continuousStart: (startingValue?: number, refreshRate?: number) => void;
    staticStart: (startingValue?: number) => void;
    complete: () => void;
    getProgress: () => number;
};

function LoadingBar({
    progress,
    height = 2,
    className = "",
    color = "red",
    background = "transparent",
    onLoaderFinished,
    transitionTime = 300,
    loaderSpeed = 500,
    waitingTime = 1000,
    shadow = true,
    containerStyle = {},
    style = {},
    shadowStyle: shadowStyleProp = {},
    containerClassName = "",
    fixedPosition = true,
    ref,
}: IProps) {
    const isMounted = useRef(false);
    const [localProgress, localProgressSet] = useState<number>(0);

    const pressedContinuous = useRef<{
        active: boolean;
        refreshRate: number;
    }>({ active: false, refreshRate: 1000 });

    const [usingProps, setUsingProps] = useState(false);

    const [pressedStaticStart, setStaticStartPressed] = useState<{
        active: boolean;
        value: number;
    }>({ active: false, value: 20 });

    const initialLoaderStyle: CSSProperties = {
        height: "100%",
        background: color,
        transition: `all ${loaderSpeed}ms ease`,
        filter: "brightness(1.1)",
        width: "0%",
    };

    const loaderContainerStyle: CSSProperties = {
        position: fixedPosition ? "fixed" : "absolute",
        top: 0,
        left: 0,
        height,
        background,
        zIndex: 99999999999,
        width: `${100}%`,
    };

    const initialShadowStyles: CSSProperties = {
        boxShadow: `0 0 10px ${color}, 0 0 10px ${color}`,
        width: "5%",
        opacity: 1,
        position: "absolute",
        height: "100%",
        transition: `all ${loaderSpeed}ms ease`,
        transform: "rotate(3deg) translate(0px, -4px)",
        left: "-10rem",
    };

    const [loaderStyle, loaderStyleSet] = useState<CSSProperties>(initialLoaderStyle);
    const [shadowStyle, shadowStyleSet] = useState<CSSProperties>(initialShadowStyles);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useImperativeHandle(ref, () => ({
        continuousStart(startingValue?: number, refreshRate = 1000) {
            if (pressedStaticStart.active) return;
            if (usingProps) {
                console.warn(
                    "react-top-loading-bar: You can't use both controlling by props and ref methods to control the bar!",
                );
                return;
            }

            const val = startingValue || randomInt(10, 20);

            pressedContinuous.current = {
                active: true,
                refreshRate,
            };

            localProgressSet(val);
            checkIfFull(val);
        },
        staticStart(startingValue?: number) {
            if (pressedContinuous.current.active) return;
            if (usingProps) {
                console.warn(
                    "react-top-loading-bar: You can't use both controlling by props and ref methods to control the bar!",
                );
                return;
            }

            const val = startingValue || randomInt(30, 50);

            setStaticStartPressed({
                active: true,
                value: val,
            });
            localProgressSet(val);
            checkIfFull(val);
        },
        complete() {
            if (usingProps) {
                console.warn(
                    "react-top-loading-bar: You can't use both controlling by props and ref methods to control the bar!",
                );
                return;
            }
            localProgressSet(100);
            checkIfFull(100);
        },
        getProgress() {
            return localProgress;
        },
    }));

    useEffect(() => {
        loaderStyleSet({
            ...loaderStyle,
            background: color,
        });

        shadowStyleSet({
            ...shadowStyle,
            boxShadow: `0 0 10px ${color}, 0 0 5px ${color}`,
        });
    }, [color]);

    useEffect(() => {
        if (ref) {
            if (ref && progress !== undefined) {
                console.warn(
                    'react-top-loading-bar: You can\'t use both controlling by props and ref methods to control the bar! Please use only props or only ref methods! Ref methods will override props if "ref" property is available.',
                );
                return;
            }
            checkIfFull(localProgress);
            setUsingProps(false);
        } else {
            if (progress) checkIfFull(progress);

            setUsingProps(true);
        }
    }, [progress]);

    const checkIfFull = (_progress: number) => {
        if (_progress >= 100) {
            // now it should wait a little
            loaderStyleSet({
                ...loaderStyle,
                width: "100%",
            });
            if (shadow) {
                shadowStyleSet({
                    ...shadowStyle,
                    left: `${_progress - 10}%`,
                });
            }

            setTimeout(() => {
                if (!isMounted.current) {
                    return;
                }
                // now it can fade out
                loaderStyleSet({
                    ...loaderStyle,
                    opacity: 0,
                    width: "100%",
                    transition: `all ${transitionTime}ms ease-out`,
                    color: color,
                });

                setTimeout(() => {
                    if (!isMounted.current) {
                        return;
                    }
                    // here we wait for it to fade
                    if (pressedContinuous.current.active) {
                        // if we have continuous loader just ending, we kill it and reset it

                        pressedContinuous.current = {
                            ...pressedContinuous.current,
                            active: false,
                        };

                        localProgressSet(0);
                        checkIfFull(0);
                    }

                    if (pressedStaticStart.active) {
                        setStaticStartPressed({
                            ...pressedStaticStart,
                            active: false,
                        });
                        localProgressSet(0);
                        checkIfFull(0);
                    }

                    if (onLoaderFinished) onLoaderFinished();
                    localProgressSet(0);
                    checkIfFull(0);
                }, transitionTime);
            }, waitingTime);
        } else {
            loaderStyleSet((_loaderStyle) => {
                return {
                    ..._loaderStyle,
                    width: `${_progress}%`,
                    opacity: 1,
                    transition: _progress > 0 ? `all ${loaderSpeed}ms ease` : "",
                };
            });

            if (shadow) {
                shadowStyleSet({
                    ...shadowStyle,
                    left: `${_progress - 5.5}%`,
                    transition: _progress > 0 ? `all ${loaderSpeed}ms ease` : "",
                });
            }
        }
    };

    useInterval(
        () => {
            const minValue = Math.min(10, (100 - localProgress) / 5);
            const maxValue = Math.min(20, (100 - localProgress) / 3);

            const random = randomValue(minValue, maxValue);

            if (localProgress + random < 95) {
                localProgressSet(localProgress + random);
                checkIfFull(localProgress + random);
            }
        },
        pressedContinuous.current.active ? pressedContinuous.current.refreshRate : null,
    );

    return (
        <div className={containerClassName} style={{ ...loaderContainerStyle, ...containerStyle }}>
            <div className={className} style={{ ...loaderStyle, ...style }}>
                {shadow ? <div style={{ ...shadowStyle, ...shadowStyleProp }} /> : null}
            </div>
        </div>
    );
}

export default LoadingBar;

/** keep typescript happy */
const noop = () => {};

export function useInterval(callback: () => void, delay: number | null | false, immediate?: boolean) {
    const savedCallback = useRef(noop);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    });

    // Execute callback if immediate is set.
    useEffect(() => {
        if (!immediate) return;
        if (delay === null || delay === false) return;
        savedCallback.current();
    }, [immediate]);

    // Set up the interval.
    useEffect(() => {
        if (delay === null || delay === false) return undefined;
        function tick() {
            return savedCallback.current();
        }
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
}

function randomValue(min: number, max: number): number {
    return Math.random() * (max - min + 1) + min;
}

function randomInt(min: number, max: number): number {
    return Math.floor(randomValue(min, max));
}
