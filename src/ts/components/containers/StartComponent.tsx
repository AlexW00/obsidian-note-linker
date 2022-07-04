import * as React from "react";

interface StartComponentProps {
    onClickScan: () => void;
}

export const StartComponent = ({onClickScan}: StartComponentProps) => {
    return (
        <div className={"start-component"}>
            <h1>🔗 Obsidian Note Linker</h1>
            <span className={"warning-toast"}>
                Note: Please backup your vault before using this plugin. This plugin is in beta stage and has therefore not been tested sufficiently.
            </span>
            <button onClick={onClickScan}>🔎 Scan Vault</button>
        </div>
    )
}