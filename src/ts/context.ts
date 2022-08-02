import * as React from "react";
import {App, TFile} from 'obsidian';
import {Dispatch, SetStateAction, useState} from "react";
import {LinkMatch, LinkTargetCandidate, NoteChangeOperation, NoteMatchingResult} from "../../pkg";

export const AppContext = React.createContext<App>(undefined);
export const NoteFilesContext = React.createContext<Map<String, TFile>>(undefined);
export const WasmWorkerInstanceContext = React.createContext<any>(undefined)
export const SelectedNoteChangeOperations = React.createContext<[Map<string, NoteChangeOperation>, Dispatch<SetStateAction<Map<string, NoteChangeOperation>>>]>(undefined);
export const NoteMatchingResultContext = React.createContext<NoteMatchingResult>(undefined);
export const LinkMatchContext = React.createContext<LinkMatch>(undefined);
export const LinkTargetCandidateContext = React.createContext<LinkTargetCandidate>(undefined);