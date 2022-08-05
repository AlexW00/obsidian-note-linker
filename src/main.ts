import {Plugin} from "obsidian";
import rustPlugin from "../pkg/obsidian_rust_plugin_bg.wasm";
import * as wasm from "../pkg";
import MainModal from "./ts/MainModal";
import {init_panic_hook} from "../pkg/";
import * as Comlink from "comlink";

// @ts-ignore
import Wcw from 'web-worker:./ts/webWorkers/WasmWorker.ts';

export default class RustPlugin extends Plugin {
    async onload() {
        // init wasm
        const buffer = Uint8Array.from(atob(rustPlugin as unknown as string), c => c.charCodeAt(0))
        await wasm.default(Promise.resolve(buffer));
        init_panic_hook()

        // init the secondary wasm thread (for searching)
        const WasmComlinkWorker = Comlink.wrap<typeof Wcw>(new Wcw())
        let wasmWorkerInstance: Comlink.Remote<typeof WasmComlinkWorker>;

        const ribbonIconEl = this.addRibbonIcon('link', 'Note Linker', async () => {
            wasmWorkerInstance = await new WasmComlinkWorker();
            await wasmWorkerInstance.init();

            const linkMatchSelectionModal = new MainModal(app, wasmWorkerInstance);
            linkMatchSelectionModal.open();
        });
        ribbonIconEl.onclose = () => {
            wasmWorkerInstance = null;
        }
    }

}