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

interface noteLinkMatchResultComponentProps {
    noteLinkMatchResult: NoteMatchingResult,
}

export const LinkMatchesListComponent = ({noteLinkMatchResult}: noteLinkMatchResultComponentProps) => {

    const {fileManager} = useContext(AppContext);
    const noteFiles = useContext<Map<String, TFile>>(NoteFilesContext);
    const {noteChangeOperations, setNoteChangeOperations} = useContext(SelectedNoteChangeOperations);

    const subtractNoteChangeOperation = (noteChangeOperationToSubtract: NoteChangeOperation) => {
        const _noteChangeOperations = new Map(noteChangeOperations);
        if (_noteChangeOperations.has(noteChangeOperationToSubtract.path)) {
            const existing_note_change_operation = _noteChangeOperations.get(noteChangeOperationToSubtract.path);

            noteChangeOperationToSubtract.replacements.forEach((replacement: Replacement) => {
                const index = existing_note_change_operation.replacements.findIndex(((r: Replacement) => r.position.is_equal_to(replacement.position)))
                if (index != -1) existing_note_change_operation.replacements.splice(index, 1);
            })

            if (existing_note_change_operation.replacements.length == 0)
                _noteChangeOperations.delete(noteChangeOperationToSubtract.path);

            setNoteChangeOperations(_noteChangeOperations)
        }
    }

    const addNoteChangeOperation = (noteChangeOperationToAdd: NoteChangeOperation) => {
        const _noteChangeOperations = new Map(noteChangeOperations);
        if (!_noteChangeOperations.has(noteChangeOperationToAdd.path)) {
            _noteChangeOperations.set(noteChangeOperationToAdd.path, noteChangeOperationToAdd)
        } else {
            const existing_note_change_operation = _noteChangeOperations.get(noteChangeOperationToAdd.path);

            noteChangeOperationToAdd.replacements.forEach((replacement: Replacement) => {
                const index = existing_note_change_operation.replacements.findIndex(((r: Replacement) => r.position.is_equal_to(replacement.position)))
                if (index != -1) existing_note_change_operation.replacements[index] = replacement;
                else existing_note_change_operation.replacements.push(replacement);
            })
            _noteChangeOperations.set(noteChangeOperationToAdd.path, existing_note_change_operation)
        }
        setNoteChangeOperations(_noteChangeOperations)
    }

    const handleNoteChangeOperationSelected = (noteChangeOperation: NoteChangeOperation, doAdd: boolean) => {
        if (doAdd) addNoteChangeOperation(noteChangeOperation)
        else subtractNoteChangeOperation(noteChangeOperation)
    }

    const handleLinkTargetCandidateSelected = (selectionItem: SelectionItem, candidate: LinkTargetCandidate, isSelected: boolean, linkMatch: LinkMatch) => {
            const replacement = new Replacement(
                linkMatch.position,
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
            );
            handleNoteChangeOperationSelected(
                new NoteChangeOperation(
                    noteLinkMatchResult.note.path,
                    noteLinkMatchResult.note.content,
                    [replacement],
                ),
                isSelected
            );
        }


    return (
        <li className={"link-matches-list"}>
            <NoteMatchingResultTitleComponent noteTitle={noteLinkMatchResult.note.title} notePath={noteLinkMatchResult.note.path}/>
            <ul className={"hide-list-styling"}>
                {noteLinkMatchResult.link_matches.map((link_match: LinkMatch) => {
                    return (
                        <LinkMatchContext.Provider value={link_match}>
                            <LinkTargetCandidatesListComponent
                                onLinkTargetCandidateSelected={
                                    (...args) => handleLinkTargetCandidateSelected(...args, link_match)}
                                key={`${link_match.matched_text}-${link_match.position.start}-${link_match.position.end}`}/>
                        </LinkMatchContext.Provider>
                    )
                })}
            </ul>
        </li>
    );
};