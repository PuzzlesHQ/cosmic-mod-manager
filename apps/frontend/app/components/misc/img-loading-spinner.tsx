import { useEffect, useRef, useState } from "react";
import { WanderingCubesSpinner } from "~/components/ui/spinner";
import { cn } from "~/components/utils";

interface ImgLoaderProps {
    src: string;
    alt: string;
    thumbnailSrc?: string;
    className?: string;
    wrapperClassName?: string;
    spinner?: React.ReactNode;
}

export function ImgLoader({ src, alt, className, wrapperClassName, spinner, thumbnailSrc }: ImgLoaderProps) {
    const loadedImages = useRef(new Set<string>()).current;
    const [isImageLoaded, setIsImageLoaded] = useState(loadedImages.has(src));

    useEffect(() => {
        if (loadedImages.has(src)) return setIsImageLoaded(true);
        setIsImageLoaded(false);

        function handleImgLoad() {
            setIsImageLoaded(true);
            loadedImages.add(src);
        }

        const img = document.createElement("img");
        img.src = src;
        img.loading = "eager";
        img.addEventListener("load", handleImgLoad);

        return () => {
            img.removeEventListener("load", handleImgLoad);
        };
    }, [src]);

    return (
        <div className={cn("relative", wrapperClassName)}>
            {!isImageLoaded && thumbnailSrc ? (
                <img src={thumbnailSrc} alt={alt} className={cn("brightness-75", className)} />
            ) : null}

            {isImageLoaded ? <img src={src} alt={alt} className={className} /> : null}

            {!isImageLoaded
                ? spinner || (
                      <WanderingCubesSpinner className="absolute-center z-10 rounded bg-card-background/75 p-4 text-foreground-bright" />
                  )
                : null}
        </div>
    );
}
