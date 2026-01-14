import { isValidUrl } from "@app/utils/string";
import {
    BoldIcon,
    CodeIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ImageIcon,
    InfoIcon,
    ItalicIcon,
    LinkIcon,
    ListIcon,
    ListOrderedIcon,
    PlusIcon,
    ScanEyeIcon,
    StrikethroughIcon,
    TextQuoteIcon,
    UnderlineIcon,
    VideoIcon,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { MarkdownRenderBox } from "~/components/md-editor/md-renderer";
import { Button, CancelButton } from "~/components/ui/button";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { FormErrorMessage } from "~/components/ui/form-message";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";
import type { Locale } from "~/locales/types";

interface Props {
    editorValue: string;
    setEditorValue: (value: string) => void;
    placeholder?: string;
    textAreaClassName?: string;
    showInfoRow?: boolean;
}

const textSeparatorChar = "{|}";

export default function MarkdownEditor({
    editorValue,
    setEditorValue,
    placeholder,
    textAreaClassName,
    showInfoRow,
}: Props) {
    const { t } = useTranslation();
    const [previewOpen, setPreviewOn] = useState(false);
    const editorTextarea = useRef<HTMLTextAreaElement>(null);
    const [lastSelectionRange, setLastSelectionRange] = useState<number[] | null>();
    const [wordWrap, setWordWrap] = useState(false);
    const [keyboardShortcutsModalOpen, setKeyboardShortcutsModalOpen] = useState(false);

    function toggleTextAtCursorsLine(
        text: string,
        atLineStart?: boolean,
        actionType?: "ADD_FRAGMENT" | "DELETE_FRAGMENT" | "",
        replaceSelectedText: string | null = null,
    ) {
        if (editorTextarea.current?.selectionStart === undefined) return;
        // selectionStart and selectionEnd index, if nothing's selected both will be the same
        const selectionStart = editorTextarea.current.selectionStart;
        const selectionEnd = editorTextarea.current.selectionEnd;

        // If the text has to be added at the line start of around the selection
        if (atLineStart === true) {
            const firstSelectedLineIndex = editorValue.slice(0, selectionStart).lastIndexOf("\n") + 1; // Start index of the first selected line
            const linesBeforeSelection = editorValue.slice(0, firstSelectedLineIndex); // All the other ines before first selected line
            const textAfterSelection = editorValue.slice(selectionEnd); // All the other text after selection
            const selectedLines = `${editorValue.slice(firstSelectedLineIndex, selectionEnd)}`.split("\n"); // All of the selected lines

            let action: "ADD_FRAGMENT" | "DELETE_FRAGMENT" | "" = actionType || "";
            if (!action) {
                // If the first line starts with that text regardless of the other lines, this will be a delete action
                if (selectedLines[0].startsWith(text)) action = "DELETE_FRAGMENT";
                else action = "ADD_FRAGMENT";
            }

            let newSelectedLinesText = "";
            if (action === "ADD_FRAGMENT") {
                // Loop through each line and add the text at the start of each, then add them up
                for (const line of selectedLines) {
                    newSelectedLinesText = `${newSelectedLinesText}${text}${line}\n`;
                }

                setLastSelectionRange([
                    selectionStart + text.length,
                    selectionEnd + text.length * selectedLines.length,
                ]);
            } else if (action === "DELETE_FRAGMENT") {
                // Same way, loop through each line, but check if the text is at the line start before removing anything
                let charactersDeletedCount = 0;
                for (const line of selectedLines) {
                    if (line.startsWith(text)) {
                        charactersDeletedCount += text.length;
                        newSelectedLinesText += `${line.slice(text.length)}\n`;
                    } else {
                        newSelectedLinesText += `${line}\n`;
                    }
                }

                // If the selection is upto the first character of that line, make sure not to decrease the startIndex
                if (editorValue[selectionStart - 1] === "\n" || selectionStart === 0) {
                    setLastSelectionRange([selectionStart, selectionEnd - charactersDeletedCount]);
                } else {
                    setLastSelectionRange([selectionStart - text.length, selectionEnd - charactersDeletedCount]);
                }
            }
            setEditorValue(`${linesBeforeSelection}${newSelectedLinesText.slice(0, -1)}${textAfterSelection}`);
        } else {
            const textFragments = text.split(textSeparatorChar);
            const editorValueFragments = [
                editorValue.slice(0, selectionStart),
                editorValue.slice(selectionStart, selectionEnd),
                editorValue.slice(selectionEnd),
            ];

            let newText = editorValue;
            if (
                editorValueFragments[0].endsWith(textFragments[0]) &&
                editorValueFragments[2].startsWith(textFragments[1])
            ) {
                newText = `${editorValue.slice(0, selectionStart - textFragments[0].length)}${editorValueFragments[1] ? editorValueFragments[1] : ""}${editorValue.slice(selectionEnd + textFragments[1].length)}`;
                setLastSelectionRange([
                    selectionStart - textFragments[0].length,
                    selectionEnd - textFragments[0].length,
                ]);
            } else {
                newText = `${editorValue.slice(0, selectionStart)}${textFragments[0]}${replaceSelectedText ? replaceSelectedText : editorValueFragments[1] ? editorValueFragments[1] : ""}${textFragments[1]}${editorValue.slice(selectionEnd)}`;

                if (replaceSelectedText !== null) {
                    setLastSelectionRange([
                        selectionStart + textFragments[0].length,
                        selectionEnd -
                            editorValueFragments[1].length +
                            replaceSelectedText.length +
                            textFragments[0].length,
                    ]);
                } else {
                    setLastSelectionRange([
                        selectionStart + textFragments[0].length,
                        selectionEnd + textFragments[0].length,
                    ]);
                }
            }

            setEditorValue(newText);
        }

        editorTextarea.current.focus();
    }

    function bold() {
        toggleTextAtCursorsLine(`**${textSeparatorChar}**`);
    }
    function italic() {
        toggleTextAtCursorsLine(`_${textSeparatorChar}_`);
    }
    function underline() {
        toggleTextAtCursorsLine(`<u>${textSeparatorChar}</u>`);
    }
    function unorderedList() {
        toggleTextAtCursorsLine("- ", true);
    }
    function quote() {
        toggleTextAtCursorsLine("> ", true);
    }
    function codeBlock() {
        toggleTextAtCursorsLine(`\`\`\`\n${textSeparatorChar}\n\`\`\``);
    }
    function spoiler() {
        toggleTextAtCursorsLine(`<details>\n<summary>Spoiler</summary>\n\n${textSeparatorChar}\n\n</details>`);
    }

    useEffect(() => {
        if (lastSelectionRange?.length) {
            setCursorPosition(editorTextarea.current, lastSelectionRange);
            setLastSelectionRange(null);
        }
    }, [editorValue]);

    useEffect(() => {
        let blockKeydownEvent = false;
        function handler(e: KeyboardEvent) {
            if (e.key === "/" && e.ctrlKey) {
                e.preventDefault();

                if (blockKeydownEvent === true) return;
                blockKeydownEvent = true;
                setKeyboardShortcutsModalOpen(!keyboardShortcutsModalOpen);
            }
        }

        function resetKeyDownEventBlocking() {
            blockKeydownEvent = false;
        }

        document.addEventListener("keydown", handler);
        document.addEventListener("keyup", resetKeyDownEventBlocking);
        () => {
            document.removeEventListener("keydown", handler);
            document.removeEventListener("keyup", resetKeyDownEventBlocking);
        };
    }, []);

    return (
        <TooltipProvider delayDuration={300}>
            <div className="flex w-full flex-col items-start justify-center gap-1">
                {/* TOOLBAR */}
                <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-1">
                    <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1">
                        <BtnGroup>
                            <IconButton
                                tooltipContent={t.editor.heading1}
                                disabled={previewOpen}
                                onClick={() => {
                                    toggleTextAtCursorsLine("# ", true);
                                }}
                            >
                                <Heading1Icon aria-hidden className="h-5 w-5" />
                            </IconButton>
                            <IconButton
                                tooltipContent={t.editor.heading2}
                                disabled={previewOpen}
                                onClick={() => {
                                    toggleTextAtCursorsLine("## ", true);
                                }}
                            >
                                <Heading2Icon aria-hidden className="h-5 w-5" />
                            </IconButton>
                            <IconButton
                                tooltipContent={t.editor.heading3}
                                disabled={previewOpen}
                                onClick={() => {
                                    toggleTextAtCursorsLine("### ", true);
                                }}
                            >
                                <Heading3Icon aria-hidden className="h-5 w-5" />
                            </IconButton>
                        </BtnGroup>
                        <Separator />
                        <BtnGroup>
                            <IconButton tooltipContent={t.editor.bold} disabled={previewOpen} onClick={bold}>
                                <BoldIcon aria-hidden className="h-5 w-5" />
                            </IconButton>
                            <IconButton tooltipContent={t.editor.italic} disabled={previewOpen} onClick={italic}>
                                <ItalicIcon aria-hidden className="h-5 w-5" />
                            </IconButton>
                            <IconButton tooltipContent={t.editor.underline} disabled={previewOpen} onClick={underline}>
                                <UnderlineIcon aria-hidden className="h-5 w-5" />
                            </IconButton>
                            <IconButton
                                tooltipContent={t.editor.strikethrough}
                                disabled={previewOpen}
                                onClick={() => {
                                    toggleTextAtCursorsLine(`~~${textSeparatorChar}~~`);
                                }}
                            >
                                <StrikethroughIcon aria-hidden className="h-5 w-5" />
                            </IconButton>
                            <IconButton tooltipContent={t.editor.code} disabled={previewOpen} onClick={codeBlock}>
                                <CodeIcon aria-hidden className="h-5 w-5" />
                            </IconButton>
                            <IconButton tooltipContent={t.editor.spoiler} disabled={previewOpen} onClick={spoiler}>
                                <ScanEyeIcon aria-hidden className="h-btn-icon w-btn-icon" />
                            </IconButton>
                        </BtnGroup>
                        <Separator />
                        <BtnGroup>
                            <IconButton
                                tooltipContent={t.editor.bulletedList}
                                disabled={previewOpen}
                                onClick={unorderedList}
                            >
                                <ListIcon aria-hidden className="h-5 w-5" />
                            </IconButton>
                            <IconButton
                                tooltipContent={t.editor.numberedList}
                                disabled={previewOpen}
                                onClick={() => {
                                    toggleTextAtCursorsLine("1. ", true);
                                }}
                            >
                                <ListOrderedIcon aria-hidden className="h-5 w-5" />
                            </IconButton>
                            <IconButton tooltipContent={t.editor.quote} disabled={previewOpen} onClick={quote}>
                                <TextQuoteIcon aria-hidden className="h-5 w-5" />
                            </IconButton>
                        </BtnGroup>
                        <Separator />
                        <BtnGroup>
                            <LinkInsertionModal
                                disabled={previewOpen}
                                modalTitle={t.editor.insertLink}
                                getMarkdownString={(url: string, altText: string, isPreview?: boolean) => {
                                    let selectedText = "";
                                    if (editorTextarea.current)
                                        selectedText = getTextareaSelectedText(editorTextarea.current);
                                    const linkLabel = altText || selectedText || url;
                                    return `[${isPreview === true ? linkLabel : ""}${textSeparatorChar}](${url})`;
                                }}
                                insertFragmentFunc={(markdownString: string, url: string, altText: string) => {
                                    let selectedText = "";
                                    if (editorTextarea.current)
                                        selectedText = getTextareaSelectedText(editorTextarea.current);
                                    const linkLabel = altText || selectedText || url;
                                    toggleTextAtCursorsLine(markdownString, false, "ADD_FRAGMENT", linkLabel);
                                }}
                                altTextInputLabel={t.editor.label}
                                altTextInputPlaceholder={t.editor.enterLabel}
                                urlInputLabel={t.form.url}
                                urlInputPlaceholder={t.editor.enterUrl}
                                isAltTextRequired={false}
                                altTextInputVisible={true}
                            >
                                <IconButton tooltipContent={t.editor.link} disabled={previewOpen}>
                                    <LinkIcon aria-hidden className="h-4 w-4" />
                                </IconButton>
                            </LinkInsertionModal>

                            <LinkInsertionModal
                                disabled={previewOpen}
                                modalTitle={t.editor.insertImage}
                                getMarkdownString={(url: string, altText: string, isPreview = false) => {
                                    let selectedText = "";
                                    if (editorTextarea.current)
                                        selectedText = getTextareaSelectedText(editorTextarea.current);
                                    const linkLabel = altText || selectedText || url;
                                    return `![${isPreview ? linkLabel : ""}${textSeparatorChar}](${url})`;
                                }}
                                insertFragmentFunc={(markdownString: string, url: string, altText: string) => {
                                    let selectedText = "";
                                    if (editorTextarea.current)
                                        selectedText = getTextareaSelectedText(editorTextarea.current);
                                    const linkLabel = altText || selectedText || url;
                                    toggleTextAtCursorsLine(markdownString, false, "ADD_FRAGMENT", linkLabel);
                                }}
                                altTextInputLabel={t.editor.imgAlt}
                                altTextInputPlaceholder={t.editor.imgAltDesc}
                                urlInputLabel={t.form.url}
                                urlInputPlaceholder={t.editor.enterImgUrl}
                                isAltTextRequired={false}
                                altTextInputVisible={true}
                            >
                                <IconButton tooltipContent={t.editor.image} disabled={previewOpen}>
                                    <ImageIcon aria-hidden className="h-4 w-4" />
                                </IconButton>
                            </LinkInsertionModal>

                            <LinkInsertionModal
                                disabled={previewOpen}
                                modalTitle={t.editor.inserYtVideo}
                                getMarkdownString={getYoutubeIframe}
                                insertFragmentFunc={(markdownString: string, _url: string, _altText: string) => {
                                    toggleTextAtCursorsLine(markdownString, false, "ADD_FRAGMENT");
                                }}
                                altTextInputLabel=""
                                altTextInputPlaceholder=""
                                urlInputLabel={t.editor.ytVideoUrl}
                                urlInputPlaceholder={t.editor.enterYtUrl}
                                isAltTextRequired={false}
                                altTextInputVisible={false}
                            >
                                <IconButton tooltipContent={t.editor.video} disabled={previewOpen}>
                                    <VideoIcon aria-hidden className="h-5 w-5" />
                                </IconButton>
                            </LinkInsertionModal>
                        </BtnGroup>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <Switch
                            id="markdown-editor-preview-toggle-switch"
                            checked={previewOpen}
                            onCheckedChange={setPreviewOn}
                        />
                        <Label htmlFor="markdown-editor-preview-toggle-switch" className="text-base">
                            {t.editor.preview}
                        </Label>
                    </div>
                </div>

                <div className="mt-2 flex w-full items-start justify-center gap-2">
                    {/* Editor area */}
                    <div
                        className={cn(
                            "flex w-full flex-col items-center justify-center gap-2",
                            previewOpen === true && "hidden",
                        )}
                    >
                        <Textarea
                            name="markdown-textarea"
                            placeholder={placeholder}
                            className={cn(
                                "focus-within:!bg-transparent h-[32rem] min-h-[16rem] w-full resize-y rounded-lg font-mono text-base text-foreground-muted focus-within:text-foreground-bright",
                                wordWrap === true ? "overflow-x-auto whitespace-nowrap" : "break-words",
                                textAreaClassName,
                            )}
                            ref={editorTextarea}
                            value={editorValue}
                            onChange={(e) => {
                                setEditorValue(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                const pressedKey = e.key.toLowerCase();
                                if (pressedKey === "escape") return editorTextarea.current?.blur();

                                if (pressedKey === "tab") {
                                    e.preventDefault();

                                    if (e.shiftKey === true) {
                                        toggleTextAtCursorsLine("  ", true, "DELETE_FRAGMENT");
                                    } else {
                                        toggleTextAtCursorsLine("  ", true, "ADD_FRAGMENT");
                                    }
                                }

                                if (e.shiftKey) return;

                                if (e.altKey) {
                                    e.preventDefault();

                                    if (pressedKey === "z") setWordWrap((prev) => !prev);
                                    else if (pressedKey === "b") bold();
                                    else if (pressedKey === "i") italic();
                                    else if (pressedKey === "u") underline();
                                    else if (pressedKey === "c") codeBlock();
                                    else if (pressedKey === "s") spoiler();
                                    else if (pressedKey === "q") quote();
                                    else if (pressedKey === "l") unorderedList();
                                }
                            }}
                            spellCheck={false}
                        />

                        {showInfoRow !== false && (
                            <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 text-foreground-muted text-sm">
                                <div className="flex items-center justify-start gap-2">
                                    <InfoIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                    <MarkdownRenderBox text={t.editor.supportsMarkdown("/md-editor")} />
                                </div>
                                <KeyboardShortcutsDialog
                                    open={keyboardShortcutsModalOpen}
                                    setOpen={setKeyboardShortcutsModalOpen}
                                    t={t.editor}
                                >
                                    <div className="hidden cursor-pointer items-center justify-center gap-2 font-mono lg:flex">
                                        <span>{t.editor.keyboardShortcuts}</span>
                                        <div className="flex items-center justify-center gap-1 font-mono">
                                            <span className="flex items-center justify-center rounded-sm bg-raised-background px-1">
                                                ctrl
                                            </span>
                                            <span className="flex items-center justify-center rounded-sm bg-raised-background px-1">
                                                /
                                            </span>
                                        </div>
                                    </div>
                                </KeyboardShortcutsDialog>
                            </div>
                        )}
                    </div>

                    {previewOpen && (
                        <div
                            className={cn(
                                "flex w-full items-center justify-center overflow-auto rounded border-2 border-border p-4",
                                !editorValue && "min-h-24",
                            )}
                        >
                            <MarkdownRenderBox text={editorValue} />
                        </div>
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
}

interface IconButtonProps {
    children: React.ReactNode;
    tooltipContent?: React.ReactNode;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

function IconButton({ children, tooltipContent, disabled, onClick, ...props }: IconButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="icon"
                    type="button"
                    variant="secondary"
                    tabIndex={disabled ? -1 : 0}
                    disabled={disabled}
                    className="h-8 w-8 text-foreground-muted"
                    onClick={onClick}
                    {...props}
                >
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent>{tooltipContent}</TooltipContent>
        </Tooltip>
    );
}

function Separator() {
    return <span className="hidden h-10 w-[0.1rem] bg-border lg:flex" />;
}

function BtnGroup({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-wrap items-center justify-start gap-x-1.5 gap-y-0.5">{children}</div>;
}

// biome-ignore lint/suspicious/noExplicitAny: HTMLTextAreaElement type doesn't have the createTextRange method, idk why, the actual object does
function setCursorPosition(textarea: any, position: number[]) {
    try {
        if (textarea.setSelectionRange) {
            textarea.focus();
            textarea.setSelectionRange(position[0], position[1]);
        } else if (textarea.createTextRange) {
            const range = textarea.createTextRange();
            range.collapse(true);
            range.moveEnd("character", position[0]);
            range.moveStart("character", position[1]);
            range.select();
        }
    } catch (error) {
        console.error(error);
    }
}

function getTextareaSelectedText(textarea: HTMLTextAreaElement) {
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    return textarea.value.slice(selectionStart, selectionEnd) || "";
}

function getYoutubeIframe(url: string, _altText: string) {
    const youtubeRegex =
        /^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9_-]{7,15})(?:[?&][a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+)*$/;
    const match = youtubeRegex.exec(url);
    if (match) {
        return `<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${match[1]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>${textSeparatorChar}`;
    }
    return "";
}

interface EditorModalProps {
    disabled: boolean;
    title: string;
    modalOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    trigger: React.ReactNode;
    children: React.ReactNode;
    insertFragmentFunc: () => void;
    t: Locale;
}

function EditorModal({
    disabled,
    title,
    trigger,
    children,
    modalOpen,
    t,
    setModalOpen,
    insertFragmentFunc,
}: EditorModalProps) {
    return (
        <Dialog
            open={modalOpen}
            onOpenChange={(open: boolean) => {
                if (disabled) return;
                setModalOpen(open);
            }}
        >
            <DialogTrigger asChild disabled={disabled}>
                <div className="flex items-center justify-center">{trigger}</div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <DialogBody className="flex flex-col gap-form-elements">
                    {children}

                    <DialogFooter>
                        <DialogClose asChild>
                            <CancelButton type="button">{t.form.cancel}</CancelButton>
                        </DialogClose>

                        <Button
                            type="button"
                            className="gap-2"
                            onClick={() => {
                                insertFragmentFunc();
                                setModalOpen(false);
                            }}
                        >
                            <PlusIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                            {t.editor.insert}
                        </Button>
                    </DialogFooter>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

interface InsertLinkModalProps {
    modalTitle: string;
    disabled: boolean;
    altTextInputLabel: string;
    altTextInputPlaceholder: string;
    isAltTextRequired: boolean;
    altTextInputVisible: boolean;
    urlInputLabel: string;
    children: React.ReactNode;
    urlInputPlaceholder: string;
    insertFragmentFunc: (markdownString: string, url: string, altText: string) => void;
    getMarkdownString: (url: string, altText: string, isPreview?: boolean) => string;
}

function LinkInsertionModal({
    modalTitle,
    disabled,
    insertFragmentFunc,
    getMarkdownString,
    altTextInputLabel,
    altTextInputPlaceholder,
    urlInputLabel,
    urlInputPlaceholder,
    isAltTextRequired,
    altTextInputVisible,
    children,
}: InsertLinkModalProps) {
    const { t } = useTranslation();
    const [url, setUrl] = useState("");
    const [urlAltText, setUrlAltText] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [urlValidationError, setUrlValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (modalOpen === false) {
            setUrl("");
            setUrlAltText("");
        }
    }, [modalOpen]);

    useEffect(() => {
        try {
            if (isValidUrl(cleanUrl(url))) setUrlValidationError(null);
            else setUrlValidationError("Invlid URL");
        } catch (error) {
            // @ts-expect-error
            setUrlValidationError((error?.message as string) || "");
        }
    }, [url]);

    return (
        <EditorModal
            modalOpen={modalOpen}
            disabled={disabled}
            setModalOpen={setModalOpen}
            title={modalTitle}
            insertFragmentFunc={() => {
                if (!url || urlValidationError) return;
                if (isAltTextRequired && !urlAltText) return;

                insertFragmentFunc(getMarkdownString(url, urlAltText, false), url, urlAltText);

                setUrl("");
                setUrlAltText("");
            }}
            trigger={children}
            t={t}
        >
            {altTextInputVisible && (
                <div className="flex w-full flex-col items-start justify-center gap-1.5">
                    <Label htmlFor="markdown-editor-link-label-input" className="flex items-center justify-center">
                        {altTextInputLabel}{" "}
                        {isAltTextRequired && (
                            <span className="flex h-full items-start justify-center text-accent-text">*</span>
                        )}
                    </Label>
                    <Input
                        type="text"
                        id="markdown-editor-link-label-input"
                        value={urlAltText}
                        onChange={(e) => {
                            setUrlAltText(e.target.value);
                        }}
                        placeholder={altTextInputPlaceholder}
                        className="w-full"
                    />
                </div>
            )}
            <div className="flex w-full flex-col items-start justify-center gap-1.5">
                <Label htmlFor="markdown-editor-link-url-input" className="flex items-center justify-center">
                    {urlInputLabel} <span className="flex h-full items-start justify-center text-accent-text">*</span>
                </Label>
                <Input
                    id="markdown-editor-link-url-input"
                    spellCheck={false}
                    type="text"
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                    }}
                    placeholder={urlInputPlaceholder}
                    className="w-full"
                />
            </div>

            {url && urlValidationError ? (
                <FormErrorMessage text={urlValidationError} />
            ) : isAltTextRequired && !urlAltText ? (
                <FormErrorMessage text={`${altTextInputLabel} is required!`} />
            ) : null}

            <div className="flex w-full flex-col items-start justify-center gap-1.5">
                <Label>{t.editor.preview}</Label>
                <div
                    tabIndex={-1}
                    className={cn(
                        "flex min-h-24 w-full items-start justify-start rounded border border-border px-4 py-3",
                    )}
                >
                    {url && !urlValidationError ? (
                        <MarkdownRenderBox
                            text={getMarkdownString(url, urlAltText, true).split(textSeparatorChar).join("")}
                        />
                    ) : null}
                </div>
            </div>
        </EditorModal>
    );
}

export function cleanUrl(input: string): string {
    let url: URL;

    try {
        url = new URL(input);
    } catch {
        throw new Error("Invalid URL. Make sure the URL is well-formed.");
    }

    // Check for unsupported protocols
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("Unsupported protocol. Use http or https.");
    }

    // If the scheme is "http", automatically upgrade it to "https"
    if (url.protocol === "http:") {
        url.protocol = "https:";
    }

    // Block certain domains for compliance
    const blockedDomains = ["forgecdn"];
    if (blockedDomains.some((domain) => url.hostname.includes(domain))) {
        throw new Error("Invalid URL. This domain is not allowed.");
    }

    return url.toString();
}

function KeyboardShortcutsDialog({
    t,
    open,
    setOpen,
    children,
}: {
    t: Locale["editor"];
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}) {
    const shortcutsString = `|  ${t.action}  |  ${t.shortcut}  |\n|---|---|\n|  ${t.bold}  | <kbd>alt</kbd> <kbd>b</kbd>  |\n|  ${t.italic}  | <kbd>alt</kbd> <kbd>i</kbd>  |\n|  ${t.underline}  | <kbd>alt</kbd> <kbd>u</kbd>  |\n|  ${t.code}  |  <kbd>alt</kbd> <kbd>c</kbd>  |\n|  ${t.spoiler}  |  <kbd>alt</kbd> <kbd>s</kbd>  |\n|  ${t.quote}  |  <kbd>alt</kbd> <kbd>q</kbd>  |\n|  ${t.bulletedList}  |  <kbd>alt</kbd> <kbd>l</kbd>  |\n|  ${t.toggleLineWrap}  |  <kbd>alt</kbd> <kbd>z</kbd>  |`;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="flex w-fit items-center justify-start">
                {children}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.keyboardShortcuts}</DialogTitle>
                </DialogHeader>

                <DialogBody className="markdown-body flex w-full flex-col items-center justify-center">
                    <MarkdownRenderBox text={shortcutsString} />
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
