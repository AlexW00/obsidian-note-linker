import {AppContext, SelectedNoteChangeOperations} from "./context";
import {App} from "obsidian";
import React, {Dispatch, SetStateAction, useContext} from "react";
import {NoteChangeOperation, Replacement} from "../../pkg";

// Utility hook to access the Obsidian App object
export const useApp = (): App | undefined => {
    return React.useContext(AppContext);
};
