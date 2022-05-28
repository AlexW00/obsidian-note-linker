import { Plugin, Notice, App, Vault} from "obsidian";
import rustPlugin from "../pkg/obsidian_rust_plugin_bg.wasm";
import * as wasm from "../pkg";
import JsNote from "./js/JsNote";
import {LinkMatch, Note, set_timeout} from "../pkg";
import LinkMatchSelectionModal from "./js/LinkMatchSelectionModal";

export default class RustPlugin extends Plugin {
	async onload() {
		// @ts-ignore
		const buffer = Uint8Array.from(atob(rustPlugin), c => c.charCodeAt(0))
		await wasm.default(Promise.resolve(buffer));

		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
			const linkMatchSelectionModal = new LinkMatchSelectionModal(app);
			linkMatchSelectionModal.open();

		});
	}
}
