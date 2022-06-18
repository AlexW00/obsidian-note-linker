import * as React from "react";
import {
    LinkMatch,
    LinkTargetCandidate,
    NoteChangeOperation,
    NoteMatchingResult,
    Replacement,
    SelectionItem
} from "../../../../pkg";
import {LinkTargetCandidatesListComponent} from "./LinkTargetCandidatesListComponent";
import {NoteMatchingResultTitleComponent} from "../titles/NoteMatchingResultTitleComponent";
import {useContext} from "react";
import {AppContext, NoteFilesContext} from "../../context";
import {TFile} from "obsidian";

interface noteLinkMatchResultComponentProps {
    noteLinkMatchResult: NoteMatchingResult,
    onNoteChangeOperationSelected: (noteChangeOperation: NoteChangeOperation, doAdd: boolean) => void
}

export const LinkMatchesListComponent = ({noteLinkMatchResult, onNoteChangeOperationSelected}: noteLinkMatchResultComponentProps) => {

    const {fileManager} = useContext(AppContext);
    const noteFiles = useContext<Map<String, TFile>>(NoteFilesContext);

    return (
        <li>
            <NoteMatchingResultTitleComponent noteTitle={noteLinkMatchResult.note.title} notePath={noteLinkMatchResult.note.path}/>
            <ul>
                {noteLinkMatchResult.link_matches.map((link_match: LinkMatch) => {
                    return (
                        <LinkTargetCandidatesListComponent
                            linkMatch={link_match}
                            onLinkTargetCandidateSelected={(selectionItem: SelectionItem, candidate: LinkTargetCandidate) =>
                                onNoteChangeOperationSelected(
                                    new NoteChangeOperation(
                                        noteLinkMatchResult.note.path,
                                        noteLinkMatchResult.note.content,
                                        [new Replacement(
                                            link_match.position,
                                            fileManager.generateMarkdownLink(
                                                noteFiles.get(candidate.path),
                                                noteLinkMatchResult.note.path,
                                                null,
                                                selectionItem.content == noteLinkMatchResult.note.title
                                                    ? null
                                                    : selectionItem.content
                                            )
                                        )]
                                    ),
                                    selectionItem.is_selected
                                )
                            }
                            key={`${link_match.matched_text}-${link_match.position.start}-${link_match.position.end}`}/>
                    )
                })}
            </ul>
        </li>
    );
};