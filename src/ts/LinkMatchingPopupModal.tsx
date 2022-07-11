import {App, Modal} from "obsidian";
import React from "react";
import {createRoot, Root} from 'react-dom/client';
import {AppContext, WasmWorkerInstanceContext} from "./context";
import {MainComponent} from "./components/containers/MainComponent";
import {Remote} from "comlink";

export default class LinkMatchingPopupModal extends Modal {

    private root: Root;
    private wasmComlinkWorkerInstance: any;

    constructor(app: App, instance: any) {
        super(app);
        this.wasmComlinkWorkerInstance = instance;
    }



    onOpen() {
        this.root = createRoot(this.contentEl);
        this.root.render(
            <AppContext.Provider value={this.app}>
                <WasmWorkerInstanceContext.Provider value={this.wasmComlinkWorkerInstance}>
                    <MainComponent/>
                </WasmWorkerInstanceContext.Provider>
            </AppContext.Provider>
        )
    }
}