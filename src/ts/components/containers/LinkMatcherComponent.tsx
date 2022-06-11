import * as React from "react";
import * as ReactDOM from "react-dom";
import {useContext, useEffect, useState} from "react";
import {LinkMatchingResult, Note, NoteScannedEvent} from "../../../../pkg";
import JsNote from "../../JsNote";
import {AppContext} from "../../context";
import * as wasm from "../../../../pkg";
import Progress from "../../Progress";
import {ProgressComponent} from "../general/ProgressComponent";
import {LinkMatchingResultsListComponent} from "../lists/LinkMatchingResultsListComponent";


export const LinkMatcherComponent = () => {

    const {vault, metadataCache} = useContext(AppContext);

    const [linkMatchingResults, setLinkMatchingResults] = useState<Array<LinkMatchingResult>>([]);
    const [linkMatchingProgress] = useState<Progress>(new Progress(JsNote.getNumberOfNotes(vault, metadataCache)));

    const onLinkMatchingProgress = (noteScannedEvent: NoteScannedEvent) => {
        linkMatchingProgress.increment();
        console.log(linkMatchingProgress.isComplete());
    }

    useEffect(() => {
        // On mount
        JsNote.getNotesFromVault(vault, metadataCache)
            .then((jsNotes: JsNote[]) => wasm.find(this, jsNotes as Note[], onLinkMatchingProgress))
            .then((linkMatchingResults: Array<LinkMatchingResult>) => {
                console.log("got results");
                setLinkMatchingResults(linkMatchingResults)
            })
        return () => {
            // On unmount
        }
    }, []);

    return (
        linkMatchingProgress.isComplete() ?
            <LinkMatchingResultsListComponent linkMatchingResults={linkMatchingResults}/>:
            <ProgressComponent progress={linkMatchingProgress}/>
    );
};

