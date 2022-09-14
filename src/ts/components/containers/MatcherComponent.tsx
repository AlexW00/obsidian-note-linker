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
import { LoadingComponent } from "../other/LoadingComponent";
import { MatchingMode } from "./MainComponent";

enum MatchingState {
	Scanning,
	Selecting,
	Replacing,
	Finished,
	Error,
}

export const MatcherComponent = ({
	matchingMode,
}: {
	matchingMode: MatchingMode;
}) => {
	const { vault, metadataCache } = useApp();
	const wasmWorkerInstance = useWasmWorkerInstance();

	const [matchingState, setMatchingState] = useState<MatchingState>(
		MatchingState.Scanning
	);
	const [numberOfLinkedNotes, setNumberOfLinkedNotes] = useState<number>(0);
	const [linkFinderResults, setLinkFinderResults] = useState<
		Array<LinkFinderResult>
	>([]);
	const [linkMatchingProgress, setLinkMatchingProgress] = useState<Progress>(
		new Progress(JsNote.getNumberOfNotes(vault))
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
		noteChangeOperations.forEach((op: NoteChangeOperation) => {
			op.applyReplacements();
			const noteFile = noteFiles.get(op.path);
			operations.push(vault.modify(noteFile, op.content));
		});
		Promise.all(operations).then(() => onFinishReplacing(operations.length));
	};

	const getLinkFinderResults = async (jsNotes: JsNote[]) => {
		const noteStrings: Array<string> = jsNotes.map((jsNote: JsNote) =>
			jsNote.toJSON()
		);
		if (matchingMode == MatchingMode.Vault) {
			// Search entire vault
			return wasmWorkerInstance.findInVault(
				noteStrings,
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
	}, [wasmWorkerInstance]);

	if (matchingState == MatchingState.Scanning)
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
				🎉 Successfully linked {numberOfLinkedNotes} notes!
			</div>
		);
	else
		return (
			<div className={"error-toast"}>
				💀 An error occurred while linking notes.
			</div>
		);
};
