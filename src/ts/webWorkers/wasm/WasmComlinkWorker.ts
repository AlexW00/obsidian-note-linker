import * as Comlink from "comlink";
import rustPlugin from "../../../../pkg/obsidian_rust_plugin_bg.wasm";
import * as wasm from "../../../../pkg";

class WasmComlinkWorker {
    private buffer: Uint8Array;
    private wasmModule: wasm.InitOutput;

    private isInitializing = true;

    public async init () {
        console.log("calling init");
        // @ts-ignore
        this.buffer = Uint8Array.from(atob(rustPlugin), c => c.charCodeAt(0))
        this.wasmModule = await wasm.default(Promise.resolve(this.buffer));
        this.wasmModule.init_panic_hook()
        console.log(this.wasmModule.add(1, 2))
        this.isInitializing = false;
    }

    public add (): number {
        console.log("calling add, init status: ", this.isInitializing)
        return 3
    }
}
Comlink.expose(WasmComlinkWorker);