import * as React from "react";
import * as ReactDOM from "react-dom";
import {useContext, useEffect, useState} from "react";
import {Note, NoteMatchingResult, NoteScannedEvent} from "../../../../pkg";
import JsNote from "../../JsNote";
import {AppContext} from "../../context";
import * as wasm from "../../../../pkg";
import Progress from "../../Progress";
import {ProgressComponent} from "../general/ProgressComponent";
import {NoteMatchingResultsList} from "../lists/NoteMatchingResultsListComponent";


export const LinkMatcherComponent = () => {

    const {vault, metadataCache} = useContext(AppContext);

    const [noteMatchingResults, setNoteMatchingResults] = useState<Array<NoteMatchingResult>>([]);
    const [linkMatchingProgress] = useState<Progress>(new Progress(JsNote.getNumberOfNotes(vault, metadataCache)));

    const onLinkMatchingProgress = (noteScannedEvent: NoteScannedEvent) => {
        linkMatchingProgress.increment();
        console.log(linkMatchingProgress.isComplete());
    }

    useEffect(() => {
        // On mount
        JsNote.getNotesFromVault(vault, metadataCache)
            .then((jsNotes: JsNote[]) => wasm.find(this, jsNotes as Note[], onLinkMatchingProgress))
            .then((noteLinkMatchResults: Array<NoteMatchingResult>) => {
                console.log("got results");
                setNoteMatchingResults(noteLinkMatchResults)
            })
        return () => {
            // On unmount
        }
    }, []);

    return (
        linkMatchingProgress.isComplete() ?
            <NoteMatchingResultsList noteMatchingResults={noteMatchingResults}/>:
            <ProgressComponent progress={linkMatchingProgress}/>
    );
};

