import {AppContext, SelectedNoteChangeOperations} from "./context";
import {App} from "obsidian";
import React, {Dispatch, SetStateAction, useContext} from "react";
import {NoteChangeOperation, Replacement} from "../../pkg";

// Utility hook to access the Obsidian App object
export const useApp = (): App | undefined => {
    return React.useContext(AppContext);
};

export const subtractNoteChangeOperation = (setNoteChangeOperations: Dispatch<SetStateAction<Map<string, NoteChangeOperation>>>, new_note_change_operations: Map<string, NoteChangeOperation>, note_change_operation_to_remove: NoteChangeOperation) => {
    if (new_note_change_operations.has(note_change_operation_to_remove.path)) {
        const existing_note_change_operation = new_note_change_operations.get(note_change_operation_to_remove.path);

        note_change_operation_to_remove.replacements.forEach((replacement: Replacement) => {
            const index = existing_note_change_operation.replacements.findIndex(((r: Replacement) => r.position.is_equal_to(replacement.position)))
            if (index != -1) existing_note_change_operation.replacements.splice(index, 1);
        })

        if (existing_note_change_operation.replacements.length == 0)
            new_note_change_operations.delete(note_change_operation_to_remove.path);

        setNoteChangeOperations(new_note_change_operations)
    }
}

export const addNoteChangeOperation = (setNoteChangeOperations: Dispatch<SetStateAction<Map<string, NoteChangeOperation>>>, noteChangeOperations: Map<string, NoteChangeOperation>, new_note_change_operation: NoteChangeOperation) => {
    if (!noteChangeOperations.has(new_note_change_operation.path)) {
        noteChangeOperations.set(new_note_change_operation.path, new_note_change_operation)
    } else {
        const existing_note_change_operation = noteChangeOperations.get(new_note_change_operation.path);

        new_note_change_operation.replacements.forEach((replacement: Replacement) => {
            const index = existing_note_change_operation.replacements.findIndex(((r: Replacement) => r.position.is_equal_to(replacement.position)))
            if (index != -1) existing_note_change_operation.replacements[index] = replacement;
            else existing_note_change_operation.replacements.push(replacement);
        })
        noteChangeOperations.set(new_note_change_operation.path, existing_note_change_operation)
        setNoteChangeOperations(noteChangeOperations)
    }
}

export const handleNoteChangeOperationSelected = (noteChangeOperations: Map<string, NoteChangeOperation>, setNoteChangeOperations: Dispatch<SetStateAction<Map<string, NoteChangeOperation>>>, note_change_operation: NoteChangeOperation, doAdd: boolean) => {
    const new_note_change_operations: Map<string, NoteChangeOperation> = noteChangeOperations;
    if (doAdd) addNoteChangeOperation(setNoteChangeOperations, new_note_change_operations, note_change_operation)
    else subtractNoteChangeOperation(setNoteChangeOperations, new_note_change_operations, note_change_operation)
    console.log(noteChangeOperations);
}