import { App, Modal } from "obsidian";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { AppContext, WasmWorkerInstanceContext } from "./context";
import {
	MainComponent,
	MatchingMode,
} from "./components/containers/MainComponent";

export default class MainModal extends Modal {
	private root: Root;
	private readonly wasmComlinkWorkerInstance: any;
	private readonly _onClose: () => void;
	private readonly _matchingMode?: MatchingMode;

	constructor(
		app: App,
		instance: any,
		_onClose: () => void,
		_matchingMode?: MatchingMode
	) {
		super(app);
		this.wasmComlinkWorkerInstance = instance;
		this._onClose = _onClose;
		this._matchingMode = _matchingMode ?? MatchingMode.None;
	}

	onOpen() {
		this.root = createRoot(this.contentEl);
		// add class to root
		this.root.render(
			<AppContext.Provider value={this.app}>
				<WasmWorkerInstanceContext.Provider
					value={this.wasmComlinkWorkerInstance}
				>
					<MainComponent _matchingMode={this._matchingMode} />
				</WasmWorkerInstanceContext.Provider>
			</AppContext.Provider>
		);
	}

	onClose() {
		super.onClose();
		this._onClose();
	}
}
