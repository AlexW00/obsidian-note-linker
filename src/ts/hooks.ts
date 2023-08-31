import {
	AppContext,
	LinkFinderResultContext,
	LinkMatchContext,
	LinkTargetCandidateContext,
	NoteFilesContext,
	ReplacementCandidateContext,
	WasmWorkerInstanceContext,
} from "./context";
import { App, TFile } from "obsidian";
import React, { Dispatch, SetStateAction, useContext } from "react";
import {
	LinkFinderResult,
	LinkMatch,
	LinkTargetCandidate,
	NoteChangeOperation,
	Replacement,
	PreferrableItem,
} from "../../pkg";

// Context hooks
export const useApp = (): App | undefined => {
	return React.useContext(AppContext);
};

export const useWasmWorkerInstance = (): any | undefined => {
	return React.useContext(WasmWorkerInstanceContext);
};

export const useNoteFiles = (): Map<string, TFile> | undefined => {
	return React.useContext(NoteFilesContext);
};

export const useLinkFinderResult = (): LinkFinderResult | undefined => {
	return React.useContext(LinkFinderResultContext);
};

export const useLinkMatch = (): LinkMatch | undefined => {
	return React.useContext(LinkMatchContext);
};

export const useLinkTargetCandidate = (): LinkTargetCandidate | undefined => {
	return React.useContext(LinkTargetCandidateContext);
};

export const useReplacementCandidate = (): PreferrableItem | undefined => {
	return React.useContext(ReplacementCandidateContext);
};
