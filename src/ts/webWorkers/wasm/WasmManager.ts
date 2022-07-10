import rustPlugin from "../../../../pkg/obsidian_rust_plugin_bg.wasm";
import * as wasm from "../../../../pkg";
import {add, init_panic_hook} from "../../../../pkg";

export class WasmManager {
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

    public sayHello(location: string): void {
        console.log(`Hello from ${location}!`);
    }

    public rsAdd([a, b]: Array<number>): number {
        console.log("called add: ", a, b)
        return this.wasmModule.add(a,b);
    }

    public isReady (): boolean {
        return !this.isInitializing;
    }
}

