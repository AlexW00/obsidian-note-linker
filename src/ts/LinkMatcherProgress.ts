import {NoteScannedEvent} from "../../pkg";

export default class LinkMatcherProgress {

    public current: number = 0;
    public max: number;

    constructor(max: number) {
        this.max = max;
    }

    public set(current: number) {
        this.current = current;
    }

    public increment(): boolean {
        this.current += 1;
        return this.current >= this.max;
    }

    public update(noteScannedEvent: NoteScannedEvent) {
        const isAtMax = this.increment();
        console.log(`LinkMatcherProgress: ${this.current}/${this.max} at note ${noteScannedEvent.note_title}`);
    }

    public render(): HTMLElement {
        const text = `${this.current}/${this.max}`;
        const element = document.createElement('div');
        element.innerText = text;
        return element;
    }
}