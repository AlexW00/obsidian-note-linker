import * as React from "react";
import {NoteChangeOperation, NoteMatchingResult, TextContext} from "../../../../pkg";
import {LinkMatchesListComponent} from "./LinkMatchesListComponent";

interface NoteMatchingResultsListProps {
    noteMatchingResults: Array<NoteMatchingResult>,
    onNoteChangeOperationSelected: (noteChangeOperation: NoteChangeOperation, doAdd: boolean) => void
    onClickReplaceButton: () => void
}

export const NoteMatchingResultsList = ({noteMatchingResults, onNoteChangeOperationSelected, onClickReplaceButton}: NoteMatchingResultsListProps) => {
    
    return (
        <div>
            <h2>Note Link Matches</h2>
            <ul>
                {noteMatchingResults.map((noteLinkMatchResult: NoteMatchingResult) => {
                    return (<LinkMatchesListComponent key={noteLinkMatchResult.note.path + "-linkMatches"}
                                 noteLinkMatchResult={noteLinkMatchResult}
                                 onNoteChangeOperationSelected={onNoteChangeOperationSelected}
                            />
                            )
                })}
            </ul>
            <button onClick={onClickReplaceButton}>Replace</button>
        </div>
    );
};
