import type { ProjectListItem } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { CompassIcon, LayoutDashboardIcon, LogInIcon } from "lucide-react";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BrandIcon, fallbackProjectIcon } from "~/components/icons";
import { MicrodataItemProps } from "~/components/microdata";
import { ImgWrapper } from "~/components/ui/avatar";
import Link, { LinkPrefetchStrategy, VariantButtonLink } from "~/components/ui/link";
import { cn } from "~/components/utils";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { ProjectPagePath } from "~/utils/urls";
import { drawBackground } from "./canvas-bg";

interface Props {
    projects: ProjectListItem[];
}

export default function HomePage({ projects }: Props) {
    const { t } = useTranslation();
    const [gridBgPortal, setGridBgPortal] = useState<Element | null>(null);
    const timeoutRef = useRef<number | undefined>(undefined);
    const session = useSession();

    const nav = t.navbar;

    // The animation keyframes in "@/app/styles.css" need to be updated according to the number of items in the list
    const showcaseItems = [nav.mods, nav.plugins, nav["resource-packs"], nav.modpacks, nav.shaders, nav.mods];

    useEffect(() => {
        setGridBgPortal(document.querySelector("#hero_section_bg_portal"));
    }, []);

    function recreateBackground() {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            drawBackground({ recreate: true });
        }, 250);
    }

    useEffect(() => {
        if (!gridBgPortal) return;
        drawBackground();

        window.addEventListener("resize", recreateBackground);
        const observer = new MutationObserver(recreateBackground);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

        return () => {
            window.removeEventListener("resize", recreateBackground);
            observer.disconnect();
        };
    }, [gridBgPortal]);

    const titleParts = t.homePage.title(t.navbar.mods);

    return (
        <>
            {gridBgPortal
                ? createPortal(
                      <div className="relative grid grid-cols-1 grid-rows-1 overflow-hidden">
                          <canvas id="starry_bg_canvas" className="col-span-full row-span-full w-full" />
                          <div className="hero_section_fading_bg col-span-full row-span-full h-full w-full bg-gradient-to-b from-transparent via-background/65 to-background" />
                      </div>,
                      gridBgPortal,
                  )
                : null}

            <main className="hero_section w-full">
                <section className="flex w-full flex-col items-center justify-center py-28">
                    <div className="p-6">
                        <BrandIcon aria-hidden className="aspect-square h-60 text-accent-text" />
                    </div>

                    <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-4">
                        <h1 className="inline-flex flex-wrap items-center justify-center gap-x-2.5 text-center font-medium text-4xl text-foreground lg:gap-x-4 lg:text-6xl">
                            {titleParts[0]?.length > 0 && <>{titleParts[0]} </>}

                            <div className="mb-1 inline-block h-12 max-w-full overflow-hidden lg:h-[4.5rem]">
                                <span className="hero_section_showcase inline-flex flex-col items-center justify-center [--unit-height:_3rem] lg:[--unit-height:_4.5rem]">
                                    {showcaseItems?.map((item, index) => {
                                        return (
                                            <strong
                                                // biome-ignore lint/suspicious/noArrayIndexKey: --
                                                key={`${item}${index}`}
                                                className={cn(
                                                    "flex h-12 items-center justify-center whitespace-nowrap text-nowrap bg-clip-text font-bold text-4xl leading-loose lg:h-[4.5rem] lg:text-6xl",
                                                    "bg-accent-bg bg-cover bg-gradient-to-b from-foreground-bright via-accent-bg to-accent-bg text-transparent",
                                                )}
                                                // @ts-expect-error
                                                style={{ "--index": index + 1 }}
                                            >
                                                {item}
                                            </strong>
                                        );
                                    })}
                                </span>
                            </div>

                            {titleParts[2]?.length > 0 && <> {titleParts[2]}</>}
                        </h1>

                        <div className="flex w-full max-w-2xl flex-col items-center justify-center">
                            <h2
                                itemProp={MicrodataItemProps.description}
                                className="w-full text-center text-foreground-muted text-lg leading-snug lg:text-xl"
                            >
                                {t.homePage.desc}
                            </h2>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-8">
                        <VariantButtonLink size="lg" variant="default" to="/mods" className="px-6">
                            <CompassIcon
                                aria-hidden
                                className="h-btn-icon-lg w-btn-icon-lg"
                                aria-label={t.homePage.exploreMods}
                            />
                            {t.homePage.exploreMods}
                        </VariantButtonLink>

                        {!session?.id ? (
                            <VariantButtonLink
                                to="/signup"
                                size="lg"
                                variant="secondary"
                                className="px-6"
                                prefetch={LinkPrefetchStrategy.Render}
                            >
                                <LogInIcon
                                    aria-hidden
                                    className="h-btn-icon-md w-btn-icon-md"
                                    aria-label={t.form.signup}
                                />
                                {t.form.signup}
                            </VariantButtonLink>
                        ) : (
                            <VariantButtonLink to="/dashboard/projects" size="lg" className="px-6" variant="secondary">
                                <LayoutDashboardIcon
                                    aria-hidden
                                    className="h-btn-icon-md w-btn-icon-md"
                                    aria-label={t.dashboard.dashboard}
                                />
                                {t.dashboard.dashboard}
                            </VariantButtonLink>
                        )}
                    </div>
                </section>

                <ShowCase projects={projects || []} />
            </main>
        </>
    );
}

