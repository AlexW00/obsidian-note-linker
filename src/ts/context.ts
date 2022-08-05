import * as React from "react";
import {Dispatch, SetStateAction} from "react";
import {App, TFile} from 'obsidian';
import {
    LinkFinderResult,
    LinkMatch,
    LinkTargetCandidate,
    NoteChangeOperation,
    PreferrableItem,
    Replacement
} from "../../pkg";

export const AppContext = React.createContext<App>(undefined);
export const WasmWorkerInstanceContext = React.createContext<any>(undefined)

export const NoteFilesContext = React.createContext<Map<string, TFile>>(undefined);
export const SelectedNoteChangeOperationsContext = React.createContext<{ noteChangeOperations: Map<string, NoteChangeOperation>, setNoteChangeOperations: Dispatch<SetStateAction<Map<string, NoteChangeOperation>>> }>(undefined);
export const LinkFinderResultContext = React.createContext<LinkFinderResult>(undefined);
export const LinkMatchContext = React.createContext<LinkMatch>(undefined);
export const LinkTargetCandidateContext = React.createContext<LinkTargetCandidate>(undefined);
export const ReplacementCandidateContext = React.createContext<PreferrableItem>(undefined);
export const ReplacementContext = React.createContext<{ replacement: Replacement, setReplacement: Dispatch<SetStateAction<Replacement>> }>(undefined);