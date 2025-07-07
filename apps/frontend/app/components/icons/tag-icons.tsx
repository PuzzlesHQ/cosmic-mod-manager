import type { CategoriesT } from "@app/utils/constants/categories";
import type { loaders_list } from "@app/utils/constants/loaders";
import {
    ArchiveIcon,
    AwardIcon,
    BarChartIcon,
    BookIcon,
    BriefcaseIcon,
    BrushIcon,
    BugIcon,
    BuildingIcon,
    CameraIcon,
    CarrotIcon,
    CastleIcon,
    CloudSunRainIcon,
    CloudyIcon,
    CompassIcon,
    CpuIcon,
    DollarSignIcon,
    EarthIcon,
    FeatherIcon,
    FilmIcon,
    FlipHorizontal2Icon,
    GlobeIcon,
    HardDriveIcon,
    HeadphonesIcon,
    HexagonIcon,
    HomeIcon,
    IceCreamConeIcon,
    ImageIcon,
    LampIcon,
    LayersIcon,
    LightbulbIcon,
    MessageCircleIcon,
    MonitorIcon,
    MountainIcon,
    NetworkIcon,
    PaletteIcon,
    PanelsTopLeftIcon,
    PenToolIcon,
    PickaxeIcon,
    ServerIcon,
    SignalHighIcon,
    SignalLowIcon,
    SignalMediumIcon,
    SkullIcon,
    SlidersIcon,
    SquarePenIcon,
    SquarePlusIcon,
    SunIcon,
    SwordsIcon,
    TreeDeciduousIcon,
    TruckIcon,
    TypeIcon,
    UserSearchIcon,
    UsersIcon,
    WandSparklesIcon,
    WrenchIcon,
    ZapIcon,
} from "lucide-react";
import type { JSX } from "react";
import type { IconSvgProps } from "~/components/types";
import { CubeIcon } from "./index";
export const PuzzleIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            width={width || size}
            height={height || size}
            {...props}
        >
            <title>Puzzle Loader</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1" />
        </svg>
    );
};

export const SimplyShadersIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
        <title>Simply shaders</title>
        <path
            d="m22.59 12.013-3.01 3.126v4.405l.005.019-4.251-.005-2.994 3.115h-.003l-3.003-3.132H5.1l-.018.005.005-4.424-2.994-3.116-.003-.023L5.1 8.858V4.452l-.005-.019 4.252.005 2.993-3.115h.003l3.003 3.132h4.234l.018-.005-.005 4.425 2.994 3.115"
            style={{}}
            transform="translate(-.344)"
        />
        <path
            d="m17.229 12.005-1.436 1.491v2.101l.003.009-2.028-.002-1.428 1.486h-.001l-1.433-1.494H8.887l-.008.002.002-2.11-1.428-1.486-.001-.011L8.887 10.5V8.399l-.002-.009 2.027.002 1.428-1.485h.002l1.432 1.494h2.019l.009-.003-.003 2.11 1.428 1.486"
            style={{}}
            transform="translate(-.344)"
        />
    </svg>
);

export const QuiltIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlSpace="preserve"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="2"
            clipRule="evenodd"
            viewBox="0 0 24 24"
            width={width || size}
            height={height || size}
            {...props}
        >
            <title>Quilt Loader</title>
            <defs>
                <path
                    id="quilt"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="65.6"
                    d="M442.5 233.9c0-6.4-5.2-11.6-11.6-11.6h-197c-6.4 0-11.6 5.2-11.6 11.6v197c0 6.4 5.2 11.6 11.6 11.6h197c6.4 0 11.6-5.2 11.6-11.7v-197Z"
                />
            </defs>
            <path fill="none" d="M0 0h24v24H0z" />
            <use xlinkHref="#quilt" strokeWidth="65.6" transform="matrix(.03053 0 0 .03046 -3.2 -3.2)" />
            <use xlinkHref="#quilt" strokeWidth="65.6" transform="matrix(.03053 0 0 .03046 -3.2 7)" />
            <use xlinkHref="#quilt" strokeWidth="65.6" transform="matrix(.03053 0 0 .03046 6.9 -3.2)" />
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="70.4"
                d="M442.5 234.8c0-7-5.6-12.5-12.5-12.5H234.7c-6.8 0-12.4 5.6-12.4 12.5V430c0 6.9 5.6 12.5 12.4 12.5H430c6.9 0 12.5-5.6 12.5-12.5V234.8Z"
                transform="rotate(45 3.5 24) scale(.02843 .02835)"
            />
        </svg>
    );
};