function ShowCase({ projects }: { projects: ProjectListItem[] }) {
    const rows = useMemo(() => {
        if (!projects || projects.length === 0) return [];

        const rowSize = Math.ceil(projects.length / 3);
        const scrollRows: React.ReactNode[] = [];

        let rowIndex = 1;
        for (let i = 0; i < projects.length; i += rowSize) {
            const part = projects.slice(i, i + rowSize);

            if (i % (rowSize * 2) === 0) {
                scrollRows.push(<MarqueeScroll key={i} items={part || []} index={rowIndex} />);
            } else {
                scrollRows.push(<MarqueeScroll key={i} items={part || []} reverse index={rowIndex} />);
            }

            rowIndex++;
        }

        return scrollRows;
    }, [projects.at(-1)?.id, projects.length]);

    if (!rows?.length) return null;
    return <div className="flex w-full flex-col gap-6">{rows}</div>;
}

interface MarqueeScrollProps {
    items: ProjectListItem[];
    reverse?: boolean;
    index: number;
}

function MarqueeScroll({ items, reverse = false, index }: MarqueeScrollProps) {
    const duration = (5.5 + index) * items.length; // Randomize duration based on number of items

    const scrollItems = items.map((item) => <ShowcaseItem key={item.id} item={item} />);

    return (
        <div className="marquee relative flex h-[5.7rem] w-full items-center justify-start overflow-hidden">
            <div
                className="scroll-container absolute flex w-fit items-center justify-start gap-x-6 px-3"
                style={{
                    animationDuration: `${duration}s`,
                    animationDelay: `-${duration / 2}s`,
                    animationDirection: reverse ? "reverse" : "normal",
                }}
            >
                {scrollItems}
            </div>

            <div
                className="scroll-container absolute flex w-fit items-center justify-start gap-x-6 px-3"
                style={{
                    animationDuration: `${duration}s`,
                    animationDelay: "0s",
                    animationDirection: reverse ? "reverse" : "normal",
                }}
            >
                {scrollItems}
            </div>
        </div>
    );
}

function ShowcaseItem({
    className,
    item,
    ...props
}: {
    className?: string;
    item: ProjectListItem;
    style?: CSSProperties;
}) {
    return (
        <Link
            aria-label={item.name}
            to={ProjectPagePath(item.type[0], item.slug)}
            className={cn(
                "flex h-[5.35rem] w-72 shrink-0 items-start justify-start gap-x-3 rounded-lg border border-card-background p-3",
                "bg-card-background transition-colors duration-300 hover:bg-card-background/35 dark:bg-transparent dark:hover:bg-card-background/35",
                className,
            )}
            {...props}
        >
            <ImgWrapper
                src={imageUrl(item.icon)}
                alt={item.name}
                fallback={fallbackProjectIcon}
                className="h-11 w-11"
                loading="lazy"
            />
            <div className="flex flex-col gap-1">
                <span className="max-w-52 overflow-hidden text-ellipsis whitespace-nowrap font-bold text-lg leading-tight">
                    {item.name}
                </span>
                <span className="line-clamp-2 max-w-52 text-pretty text-[0.87rem] text-foreground-muted leading-tight">
                    {item.summary}
                </span>
            </div>
        </Link>
    );
}
