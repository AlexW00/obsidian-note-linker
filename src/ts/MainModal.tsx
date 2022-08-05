import {App, Modal} from "obsidian";
import React from "react";
import {createRoot, Root} from 'react-dom/client';
import {AppContext, WasmWorkerInstanceContext} from "./context";
import {MainComponent} from "./components/containers/MainComponent";

export default class MainModal extends Modal {

    private root: Root;
    private readonly wasmComlinkWorkerInstance: any;
    private  readonly _onClose: () => void;

    constructor(app: App, instance: any, _onClose: () => void) {
        super(app);
        this.wasmComlinkWorkerInstance = instance;
        this._onClose = _onClose;
    }


    onOpen() {
        this.root = createRoot(this.contentEl);
        // add class to root
        this.root.render(
            <AppContext.Provider value={this.app}>
                <WasmWorkerInstanceContext.Provider value={this.wasmComlinkWorkerInstance}>
                    <MainComponent/>
                </WasmWorkerInstanceContext.Provider>
            </AppContext.Provider>
        )
    }

    onClose() {
        super.onClose();
        this._onClose();
    }

}