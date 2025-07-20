import { ProjectPublishingStatus } from "@app/utils/types";
import { Building2Icon, EyeOffIcon, FileCheckIcon, FileText, LoaderIcon, UserIcon, XIcon } from "lucide-react";
import type React from "react";
import { cn } from "~/components/utils";

export function SunIcon(props: React.ComponentProps<"svg">) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
            id="sun_icon"
            {...props}
        >
            <circle cx="12" cy="12" r="5" id="sun_center_circle" />
            <path
                id="sun_corona"
                d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            />
        </svg>
    );
}

export function MoonIcon(props: React.ComponentProps<"svg">) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            id="moon_icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            {...props}
        >
            <path id="moon_path" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}

export function BrandIcon({ strokeWidth, ...props }: React.ComponentProps<"svg">) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="30 53 400 400"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            {...props}
        >
            <defs>
                <linearGradient
                    id="b"
                    x1={252.872}
                    x2={252.872}
                    y1={91.975}
                    y2={178.255}
                    gradientTransform="matrix(.96253 .27117 -1.09688 3.93103 128.002 -339.044)"
                    gradientUnits="userSpaceOnUse"
                    href="#a"
                />
                <linearGradient id="a">
                    <stop className="text-accent-bg" stopColor="currentColor" offset="0" />
                    <stop className="text-accent-bg" stopColor="currentColor" offset="1" />
                </linearGradient>
                <linearGradient
                    id="c"
                    x1={328.973}
                    x2={328.973}
                    y1={302.535}
                    y2={344}
                    gradientTransform="matrix(.96274 .27043 -2.28238 8.17965 644.299 -2472.513)"
                    gradientUnits="userSpaceOnUse"
                    href="#a"
                />
                <linearGradient
                    id="d"
                    x1={233.357}
                    x2={233.357}
                    y1={93.14}
                    y2={415.587}
                    gradientTransform="matrix(.96065 .27777 -.2935 1.05186 73.677 -71.708)"
                    gradientUnits="userSpaceOnUse"
                    href="#a"
                />
                <linearGradient
                    id="e"
                    x1={233.318}
                    x2={233.318}
                    y1={166.34}
                    y2={342.381}
                    gradientTransform="matrix(.9634 .26804 -.5376 1.92665 135.157 -291.933)"
                    gradientUnits="userSpaceOnUse"
                    href="#a"
                />
                <linearGradient
                    id="f"
                    x1={0}
                    x2={0}
                    y1={-128.015}
                    y2={128.015}
                    gradientTransform="matrix(-.44979 -.89314 3.65307 -1.81413 32.055 9.462)"
                    gradientUnits="userSpaceOnUse"
                    href="#a"
                />
            </defs>
            <g fill="none" strokeWidth={strokeWidth || 22}>
                <path stroke="url(#b)" d="m255.925 91.975-6.106 86.28" />
                <path
                    stroke="url(#c)"
                    d="M293.846 302.535 364.1 344"
                    style={{
                        transformBox: "fill-box",
                        transformOrigin: "50% 50%",
                    }}
                />
                <path
                    stroke="url(#d)"
                    strokeLinecap="square"
                    strokeMiterlimit={30}
                    d="m321.33 251.114 73.022-2.595c4.405 123.937-127.008 206.164-236.541 148.011-109.534-58.154-115.04-213.074-9.91-278.857 61.247-38.324 140.519-31.184 193.933 17.466l-49.202 54.02"
                    filter="none"
                    paintOrder="fill"
                />
                <path
                    stroke="url(#e)"
                    strokeDashoffset={-14}
                    strokeMiterlimit={4.7}
                    d="M292.632 189.159a93 93 0 0 0-4.783-4.07 90 90 0 0 0-4.946-3.657 88 88 0 0 0-10.304-6.101 87 87 0 0 0-10.738-4.518 85 85 0 0 0-5.488-1.68 87 87 0 0 0-16.722-2.793m-16.741.461a89 89 0 0 0-10.933 2.04 90.3 90.3 0 0 0-15.707 5.546 89 89 0 0 0-14.448 8.393 88 88 0 0 0-8.696 7.101 87 87 0 0 0-7.782 8.254 86 86 0 0 0-12.254 19.784 89 89 0 0 0-4.189 11.44 93 93 0 0 0-2.68 12.264 89 89 0 0 0-.966 12.145 86.2 86.2 0 0 0 2.885 23.092 86 86 0 0 0 3.629 10.748 87 87 0 0 0 4.941 10.081 88 88 0 0 0 6.142 9.316 90 90 0 0 0 7.233 8.449 91 91 0 0 0 8.215 7.482 90 90 0 0 0 9.086 6.415 88.5 88.5 0 0 0 15.022 7.403 86.5 86.5 0 0 0 22.051 5.2 86 86 0 0 0 11.644.373m17.93-2.507a92 92 0 0 0 9.535-2.895q1.725-.63 3.413-1.326a89 89 0 0 0 6.586-3.043 89 89 0 0 0 6.252-3.537 87 87 0 0 0 5.896-4.004 89 89 0 0 0 5.52-4.44 88 88 0 0 0 9.831-10.079 88 88 0 0 0 6.235-8.492 86 86 0 0 0 1.848-2.988m7.399-15.973a89 89 0 0 0 2.052-6.801q.446-1.726.821-3.475.377-1.748.682-3.518.307-1.771.54-3.56.235-1.79.395-3.597.162-1.807.248-3.631.087-1.822.098-3.66a87 87 0 0 0-.054-3.687"
                    filter="none"
                    paintOrder="fill"
                />
            </g>
            <path
                fill="url(#f)"
                d="M-15.874 10.672c-6.994-7.768-6.366-19.751 1.403-26.746 7.768-6.995 19.751-6.366 26.745 1.402 6.995 7.769 6.368 19.751-1.401 26.746s-19.752 6.367-26.747-1.402M0-128.015l-25.604 83.669-85.26-19.662L-51.206 0l-59.658 64.008 85.261-19.662L0 128.015l25.603-83.669 85.261 19.662L51.206 0l59.658-64.008-85.261 19.662z"
                transform="rotate(132 59.685 179.212)scale(.3372)"
            />
            <g transform="translate(256.987 228.805)scale(.17498)" />
        </svg>
    );
}