export const MobIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            aria-hidden="true"
            xmlSpace="preserve"
            fillRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="1.5"
            clipRule="evenodd"
            viewBox="0 0 24 24"
            width={width || size}
            height={height || size}
            {...props}
        >
            <path fill="none" d="M0 0h24v24H0z" />
            <path fill="none" stroke="currentColor" strokeWidth="2" d="M3 3h18v18H3z" />
            <path stroke="currentColor" fill="currentColor" d="M6 6h4v4H6zm8 0h4v4h-4zm-4 4h4v2h2v6h-2v-2h-4v2H8v-6h2v-2Z" />
        </svg>
    );
};

export const KitchenSinkIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" xmlSpace="preserve" width={width || size} height={height || size} {...props}>
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m19.9 14-1.4 4.9c-.3 1-1.1 1.7-2.1 1.7H7.6c-.9 0-1.8-.7-2.1-1.7L4.1 14h15.8zM12 10V4.5M12 4.5c0-1.2.9-2.1 2.1-2.1M14.1 2.4c1.2 0 2.1.9 2.1 2.1M22.2 12c0 .6-.2 1.1-.6 1.4-.4.4-.9.6-1.4.6H3.8c-1.1 0-2-.9-2-2 0-.6.2-1.1.6-1.4.4-.4.9-.6 1.4-.6h16.4c1.1 0 2 .9 2 2z" />
            </g>
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.2 7.2h0"
            />
        </svg>
    );
};

export const RayReflectingIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width={width || size}
            height={height || size}
            {...props}
        >
            <path d="M2.977 19.17h16.222" transform="translate(-.189 -.328) scale(1.09932)" />
            <path d="M3.889 3.259 12 19.17l5.749-11.277" transform="translate(-1.192 -.328) scale(1.09932)" />
            <path d="M9.865 6.192h4.623v4.623" transform="scale(1.09931) rotate(-18 20.008 .02)" />
        </svg>
    );
};

export const PotatoIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 512 512"
            fill="currentColor"
            stroke="currentColor"
            width={width || size}
            height={height || size}
            {...props}
        >
            <g>
                <g>
                    <path d="M218.913,116.8c-6.4-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8c3.2-3.2,4.8-6.4,4.8-11.2S222.113,120,218.913,116.8z" />
                </g>
            </g>
            <g>
                <g>
                    <path d="M170.913,372.8c-6.4-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8c3.2-3.2,4.8-8,4.8-11.2C175.713,379.2,174.113,376,170.913,372.8z" />
                </g>
            </g>
            <g>
                <g>
                    <path d="M250.913,228.8c-4.8-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8c3.2-3.2,4.8-8,4.8-11.2C255.713,235.2,254.113,232,250.913,228.8z" />
                </g>
            </g>
            <g>
                <g>
                    <path d="M410.913,212.8c-4.8-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8c3.2-3.2,4.8-8,4.8-11.2C415.713,219.2,414.113,216,410.913,212.8z" />
                </g>
            </g>
            <g>
                <g>
                    <path d="M346.913,308.8c-4.8-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8c3.2-3.2,4.8-8,4.8-11.2C351.713,315.2,350.113,312,346.913,308.8z" />
                </g>
            </g>
            <g>
                <g>
                    <path d="M346.913,100.8c-6.4-6.4-16-6.4-22.4,0c-3.2,3.2-4.8,6.4-4.8,11.2s1.6,8,4.8,11.2c3.2,3.2,8,4.8,11.2,4.8    c4.8,0,8-1.6,11.2-4.8s4.8-6.4,4.8-11.2S350.113,104,346.913,100.8z" />
                </g>
            </g>
            <g>
                <g>
                    <path d="M503.713,142.4c-28.8-136-179.2-142.4-208-142.4c-4.8,0-9.6,0-16,0c-67.2,1.6-132.8,36.8-187.2,97.6    c-60.8,67.2-96,155.2-91.2,227.2c8,126.4,70.4,187.2,192,187.2c115.2,0,201.6-33.6,256-100.8    C513.313,331.2,519.713,219.2,503.713,142.4z M423.713,392c-48,59.2-126.4,89.6-230.4,89.6s-152-48-160-158.4    c-4.8-64,28.8-144,83.2-203.2c48-54.4,107.2-84.8,164.8-88c4.8,0,9.6,0,14.4,0c140.8,0,171.2,89.6,176,116.8    C486.113,219.2,481.313,320,423.713,392z" />
                </g>
            </g>
        </svg>
    );
};

