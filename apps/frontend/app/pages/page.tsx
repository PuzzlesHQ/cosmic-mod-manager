import { BrandIcon, fallbackProjectIcon } from "@app/components/icons";
import { MicrodataItemProps } from "@app/components/microdata";
import { Prefetch } from "@app/components/ui/link";
import { cn } from "@app/components/utils";
import type { ProjectListItem } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { CompassIcon, LayoutDashboardIcon, LogInIcon } from "lucide-react";
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ImgWrapper } from "~/components/ui/avatar";
import Link, { VariantButtonLink } from "~/components/ui/link";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { ProjectPagePath } from "~/utils/urls";
import { drawBackground } from "./canvas-bg";

interface Props {
    projects: ProjectListItem[];
}

export default function HomePage({ projects }: Props) {
    const session = useSession();
    const { t } = useTranslation();
    const nav = t.navbar;

    const [gridBgPortal, setGridBgPortal] = useState<Element | null>(null);

    // The animation keyframes in "@/app/styles.css" need to be updated according to the number of items in the list
    const showcaseItems = [nav.mods, nav.plugins, nav["resource-packs"], nav.modpacks, nav.shaders, nav.mods];

    useEffect(() => {
        setGridBgPortal(document.querySelector("#hero_section_bg_portal"));
    }, []);

    function recreateBackground() {
        if (gridBgPortal) drawBackground({ recreate: true });
    }

    useEffect(() => {
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
                      <div className="overflow-hidden relative grid grid-cols-1 grid-rows-1">
                          <canvas id="starry_bg_canvas" className="w-full col-span-full row-span-full" />
                          <div className="hero_section_fading_bg w-full h-full col-span-full row-span-full bg-gradient-to-b from-transparent via-background/65 to-background" />
                      </div>,
                      gridBgPortal,
                  )
                : null}

            <main className="w-full hero_section">
                <section className="w-full flex flex-col items-center justify-center py-28">
                    <div className="p-6">
                        <BrandIcon aria-hidden className="text-accent-foreground" size="15rem" />
                    </div>

                    <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-4">
                        <h1 className="text-4xl lg:text-6xl font-medium text-foreground inline-flex text-center items-center justify-center gap-x-2.5 lg:gap-x-4 flex-wrap">
                            {titleParts[0]?.length > 0 && <>{titleParts[0]} </>}

                            <div className="inline-block h-12 lg:h-[4.5rem] mb-1 max-w-full overflow-hidden">
                                <span className="hero_section_showcase inline-flex flex-col items-center justify-center [--unit-height:_3rem] lg:[--unit-height:_4.5rem]">
                                    {showcaseItems?.map((item, index) => {
                                        return (
                                            <strong
                                                key={`${item}${index}`}
                                                className={cn(
                                                    "flex font-bold items-center justify-center h-12 lg:h-[4.5rem] text-4xl lg:text-6xl bg-clip-text leading-loose text-nowrap whitespace-nowrap",
                                                    "bg-accent-background text-transparent bg-cover bg-gradient-to-b from-rose-200 to-accent-background via-accent-background",
                                                )}
                                                // @ts-ignore
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

                        <div className="w-full max-w-2xl flex flex-col items-center justify-center">
                            <h2
                                itemProp={MicrodataItemProps.description}
                                className="w-full leading-snug text-center text-lg lg:text-xl text-muted-foreground/95"
                            >
                                {t.homePage.desc}
                            </h2>
                        </div>
                    </div>

                    <div className="flex gap-4 md:gap-8 flex-wrap items-center justify-center mt-6">
                        <VariantButtonLink size="lg" variant="default" url="/mods" className="px-6">
                            <CompassIcon
                                aria-hidden
                                className="w-btn-icon-lg h-btn-icon-lg"
                                aria-label={t.homePage.exploreMods}
                            />
                            {t.homePage.exploreMods}
                        </VariantButtonLink>

                        {!session?.id ? (
                            <VariantButtonLink
                                url="/signup"
                                size="lg"
                                className="px-6 bg-card-background hover:bg-card-background/90 dark:bg-shallow-background dark:hover:bg-shallow-background/90"
                                prefetch={Prefetch.Render}
                            >
                                <LogInIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" aria-label={t.form.signup} />
                                {t.form.signup}
                            </VariantButtonLink>
                        ) : (
                            <VariantButtonLink url="/dashboard/projects" size="lg" className="px-6" variant="secondary-inverted">
                                <LayoutDashboardIcon
                                    aria-hidden
                                    className="w-btn-icon-md h-btn-icon-md"
                                    aria-label={t.dashboard.dashboard}
                                />
                                {t.dashboard.dashboard}
                            </VariantButtonLink>
                        )}
                    </div>
                </section>

                <ShowCase projects={projects} />
            </main>
        </>
    );
}

function ShowCase({ projects }: { projects: ProjectListItem[] }) {
    console.log("Rendering showcase with", projects.length, "projects");

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
    return <div className="w-full flex flex-col gap-6">{rows}</div>;
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
        <div className="marquee w-full flex items-center justify-start relative h-[5.7rem] overflow-hidden">
            <div
                className="scroll-container absolute w-fit flex items-center justify-start gap-x-6 px-3"
                style={{
                    animationDuration: `${duration}s`,
                    animationDelay: `-${duration / 2}s`,
                    animationDirection: reverse ? "reverse" : "normal",
                }}
            >
                {scrollItems}
            </div>

            <div
                className="scroll-container absolute w-fit flex items-center justify-start gap-x-6 px-3"
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

function ShowcaseItem({ className, item, ...props }: { className?: string; item: ProjectListItem; style?: CSSProperties }) {
    return (
        <Link
            aria-label={item.name}
            to={ProjectPagePath(item.type[0], item.slug)}
            className={cn(
                "shrink-0 border border-card-background rounded-lg w-72 h-[5.35rem] flex gap-x-3 items-start justify-start p-3",
                "bg-card-background dark:bg-transparent hover:bg-card-background/35 dark:hover:bg-card-background/35 transition-colors duration-300",
                className,
            )}
            {...props}
        >
            <ImgWrapper
                src={imageUrl(item.icon)}
                alt={item.name}
                fallback={fallbackProjectIcon}
                className="w-11 h-11"
                loading="lazy"
            />
            <div className="flex flex-col gap-1">
                <span className="max-w-52 text-lg font-bold overflow-hidden whitespace-nowrap text-ellipsis leading-tight">
                    {item.name}
                </span>
                <span className="max-w-52 text-[0.87rem] line-clamp-2 text-muted-foreground leading-tight text-pretty">
                    {item.summary}
                </span>
            </div>
        </Link>
    );
}
