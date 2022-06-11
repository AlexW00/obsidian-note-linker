import * as React from "react";
import {NoteMatchingResult, TextContext} from "../../../../pkg";
import {LinkMatchesListComponent} from "./LinkMatchesListComponent";

interface NoteMatchingResultsListProps {
    noteMatchingResults: Array<NoteMatchingResult>,
}

export const NoteMatchingResultsList = ({noteMatchingResults}: NoteMatchingResultsListProps) => {
    return (
        <div>
            <h2>Note Link Matches</h2>
            <ul>
                {noteMatchingResults.map((noteLinkMatchResult: NoteMatchingResult) => {
                    return <LinkMatchesListComponent key={noteLinkMatchResult.note.path + "-linkMatches"} noteLinkMatchResult={noteLinkMatchResult}/>
                })}
            </ul>
            <button>Replace</button>
        </div>
    );
};