export const PumpkinIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            width={width || size}
            height={height || size}
            aria-hidden="true"
            {...props}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 15l1.5 1l1.5 -1l1.5 1l1.5 -1" />
            <path d="M10 11h.01" />
            <path d="M14 11h.01" />
            <path d="M17 6.082c2.609 .588 3.627 4.162 2.723 7.983c-.903 3.82 -2.75 6.44 -5.359 5.853a3.355 3.355 0 0 1 -.774 -.279a3.728 3.728 0 0 1 -1.59 .361c-.556 0 -1.09 -.127 -1.59 -.362a3.296 3.296 0 0 1 -.774 .28c-2.609 .588 -4.456 -2.033 -5.36 -5.853c-.903 -3.82 .115 -7.395 2.724 -7.983c1.085 -.244 1.575 .066 2.585 .787c.716 -.554 1.54 -.869 2.415 -.869c.876 0 1.699 .315 2.415 .87c1.01 -.722 1.5 -1.032 2.585 -.788z" />
            <path d="M12 6c0 -1.226 .693 -2.346 1.789 -2.894l.211 -.106" />
        </svg>
    );
};

export const ParkourIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            width={width || size}
            height={height || size}
            aria-hidden="true"
            {...props}
        >
            <rect width="256" height="256" fill="none" />
            <circle
                cx="152"
                cy="56"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="22"
            />
            <path
                d="M56,105.6s32-25.67,80,7c50.47,34.3,80,20.85,80,20.85"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="22"
            />
            <path
                d="M110.64,161.16C128.47,165,176,180,176,232"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="22"
            />
            <path
                d="M134.44,111.51C128.37,135.24,98.81,206.68,32,200"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="22"
            />
        </svg>
    );
};

export const ChristmasTreeIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            width={width || size}
            height={height || size}
            aria-hidden="true"
            {...props}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 3l4 4l-2 1l4 4l-3 1l4 4h-14l4 -4l-3 -1l4 -4l-2 -1z" />
            <path d="M14 17v3a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-3" />
        </svg>
    );
};

export const PixelArtIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={width || size}
            height={height || size}
            aria-hidden="true"
            fill="currentColor"
            {...props}
        >
            <path d="M14 10V14H10V10H14ZM16 10H21V14H16V10ZM14 21H10V16H14V21ZM16 21V16H21V20C21 20.5523 20.5523 21 20 21H16ZM14 3V8H10V3H14ZM16 3H20C20.5523 3 21 3.44772 21 4V8H16V3ZM8 10V14H3V10H8ZM8 21H4C3.44772 21 3 20.5523 3 20V16H8V21ZM8 3V8H3V4C3 3.44772 3.44772 3 4 3H8Z" />
        </svg>
    );
};

export const MazeIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-33 -33 396.00 396.00"
            xmlSpace="preserve"
            transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
            width={width || size}
            height={height || size}
            aria-hidden="true"
            fill="currentColor"
            {...props}
        >
            <g strokeWidth="0" />
            <g strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="1.32" />
            <g>
                <g>
                    <path d="M69.166,230c-8.284,0-15,6.716-15,15s6.716,15,15,15h95.836c8.284,0,15-6.716,15-15v-65H230v65c0,8.284,6.716,15,15,15 s15-6.716,15-15V71.547c0-8.284-6.716-15-15-15s-15,6.716-15,15V150H30V30h75.082c8.284,0,15-6.716,15-15s-6.716-15-15-15H15 C6.716,0,0,6.716,0,15v300c0,8.284,6.716,15,15,15h150c8.284,0,15-6.716,15-15s-6.716-15-15-15H30V180h120.002v50H69.166z" />
                    <path d="M315,0H165.002c-8.284,0-15,6.716-15,15v65H75c-8.284,0-15,6.716-15,15s6.716,15,15,15h90.002c8.284,0,15-6.716,15-15V30 H300v270h-75c-8.284,0-15,6.716-15,15s6.716,15,15,15h90c8.284,0,15-6.716,15-15V15C330,6.716,323.284,0,315,0z" />
                </g>
            </g>
        </svg>
    );
};

