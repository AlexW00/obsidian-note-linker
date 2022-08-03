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
import {
    AppContext,
    LinkMatchContext,
    NoteFilesContext,
    NoteMatchingResultContext,
    SelectedNoteChangeOperations
} from "../../context";
import {TFile} from "obsidian";
import {handleNoteChangeOperationSelected} from "../../hooks";



export const LinkMatchesListComponent = () => {

    const {fileManager} = useContext(AppContext);
    const noteFiles = useContext<Map<String, TFile>>(NoteFilesContext);
    const [noteChangeOperations, setNoteChangeOperations] = useContext(SelectedNoteChangeOperations);
    const noteMatchingResult = useContext(NoteMatchingResultContext);

    const handleLinkTargetCandidateSelected = (selectionItem: SelectionItem, candidate: LinkTargetCandidate,link_match: LinkMatch, isSelected: boolean) => {
        const noteChangeOperation = new NoteChangeOperation(
            noteMatchingResult.note.path,
            noteMatchingResult.note.content,
            [new Replacement(
                link_match.position,
                fileManager.generateMarkdownLink(
                    noteFiles.get(candidate.path),
                    noteMatchingResult.note.path,
                    null,
                    selectionItem.content == noteMatchingResult.note.title
                        ? null
                        : selectionItem.content
                ),
                selectionItem.content,
                candidate.path
            )],
        );       
        handleNoteChangeOperationSelected(
            noteChangeOperations,
            setNoteChangeOperations,
            noteChangeOperation,
            isSelected
        )
    }
    
    return (
        <li className={"link-matches-list"}>
            <NoteMatchingResultTitleComponent noteTitle={noteMatchingResult.note.title} notePath={noteMatchingResult.note.path}/>
            <ul className={"hide-list-styling"}>
                {noteMatchingResult.link_matches.map((link_match: LinkMatch) => {
                    return (
                        <LinkMatchContext.Provider value={link_match}>
                            <LinkTargetCandidatesListComponent
                                onLinkTargetCandidateSelected={(selectionItem: SelectionItem, candidate: LinkTargetCandidate, isSelected) => 
                                    handleLinkTargetCandidateSelected(selectionItem, candidate, link_match, isSelected)}
                                key={`${link_match.matched_text}-${link_match.position.start}-${link_match.position.end}`}/>
                        </LinkMatchContext.Provider>
                    )
                })}
            </ul>
        </li>
    );
};