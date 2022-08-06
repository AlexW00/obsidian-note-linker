import * as React from "react";
import {LinkMatch, LinkFinderResult, Replacement, NoteChangeOperation} from "../../../../pkg";
import {LinkTargetCandidatesListComponent} from "./LinkTargetCandidatesListComponent";
import {LinkFinderResultTitleComponent} from "../titles/LinkFinderResultTitleComponent";
import {LinkMatchContext} from "../../context";
import {Dispatch, SetStateAction, useCallback, useMemo} from "react";
import {useLinkFinderResult, useSelectedNoteChangeOperations} from "../../hooks";

interface linkFinderResultComponentProps {
    linkFinderResult: LinkFinderResult,
    selectedReplacements: Array<Replacement>,
    noteChangeOperations: Map<string, NoteChangeOperation>,
    setNoteChangeOperations: Dispatch<SetStateAction<Map<string, NoteChangeOperation>>>
}

export const LinkMatchesListComponent = React.memo(({linkFinderResult, selectedReplacements, noteChangeOperations, setNoteChangeOperations}: linkFinderResultComponentProps) => {
    const parentNote = useLinkFinderResult().note;
    console.log("rendering LinkMatchesListComponent");


    return <li className={"link-matches-list"}>
            <LinkFinderResultTitleComponent noteTitle={linkFinderResult.note.title}
                                              notePath={linkFinderResult.note.path}/>
            <ul className={"hide-list-styling"}>
                {linkFinderResult.linkMatches.map((link_match: LinkMatch) => {
                    const noteChangeOperation: NoteChangeOperation = noteChangeOperations.get(parentNote.path);

                    const replacement = selectedReplacements.find((replacement: Replacement) => {
                        return replacement.position.is_equal_to(link_match.position);
                    });

                    return <LinkMatchContext.Provider value={link_match}
                                                   key={`${link_match.position.start}-${link_match.position.end}`}>
                                    <LinkTargetCandidatesListComponent
                                        _replacement={replacement}
                                        noteChangeOperation={noteChangeOperation}
                                        noteChangeOperations={noteChangeOperations}
                                        setNoteChangeOperations={setNoteChangeOperations}
                                        linkMatch={link_match}
                                        parentNote={parentNote}
                                    />
                                </LinkMatchContext.Provider>;
                    }
                )}
            </ul>
        </li>
    ;
}, (prevProps: linkFinderResultComponentProps, nextProps: linkFinderResultComponentProps) => prevProps.selectedReplacements == nextProps.selectedReplacements);