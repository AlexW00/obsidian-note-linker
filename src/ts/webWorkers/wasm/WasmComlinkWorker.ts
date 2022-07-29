import * as Comlink from "comlink";
import rustPlugin from "../../../../pkg/obsidian_rust_plugin_bg.wasm";
import * as wasm from "../../../../pkg";
import {init_panic_hook, add, find, Note, find_silent, NoteMatchingResult} from "../../../../pkg";
import JsNote from "../../JsNote";

class WasmComlinkWorker {
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

    public async find(context: any, notes: Note[], callback: Function) {

        return await find(context, notes, callback);
    }

    public async findSilent(notesStringified: Array<string>) {
        console.log("calling findSilent");
        const notes: Array<Note> = notesStringified.map(noteString => Note.from_json_string(noteString));
        console.log(notes);
        const noteMatchingResults: Array<NoteMatchingResult> = await find_silent(notes);
        console.log("noteMatchingResults", noteMatchingResults);
        noteMatchingResults.forEach(noteMatchingResult => {
            console.log(noteMatchingResult.to_json_string());
        })
        return noteMatchingResults;
    }

}
Comlink.expose(WasmComlinkWorker);