export const IslandIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 511.998 511.998"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
            width={width || size}
            height={height || size}
            aria-hidden="true"
            fill="currentColor"
            {...props}
        >
            <g strokeWidth="0" />
            <g strokeLinecap="round" strokeLinejoin="round" />
            <g>
                <g>
                    <g>
                        <path d="M481.771,180.215c-8.032-18.891-20.464-35.363-36.296-48.461c12.603-3.935,23.805-7.896,29.051-9.791 c7.917-2.86,12.471-11.161,10.629-19.375c-11.546-51.496-71.993-74.378-119.825-51.925c-3.721-9.587-9.225-18.418-16.296-25.974 C325.289-0.674,289.196-7.214,259.221,8.421c-6.811,3.552-10.325,11.291-8.514,18.757c2.505,10.327,5.298,21.211,8.797,31.687 c-54.797-9.37-113.422,11.635-141.22,54.955c-5.738,8.94-1.772,20.898,8.146,24.655c26.558,10.06,55.902,15.804,87.661,17.187 c-7.628,8.889-14.102,18.629-19.265,29.056c-11.81,23.852-15.937,50.103-11.621,73.916c1.793,9.902,11.879,15.985,21.479,12.957 c7.278-2.299,14.86-5.407,22.547-9.102c-3.2,6.569-6.31,13.259-9.331,20.102c-18.902,42.831-31.65,85.091-39.783,131.961 c-54.826,5.549-157.339,26.024-157.339,80.71c0,9.242,7.493,16.736,16.736,16.736h401.653c9.242,0,16.736-7.493,16.736-16.736 c0-53.826-99.391-74.441-153.517-80.306c-0.318-30.855,2.588-59.937,8.991-90.412c4.628-22.014,10.598-42.616,18.294-62.97 c7.771,15.37,16.737,29.334,26.348,39.044c6.584,6.65,17.331,6.593,23.847-0.095c18.139-18.615,29.138-40.385,32.676-64.24 c15.879,12.959,32.36,24.638,47.801,33.762c8.775,5.185,20.133,1.368,23.982-8.087 C494.336,237.371,493.406,207.576,481.771,180.215z M407.633,478.529H69.05c39.462-25.428,117.256-33.471,169.291-33.471 C293.992,445.058,369.635,454.045,407.633,478.529z M278.622,317.664c-6.712,31.945-9.856,62.46-9.722,94.672 c-10.038-0.495-20.244-0.749-30.559-0.749c-8.685,0-17.292,0.179-25.788,0.531c7.692-41.154,19.048-77.668,35.968-116.01 c11.41-25.847,24.092-49.421,38.687-71.996c7.569-5.99,14.642-12.05,20.944-17.907c1.08,3.803,2.286,7.736,3.602,11.746 C296.608,250.56,286.029,282.428,278.622,317.664z M457.756,228.617c-17.367-12.108-35.179-26.8-50.937-42.139 c-5.211-5.072-13.106-6.192-19.519-2.771c-6.418,3.421-9.885,10.598-8.578,17.752c4.108,22.485,0.527,42.742-10.648,60.453 c-19.208-30.379-33.275-79.335-32.965-91.223c0.194-7.422-4.532-14.081-11.599-16.349c-7.068-2.269-14.788,0.397-18.948,6.546 c-11.026,16.288-50.826,50.892-89.054,70.11c3.008-27.112,19.521-58.454,54.404-78.68c6.77-3.926,9.91-12.026,7.553-19.49 c-2.356-7.464-9.592-12.293-17.376-11.618c-35.946,3.108-68.895,0.888-98.301-6.596c31.558-26.507,83.425-32.366,122.756-12.925 c7.07,3.493,15.617,1.572,20.511-4.611c4.893-6.183,4.8-14.945-0.224-21.021c-8.121-9.822-13.95-27.438-17.934-42.126 c13.46-2.264,27.36,2.521,37.734,13.605c0,0,0,0,0.001,0c7.815,8.35,12.374,19.427,12.834,31.188 c0.254,6.517,4.276,12.289,10.3,14.786c6.024,2.497,12.949,1.262,17.74-3.163c24.118-22.284,64.98-18.601,81.225,5.883 c-17.281,5.751-36.058,11.238-46.651,12.552c-7.569,0.938-13.542,6.883-14.519,14.446c-0.976,7.564,3.292,14.83,10.375,17.659 c25.473,10.176,45.031,28.788,55.074,52.409C455.995,205.015,458.26,217.186,457.756,228.617z" />
                    </g>
                </g>
            </g>
        </svg>
    );
};

