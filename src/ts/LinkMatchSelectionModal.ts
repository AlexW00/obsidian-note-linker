import * as wasm from "../../pkg";
import {App, Modal} from "obsidian";
import JsNote from "./JsNote";
import LinkMatcherProgress from "./LinkMatcherProgress";
import {LinkMatchingResult, Note, NoteScannedEvent} from "../../pkg";

export default class LinkMatchSelectionModal extends Modal {

    progress: LinkMatcherProgress;

    constructor(app: App) {
        super(app);
    }

    onOpen() {
        this.createLinkMatchingProgress();
        this.getLinkMatches(this.onLinkMatchingProgress)
            .then(this.onLinkMatchingComplete)
    }

    onLinkMatchingComplete = (linkMatches: LinkMatchingResult[]) => {
        console.log("Matching complete");
        console.log(linkMatches);
    }

    onLinkMatchingProgress = (noteScannedEvent: NoteScannedEvent) => {
        this.progress.update(noteScannedEvent)
    }

    createLinkMatchingProgress = () => {
        this.progress = new LinkMatcherProgress(JsNote.getNumberOfNotes(this.app.vault, this.app.metadataCache));
        this.contentEl.appendChild(this.progress.render());
    }

    getLinkMatches(onNoteScanned: (noteScannedEvent: NoteScannedEvent) => void): Promise<LinkMatchingResult[]> {
        return JsNote
            .getNotesFromVault(this.app.vault, this.app.metadataCache)
            .then((jsNotes: JsNote[]) => wasm.find(this, jsNotes as Note[], onNoteScanned));
    }

    public render (linkMatches: LinkMatchingResult[]): HTMLElement {
        const root = document.createElement("div");
        root.innerText= "Link Matches: " + linkMatches.length;
        return root;
    }


}