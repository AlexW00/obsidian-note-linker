import * as React from "react";
import {LinkMatch, NoteChangeOperation, NoteMatchingResult, Replacement, SelectionItem} from "../../../../pkg";
import {LinkTargetCandidatesListComponent} from "./LinkTargetCandidatesListComponent";
import {NoteMatchingResultTitleComponent} from "../titles/NoteMatchingResultTitleComponent";

interface noteLinkMatchResultComponentProps {
    noteLinkMatchResult: NoteMatchingResult,
    onNoteChangeOperationSelected: (noteChangeOperation: NoteChangeOperation, doAdd: boolean) => void
}

export const LinkMatchesListComponent = ({noteLinkMatchResult, onNoteChangeOperationSelected}: noteLinkMatchResultComponentProps) => {

    return (
        <li>
            <NoteMatchingResultTitleComponent noteTitle={noteLinkMatchResult.note.title} notePath={noteLinkMatchResult.note.path}/>
            <ul>
                {noteLinkMatchResult.link_matches.map((link_match: LinkMatch) => {
                    return (
                        <LinkTargetCandidatesListComponent
                            linkMatch={link_match}
                            onLinkTargetCandidateSelected={(selectionItem: SelectionItem, linkMatch: LinkMatch, isSelected: boolean) =>
                                onNoteChangeOperationSelected(
                                    new NoteChangeOperation(
                                        noteLinkMatchResult.note.path,
                                        noteLinkMatchResult.note.content,
                                        [new Replacement(
                                            linkMatch.position,
                                            selectionItem.content
                                        )]
                                    ),
                                    isSelected
                                )
                            }
                            key={`${link_match.matched_text}-${link_match.position.start}-${link_match.position.end}`}/>
                    )
                })}
            </ul>
        </li>
    );
};