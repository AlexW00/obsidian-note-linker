import { Plugin } from "obsidian";
import rustPlugin from "../pkg/obisidian_note_linker_bg.wasm";
import * as wasm from "../pkg";
import MainModal from "./ts/MainModal";
import { init_panic_hook } from "../pkg/";
import * as Comlink from "comlink";

// @ts-ignore
import Wcw from "web-worker:./ts/webWorkers/WasmWorker.ts";
import { MatchingMode } from "./ts/components/containers/MainComponent";

export default class RustPlugin extends Plugin {
	async onload() {
		// init wasm
		const buffer = Uint8Array.from(atob(rustPlugin as unknown as string), (c) =>
			c.charCodeAt(0)
		);
		await wasm.default(Promise.resolve(buffer));
		init_panic_hook();

		this.addRibbonIcon("link", "Note Linker", () => this.openModal());
		this.addCommand({
			id: "open-note-linker",
			name: "Open",
			callback: this.openModal,
		});
		this.addCommand({
			id: "open-note-linker-vault",
			name: "Search Vault",
			callback: () => this.openModal(MatchingMode.Vault),
		});
		this.addCommand({
			id: "open-note-linker-note",
			name: "Search Note",
			callback: () => this.openModal(MatchingMode.Note),
		});
	}

	openModal = async (_matchingModal?: MatchingMode) => {
		// init the secondary wasm thread (for searching)
		const wcw = new Wcw();
		const WasmComlinkWorker = Comlink.wrap<typeof Wcw>(wcw);
		let wasmWorkerInstance: Comlink.Remote<typeof WasmComlinkWorker>;

		wasmWorkerInstance = await new WasmComlinkWorker();
		await wasmWorkerInstance.init();

		const linkMatchSelectionModal = new MainModal(
			app,
			wasmWorkerInstance,
			() => {
				wcw.terminate();
			},
			_matchingModal
		);
		linkMatchSelectionModal.open();
	};
}
