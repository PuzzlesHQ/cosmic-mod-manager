interface HistoryEntry {
    value: string;
    selectionStart: number;
    selectionEnd: number;
}

type EditorStateSetter = (str: string) => void;
type SelectionSetter = (selection: [number, number]) => void;

export class UndoRedoHistory {
    private history: HistoryEntry[] = [];
    private index = -1;

    private timeoutRef: number | undefined = undefined;
    private lastStartTime = 0;
    private currentDelay = 500;

    public push = (value: string, start: number, end: number) => {
        if (this.index >= 0 && this.history[this.index].value === value) return;

        this.history.splice(this.index + 1);
        this.history.push({ value, selectionStart: start, selectionEnd: end });
        this.index = this.history.length - 1;
    };

    public pushDebounced = (val: string, start: number, end: number) => {
        const now = Date.now();

        if (this.timeoutRef) {
            window.clearTimeout(this.timeoutRef);

            const elapsed = now - this.lastStartTime;
            this.currentDelay = Math.max(0, this.currentDelay - elapsed);
        } else {
            this.currentDelay = 500;
        }

        this.lastStartTime = now;
        this.timeoutRef = window.setTimeout(() => {
            this.push(val, start, end);
            this.timeoutRef = undefined;
        }, this.currentDelay);
    };

    public undo = (setEditorValue: EditorStateSetter, setSelection: SelectionSetter) => {
        if (this.index > 0) {
            this.index--;
            const entry = this.history[this.index];
            setEditorValue(entry.value);
            setSelection([entry.selectionStart, entry.selectionEnd]);
        }
    };

    public redo = (setEditorValue: EditorStateSetter, setSelection: SelectionSetter) => {
        if (this.index < this.history.length - 1) {
            this.index++;
            const entry = this.history[this.index];
            setEditorValue(entry.value);
            setSelection([entry.selectionStart, entry.selectionEnd]);
        }
    };
}
