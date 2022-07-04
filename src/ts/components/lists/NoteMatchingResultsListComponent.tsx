import * as React from "react";
import {NoteChangeOperation, NoteMatchingResult, TextContext} from "../../../../pkg";
import {LinkMatchesListComponent} from "./LinkMatchesListComponent";

interface NoteMatchingResultsListProps {
    noteMatchingResults: Array<NoteMatchingResult>,
    onNoteChangeOperationSelected: (noteChangeOperation: NoteChangeOperation, doAdd: boolean) => void
    onClickReplaceButton: () => void
}

export const NoteMatchingResultsList = ({noteMatchingResults, onNoteChangeOperationSelected, onClickReplaceButton}: NoteMatchingResultsListProps) => {
    
    if (noteMatchingResults.length !== 0) return (
        <div className = "note-matching-result-list">
            <h2>Note Link Matches</h2>
            <ul className = {"hide-list-styling"}>
                {noteMatchingResults.map((noteLinkMatchResult: NoteMatchingResult) => {
                    return (<LinkMatchesListComponent key={noteLinkMatchResult.note.path + "-linkMatches"}
                                 noteLinkMatchResult={noteLinkMatchResult}
                                 onNoteChangeOperationSelected={onNoteChangeOperationSelected}
                            />
                            )
                })}
            </ul>
            <button onClick={onClickReplaceButton}>🔗 Link selected</button>

        </div>
    );
    else return (
        <div className={"info-toast"}>👀 No notes to link could be found.</div>
    )
};
