import rustPlugin from "../../../../pkg/obsidian_rust_plugin_bg.wasm";
import * as wasm from "../../../../pkg";
import {init_panic_hook} from "../../../../pkg";

export class WasmManager {
    private buffer: Uint8Array;

    public async init () {
        // @ts-ignore
        this.buffer = Uint8Array.from(atob(rustPlugin), c => c.charCodeAt(0))
        await wasm.default(Promise.resolve(this.buffer));
        init_panic_hook()
    }

    public sayHello(location: string): void {
        console.log(`Hello from ${location}!`);
    }
}

