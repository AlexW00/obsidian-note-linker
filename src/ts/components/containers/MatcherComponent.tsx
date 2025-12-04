import * as React from "react";
import { useEffect, useState } from "react";
import * as Comlink from "comlink";
import {
	NoteChangeOperation,
	LinkFinderResult,
	NoteScannedEvent,
} from "../../../../pkg";
import JsNote from "../../objects/JsNote";
import Progress from "../../objects/Progress";
import { ProgressComponent } from "../other/ProgressComponent";
import { MatchSelectionComponent } from "./MatchSelectionComponent";
import { Notice, TFile } from "obsidian";
import { useApp, useWasmWorkerInstance } from "../../hooks";
import { MatchingMode } from "./MainComponent";
import { NoteLinkerSettings } from "../../../settings";

// Use a sentinel that maps to Rust's `usize::MAX` so the matcher can treat it as an
// unlimited cap across architectures. The value overflows to `u32::MAX` on the
// wasm target while remaining well above any practical limit on native builds.
const UNLIMITED_LINK_LIMIT = Number.MAX_SAFE_INTEGER;

enum MatchingState {
	Initializing,
	Scanning,
	Selecting,
	Replacing,
	Finished,
	Error,
}

interface MatcherComponentProps {
        matchingMode: MatchingMode;
        settings: NoteLinkerSettings;
}

export const MatcherComponent = ({ matchingMode, settings }: MatcherComponentProps) => {
	const { vault, metadataCache } = useApp();
	const wasmWorkerInstance = useWasmWorkerInstance();

	const [matchingState, setMatchingState] = useState<MatchingState>(
		MatchingState.Initializing
	);
	const [numberOfLinkedNotes, setNumberOfLinkedNotes] = useState<number>(0);
	const [linkFinderResults, setLinkFinderResults] = useState<
		Array<LinkFinderResult>
	>([]);
	const [linkMatchingProgress, setLinkMatchingProgress] = useState<Progress>(
		new Progress(
			matchingMode == MatchingMode.Vault ? JsNote.getNumberOfNotes(vault) : 1
		)
	);

	const onLinkMatchingProgress = (serializedNoteScannedEvent: string) => {
		const noteScannedEvent: NoteScannedEvent = NoteScannedEvent.fromJSON(
			serializedNoteScannedEvent
		);
		const newLinkMatchingProgress = new Progress(
			linkMatchingProgress.max,
			noteScannedEvent
		);
		setLinkMatchingProgress(newLinkMatchingProgress);
	};

	const onStartReplacing = () => {
		setMatchingState(MatchingState.Replacing);
	};

	const onFinishReplacing = (num: number) => {
		setNumberOfLinkedNotes(num);
		setMatchingState(MatchingState.Finished);
	};

	const handleReplaceButtonClicked = (
		noteChangeOperations: Map<string, NoteChangeOperation>,
		noteFiles: Map<string, TFile>
	) => {
		onStartReplacing();
		const operations: Array<Promise<void>> = [];
		let totalNum = 0;
		noteChangeOperations.forEach((op: NoteChangeOperation) => {
			totalNum += op.replacements.length;
			op.applyReplacements();
			const noteFile = noteFiles.get(op.path);
			operations.push(vault.modify(noteFile, op.content));
		});
		Promise.all(operations).then(() => onFinishReplacing(totalNum));
	};

	const getLinkFinderResults = async (jsNotes: JsNote[]) => {
		setMatchingState(MatchingState.Scanning);
		const noteStrings: Array<string> = jsNotes.map((jsNote: JsNote) =>
			jsNote.toJSON()
		);
        const limitEnabled = settings.limitMatchesPerNote;
        const maxLinksPerNote = limitEnabled
                ? Math.max(1, Math.floor(settings.maxLinksPerNote))
                : UNLIMITED_LINK_LIMIT;
        const countExistingLinks =
                limitEnabled && settings.countExistingLinksTowardLimit;

		if (matchingMode == MatchingMode.Vault) {
			// Search entire vault
			return wasmWorkerInstance.findInVault(
				noteStrings,
				maxLinksPerNote,
				countExistingLinks,
				Comlink.proxy(onLinkMatchingProgress)
			);
		} else {
			// Search only the active note
			const activeFile = app.workspace.getActiveFile();
			if (activeFile !== null && activeFile.extension === "md") {
				const activeNoteString = (
					await JsNote.fromFile(activeFile, vault, metadataCache)
				).toJSON();

				return wasmWorkerInstance.findInNote(
					activeNoteString,
					noteStrings,
					maxLinksPerNote,
					countExistingLinks,
					Comlink.proxy(onLinkMatchingProgress)
				);
			} else {
				new Notice("No active note found");
			}
		}
	};

	const showMatchSelection = (
		serializedNoteLinkMatchResults: Array<string>
	) => {
		const linkFinderResults: Array<LinkFinderResult> =
			serializedNoteLinkMatchResults.map((linkFinderResult: string) =>
				LinkFinderResult.fromJSON(linkFinderResult)
			);
		setLinkFinderResults(linkFinderResults);
		setMatchingState(MatchingState.Selecting);
	};

	const showError = (error: Error) => {
		console.error(error);
		setMatchingState(MatchingState.Error);
	};

	useEffect(() => {
		JsNote.getNotesFromVault(vault, metadataCache)
			.then(getLinkFinderResults)
			.then(showMatchSelection)
			.catch(showError);
	}, [
        wasmWorkerInstance,
        settings.limitMatchesPerNote,
        settings.maxLinksPerNote,
        settings.countExistingLinksTowardLimit,
    ]);

	if (matchingState == MatchingState.Initializing) {
		return <div>🏗️ Retrieving notes...</div>;
	} else if (matchingState == MatchingState.Scanning)
		return <ProgressComponent progress={linkMatchingProgress} />;
	else if (matchingState == MatchingState.Selecting)
		return (
			<MatchSelectionComponent
				linkFinderResults={linkFinderResults}
				onClickReplaceButton={handleReplaceButtonClicked}
			/>
		);
	else if (matchingState == MatchingState.Replacing)
		return <div className={"info-toast"}>⏳ Linking Notes...</div>;
	else if (matchingState == MatchingState.Finished)
		return (
			<div className={"success-toast"}>
				🎉 Successfully created {numberOfLinkedNotes} new links!
			</div>
		);
	else
		return (
			<div className={"error-toast"}>
				💀 An error occurred while linking notes.
			</div>
		);
};
