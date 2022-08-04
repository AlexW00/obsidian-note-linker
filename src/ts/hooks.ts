import {
    AppContext, LinkMatchContext, LinkTargetCandidateContext,
    NoteFilesContext,
    NoteMatchingResultContext,
    SelectedNoteChangeOperationsContext, SelectionItemContext,
    WasmWorkerInstanceContext
} from "./context";
import {App, TFile} from "obsidian";
import React, {Dispatch, SetStateAction, useContext} from "react";
import {
    LinkMatch,
    LinkTargetCandidate,
    NoteChangeOperation,
    NoteMatchingResult,
    Replacement,
    SelectionItem
} from "../../pkg";

// Context hooks
export const useApp = (): App | undefined => {
    return React.useContext(AppContext);
};

export const useWasmWorkerInstance = (): any | undefined => {
    return React.useContext(WasmWorkerInstanceContext);
}

export const useNoteFiles = (): Map<string, TFile> | undefined => {
    return React.useContext(NoteFilesContext);
}

export const useSelectedNoteChangeOperations = (): {noteChangeOperations: Map<string, NoteChangeOperation>, setNoteChangeOperations: Dispatch<SetStateAction<Map<string, NoteChangeOperation>>>} | undefined => {
    return React.useContext(SelectedNoteChangeOperationsContext);
}

export const useNoteMatchingResult = (): NoteMatchingResult | undefined => {
    return React.useContext(NoteMatchingResultContext);
}

export const useLinkMatch = (): LinkMatch | undefined => {
    return React.useContext(LinkMatchContext);
}

export const useLinkTargetCandidate = (): LinkTargetCandidate | undefined => {
    return React.useContext(LinkTargetCandidateContext);
}

export const useSelectionItem = (): SelectionItem | undefined => {
    return React.useContext(SelectionItemContext);
}