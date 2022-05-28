import * as wasm from "../../pkg";
import {LinkMatch, Note, NoteScannedEvent} from "../../pkg";
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
        const linkMatches = this.getLinkMatches((noteScannedEvent: NoteScannedEvent) => progress.update(noteScannedEvent)).then((linkMatches: LinkMatch[]) => {
            const linkMatchSelectionList = new LinkMatchSelectionList(linkMatches);
            this.contentEl.appendChild(linkMatchSelectionList.$html());
        })
    }

    getLinkMatches(onNoteScanned: (noteScannedEvent: NoteScannedEvent) => void): Promise<LinkMatch[]> {
        return JsNote.getNotesFromVault(this.app.vault, this.app.metadataCache).then((jsNotes: JsNote[]) => {
            const linkMatches = wasm.find(this, jsNotes as Note[], onNoteScanned);
            linkMatches.forEach((linkMatch: LinkMatch) => {
                // Logging for testing
                console.log("Found text match: " + linkMatch.matched_text + " at " + linkMatch.position.start + "-" + linkMatch.position.end + " in " + linkMatch.note.title);
            })
            return linkMatches as LinkMatch[];
        });
    }

    public render (linkMatches: LinkMatch[]): HTMLElement {
        const root = document.createElement("div");
        root.innerText= "Link Matches: " + linkMatches.length;
        return root;
    }


}