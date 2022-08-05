import {NoteScannedEvent} from "../../../pkg";

export default class Progress {

    current: number;
    max: number;
    noteScannedEvent: NoteScannedEvent;

    PROGRESS_BAR_BORDER_LEFT = "[";
    PROGRESS_BAR_BORDER_RIGHT = "]";
    PROGRESS_BAR_ARROW_BODY = "=";
    PROGRESS_BAR_ARROW_HEAD = ">";
    PROGRESS_BAR_MISSING_BODY = "-";

    PROGRESS_BAR_LENGTH = 20;

    constructor(max: number, noteScannedEvent?: NoteScannedEvent) {
        this.max = max;
        this.current = noteScannedEvent === undefined ? 0 : noteScannedEvent.index;
        this.noteScannedEvent = noteScannedEvent;
    }

    public isComplete(): boolean {
        return this.current >= this.max
    }

    public asAsciiArt(): string {
        const percentage = this.current / this.max;
        const progressLength = Math.floor(percentage * this.PROGRESS_BAR_LENGTH);
        const missingLength = this.PROGRESS_BAR_LENGTH - progressLength;

        return this.PROGRESS_BAR_BORDER_LEFT +
            this.PROGRESS_BAR_ARROW_BODY.repeat(progressLength) +
            this.PROGRESS_BAR_ARROW_HEAD +
            this.PROGRESS_BAR_MISSING_BODY.repeat(missingLength) +
            this.PROGRESS_BAR_BORDER_RIGHT +
            `(${this.current}/${this.max})`;
    }

    public asDescriptionText(): string {
        return (this.noteScannedEvent !== undefined) ? `Scanned: ${this.noteScannedEvent.noteTitle}` : "";
    }

}