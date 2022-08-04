import * as React from "react";
import {useCallback} from "react";
import {LinkMatch, LinkTargetCandidate, NoteChangeOperation, Replacement, SelectionItem} from "../../../../pkg";
import {generateMockupMdLink} from "../../util";
import {
    useApp,
    useLinkMatch,
    useLinkTargetCandidate,
    useNoteFiles,
    useLinkFinderResult,
    useSelectedNoteChangeOperations,
    useSelectionItem
} from "../../hooks";


export const ReplacementItemComponent = () => {
    const {fileManager} = useApp();
    const parentNote = useLinkFinderResult().note;
    const linkMatch = useLinkMatch();
    const linkTargetCandidate = useLinkTargetCandidate();
    const selectionItem = useSelectionItem();
    const {noteChangeOperations, setNoteChangeOperations} = useSelectedNoteChangeOperations();
    const noteFiles = useNoteFiles();

    const noteChangeOperation = noteChangeOperations.get(parentNote.path);


    const isSelected = useCallback(() => {
        if (noteChangeOperation === undefined || noteChangeOperation.replacements === undefined) return false;
        const isSelected = noteChangeOperation.replacements.find(
            (replacement: Replacement) => {
                return replacement.position.start == linkMatch.position.start &&
                    replacement.position.end == linkMatch.position.end &&
                    replacement.targetNotePath == linkTargetCandidate.path &&
                    replacement.originalSubstitute == selectionItem.content;
            }
        ) != undefined;
        return isSelected
    }, [noteChangeOperations]);


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

    const handleSelect = (selectionItem: SelectionItem, candidate: LinkTargetCandidate, doAdd: boolean, linkMatch: LinkMatch) => {
        const replacement = new Replacement(
            linkMatch.position,
            fileManager.generateMarkdownLink(
                noteFiles.get(candidate.path),
                parentNote.path,
                null,
                selectionItem.content == parentNote.title
                    ? null
                    : selectionItem.content
            ),
            selectionItem.content,
            candidate.path
        );

        const newNoteChangeOperation = new NoteChangeOperation(
            parentNote.path,
            parentNote.content,
            [replacement],
        );

        if (doAdd) addNoteChangeOperation(newNoteChangeOperation)
        else subtractNoteChangeOperation(newNoteChangeOperation)
    }

    return (
        <li className={"replacement-item"}>
            <input
                className={"checkbox"}
                type={"checkbox"}
                checked={isSelected()}
                onChange={() => {
                    handleSelect(selectionItem, linkTargetCandidate, !isSelected(), linkMatch)
                }}
            />
            <span className={"matched-text"}>
                "{selectionItem.content}"
            </span>
            <div className={"replacement-context"}>
                <span className={"arrow-icon"}>→</span>
                <span className={"context-tail"}>
                    "... {linkMatch.context.leftContextTail.text}
                </span>
                <span className={"link-preview"}>
                    {generateMockupMdLink(selectionItem.content, linkTargetCandidate.title)}
                </span>
                <span className={"context-tail"}>
                    {linkMatch.context.rightContextTail.text} ..."
                </span>
            </div>
        </li>
    );
};
