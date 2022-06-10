import * as wasm from "../../pkg";
import {Note, NoteLinkMatchResult, NoteScannedEvent} from "../../pkg";
import {App, Modal} from "obsidian";
import JsNote from "./JsNote";
import LinkMatcherProgress from "./LinkMatcherProgress";
import LinkMatchSelectionList from "./components/LinkMatchSelectionList";

export default class LinkMatchSelectionModal extends Modal {

    constructor(app: App) {
        super(app);
    }

    onOpen() {
        const progress = new LinkMatcherProgress(JsNote.getNumberOfNotes(this.app.vault, this.app.metadataCache));
        this.contentEl.appendChild(progress.render());
        const linkMatches = this.getLinkMatches((noteScannedEvent: NoteScannedEvent) => progress.update(noteScannedEvent))
    }

    getLinkMatches(onNoteScanned: (noteScannedEvent: NoteScannedEvent) => void): Promise<NoteLinkMatchResult[]> {
        return JsNote.getNotesFromVault(this.app.vault, this.app.metadataCache).then((jsNotes: JsNote[]) => {
            const linkMatches = wasm.find(this, jsNotes as Note[], onNoteScanned);
            linkMatches.forEach((linkMatch: NoteLinkMatchResult) => {
                console.log(linkMatch)
            })
            return linkMatches as NoteLinkMatchResult[];
        });
    }

    public render (linkMatches: NoteLinkMatchResult[]): HTMLElement {
        const root = document.createElement("div");
        root.innerText= "Link Matches: " + linkMatches.length;
        return root;
    }


}