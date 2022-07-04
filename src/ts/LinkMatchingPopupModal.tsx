import {App, Modal} from "obsidian";
import React from "react";
import {createRoot, Root} from 'react-dom/client';
import { AppContext } from "./context";
import {MainComponent} from "./components/containers/MainComponent";

export default class LinkMatchingPopupModal extends Modal {

    private root: Root;

    constructor(app: App) {
        super(app);
    }



    onOpen() {
        this.root = createRoot(this.contentEl);
        this.root.render(
            <AppContext.Provider value={this.app}>
                <MainComponent/>
            </AppContext.Provider>
        )
    }
}