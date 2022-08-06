import * as React from "react";
import {Dispatch, SetStateAction} from "react";
import {LinkMatch, NoteChangeOperation, Replacement} from "../../../../pkg";
import {LinkTargetCandidatesListComponent} from "./LinkTargetCandidatesListComponent";
import {LinkFinderResultTitleComponent} from "../titles/LinkFinderResultTitleComponent";
import {LinkMatchContext} from "../../context";
import {useLinkFinderResult} from "../../hooks";

interface LinkMatchesListComponentProps {
    selectedReplacements: Array<Replacement>,
    noteChangeOperations: Map<string, NoteChangeOperation>,
    setNoteChangeOperations: Dispatch<SetStateAction<Map<string, NoteChangeOperation>>>
}

export const LinkMatchesListComponent = React.memo(({
                                                        selectedReplacements,
                                                        noteChangeOperations,
                                                        setNoteChangeOperations
                                                    }: LinkMatchesListComponentProps) => {
    const linkFinderResult = useLinkFinderResult();
    const parentNote = useLinkFinderResult().note;

    return <li className={"link-matches-list"}>
        <LinkFinderResultTitleComponent noteTitle={linkFinderResult.note.title}
                                        notePath={linkFinderResult.note.path}/>
        <ul className={"hide-list-styling"}>
            {linkFinderResult.linkMatches.map((link_match: LinkMatch) => {
                    const noteChangeOperation: NoteChangeOperation = noteChangeOperations.get(parentNote.path);
                    const selectedReplacement = selectedReplacements.find((replacement: Replacement) => {
                        return replacement.position.is_equal_to(link_match.position);
                    });

                    return <LinkMatchContext.Provider value={link_match}
                                                      key={`${link_match.position.start}-${link_match.position.end}`}>
                        <LinkTargetCandidatesListComponent
                            _selectedReplacement={selectedReplacement}
                            noteChangeOperation={noteChangeOperation}
                            noteChangeOperations={noteChangeOperations}
                            setNoteChangeOperations={setNoteChangeOperations}
                        />
                    </LinkMatchContext.Provider>;
                }
            )}
        </ul>
    </li>
        ;
}, (prevProps: LinkMatchesListComponentProps, nextProps: LinkMatchesListComponentProps) => prevProps.selectedReplacements == nextProps.selectedReplacements);