export const DoorClosedLockedIcon: React.FC<IconSvgProps> = ({ size, width, height, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            width={width || size}
            height={height || size}
            {...props}
        >
            <path d="M10 12h.01" />
            <path d="M18 9V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
            <path d="M2 20h8" />
            <path d="M20 17v-2a2 2 0 1 0-4 0v2" />
            <rect x="14" y="17" width="8" height="5" rx="1" />
        </svg>
    );
};

const defaultIconClass = "inline w-4 leading-none aspect-square";

type IconNames = keyof CategoriesT | (typeof loaders_list)[number]["name"] | "client" | "server";

const tagIcons: { [K in IconNames]?: JSX.Element } = {
    // Loaders
    quilt: <QuiltIcon className={defaultIconClass} aria-hidden />,
    puzzle_loader: <PuzzleIcon className={defaultIconClass} aria-hidden />,
    simply_shaders: <SimplyShadersIcon className={defaultIconClass} aria-hidden />,
    paradox: <PuzzleIcon className={defaultIconClass} aria-hidden />,

    // Tags
    adventure: <CompassIcon className={defaultIconClass} aria-hidden />,
    atmosphere: <CloudSunRainIcon className={defaultIconClass} aria-hidden />,
    audio: <HeadphonesIcon className={defaultIconClass} aria-hidden />,
    blocks: <CubeIcon className={defaultIconClass} aria-hidden />,
    bloom: <LampIcon className={defaultIconClass} aria-hidden />,
    "bug-fix": <WrenchIcon className={defaultIconClass} aria-hidden />,
    cartoon: <BrushIcon className={defaultIconClass} aria-hidden />,
    challenging: <BarChartIcon className={defaultIconClass} aria-hidden />,
    christmas: <ChristmasTreeIcon className={defaultIconClass} aria-hidden />,
    city: <BuildingIcon className={defaultIconClass} aria-hidden />,
    "colored-lighting": <PaletteIcon className={defaultIconClass} aria-hidden />,
    combat: <SwordsIcon className={defaultIconClass} aria-hidden />,
    "core-shaders": <CpuIcon className={defaultIconClass} aria-hidden />,
    cursed: <BugIcon className={defaultIconClass} aria-hidden />,
    decoration: <HomeIcon className={defaultIconClass} aria-hidden />,
    economy: <DollarSignIcon className={defaultIconClass} aria-hidden />,
    entities: <MobIcon className={defaultIconClass} aria-hidden />,
    environment: <SunIcon className={defaultIconClass} aria-hidden />,
    equipment: <PickaxeIcon className={defaultIconClass} aria-hidden />,
    escape: <DoorClosedLockedIcon className={defaultIconClass} aria-hidden />,
    fantasy: <WandSparklesIcon className={defaultIconClass} aria-hidden />,
    foliage: <TreeDeciduousIcon className={defaultIconClass} aria-hidden />,
    fonts: <TypeIcon className={defaultIconClass} aria-hidden />,
    food: <CarrotIcon className={defaultIconClass} aria-hidden />,
    "game-mechanics": <SlidersIcon className={defaultIconClass} aria-hidden />,
    gui: <PanelsTopLeftIcon className={defaultIconClass} aria-hidden />,
    "hide-and-seek": <UserSearchIcon className={defaultIconClass} aria-hidden />,
    horror: <SkullIcon className={defaultIconClass} aria-hidden />,
    halloween: <PumpkinIcon className={defaultIconClass} />,
    high: <SignalHighIcon className={defaultIconClass} aria-hidden />,
    island: <IslandIcon className={defaultIconClass} />,
    items: <BookIcon className={defaultIconClass} aria-hidden />,
    "kitchen-sink": <KitchenSinkIcon className={defaultIconClass} aria-hidden />,
    library: <BookIcon className={defaultIconClass} aria-hidden />,
    lightweight: <FeatherIcon className={defaultIconClass} aria-hidden />,
    locale: <GlobeIcon className={defaultIconClass} aria-hidden />,
    low: <SignalLowIcon className={defaultIconClass} aria-hidden />,
    magic: <WandSparklesIcon className={defaultIconClass} aria-hidden />,
    maze: <MazeIcon className={defaultIconClass} />,
    management: <ServerIcon className={defaultIconClass} aria-hidden />,
    medieval: <CastleIcon className={defaultIconClass} aria-hidden />,
    medium: <SignalMediumIcon className={defaultIconClass} aria-hidden />,
    minigame: <AwardIcon className={defaultIconClass} aria-hidden />,
    mobs: <MobIcon className={defaultIconClass} aria-hidden />,
    modded: <SquarePlusIcon className={defaultIconClass} aria-hidden />,
    models: <LayersIcon className={defaultIconClass} aria-hidden />,
    multiplayer: <UsersIcon className={defaultIconClass} aria-hidden />,
    optimization: <ZapIcon className={defaultIconClass} aria-hidden />,
    parkour: <ParkourIcon className={defaultIconClass} />,
    "path-tracing": <RayReflectingIcon className={defaultIconClass} aria-hidden />,
    pbr: <LightbulbIcon className={defaultIconClass} aria-hidden />,
    "pixel-art": <PixelArtIcon className={defaultIconClass} />,
    potato: <PotatoIcon className={defaultIconClass} aria-hidden />,
    puzzle: <PuzzleIcon className={defaultIconClass} aria-hidden />,
    quests: <NetworkIcon className={defaultIconClass} aria-hidden />,
    realistic: <CameraIcon className={defaultIconClass} aria-hidden />,
    reflections: <FlipHorizontal2Icon className={defaultIconClass} aria-hidden />,
    screenshot: <ImageIcon className={defaultIconClass} aria-hidden />,
    "semi-realistic": <FilmIcon className={defaultIconClass} aria-hidden />,
    survival: <PickaxeIcon className={defaultIconClass} aria-hidden />,
    shadows: <MountainIcon className={defaultIconClass} aria-hidden />,
    simplistic: <HexagonIcon className={defaultIconClass} aria-hidden />,
    social: <MessageCircleIcon className={defaultIconClass} aria-hidden />,
    skyblock: <CloudyIcon className={defaultIconClass} aria-hidden />,
    storage: <ArchiveIcon className={defaultIconClass} aria-hidden />,
    technology: <CpuIcon className={defaultIconClass} aria-hidden />,
    themed: <PenToolIcon className={defaultIconClass} aria-hidden />,
    transportation: <TruckIcon className={defaultIconClass} aria-hidden />,
    tweaks: <SquarePenIcon className={defaultIconClass} aria-hidden />,
    utility: <BriefcaseIcon className={defaultIconClass} aria-hidden />,
    "vanilla-like": <IceCreamConeIcon className={defaultIconClass} aria-hidden />,
    worldgen: <EarthIcon className={defaultIconClass} aria-hidden />,
    client: <MonitorIcon className={defaultIconClass} aria-hidden />,
    server: <HardDriveIcon className={defaultIconClass} aria-hidden />,
};

export default tagIcons;

export function TagIcon({ name }: { name: string }) {
    // @ts-ignore
    const icon = tagIcons[name];
    if (!icon) return null;

    return icon;
}
