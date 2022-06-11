import { AppContext } from "./context";
import {App} from "obsidian";
import React from "react";

// Utility hook to access the Obsidian App object
export const useApp = (): App | undefined => {
    return React.useContext(AppContext);
};