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
import {AppContext, LinkMatchContext, NoteFilesContext, SelectedNoteChangeOperations} from "../../context";
import {TFile} from "obsidian";
import {handleNoteChangeOperationSelected} from "../../hooks";

interface noteLinkMatchResultComponentProps {
    noteLinkMatchResult: NoteMatchingResult,
}

export const LinkMatchesListComponent = ({noteLinkMatchResult}: noteLinkMatchResultComponentProps) => {

    const {fileManager} = useContext(AppContext);
    const noteFiles = useContext<Map<String, TFile>>(NoteFilesContext);
    const [noteChangeOperations, setNoteChangeOperations] = useContext(SelectedNoteChangeOperations);

    return (
        <li className={"link-matches-list"}>
            <NoteMatchingResultTitleComponent noteTitle={noteLinkMatchResult.note.title} notePath={noteLinkMatchResult.note.path}/>
            <ul className={"hide-list-styling"}>
                {noteLinkMatchResult.link_matches.map((link_match: LinkMatch) => {
                    return (
                        <LinkMatchContext.Provider value={link_match}>
                            <LinkTargetCandidatesListComponent
                                onLinkTargetCandidateSelected={(selectionItem: SelectionItem, candidate: LinkTargetCandidate, isSelected) =>
                                    handleNoteChangeOperationSelected(
                                        noteChangeOperations,
                                        setNoteChangeOperations,
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
                                                ),
                                                selectionItem.content,
                                                candidate.path
                                            )],
                                        ),
                                        isSelected
                                    )
                                }
                                key={`${link_match.matched_text}-${link_match.position.start}-${link_match.position.end}`}/>
                        </LinkMatchContext.Provider>
                    )
                })}
            </ul>
        </li>
    );
};