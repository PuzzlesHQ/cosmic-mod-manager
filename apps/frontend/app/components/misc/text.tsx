interface TextSpacerProps {
    text: string | undefined | null;
    spacing?: "before" | "after";
}

export function TextSpacer(props: TextSpacerProps) {
    if (!props.text) return null;
    if (!props.text.trim()) return null;

    return (
        <>
            {props.spacing === "before" ? " " : null}
            {props.text}
            {props.spacing !== "before" ? " " : null}
        </>
    );
}