export function DiscordIcon({ className, ...props }: React.ComponentProps<"svg">) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            className={cn("fill-[#5865f2] dark:fill-[#5865f2]", className)}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-label="Google"
            {...props}
        >
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
        </svg>
    );
}

export function GoogleIcon(props: React.ComponentProps<"svg">) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" aria-label="Google" role="img" viewBox="0 0 512 512" {...props}>
            <path d="m0 0H512V512H0" fill="none" />
            <path fill="#34a853" d="m90 341a192 192 0 00296 59v-48h-62c-53 35-141 22-171-60" />
            <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
            <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
            <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
        </svg>
    );
}

export function GitlabIcon(props: React.ComponentProps<"svg">) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" aria-label="GitLab" role="img" viewBox="0 0 512 512" {...props}>
            <path d="m0 0H512V512H0" fill="#FFFFFF00" />
            <path fill="#e24329" d="m71 222 52-136c5-12 21-12 26 0l35.5 109h143L363 86c5-12 21-12 26 0l52 136-185 120" />
            <path fill="#fca326" d="m244 442q12 10 24 0l61-46V340.8H183V396" />
            <path fill="#fc6d26" d="m103 336A97 97 0 0171 222q37 8 65 28l193 146 80-60a97 97 0 0032-114q-37 8-65 28L183 396" />
        </svg>
    );
}

export function GithubIcon(props: React.ComponentProps<"svg">) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" role="img" fill="currentColor" viewBox="0 0 24 24" aria-label="GitHub" {...props}>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    );
}

export function CubeIcon(props: React.ComponentProps<"svg">) {
    return (
        <svg aria-hidden="true" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M7.28856 0.796908C7.42258 0.734364 7.57742 0.734364 7.71144 0.796908L13.7114 3.59691C13.8875 3.67906 14 3.85574 14 4.05V10.95C14 11.1443 13.8875 11.3209 13.7114 11.4031L7.71144 14.2031C7.57742 14.2656 7.42258 14.2656 7.28856 14.2031L1.28856 11.4031C1.11252 11.3209 1 11.1443 1 10.95V4.05C1 3.85574 1.11252 3.67906 1.28856 3.59691L7.28856 0.796908ZM2 4.80578L7 6.93078V12.9649L2 10.6316V4.80578ZM8 12.9649L13 10.6316V4.80578L8 6.93078V12.9649ZM7.5 6.05672L12.2719 4.02866L7.5 1.80176L2.72809 4.02866L7.5 6.05672Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
            />
        </svg>
    );
}

export const CancelButtonIcon = XIcon;

export const fallbackProjectIcon = <CubeIcon aria-hidden className="h-3/4 w-3/4 text-foreground-extra-muted" />;
export const fallbackOrgIcon = <Building2Icon aria-hidden className="h-[65%] w-[65%] text-foreground-extra-muted" />;
export const fallbackUserIcon = <UserIcon aria-hidden className="h-[65%] w-[65%] text-foreground-extra-muted" />;

export const PROJECT_STATUS_ICONS = {
    [ProjectPublishingStatus.DRAFT]: (className?: string) => (
        <FileText className={cn("inline h-[1.15em] w-[1.15em]", className)} />
    ),
    [ProjectPublishingStatus.PROCESSING]: (className?: string) => (
        <LoaderIcon aria-hidden className={cn("inline h-[1.15em] w-[1.15em]", className)} />
    ),
    [ProjectPublishingStatus.APPROVED]: (className?: string) => (
        <FileCheckIcon aria-hidden className={cn("inline h-[1.15em] w-[1.15em]", className)} />
    ),
    [ProjectPublishingStatus.WITHHELD]: (className?: string) => (
        <EyeOffIcon aria-hidden className={cn("inline h-[1.15em] w-[1.15em]", className)} />
    ),
    [ProjectPublishingStatus.REJECTED]: (className?: string) => (
        <XIcon aria-hidden className={cn("inline h-[1.15em] w-[1.15em]", className)} />
    ),
};

export function ProjectStatusDesc(status?: string) {
    switch (status) {
        case ProjectPublishingStatus.DRAFT:
            return "This project is currently in draft status and not visible to others.";
        case ProjectPublishingStatus.PROCESSING:
            return "Your project is currently under review and awaiting approval.";
        case ProjectPublishingStatus.APPROVED:
            return "Congratulations! Your project has been approved and can be accessed by others.";
        case ProjectPublishingStatus.REJECTED:
            return "Your project was rejected by the mods.";
        case ProjectPublishingStatus.WITHHELD:
            return "Your project has been withheld and is not publicly visible. Please check for required updates.";
    }

    return undefined;
}

export const ProjectStatusIcon = ({ status, className }: { status: ProjectPublishingStatus; className?: string }) => {
    return PROJECT_STATUS_ICONS[status](className);
};
