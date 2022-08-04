import * as Comlink from "comlink";
import rustPlugin from "../../../pkg/obsidian_rust_plugin_bg.wasm";
import * as wasm from "../../../pkg";
import {add, find_silent, init_panic_hook, find,Note, NoteMatchingResult} from "../../../pkg";

class WasmWorker {
    public async init () {
        console.log("calling init");
        // @ts-ignore
        const buffer = Uint8Array.from(atob(rustPlugin), c => c.charCodeAt(0))
        await wasm.default(Promise.resolve(buffer));
        init_panic_hook()
    }

    public add (a: number, b: number): number {
        console.log("calling add");
        return add(a, b);
    }

    public find(notesStringified: Array<string>, callback: Function): Array<string> {
        const notes: Array<Note> = notesStringified.map(noteString => Note.fromJSON(noteString));
        const noteMatchingResults: Array<NoteMatchingResult> = find(this, notes, callback);
        return noteMatchingResults.map(noteMatchingResult => noteMatchingResult.toJSON());
    }


    public findSilent(notesStringified: Array<string>): Array<string> {
        console.log("calling findSilent");
        const notes: Array<Note> = notesStringified.map(noteString => Note.fromJSON(noteString));
        console.log(notes);
        const noteMatchingResults: Array<NoteMatchingResult> = find_silent(notes);
        console.log("noteMatchingResults", noteMatchingResults);
        return noteMatchingResults.map(noteMatchingResult => noteMatchingResult.toJSON());
    }

}
Comlink.expose(WasmWorker);