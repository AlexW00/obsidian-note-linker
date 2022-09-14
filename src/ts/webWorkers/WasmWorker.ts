import * as Comlink from "comlink";
import rustPlugin from "../../../pkg/obisidian_note_linker_bg.wasm";
import * as wasm from "../../../pkg";
import {
	init_panic_hook,
	Note,
	LinkFinderResult,
	find_in_vault,
	find_in_note,
} from "../../../pkg";

class WasmWorker {
	public async init() {
		// @ts-ignore
		const buffer = Uint8Array.from(atob(rustPlugin), (c) => c.charCodeAt(0));
		await wasm.default(Promise.resolve(buffer));
		init_panic_hook();
	}

	public findInVault(
		serializedNotes: Array<string>,
		callback: Function
	): Array<string> {
		const notes: Array<Note> = serializedNotes.map((noteString) =>
			Note.fromJSON(noteString)
		);
		const noteMatchingResults: Array<LinkFinderResult> = find_in_vault(
			this,
			notes,
			callback
		);
		return noteMatchingResults.map((noteMatchingResult) =>
			noteMatchingResult.toJSON()
		);
	}

	public findInNote(
		serializedNote: string,
		searializedNotes: Array<string>,
		callback: Function
	): Array<string> {
		const note: Note = Note.fromJSON(serializedNote);
		const notes: Array<Note> = searializedNotes.map((noteString) =>
			Note.fromJSON(noteString)
		);
		const noteMatchingResults: Array<LinkFinderResult> = find_in_note(
			this,
			note,
			notes,
			callback
		);
		return noteMatchingResults.map((noteMatchingResult) =>
			noteMatchingResult.toJSON()
		);
	}
}

Comlink.expose(WasmWorker);
