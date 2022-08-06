import * as React from "react";
import {LinkFinderResult, Note, NoteChangeOperation} from "../../../../pkg";
import {LinkMatchesListComponent} from "./LinkMatchesListComponent";
import {LinkFinderResultContext} from "../../context";
import {useSelectedNoteChangeOperations} from "../../hooks";

interface LinkFinderResultsListProps {
    linkFinderResults: Array<LinkFinderResult>,
    onClickReplaceButton: () => void
}

export const LinkFinderResultsList = ({linkFinderResults, onClickReplaceButton}: LinkFinderResultsListProps) => {
    const {noteChangeOperations, setNoteChangeOperations} = useSelectedNoteChangeOperations();

    const findNoteChangeOperation = (note: Note): NoteChangeOperation | undefined => {
        return noteChangeOperations.get(note.path);
    }

    const findReplacements = (note: Note) => {
        return findNoteChangeOperation(note)?.replacements ?? [];
    };

    if (linkFinderResults.length !== 0) return (
        <div className="note-matching-result-list">
            <h1>Note Link Matches</h1>
            <ul className={"hide-list-styling"}>
                {linkFinderResults.map((linkFinderResult: LinkFinderResult) => {
                        const selectedReplacements = findReplacements(linkFinderResult.note);
                        return (<LinkFinderResultContext.Provider value={linkFinderResult}
                                                                  key={`${linkFinderResult.note.path}`}>
                            <LinkMatchesListComponent
                                selectedReplacements={selectedReplacements}
                                noteChangeOperations={noteChangeOperations}
                                setNoteChangeOperations={setNoteChangeOperations}
                            />
                        </LinkFinderResultContext.Provider>);
                    }
                )}
            </ul>
            <button onClick={onClickReplaceButton}>🔗 Link selected</button>
        </div>
    );
    else return (
        <div className={"info-toast"}>👀 No notes to link could be found.</div>
    )
};
