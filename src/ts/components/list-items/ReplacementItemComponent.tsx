import * as React from "react";
import {useCallback} from "react";
import {LinkMatch, LinkTargetCandidate, NoteChangeOperation, Replacement, PreferrableItem} from "../../../../pkg";
import {generateMockupMdLink} from "../../util";
import {
    useApp,
    useLinkMatch,
    useLinkTargetCandidate,
    useNoteFiles,
    useLinkFinderResult,
    useSelectedNoteChangeOperations,
    useReplacementCandidate
} from "../../hooks";


export const ReplacementItemComponent = () => {
    const {fileManager} = useApp();
    const parentNote = useLinkFinderResult().note;
    const linkMatch = useLinkMatch();
    const linkTargetCandidate = useLinkTargetCandidate();
    const replacementCandidate = useReplacementCandidate();
    const {noteChangeOperations, setNoteChangeOperations} = useSelectedNoteChangeOperations();
    const noteFiles = useNoteFiles();

    const noteChangeOperation = noteChangeOperations.get(parentNote.path);


    const isPreferred = useCallback(() => {
        if (noteChangeOperation === undefined || noteChangeOperation.replacements === undefined) return false;
        const isPreferred = noteChangeOperation.replacements.find(
            (replacement: Replacement) => {
                return replacement.position.start == linkMatch.position.start &&
                    replacement.position.end == linkMatch.position.end &&
                    replacement.targetNotePath == linkTargetCandidate.path &&
                    replacement.originalSubstitute == replacementCandidate.content;
            }
        ) != undefined;
        return isPreferred
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

    const handleSelect = (replacementCandidate: PreferrableItem, candidate: LinkTargetCandidate, doAdd: boolean, linkMatch: LinkMatch) => {
        const replacement = new Replacement(
            linkMatch.position,
            fileManager.generateMarkdownLink(
                noteFiles.get(candidate.path),
                parentNote.path,
                null,
                replacementCandidate.content == parentNote.title
                    ? null
                    : replacementCandidate.content
            ),
            replacementCandidate.content,
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
        <li className={"replacement-item"} onClick={() => handleSelect(replacementCandidate, linkTargetCandidate, !isPreferred(), linkMatch)}>
            <input
                className={"task-list-item-checkbox"}
                type={"checkbox"}
                checked={isPreferred()}
            />
            <span className={"matched-text"}>
                "{replacementCandidate.content}"
            </span>
            <div className={"replacement-context"}>
                <span className={"arrow-icon"}>→</span>
                <span className={"context-tail"}>
                    "... {linkMatch.context.leftContextTail.text}
                </span>
                <span className={"link-preview"}>
                    {generateMockupMdLink(replacementCandidate.content, linkTargetCandidate.title)}
                </span>
                <span className={"context-tail"}>
                    {linkMatch.context.rightContextTail.text} ..."
                </span>
            </div>
        </li>
    );
};
