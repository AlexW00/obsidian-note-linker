import * as React from "react";
import {useEffect, useState} from "react";
import * as Comlink from "comlink";
import {NoteChangeOperation, NoteMatchingResult, NoteScannedEvent} from "../../../../pkg";
import JsNote from "../../objects/JsNote";
import Progress from "../../objects/Progress";
import {ProgressComponent} from "../general/ProgressComponent";
import {MatchSelectionComponent} from "./MatchSelectionComponent";
import {TFile} from "obsidian";
import {useApp, useWasmWorkerInstance} from "../../hooks";

enum MatchingState {
    Scanning,
    Selecting,
    Replacing,
    Finished,
    Error
}

export const MatcherComponent = () => {
    const {vault, metadataCache} = useApp();
    const wasmWorkerInstance = useWasmWorkerInstance();

    const [matchingState, setMatchingState] = useState<MatchingState>(MatchingState.Scanning);
    const [numberOfLinkedNotes, setNumberOfLinkedNotes] = useState<number>(0);
    const [noteMatchingResults, setNoteMatchingResults] = useState<Array<NoteMatchingResult>>([]);
    const [linkMatchingProgress] = useState<Progress>(new Progress(JsNote.getNumberOfNotes(vault)));

    const onLinkMatchingProgress = (noteScannedEvent: NoteScannedEvent) => {
        console.log("note scan event")
        linkMatchingProgress.increment();
    }

    const onStartReplacing = () => {
        setMatchingState(MatchingState.Replacing)
    }

    const onFinishReplacing = (num: number) => {
        setNumberOfLinkedNotes(num);
        setMatchingState(MatchingState.Finished)
    }

    const handleReplaceButtonClicked = (noteChangeOperations: Map<string, NoteChangeOperation>, noteFiles: Map<string, TFile>) => {
        onStartReplacing()
        const operations: Array<Promise<void>> = [];
        noteChangeOperations.forEach((op: NoteChangeOperation) => {
            op.applyReplacements()
            const noteFile = noteFiles.get(op.path);
            operations.push(vault.modify(noteFile, op.content));
        })
        Promise.all(operations).then(() => onFinishReplacing(operations.length))
    }

    const findNoteMatchingResults = (jsNotes: JsNote[]) => {
        const noteStrings: Array<string> = jsNotes.map((jsNote: JsNote) => jsNote.toJSON());
        return wasmWorkerInstance.find(noteStrings, Comlink.proxy(onLinkMatchingProgress));
    }
    const showMatchSelection = (serializedNoteLinkMatchResults: Array<string>) => {
        const noteLinkMatchResults: Array<NoteMatchingResult> = serializedNoteLinkMatchResults.map((noteLinkMatchResult: string) => NoteMatchingResult.fromJSON(noteLinkMatchResult));
        setNoteMatchingResults(noteLinkMatchResults);
        setMatchingState(MatchingState.Selecting);
    }

    const showError = (error: Error) => {
        console.error(error);
        setMatchingState(MatchingState.Error);
    }

    useEffect(() => {
        JsNote.getNotesFromVault(vault, metadataCache)
            .then(findNoteMatchingResults)
            .then(showMatchSelection)
            .catch(showError)
    }, [wasmWorkerInstance]);


    if (matchingState == MatchingState.Scanning) return <ProgressComponent progress={linkMatchingProgress}/>
    else if (matchingState == MatchingState.Selecting) return <MatchSelectionComponent
        noteMatchingResults={noteMatchingResults}
        onClickReplaceButton={handleReplaceButtonClicked}
    />
    else if (matchingState == MatchingState.Replacing) return <div className={"info-toast"}>⏳ Linking Notes...</div>
    else if (matchingState == MatchingState.Finished) return <div className={"success-toast"}>🎉 Successfully
        linked {numberOfLinkedNotes} notes!</div>
    else return <div className={"error-toast"}>💀 An error occurred while linking notes.</div>
};

