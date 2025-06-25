import { Quit, WindowMinimise, WindowToggleMaximise } from "@/wailsjs/runtime";
import { Button } from "@app/components/ui/button";
import { cn } from "@app/components/utils";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import usePathSegments, { type Segment } from "~/hooks/path-segments";
import Link from "./ui/link";

const draggable = { "--wails-draggable": "drag" };
const noDrag = { "--wails-draggable": "no-drag" };

export default function TitleBar() {
    return (
        <div
            className="h-12 grid grid-cols-[auto_1fr_auto]"
            // @ts-ignore
            style={draggable}
        >
            <div
                // @ts-ignore
                style={noDrag}
                className="flex items-center justify-center gap-x-4"
            >
                <BreadCrumbs />
            </div>

            <span />

            <div
                id="controls"
                className="flex items-center justify-center z-[9999] px-2"
                // @ts-ignore
                style={noDrag}
            >
                <ActionButton
                    title="Mimimize"
                    onClick={WindowMinimise}
                    className="bg-yellow-500/75 group-hover/btn:bg-yellow-500"
                />

                <ActionButton
                    title="Maximize"
                    onClick={WindowToggleMaximise}
                    className="bg-green-500/75 group-hover/btn:bg-green-500"
                />

                <ActionButton title="Close" onClick={Quit} className="bg-red-500/75 group-hover/btn:bg-red-500">
                    <XIcon aria-hidden className="w-[0.87rem] h-[0.87rem]" />
                </ActionButton>
            </div>
        </div>
    );
}

interface Props {
    onClick: () => void;
    title: string;
    className?: string;
    children?: React.ReactNode;
}

function ActionButton(props: Props) {
    return (
        <button
            type="button"
            title={props.title}
            className={cn(
                "grid grid-cols-1 place-items-center w-6 h-full rounded-none cursor-default",
                "group/btn",
                "[&_svg]:invisible [&_svg]:hover:visible",
            )}
            onClick={props.onClick}
        >
            <span className={cn("grid grid-cols-1 place-items-center w-4 h-4 rounded-full text-zinc-950", props.className)}>
                {props.children}
            </span>
        </button>
    );
}

// interface NavigationHistory {
//     length: number;
//     state: null | {
//         idx: number;
//     };
// }

function BreadCrumbs() {
    const { segments } = usePathSegments();

    function forward() {
        window.history.forward();
    }

    function back() {
        window.history.back();
    }

    // const segment1 = segments[0];
    // const segment2 = segments[1];

    return (
        <>
            <div className="px-1">
                <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                        "text-foreground hover:text-muted-foreground",
                        "hover:bg-transparent dark:hover:bg-transparent",
                        "!w-8 rounded-none",
                    )}
                    onClick={back}
                >
                    <ChevronLeftIcon aria-hidden className="w-5 h-5" />
                </Button>

                <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                        "text-foreground hover:text-muted-foreground",
                        "hover:bg-transparent dark:hover:bg-transparent",
                        "!w-8 rounded-none",
                    )}
                    onClick={forward}
                >
                    <ChevronRightIcon aria-hidden className="w-5 h-5" />
                </Button>
            </div>

            <Segments segments={segments} />
        </>
    );
}

interface SegmentsProps {
    segments: Segment[];
}

function Segments(props: SegmentsProps) {
    if (props.segments.length === 0) {
        return null;
    }

    if (props.segments.length < 2) {
        return <span>{props.segments[0].label}</span>;
    }

    return (
        <div className="flex items-center justify-center gap-x-1">
            <Link className="text-muted-foreground/85 hover:text-foreground transition-colors" to={props.segments[0].href || "/"}>
                {props.segments[0].label}
            </Link>
            <ChevronRightIcon aria-hidden className="w-4 h-4 text-extra-muted-foreground" />
            <span>{props.segments[1].label}</span>
        </div>
    );
}
