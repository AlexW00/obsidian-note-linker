import * as Comlink from "comlink";
import rustPlugin from "../../../pkg/obsidian_rust_plugin_bg.wasm";
import * as wasm from "../../../pkg";
import {find, init_panic_hook, Note, LinkFinderResult} from "../../../pkg";

class WasmWorker {
    public async init() {
        // @ts-ignore
        const buffer = Uint8Array.from(atob(rustPlugin), c => c.charCodeAt(0))
        await wasm.default(Promise.resolve(buffer));
        init_panic_hook()
    }

    public find(serializedNotes: Array<string>, callback: Function): Array<string> {
        const notes: Array<Note> = serializedNotes.map(noteString => Note.fromJSON(noteString));
        const noteMatchingResults: Array<LinkFinderResult> = find(this, notes, callback);
        return noteMatchingResults.map(noteMatchingResult => noteMatchingResult.toJSON());
    }

}

Comlink.expose(WasmWorker);